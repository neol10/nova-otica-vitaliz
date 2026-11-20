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
 * Distâncias de rolagem cinematográficas calibradas para ritmo suave e envolvente:
 * - Desktop (>= 1024px): 3000px
 * - Tablet (768px - 1023px): 2400px
 * - Mobile (< 768px): 2000px
 */
function getHeroScrollDistance(): number {
  if (typeof window === 'undefined') return 3000;
  const width = window.innerWidth;
  if (width < 768) {
    return 2000; // Mobile (< 768px)
  }
  if (width < 1024) {
    return 2400; // Tablet (768px - 1023px)
  }
  return 3000; // Desktop (>= 1024px)
}

/** Máximo de recarregamentos do vídeo após erro de mídia antes de cair no modo estático. */
const MAX_MEDIA_RETRIES = 2;

/**
 * Enquadramento dinâmico horizontal (`object-position`) para o Hero Mobile Full-Screen (< 768px),
 * sincronizado 100% com o progresso do scroll na narrativa Óculos -> Modelo:
 * - Início (0.00 -> 0.45): 53% -> 45% (centraliza a dobradiça e os pinos no macro dos óculos e acompanha a abertura da armação).
 * - Meio   (0.45 -> 0.75): 45% -> 46% (acompanha a armação e o movimento das mãos levando os óculos ao rosto).
 * - Final  (0.75 -> 1.00): 46% (centraliza o rosto da modelo, os olhos com os óculos e a mão sob o queixo).
 */
function getMobileObjectPosition(progress: number): string {
  const p = Math.max(0, Math.min(1, progress));
  let xPct = 53;
  if (p <= 0.45) {
    const t = p / 0.45;
    xPct = 53 - t * 8; // 53% -> 45%
  } else if (p <= 0.75) {
    const t = (p - 0.45) / 0.3;
    xPct = 45 + t * 1; // 45% -> 46%
  } else {
    xPct = 46;
  }
  return `${xPct.toFixed(1)}% 38%`;
}

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

  // Controlador de seeking otimizado: vídeo já invertido fisicamente com GOP curto (-g 6, zero B-frames)
  const [seek] = useState(
    () =>
      new VideoSeekController(() => videoRef.current, {
        inverted: false,
        epsilon: 0.02, // ~0.6 quadro a 30fps para fluidez contínua sem seeks redundantes
        retryMs: 50, // Resposta imediata durante o scrub
      })
  );
  const renderedProgressRef = useRef<number>(0);
  const mediaRetriesRef = useRef<number>(0);

  // Diagnóstico (inerte em produção)
  const debug = useHeroDebug(videoRef, seek);

  // Seleção de assets com base no viewport (narrativa direta: início = armação, fim = mulher)
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
  // O VideoSeekController gerencia a inversão narrativa internamente (inverted: true: modelo -> óculos).
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
        className="relative w-full h-[100svh] min-h-[100svh] md:min-h-[90vh] flex items-center justify-center bg-wine-deep overflow-hidden pt-16"
      >
        <img
          src={finalPosterSrc}
          alt="Nova Ótica Vitaliz — Modelo com armação de grau"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          style={isMobile ? { objectPosition: getMobileObjectPosition(1) } : undefined}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wine-deep via-wine-deep/40 to-transparent" />
        <HeroOverlay progress={1.0} layout={isMobile ? 'mobile-fullscreen' : 'overlay'} />

        {hasMediaError && (
          <div className="absolute top-20 right-6 z-30 glass-panel px-3 py-1.5 rounded text-caption text-amber-900 bg-amber-100 flex items-center gap-1.5">
            <AlertCircle size={14} />
            <span>Modo Estático Ativo</span>
          </div>
        )}
      </section>
    );
  }

  const mobileObjPos = getMobileObjectPosition(scrollProgress);

  return (
    <div
      ref={trackRef}
      id="hero-cinematografico"
      aria-label="Experiência Cinematográfica Nova Ótica Vitaliz"
      className="relative w-full"
      style={{ height: `calc(100svh + ${scrollDistance}px)` }}
    >
      {/* Contêiner com fixação sticky natural: 100svh no mobile e 100dvh no desktop */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-[100svh] md:h-screen md:min-h-[100dvh] bg-wine-deep overflow-hidden flex items-center justify-center select-none"
      >
        {isMobile ? (
          /* COMPOSIÇÃO MOBILE FULL-SCREEN (< 768px): 100svh tela cheia com object-cover e object-position dinâmico */
          <div className="relative w-full h-full flex items-center justify-center bg-wine-deep">
            {/* 1. Camada de Poster Estático Inicial */}
            <img
              src={posterSrc}
              alt="Primeiro quadro — Modelo com armação Nova Ótica Vitaliz"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-luxury pointer-events-none ${
                isVideoReady ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ objectPosition: getMobileObjectPosition(0) }}
              fetchPriority="high"
            />

            {/* 2. Camada do Vídeo Controlado por Scroll preenchendo 100svh sem faixas vazias */}
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
              style={{ objectPosition: mobileObjPos }}
              className={`relative z-10 w-full h-full object-cover transition-opacity duration-500 ${
                isVideoReady ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden="true"
            />

            {/* 3. Poster Final Congelado no término do scroll */}
            <img
              src={finalPosterSrc}
              alt="Quadro final — Detalhe macro da armação em acetato translúcido vinho"
              className="absolute inset-0 z-15 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
              style={{
                opacity: scrollProgress >= 0.98 ? 1 : 0,
                objectPosition: getMobileObjectPosition(1),
              }}
              aria-hidden="true"
            />

            {/* Vinheta superior sutil apenas para proteger a legibilidade do Header flutuante sobre o vídeo full-screen */}
            <div
              className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-wine-deep/75 via-wine-deep/25 to-transparent z-15 pointer-events-none"
              aria-hidden="true"
            />

            {/* 4. Overlay Editorial Mobile Full-Screen na base sem cobrir rosto ou óculos */}
            <HeroOverlay progress={scrollProgress} layout="mobile-fullscreen" />

            {/* 6. Indicador de Rolagem Inicial em Cápsula Premium Aprovada (respeita safe-area-inset-bottom) */}
            <div
              className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-center pb-[max(0.85rem,env(safe-area-inset-bottom))] transition-opacity duration-300 pointer-events-none"
              style={{ opacity: Math.max(0, 1 - scrollProgress * 8) }}
              aria-hidden="true"
            >
              <div className="flex flex-col items-center gap-1 px-5 py-2 rounded-full bg-wine-deep/90 backdrop-blur-md border border-gold/50 animate-luxury-glow">
                <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-champagne-light font-semibold whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  Role para Explorar
                </span>
                <ChevronDown size={14} className="animate-bounce text-gold-light drop-shadow-[0_0_8px_rgba(223,193,132,0.8)]" />
              </div>
            </div>
          </div>
        ) : (
          /* COMPOSIÇÃO DESKTOP & TABLET (>= 768px): 100% Preservada */
          <>
            {/* 1. Camada de Poster Estático (sempre presente atrás do vídeo para evitar flash preto) */}
            <img
              src={posterSrc}
              alt="Primeiro quadro — Modelo com armação Nova Ótica Vitaliz"
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
              alt="Quadro final — Detalhe macro da armação em acetato translúcido vinho"
              className="absolute inset-0 z-15 w-full h-full object-contain sm:object-cover pointer-events-none transition-opacity duration-300"
              style={{
                opacity: scrollProgress >= 0.98 ? 1 : 0,
              }}
              aria-hidden="true"
            />

            {/* 4. Overlay Editorial com Headline Oficial e CTA */}
            <HeroOverlay progress={scrollProgress} layout="overlay" />

            {/* 6. Indicador de Rolagem Inicial (com destaque e brilho no desktop) */}
            <div
              className="absolute bottom-10 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 transition-opacity duration-300 pointer-events-none w-max max-w-[90vw]"
              style={{ opacity: Math.max(0, 1 - scrollProgress * 8) }}
              aria-hidden="true"
            >
              <div className="flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-full bg-wine-deep/90 backdrop-blur-md border border-gold/50 animate-luxury-glow">
                <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-champagne-light font-semibold whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  Role para Explorar
                </span>
                <ChevronDown size={15} className="animate-bounce text-gold-light drop-shadow-[0_0_8px_rgba(223,193,132,0.8)]" />
              </div>
            </div>
          </>
        )}

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
      </div>
    </div>
  );
};
