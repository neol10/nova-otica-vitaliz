import React from 'react';
import { Container } from '../ui/Container';
import { businessConfig, getWhatsAppLink } from '../../config/business';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';
import { ArrowRight, Sparkles } from 'lucide-react';

export const ConversionSection: React.FC = () => {
  const whatsAppLink = getWhatsAppLink();
  const conversionUrl = whatsAppLink ?? businessConfig.brand.instagramUrl;

  return (
    <section
      id="conversao"
      aria-label="Conhecer a Nova Ótica Vitaliz"
      className="relative py-28 md:py-36 bg-wine-deep text-offwhite overflow-hidden border-b border-gold/20"
    >
      {/* Efeito de iluminação cinematográfica de fundo */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-wine-soft/60 via-wine-deep to-[#140409]"
        aria-hidden="true"
      />

      {/* Grade decorativa com opacidade ultra-sutil */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(197,160,89,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,160,89,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"
        aria-hidden="true"
      />

      <Container size="default" className="relative z-10 text-center space-y-10 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-wine-deep/80 backdrop-blur-xs text-gold text-caption uppercase tracking-[0.25em] text-xs font-medium">
          <Sparkles size={13} />
          <span>Nova Ótica Vitaliz</span>
        </div>

        {/* Headline Oficial Obrigatória */}
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-offwhite leading-[1.1] tracking-tight text-balance">
          Seu próximo olhar{' '}
          <span className="italic font-normal text-gold underline decoration-gold/40 underline-offset-8">
            começa aqui.
          </span>
        </h2>

        {/* Subtítulo Oficial Obrigatório */}
        <p className="font-sans text-body-lg sm:text-xl text-champagne-light/85 font-light leading-relaxed max-w-2xl mx-auto text-balance">
          Estilo, personalidade e novas possibilidades para transformar a maneira como você se apresenta
          ao mundo.
        </p>

        {/* CTA Elegante */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={conversionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-sm bg-gold text-wine-deep hover:bg-gold-light font-sans text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 shadow-elevated-wine group"
          >
            <WhatsAppIcon size={18} className="text-wine-deep" />
            <span>CONHECER A VITALIZ</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </Container>
    </section>
  );
};
