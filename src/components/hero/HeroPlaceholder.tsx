import React from 'react';
import { Container } from '../ui/Container';
import { Badge } from '../ui/Badge';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Sparkles, Film, ArrowDown } from 'lucide-react';

/**
 * HeroPlaceholder — Fundação Técnica do Hero Cinematográfico
 *
 * REGRA RIGOROSA DA ETAPA 2:
 * - O Hero cinematográfico definitivo NÃO é implementado nesta etapa.
 * - O arquivo master "hero cinematografico scrool.mp4" permanece intacto.
 * - Este componente estabelece a infraestrutura técnica (marcação semântica,
 *   espaço reservado de pinning, verificação de prefers-reduced-motion e fallback mobile).
 */
export const HeroPlaceholder: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="hero-cinematografico"
      aria-label="Apresentação Cinematográfica da Nova Ótica Vitaliz"
      className="relative min-h-[90vh] flex flex-col justify-center items-center bg-wine-deep text-offwhite overflow-hidden py-24 border-b border-gold/30"
    >
      {/* Background decorativo estático e acessível (não utiliza autoplay forçado) */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-wine-soft via-wine-deep to-[#15040a] opacity-90"
        aria-hidden="true"
      />

      {/* Grid sutil de luxo com linhas de ouro translúcido */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(197,160,89,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,160,89,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]"
        aria-hidden="true"
      />

      <Container size="default" className="relative z-10 text-center space-y-8">
        {/* Badge de status do design system */}
        <div className="flex justify-center">
          <Badge variant="gold" className="gap-2">
            <Sparkles size={14} className="text-gold" />
            <span>Fundação Técnica &bull; Design System Ativo</span>
          </Badge>
        </div>

        {/* Título de exibição com Cormorant Garamond */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="font-display text-hero-title font-light tracking-tight text-offwhite text-balance">
            A Arte da Visão em Sua Expressão Mais{' '}
            <span className="italic font-normal text-gold underline decoration-gold/40 underline-offset-8">
              Sofisticada
            </span>
          </h1>

          <p className="font-sans text-editorial-sub text-champagne-light/80 max-w-2xl mx-auto font-light leading-relaxed">
            Uma experiência visual contemporânea onde moda óptica, curadoria exclusiva e alta estética
            se encontram.
          </p>
        </div>

        {/* Card informativo de infraestrutura técnica (visível durante desenvolvimento/auditoria) */}
        <div className="max-w-xl mx-auto glass-dark p-6 rounded-sm border border-gold/30 text-left space-y-3 mt-8">
          <div className="flex items-center gap-2 text-gold font-display text-lg font-medium">
            <Film size={18} />
            <span>Infraestrutura do Hero Cinematográfico (Etapa 2)</span>
          </div>
          <p className="text-body-sm text-offwhite/80 leading-relaxed font-light">
            O contêiner de ancoragem, classes de pinning, escala tipográfica de alto impacto e detecção
            de movimento reduzido foram configurados com sucesso.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-offwhite/60">
            <span className="bg-black/40 px-2.5 py-1 rounded border border-gold/20">
              Master: hero cinematografico scrool.mp4 (Preservado)
            </span>
            <span className="bg-black/40 px-2.5 py-1 rounded border border-gold/20">
              Reduced-Motion: {prefersReducedMotion ? 'Ativado (Fallback Estático)' : 'Padrão'}
            </span>
          </div>
        </div>

        {/* Indicador de scroll inicial */}
        <div className="pt-10 flex flex-col items-center gap-2 text-gold/70 animate-pulse">
          <span className="text-caption uppercase tracking-widest text-[11px]">
            Arquitetura em Construção
          </span>
          <ArrowDown size={16} />
        </div>
      </Container>
    </section>
  );
};
