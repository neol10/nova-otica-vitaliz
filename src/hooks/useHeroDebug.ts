import { useEffect, useRef, useState, type RefObject } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { VideoSeekController } from '../utils/videoSeekController';

/**
 * Instrumentação de diagnóstico do Hero — SOMENTE em desenvolvimento.
 * Em produção (`import.meta.env.DEV === false`) nenhum efeito é registrado,
 * nenhum intervalo é criado e nada é exposto em `window`.
 *
 * Em dev expõe:
 *  - `window.__HERO_DEBUG__.snapshot()` (estado completo sob demanda);
 *  - HUD textual (retornado em `hud`) atualizado a ~4 Hz;
 *  - console.debug no máximo 1x/s e somente quando o estado muda;
 *  - console.warn imediato para instâncias duplicadas de ScrollTrigger.
 */
interface EventCounters {
  waiting: number;
  stalled: number;
  suspend: number;
  abort: number;
  seeking: number;
  error: number;
}

const EMPTY: EventCounters = { waiting: 0, stalled: 0, suspend: 0, abort: 0, seeking: 0, error: 0 };

export function useHeroDebug(
  videoRef: RefObject<HTMLVideoElement | null>,
  controller: VideoSeekController
) {
  const counters = useRef<EventCounters>({ ...EMPTY });
  const [hud, setHud] = useState<string>('');

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const snapshot = () => {
      const v = videoRef.current;
      let bufEnd = 0;
      try {
        if (v && v.buffered && v.buffered.length > 0) {
          bufEnd = Number(v.buffered.end(v.buffered.length - 1).toFixed(2));
        }
      } catch {
        /* noop */
      }
      return {
        scrollY: Math.round(window.scrollY),
        progress: Number(controller.getProgress().toFixed(4)),
        currentTime: v ? Number(v.currentTime.toFixed(3)) : null,
        duration: v && Number.isFinite(v.duration) ? Number(v.duration.toFixed(2)) : null,
        buffered: bufEnd,
        readyState: v?.readyState ?? null,
        networkState: v?.networkState ?? null,
        seeking: v?.seeking ?? null,
        scrollTriggers: ScrollTrigger.getAll().length,
        bodyOverflow: document.body.style.overflow || 'auto',
        inverted: controller.inverted,
        seekStats: { ...controller.stats },
        events: { ...counters.current },
      };
    };

    (window as unknown as { __HERO_DEBUG__?: unknown }).__HERO_DEBUG__ = { snapshot };

    let lastKey = '';
    let lastLogAt = 0;
    const id = window.setInterval(() => {
      const s = snapshot();
      setHud(
        [
          `y=${s.scrollY} p=${s.progress} inv=${s.inverted ? 1 : 0}`,
          `t=${s.currentTime}/${s.duration} buf=${s.buffered}s rs=${s.readyState} ns=${s.networkState} seeking=${s.seeking}`,
          `ST=${s.scrollTriggers} body.overflow=${s.bodyOverflow}`,
          `seeks=${s.seekStats.issued} stale=${s.seekStats.staleRetries} giveUp=${s.seekStats.giveUps} rVFC=${s.seekStats.framesDelivered}`,
          `wait=${s.events.waiting} stall=${s.events.stalled} err=${s.events.error}`,
        ].join('\n')
      );

      if (s.scrollTriggers > 1) {
        console.warn('[hero] instâncias de ScrollTrigger duplicadas:', s.scrollTriggers);
      }

      const key = JSON.stringify(s);
      const now = performance.now();
      if (key !== lastKey && now - lastLogAt >= 1000) {
        lastKey = key;
        lastLogAt = now;
        console.debug('[hero]', s);
      }
    }, 250);

    return () => {
      window.clearInterval(id);
      delete (window as unknown as { __HERO_DEBUG__?: unknown }).__HERO_DEBUG__;
    };
  }, [videoRef, controller]);

  const bump = (key: keyof EventCounters) => () => {
    if (!import.meta.env.DEV) return;
    counters.current[key] += 1;
    // 'seeking'/'suspend' são frequentes: só contam (aparecem no HUD), sem log.
    if (key !== 'seeking' && key !== 'suspend') console.debug(`[hero] video:${key}`);
  };

  return {
    hud,
    /** Contagem de erro chamada manualmente pelo handler de erro do componente. */
    logError: bump('error'),
    /** Props de evento extras do <video> (apenas diagnóstico). */
    eventProps: {
      onWaiting: bump('waiting'),
      onStalled: bump('stalled'),
      onSuspend: bump('suspend'),
      onAbort: bump('abort'),
      onSeeking: bump('seeking'),
    },
  };
}
