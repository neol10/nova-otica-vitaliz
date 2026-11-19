import React from 'react';
import { Container } from '../ui/Container';
import { Layers, ArrowUpRight } from 'lucide-react';

interface CollectionCategory {
  id: string;
  title: string;
  categoryTag: string;
  description: string;
  imageSrc?: string;
  isPlaceholder?: boolean;
}

const CATEGORIES: CollectionCategory[] = [
  {
    id: 'grau',
    title: 'Armações de Grau',
    categoryTag: 'Linha Oftálmica',
    description:
      'Linhas puras, leveza ergonômica e precisão geométrica para quem valoriza nitidez e sofisticação contínua.',
    imageSrc: '/assets/images/editorial/vitaliz-armacoes-grau.webp',
    isPlaceholder: false,
  },
  {
    id: 'solar',
    title: 'Óculos de Sol',
    categoryTag: 'Proteção & Presença',
    description:
      'Lentes com filtro de conforto e armações com personalidade expressiva para iluminar qualquer ocasião.',
    imageSrc: '/assets/images/editorial/vitaliz-oculos-sol.webp',
    isPlaceholder: false,
  },
  {
    id: 'tendencias',
    title: 'Estilos & Tendências',
    categoryTag: 'Curadoria de Design',
    description:
      'Formas autorais, acetatos translúcidos e composições contemporâneas que acompanham a evolução da moda óptica.',
    imageSrc: '/assets/images/editorial/vitaliz-estilos-tendencias.webp',
    isPlaceholder: false,
  },
];

export const CollectionsSection: React.FC = () => {
  return (
    <section
      id="colecoes"
      aria-label="Coleções Nova Ótica Vitaliz"
      className="py-28 md:py-36 bg-offwhite text-graphite border-b border-champagne-dark"
    >
      <Container size="wide" className="space-y-16 sm:space-y-20">
        {/* Cabeçalho da Seção */}
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-gold" />
            <span className="text-caption uppercase tracking-[0.25em] text-wine-deep/80 font-semibold text-xs">
              Classificação &bull; Curadoria Óptica
            </span>
          </div>

          {/* Título Oficial Obrigatório */}
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-wine-deep tracking-tight">
            Encontre o estilo que{' '}
            <span className="italic font-light text-gold-dark">combina com você.</span>
          </h2>

          {/* Subtítulo Oficial Obrigatório */}
          <p className="font-sans text-body-lg text-graphite-light font-light leading-relaxed">
            Explore diferentes possibilidades para valorizar seu olhar.
          </p>
        </div>

        {/* Grid Editorial Assimétrico de Coleções */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {CATEGORIES.map((cat, idx) => (
            <article
              key={cat.id}
              className={`group relative flex flex-col justify-between bg-champagne-light/70 rounded-sm overflow-hidden border border-champagne-dark/80 hover:border-gold/50 transition-all duration-500 hover:shadow-subtle-gold ${
                idx === 1 ? 'md:translate-y-4' : ''
              }`}
            >
              {/* Área Fotográfica com Hover Sutil */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-champagne-dark/40">
                {cat.imageSrc && !cat.isPlaceholder ? (
                  <img
                    src={cat.imageSrc}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                    loading="eager"
                    decoding="async"
                    width="1199"
                    height="1312"
                  />
                ) : (
                  /* Placeholder visual elegante e claramente identificado */
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-champagne via-champagne-light to-champagne-dark text-graphite/70">
                    <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center mb-3">
                      <Layers size={20} className="text-gold" />
                    </div>
                    <span className="font-display text-base font-medium text-wine-deep tracking-wider uppercase">
                      Curadoria Editorial
                    </span>
                    <span className="font-mono text-[10px] text-graphite/50 tracking-wider uppercase mt-1">
                      [Fotografia Oficial em Breve]
                    </span>
                  </div>
                )}

                {/* Tag de Categoria flutuante */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-sans font-medium uppercase tracking-widest bg-wine-deep/80 text-offwhite backdrop-blur-xs border border-gold/20">
                    {cat.categoryTag}
                  </span>
                </div>
              </div>

              {/* Informações e Descrição */}
              <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-medium text-wine-deep group-hover:text-gold-dark transition-colors">
                    {cat.title}
                  </h3>
                  <p className="font-sans text-body-sm text-graphite-light font-light leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Rodapé do Card: Identificação de Navegação Sem Preços ou Links Fictícios */}
                <div className="pt-4 border-t border-champagne-dark/60 flex items-center justify-between text-caption text-graphite/60">
                  <span className="uppercase tracking-widest text-[11px] font-medium text-wine-deep/70">
                    Curadoria Nova Ótica Vitaliz
                  </span>
                  <div className="w-7 h-7 rounded-full border border-gold/40 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-wine-deep transition-all duration-300">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};
