import React from 'react';
import { Container } from '../ui/Container';
import { Compass, Sparkles } from 'lucide-react';

const STYLE_PILLARS = [
  {
    name: 'Clássico & Atemporal',
    description: 'Proporções equilibradas e linhas elegantes que atravessam tendências com discrição e nobreza.',
  },
  {
    name: 'Moderno & Autoral',
    description: 'Geometrias marcantes, acetatos translúcidos e cortes contemporâneos que afirmam presença.',
  },
  {
    name: 'Minimalista & Preciso',
    description: 'Perfis ultrafinos em titânio e metais nobres, onde a leveza e a função pura são protagonistas.',
  },
];

export const StyleSection: React.FC = () => {
  return (
    <section
      id="estilo"
      aria-label="Estilo e Personalidade"
      className="relative py-28 md:py-36 bg-wine-deep text-offwhite overflow-hidden border-b border-gold/20"
    >
      {/* Iluminação de fundo e texturização discreta */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-wine-soft/80 via-wine-deep to-[#120308]"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(197,160,89,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,160,89,0.03)_1px,transparent_1px)] bg-[size:5rem_5rem]"
        aria-hidden="true"
      />

      <Container size="wide" className="relative z-10 space-y-20">
        {/* Bloco Superior: Headline de Alto Impacto */}
        <div className="max-w-3xl space-y-6">
          <div className="flex items-center gap-2">
            <Compass size={14} className="text-gold" />
            <span className="text-caption uppercase tracking-[0.25em] text-gold/90 font-semibold text-xs">
              Estilo e Personalidade
            </span>
          </div>

          {/* Headline Oficial Obrigatória */}
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-offwhite leading-[1.08] tracking-tight">
            Um estilo para{' '}
            <span className="italic font-normal text-gold underline decoration-gold/40 underline-offset-8">
              cada olhar.
            </span>
          </h2>

          {/* Texto Oficial Obrigatório */}
          <p className="font-sans text-body-lg text-champagne-light/85 font-light leading-relaxed max-w-2xl text-balance">
            Clássico, moderno, discreto ou marcante. Os óculos são uma forma de expressar sua
            personalidade em cada detalhe.
          </p>
        </div>

        {/* Composição Editorial Central: Imagem Ampla + Pilares de Estilo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Fotografia Editorial Ampla (7 Colunas) */}
          <div className="lg:col-span-7">
            <div className="relative group">
              <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] max-h-[580px] rounded-sm overflow-hidden border border-gold/30 shadow-elevated-wine bg-wine-deep">
                <img
                  src="/assets/images/editorial/vitaliz-modelo-editorial.webp"
                  alt="Estilo e Personalidade — Expressão sofisticada com armação Nova Ótica Vitaliz"
                  className="w-full h-full object-cover object-top sm:object-center transition-transform duration-700 ease-luxury group-hover:scale-103"
                  loading="lazy"
                  width="1199"
                  height="1312"
                />

                {/* Gradiente protetor inferior localizado */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-wine-deep/80 via-transparent to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-offwhite z-10">
                  <div className="flex items-center gap-2 text-caption">
                    <Sparkles size={14} className="text-gold" />
                    <span className="tracking-widest uppercase text-xs font-medium">
                      Harmonia &bull; Forma &bull; Expressão
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-offwhite/70 tracking-wider">
                    NOVA ÓTICA VITALIZ
                  </span>
                </div>
              </div>

              {/* Borda deslocada sutil para efeito de galeria de luxo */}
              <div
                className="absolute -top-3 -right-3 w-full h-full border border-gold/20 rounded-sm -z-10 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Pilares de Expressão (5 Colunas) */}
          <div className="lg:col-span-5 space-y-6">
            {STYLE_PILLARS.map((pillar, index) => (
              <div
                key={pillar.name}
                className="p-6 rounded-sm bg-wine-soft/40 border border-gold/20 hover:border-gold/50 transition-all duration-300 space-y-2 hover:bg-wine-soft/60"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-gold/80 font-semibold">
                    0{index + 1}
                  </span>
                  <h3 className="font-display text-xl font-medium text-offwhite">
                    {pillar.name}
                  </h3>
                </div>
                <p className="font-sans text-body-sm text-offwhite/70 font-light leading-relaxed pl-7">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
