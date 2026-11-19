import React, { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroOverlay } from './HeroOverlay';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { isMobileViewport } from '../../utils/device';
import { ChevronDown, AlertCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Distâncias de rolagem cinematográficas responsivas:
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

export const HeroCinematographic: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [scrollDistance, setScrollDistance] = useState<number>(() => getHeroScrollDistance());
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const [hasMediaError, setHasMediaError] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => isMobileViewport());
  const prefersReducedMotion = useReducedMotion();

  // Referências para controle de seeking desacoplado e amortecido
  const targetTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const isSeekingRef = useRef<boolean>(false);
  const pendingTimeRef = useRef<number | null>(null);

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

  // Monitoramento de resize dinâmico com recálculo da distância
  useEffect(() => {
    const handleResize = () => {
      const newDistance = getHeroScrollDistance();
      setScrollDistance(newDistance);

      const mobileNow = isMobileViewport();
      if (mobileNow !== isMobile) {
        setIsMobile(mobileNow);
      }
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Rotina controlada de Seeking via requestAnimationFrame
  const executeSeek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video || isNaN(time)) return;

    // Limita o tempo ao intervalo seguro [0, duration - 0.05]
    const maxDuration = video.duration && !isNaN(video.duration) ? video.duration : 20.0;
    const safeTime = Math.max(0, Math.min(time, maxDuration - 0.05));

    // Se a diferença for imperceptível (< 20ms), evita seek redundante
    if (Math.abs(video.currentTime - safeTime) < 0.02) {
      return;
    }

    if (video.seeking) {
      pendingTimeRef.current = safeTime;
      return;
    }

    try {
      isSeekingRef.current = true;
      video.currentTime = safeTime;
    } catch {
      isSeekingRef.current = false;
    }
  }, []);

  // Listener para quando o seek é completado pelo hardware
  const handleSeeked = useCallback(() => {
    isSeekingRef.current = false;
    if (pendingTimeRef.current !== null) {
      const nextTime = pendingTimeRef.current;
      pendingTimeRef.current = null;
      executeSeek(nextTime);
    }
  }, [executeSeek]);

  // Agendamento de seek suave via rAF
  const scheduleSeek = useCallback(
    (time: number) => {
      targetTimeRef.current = time;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(() => {
        executeSeek(targetTimeRef.current);
      });
    },
    [executeSeek]
  );

  // Inicialização do GSAP ScrollTrigger vinculado ao track físico responsivo
  useEffect(() => {
    // Se o usuário preferir movimento reduzido ou houver erro, desativa o pinning
    if (prefersReducedMotion || hasMediaError) return;

    const track = trackRef.current;
    const video = videoRef.current;
    if (!track || !video) return;

    // Pausa o vídeo por padrão (controle estrito pelo scroll)
    video.pause();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8, // Amortecimento milimétrico contra trepidação
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);

          const duration = video.duration && !isNaN(video.duration) ? video.duration : 20.0;
          const targetTime = progress * duration;
          scheduleSeek(targetTime);
        },
      });
    }, track);

    return () => {
      ctx.revert();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [prefersReducedMotion, hasMediaError, scheduleSeek, scrollDistance]);

  // Handlers do elemento de vídeo
  const handleLoadedData = () => {
    setIsVideoReady(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoError = () => {
    setHasMediaError(true);
    setIsVideoReady(false);
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
          ref={videoRef}
          src={videoSrc}
          playsInline
          muted
          preload="auto"
          onLoadedData={handleLoadedData}
          onSeeked={handleSeeked}
          onError={handleVideoError}
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
      </div>
    </div>
  );
};
