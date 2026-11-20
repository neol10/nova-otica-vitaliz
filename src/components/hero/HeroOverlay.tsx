import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface HeroOverlayProps {
  progress: number; // Progresso normalizado de 0 a 1 do ScrollTrigger
  /**
   * 'overlay': Desktop/Tablet (>= 768px) — composição original preservada.
   * 'mobile-fullscreen': Mobile (< 768px) — sobreposto na base do Hero full-screen (100svh)
   *                      com gradiente vinho sutil inferior, preservando rosto e óculos livres
   *                      e mantendo distância segura da cápsula de scroll.
   */
  layout?: 'overlay' | 'mobile-fullscreen';
}

/**
 * HeroOverlay — Camada Editorial e Chamada de Conversão do Hero Cinematográfico Invertido.
 *
 * Narrativa Oficial NEWNEO:
 * 1. Momento Inicial (progress 0.0 -> ~0.25):
 *    - Mulher usando os óculos.
 *    - Headline: "Seu olhar. Seu estilo."
 *    - Texto: "Uma nova perspectiva de elegância."
 *    - Posição segura sem cobrir rosto ou armação. Sem CTA (vídeo e mensagem respiram).
 *
 * 2. Momento Intermediário (progress ~0.25 -> ~0.70):
 *    - Fade-out suave: o vídeo é o protagonista da transformação cinematográfica.
 *
 * 3. Momento Final (progress ~0.70 -> 1.0):
 *    - Armação em destaque macro (foco nos detalhes).
 *    - Headline: "Os detalhes fazem a diferença."
 *    - Texto: "Descubra novas possibilidades para o seu olhar."
 *    - CTA: "CONHECER COLEÇÕES" direcionado para #colecoes.
 *
 * Totalmente reversível e adaptado para visualização em todos os viewports (320px a 1440px+).
 */
export const HeroOverlay: React.FC<HeroOverlayProps> = ({
  progress,
  layout = 'overlay',
}) => {
  // --- Cálculos de Opacidade e Translação Reversíveis ---

  // Bloco Inicial: visível no topo (progress=0), esmaece suavemente até progress=0.28
  const initialOpacity = progress <= 0.08 ? 1 : Math.max(0, 1 - (progress - 0.08) / 0.20);
  const initialTranslateY = (1 - initialOpacity) * -16;

  // Bloco Final: surge a partir de progress=0.70 e atinge 1 em 0.90
  const finalOpacity = progress <= 0.70 ? 0 : Math.max(0, Math.min(1, (progress - 0.70) / 0.20));
  const finalTranslateY = (1 - finalOpacity) * 20;

  const isFinalInteractive = finalOpacity > 0.2;
  const scrimOpacity = Math.max(initialOpacity, finalOpacity);

  // Modo Mobile Full-Screen (< 768px): Textos posicionados na zona inferior com gradiente vinho sutil,
  // deixando rosto, óculos e movimento das mãos 100% livres no centro/topo e respeitando a cápsula de scroll.
  if (layout === 'mobile-fullscreen') {
    return (
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex flex-col justify-end px-5 sm:px-8 pb-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.75rem))]">
        {/* Gradiente vinho profundo sutil apenas no terço inferior para contraste elegante sem cobrir o rosto/óculos */}
        <div
          className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-wine-deep/95 via-wine-deep/65 to-transparent transition-opacity duration-200"
          style={{
            opacity: Math.min(1, Math.max(0.3, scrimOpacity * 0.96)),
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-md min-h-[140px] flex items-end">
          {/* 1. MOMENTO INICIAL (Mobile Full-Screen): "Seu olhar. Seu estilo." */}
          <div
            className="absolute inset-x-0 bottom-0 space-y-2 will-change-transform"
            style={{
              opacity: initialOpacity,
              transform: `translate3d(0, ${initialTranslateY}px, 0)`,
              pointerEvents: 'none',
              display: initialOpacity <= 0 ? 'none' : 'block',
            }}
            aria-hidden={initialOpacity <= 0}
          >
            <div className="flex items-center gap-2">
              <span className="h-[1px] w-6 bg-gold/80" />
              <span className="text-caption uppercase tracking-[0.22em] text-gold text-[10px] font-medium">
                Nova Ótica Vitaliz
              </span>
            </div>

            <h1 className="font-display text-[1.95rem] xs:text-[2.2rem] font-light text-offwhite leading-[1.06] tracking-tight drop-shadow-sm">
              <span className="block">Seu olhar.</span>
              <span className="block italic text-gold font-normal">Seu estilo.</span>
            </h1>

            <p className="font-sans text-xs sm:text-sm text-champagne-light/90 font-light leading-relaxed max-w-xs">
              Uma nova perspectiva de elegância.
            </p>
          </div>

          {/* 2. MOMENTO FINAL (Mobile Full-Screen): "Os detalhes fazem a diferença." + CTA */}
          <div
            className="absolute inset-x-0 bottom-0 space-y-2.5 will-change-transform"
            style={{
              opacity: finalOpacity,
              transform: `translate3d(0, ${finalTranslateY}px, 0)`,
              pointerEvents: isFinalInteractive ? 'auto' : 'none',
              display: finalOpacity <= 0 ? 'none' : 'block',
            }}
            aria-hidden={finalOpacity <= 0}
          >
            <div className="flex items-center gap-2">
              <span className="h-[1px] w-6 bg-gold/80" />
              <span className="text-caption uppercase tracking-[0.22em] text-gold text-[10px] font-medium">
                Alta Precisão & Design
              </span>
            </div>

            <h2 className="font-display text-[1.85rem] xs:text-[2.1rem] font-light text-offwhite leading-[1.06] tracking-tight drop-shadow-sm">
              <span className="block">Os detalhes</span>
              <span className="block italic text-gold font-normal">fazem a diferença.</span>
            </h2>

            <p className="font-sans text-xs sm:text-sm text-champagne-light/90 font-light leading-relaxed max-w-xs">
              Descubra novas possibilidades para o seu olhar.
            </p>

            <div className="pt-2">
              <a
                href="#colecoes"
                className="group inline-flex items-center justify-center gap-2.5 font-semibold text-[11px] uppercase tracking-wider px-6 py-3.5 rounded-sm bg-gold text-wine-deep hover:bg-gold-light border border-gold shadow-subtle-gold transition-all duration-300 ease-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 active:scale-[0.98]"
                tabIndex={isFinalInteractive ? 0 : -1}
              >
                <span>CONHECER COLEÇÕES</span>
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex flex-col justify-between p-5 sm:p-8 md:p-14 lg:p-20">
      {/* Máscara gradiente de fundo adaptativa para contraste editorial sem escurecer toda a cena */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-wine-deep/90 via-wine-deep/25 to-transparent transition-opacity duration-300"
        style={{
          opacity: Math.max(initialOpacity * 0.75, finalOpacity * 0.95),
        }}
        aria-hidden="true"
      />

      {/* ─────────────────────────────────────────────────────────────
          1. MOMENTO INICIAL: "Seu olhar. Seu estilo." (Mulher)
          ───────────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 max-w-xl transition-all duration-150 ease-out pt-20 sm:pt-24 md:pt-16"
        style={{
          opacity: initialOpacity,
          transform: `translate3d(0, ${initialTranslateY}px, 0)`,
          pointerEvents: 'none',
          display: initialOpacity <= 0 ? 'none' : 'block',
        }}
        aria-hidden={initialOpacity <= 0}
      >
        {/* Selo editorial sutil */}
        <div className="flex items-center gap-2 mb-3">
          <span className="h-[1px] w-6 sm:w-8 bg-gold/70" />
          <span className="text-caption uppercase tracking-[0.25em] text-gold text-[10px] sm:text-xs font-medium">
            Nova Ótica Vitaliz
          </span>
        </div>

        {/* Headline Inicial */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-offwhite leading-[1.08] tracking-tight drop-shadow-sm">
          <span className="block">Seu olhar.</span>
          <span className="block italic text-gold font-normal">Seu estilo.</span>
        </h1>

        {/* Texto de Apoio Inicial */}
        <p className="mt-3 font-sans text-xs sm:text-sm md:text-base text-champagne-light/90 max-w-sm sm:max-w-md font-light leading-relaxed">
          Uma nova perspectiva de elegância.
        </p>
      </div>

      {/* Espaçador flexível central para manter o vídeo como protagonista */}
      <div className="flex-1 pointer-events-none" aria-hidden="true" />

      {/* ─────────────────────────────────────────────────────────────
          2. MOMENTO FINAL: "Os detalhes fazem a diferença." (Armação)
          ───────────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 max-w-xl transition-all duration-150 ease-out pb-4 sm:pb-6"
        style={{
          opacity: finalOpacity,
          transform: `translate3d(0, ${finalTranslateY}px, 0)`,
          pointerEvents: isFinalInteractive ? 'auto' : 'none',
          display: finalOpacity <= 0 ? 'none' : 'block',
        }}
        aria-hidden={finalOpacity <= 0}
      >
        {/* Selo editorial sutil */}
        <div className="flex items-center gap-2 mb-3">
          <span className="h-[1px] w-6 sm:w-8 bg-gold/70" />
          <span className="text-caption uppercase tracking-[0.25em] text-gold text-[10px] sm:text-xs font-medium">
            Alta Precisão & Design
          </span>
        </div>

        {/* Headline Final */}
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-offwhite leading-[1.08] tracking-tight drop-shadow-sm">
          <span className="block">Os detalhes</span>
          <span className="block italic text-gold font-normal">fazem a diferença.</span>
        </h2>

        {/* Texto de Apoio Final */}
        <p className="mt-3 font-sans text-xs sm:text-sm md:text-base text-champagne-light/90 max-w-sm sm:max-w-md font-light leading-relaxed">
          Descubra novas possibilidades para o seu olhar.
        </p>

        {/* CTA Oficial com Destino #colecoes */}
        <div className="pt-5 sm:pt-6">
          <a
            href="#colecoes"
            className="group inline-flex items-center justify-center gap-3 font-semibold text-[11px] sm:text-xs uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded-sm bg-gold text-wine-deep hover:bg-gold-light border border-gold shadow-subtle-gold hover:shadow-elevated-wine transition-all duration-300 ease-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 active:scale-[0.98]"
            tabIndex={isFinalInteractive ? 0 : -1}
          >
            <span>CONHECER COLEÇÕES</span>
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </div>
  );
};
