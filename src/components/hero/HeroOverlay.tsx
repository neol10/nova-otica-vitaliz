import React from 'react';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';

export interface HeroOverlayProps {
  progress: number; // Progresso normalizado de 0 a 1 do ScrollTrigger
}

/**
 * HeroOverlay — Camada Editorial e Chamada de Conversão do Hero
 *
 * Diretrizes:
 * - Headline: "SEU OLHAR. SEU ESTILO."
 * - Entrada gradual a partir de progress >= 0.65 (quando a modelo coloca os óculos).
 * - Posicionamento estratégico à esquerda/inferior para NÃO cobrir o rosto da modelo.
 * - Animação suave e 100% reversível com o scroll.
 * - Contraste acessível com gradiente protetor localizado.
 */
export const HeroOverlay: React.FC<HeroOverlayProps> = ({ progress }) => {
  // Com a modelo aparecendo primeiro, o título já surge visível no topo (progress 0)
  // e suaviza levemente quando o zoom no detalhe macro do óculos se aprofunda
  const opacity = Math.max(0.2, 1 - progress * 0.8);
  const translateY = progress * -15;
  const isInteractive = opacity > 0.4;

  return (
    <div
      className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end p-6 sm:p-10 md:p-16 lg:p-20"
    >
      {/* Máscara gradiente inferior localizada para garantir contraste acessível sem escurecer toda a mídia */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-wine-deep/85 via-wine-deep/30 to-transparent transition-opacity duration-300"
        style={{ opacity: Math.min(1, opacity * 1.1) }}
        aria-hidden="true"
      />

      {/* Conteúdo Editorial Posicionado Estrategicamente */}
      <div
        className="relative z-10 max-w-xl space-y-5 transition-transform duration-100 ease-out"
        style={{
          opacity,
          transform: `translate3d(0, ${translateY}px, 0)`,
          pointerEvents: isInteractive ? 'auto' : 'none',
        }}
      >
        {/* Selo sutil */}
        <div className="flex items-center gap-2">
          <span className="h-[1px] w-8 bg-gold/60" />
          <span className="text-caption uppercase tracking-widest text-gold text-xs font-semibold">
            Nova Ótica Vitaliz
          </span>
        </div>

        {/* Headline Oficial Obrigatória */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-offwhite leading-[1.05] tracking-tight">
          <span className="block">SEU OLHAR.</span>
          <span className="block italic text-gold font-normal">SEU ESTILO.</span>
        </h1>

        {/* Subtítulo institucional refinado */}
        <p className="font-sans text-body-sm sm:text-body-md text-champagne-light/90 max-w-md font-light leading-relaxed">
          Armações selecionadas onde a moda óptica encontra a proporção áurea e o design contemporâneo.
        </p>

        {/* CTA Obrigatório direcionado para âncora futura de coleções */}
        <div className="pt-2">
          <a href="#colecoes" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
            <Button
              variant="secondary"
              size="lg"
              className="group gap-3 tracking-wider text-xs uppercase px-7 py-4 shadow-subtle-gold hover:shadow-elevated-wine"
            >
              <span>CONHECER COLEÇÕES</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
