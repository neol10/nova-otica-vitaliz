import React from 'react';
import { Container } from '../ui/Container';
import { Sparkles, Eye } from 'lucide-react';

export const EssenceSection: React.FC = () => {
  return (
    <section
      id="sobre"
      aria-label="A Essência Vitaliz"
      className="relative py-28 md:py-36 bg-champagne text-graphite overflow-hidden border-b border-champagne-dark/60"
    >
      {/* Elemento de iluminação difusa decorativa */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Coluna Editorial / Texto (Assimétrica - 7 colunas) */}
          <div className="lg:col-span-7 space-y-8 order-2 lg:order-1">
            <div className="flex items-center gap-2">
              <span className="h-[1px] w-10 bg-gold/60" />
              <span className="text-caption uppercase tracking-[0.25em] text-wine-deep/80 font-semibold text-xs">
                A Essência Vitaliz
              </span>
            </div>

            {/* Headline Obrigatória */}
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-wine-deep leading-[1.1] tracking-tight">
              Seu olhar revela{' '}
              <span className="italic font-light text-gold-dark underline decoration-gold/30 underline-offset-8">
                quem você é.
              </span>
            </h2>

            {/* Texto Oficial Obrigatório */}
            <p className="font-sans text-body-lg text-graphite-light font-light leading-relaxed max-w-xl text-balance">
              Mais do que um acessório, os óculos fazem parte da sua identidade. Cada detalhe pode
              transformar a maneira como você se expressa e revela seu estilo.
            </p>

            {/* Destaque conceitual com microinteração sutil */}
            <div className="pt-4 border-l-2 border-gold/40 pl-6 space-y-2">
              <div className="flex items-center gap-2 text-wine-deep font-display text-xl font-medium">
                <Sparkles size={16} className="text-gold" />
                <span>Elegância &bull; Conforto &bull; Singularidade</span>
              </div>
              <p className="font-sans text-body-sm text-graphite-light/80 font-light max-w-lg">
                Curadoria atenta à proporção do rosto, ao peso das hastes e à pureza das linhas,
                para que a sua expressão seja autêntica e inconfundível.
              </p>
            </div>
          </div>

          {/* Coluna Visual / Fotografia Editorial com Placeholder Elegante (5 colunas) */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative group">
              {/* Moldura externa refinada com sombra dourada difusa */}
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-gradient-to-br from-champagne-light via-champagne to-champagne-dark border border-gold/30 shadow-subtle-gold transition-all duration-700 group-hover:shadow-elevated-wine">
                {/* Imagem editorial aprovada do acervo oficial (A Essência Vitaliz) */}
                <img
                  src="/assets/images/editorial/vitaliz-essencia.webp"
                  alt="A Essência Vitaliz — Detalhes em acetato translúcido vinho e acabamentos nobres"
                  className="w-full h-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                  loading="lazy"
                  width="1199"
                  height="1312"
                />

                {/* Máscara de vinheta suave */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-wine-deep/60 via-transparent to-transparent opacity-80"
                  aria-hidden="true"
                />

                {/* Selo de identificação visual da curadoria */}
                <div className="absolute bottom-6 left-6 right-6 z-10 flex items-center justify-between text-offwhite text-caption">
                  <div className="flex items-center gap-2">
                    <Eye size={14} className="text-gold" />
                    <span className="tracking-widest uppercase text-[11px] font-medium">
                      Design &bull; Alta Estética
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-offwhite/60 tracking-wider">
                    Nova Ótica Vitaliz
                  </span>
                </div>
              </div>

              {/* Elemento de profundidade arquitetural atrás da imagem */}
              <div
                className="absolute -bottom-4 -left-4 w-full h-full border border-gold/20 rounded-sm -z-10 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
