import React, { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroOverlay } from './HeroOverlay';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useHeroDebug } from '../../hooks/useHeroDebug';
import { isMobileViewport } from '../../utils/device';
import { VideoSeekController } from '../../utils/videoSeekController';
import { ChevronDown, AlertCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Distâncias de rolagem cinematográficas responsivas (APROVADAS — não alterar):
 * - Desktop: 4000px
 * - Tablet: 3200px
 * - Mobile: 2600px
 */
function getHeroScrollDistance(): number {
  if (typeof window === 'undefined') return 4000;
  const width = window.innerWidth;
  if (width < 768) {
    return 2600; // Mobile (< 768px)
  }
  if (width < 1024) {
    return 3200; // Tablet (768px - 1023px)
  }
  return 4000; // Desktop (>= 1024px)
}

/** Máximo de recarregamentos do vídeo após erro de mídia antes de cair no modo estático. */
const MAX_MEDIA_RETRIES = 2;

export const HeroCinematographic: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [scrollDistance, setScrollDistance] = useState<number>(() => getHeroScrollDistance());
  // Guarda QUAL fonte já está pronta: ao trocar de fonte (desktop↔mobile) o poster volta sozinho.
  const [readySrc, setReadySrc] = useState<string | null>(null);
  const [hasMediaError, setHasMediaError] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => isMobileViewport());
  const prefersReducedMotion = useReducedMotion();

  // Controlador de seeking: mantém só o destino mais recente, nunca bloqueia o scroll.
  const [seek] = useState(() => new VideoSeekController(() => videoRef.current));
  const renderedProgressRef = useRef<number>(0);
  const mediaRetriesRef = useRef<number>(0);

  // Diagnóstico (inerte em produção)
  const debug = useHeroDebug(videoRef, seek);

  // Seleção de assets com base no viewport
  const videoSrc = isMobile
    ? '/assets/video/hero-scroll-mobile.mp4'
    : '/assets/video/hero-scroll-desktop.mp4';

  const posterSrc = isMobile
    ? '/assets/images/hero-poster-mobile.webp'
    : '/assets/images/hero-poster-desktop.webp';

  const finalPosterSrc = isMobile
    ? '/assets/images/hero-final-mobile.webp'
    : '/assets/images/hero-final-desktop.webp';

  const isVideoReady = readySrc === videoSrc;

  // Resize: apenas recalcula distância/asset (com debounce). NÃO chamamos
  // ScrollTrigger.refresh() manualmente: o GSAP já faz refresh próprio no resize
  // e ignora o "resize" causado pela barra de URL do mobile. O refresh manual a
  // cada evento (sem debounce) disparava recálculos no meio da rolagem.
  useEffect(() => {
    let timer: number | undefined;
    const apply = () => {
      setScrollDistance(getHeroScrollDistance());
      setIsMobile(isMobileViewport());
    };
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(apply, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Ciclo de vida do controlador: cancela frame pendente ao desmontar e retoma ao voltar à aba.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') seek.flush();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      seek.cancel();
    };
  }, [seek]);

  // Progresso do scroll -> destino do vídeo + estado visual (renderiza só se mudou o bastante)
  const handleProgress = useCallback(
    (progress: number) => {
      seek.request(progress);
      const last = renderedProgressRef.current;
      if (progress === 0 || progress === 1 || Math.abs(progress - last) >= 0.002) {
        renderedProgressRef.current = progress;
        setScrollProgress(progress);
      }
    },
    [seek]
  );

  // Inicialização do GSAP ScrollTrigger vinculado ao track físico responsivo
  useEffect(() => {
    // Se o usuário preferir movimento reduzido ou houver erro, desativa o efeito
    if (prefersReducedMotion || hasMediaError) return;

    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => handleProgress(self.progress),
        // Sincroniza no (re)cálculo: cobre recarga no meio do documento e resize.
        onRefresh: (self) => handleProgress(self.progress),
      });
    }, track);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion, hasMediaError, scrollDistance, handleProgress]);

  // Handlers do elemento de vídeo
  const handleLoadedData = () => {
    setReadySrc(videoSrc);
    videoRef.current?.pause();
    // Alinha o vídeo ao progresso REAL do scroll (não força 0): cobre recarga no meio da página.
    seek.reset();
    seek.flush();
  };

  const handleVideoError = () => {
    debug.logError();
    const video = videoRef.current;
    if (video && mediaRetriesRef.current < MAX_MEDIA_RETRIES) {
      // Erro de mídia (ex.: falha de rede durante um seek): tenta recarregar antes de desistir.
      mediaRetriesRef.current += 1;
      setReadySrc(null);
      seek.reset();
      video.load();
      return;
    }
    // Falha persistente: modo estático — a navegação permanece livre.
    setHasMediaError(true);
    setReadySrc(null);
  };

  // Renderização do Modo Fallback (Reduced Motion ou Erro de Mídia)
  if (prefersReducedMotion || hasMediaError) {
    return (
      <section
        id="hero-cinematografico"
        aria-label="Apresentação Nova Ótica Vitaliz"
        className="relative w-full min-h-[90vh] flex items-center justify-center bg-wine-deep overflow-hidden pt-16"
      >
        <img
          src={posterSrc}
          alt="Nova Ótica Vitaliz — Armação de luxo em detalhe macro"
          className="absolute inset-0 w-full h-full object-contain sm:object-cover opacity-90"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wine-deep via-wine-deep/40 to-transparent" />
        <HeroOverlay progress={1.0} />

        {hasMediaError && (
          <div className="absolute top-20 right-6 z-30 glass-panel px-3 py-1.5 rounded text-caption text-amber-900 bg-amber-100 flex items-center gap-1.5">
            <AlertCircle size={14} />
            <span>Modo Estático Ativo</span>
          </div>
        )}
      </section>
    );
  }

  return (
    <div
      ref={trackRef}
      id="hero-cinematografico"
      aria-label="Experiência Cinematográfica Nova Ótica Vitaliz"
      className="relative w-full"
      style={{ height: `calc(100vh + ${scrollDistance}px)` }}
    >
      {/* Contêiner com fixação sticky natural: garante que as seções seguintes não subam antes de scrollDistance px */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen min-h-[100dvh] bg-wine-deep overflow-hidden flex items-center justify-center select-none"
      >
        {/* 1. Camada de Poster Estático (sempre presente atrás do vídeo para evitar flash preto) */}
        <img
          src={posterSrc}
          alt="Primeiro quadro — Armação de acetato translúcido vinho"
          className={`absolute inset-0 w-full h-full object-contain sm:object-cover transition-opacity duration-700 ease-luxury pointer-events-none ${
            isVideoReady ? 'opacity-0' : 'opacity-100'
          }`}
          fetchPriority="high"
        />

        {/* 2. Camada do Vídeo Controlado por Scroll */}
        <video
          key={videoSrc}
          ref={videoRef}
          src={videoSrc}
          playsInline
          muted
          preload="auto"
          onLoadedMetadata={() => seek.flush()}
          onLoadedData={handleLoadedData}
          onSeeked={() => seek.flush()}
          onError={handleVideoError}
          {...debug.eventProps}
          className={`relative z-10 w-full h-full object-contain sm:object-cover transition-opacity duration-500 ${
            isVideoReady ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        {/* 3. Poster Final Congelado (aparece suavemente no término do scroll para transição imperceptível) */}
        <img
          src={finalPosterSrc}
          alt="Quadro final — Modelo com armação Nova Ótica Vitaliz"
          className="absolute inset-0 z-15 w-full h-full object-contain sm:object-cover pointer-events-none transition-opacity duration-300"
          style={{
            opacity: scrollProgress >= 0.98 ? 1 : 0,
          }}
          aria-hidden="true"
        />

        {/* 4. Overlay Editorial com Headline Oficial e CTA */}
        <HeroOverlay progress={scrollProgress} />

        {/* 5. Linha de Progresso Cinemática Sutil (Indicador de scrub no rodapé da seção) */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-wine-soft/60 z-30 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="h-full bg-gradient-to-r from-gold/60 via-gold to-gold-light transition-all duration-75 ease-out"
            style={{ width: `${Math.min(100, scrollProgress * 100)}%` }}
          />
        </div>

        {/* 6. Indicador de Rolagem Inicial (garantido dentro da viewport no topo) */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 text-gold/80 transition-opacity duration-300 pointer-events-none"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 8) }}
          aria-hidden="true"
        >
          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-champagne-light/80 font-medium">
            Role para Explorar
          </span>
          <ChevronDown size={15} className="animate-bounce text-gold" />
        </div>

        {/* 7. HUD de diagnóstico — existe SOMENTE em desenvolvimento (removido do bundle de produção) */}
        {import.meta.env.DEV && (
          <pre
            data-hero-debug
            className="absolute bottom-2 left-2 z-[60] m-0 p-1.5 text-[10px] leading-tight font-mono text-white bg-black/70 pointer-events-none whitespace-pre"
          >
            {debug.hud}
          </pre>
        )}
      </div>
    </div>
  );
};
