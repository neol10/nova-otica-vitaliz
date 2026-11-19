import React, { useState, useEffect } from 'react';
import { Container } from '../ui/Container';
import { businessConfig } from '../../config/business';
import { InstagramIcon } from '../icons/InstagramIcon';
import { Menu, X } from 'lucide-react';

export const HeaderFoundation: React.FC = () => {
  const [isLightSection, setIsLightSection] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Monitora o scroll para alternar entre o modo sobre o Hero (escuro/translúcido)
  // e o modo sobre seções claras (champagne/blur)
  useEffect(() => {
    const handleScroll = () => {
      const colecoesElem = document.getElementById('colecoes');
      if (colecoesElem) {
        const rect = colecoesElem.getBoundingClientRect();
        // Quando a seção clara atinge os primeiros 70px do topo da viewport
        setIsLightSection(rect.top <= 70);
      } else {
        // Fallback baseado em scrollY geral se o elemento não for localizado
        setIsLightSection(window.scrollY > 2500);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloqueia o scroll do body e escuta tecla Escape quando o menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsMobileMenuOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  // Se o viewport cruzar o breakpoint `lg` (rotação do tablet / resize) com o menu aberto,
  // a gaveta some via CSS (lg:hidden) mas o estado continuava "aberto" e o body ficava com
  // overflow:hidden — página sem rolagem. Fecha o menu (e libera o scroll) ao entrar em `lg`.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMobileMenuOpen(false);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-luxury ${
          isLightSection
            ? 'bg-champagne/85 backdrop-blur-md border-b border-champagne-dark/50 shadow-sm py-3'
            : 'bg-wine-deep/30 backdrop-blur-sm border-b border-gold/15 py-4'
        }`}
      >
        <Container size="wide" className="flex h-10 items-center justify-between">
          {/* Marca / Assinatura Tipográfica Minimalista (sem quebras de linha em viewports estreitos) */}
          <a
            href="#"
            className="group inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
            aria-label="Nova Ótica Vitaliz — Início"
          >
            <span
              className={`font-display text-base sm:text-xl font-medium tracking-[0.14em] sm:tracking-[0.2em] uppercase whitespace-nowrap transition-colors duration-300 ${
                isLightSection
                  ? 'text-wine-deep group-hover:text-gold-dark'
                  : 'text-offwhite group-hover:text-gold'
              }`}
            >
              {businessConfig.brand.name}
            </span>
          </a>

          {/* Navegação Desktop Simplificada & Editorial */}
          <nav aria-label="Navegação Principal" className="hidden lg:flex items-center gap-8">
            <a
              href="#colecoes"
              className={`text-caption uppercase tracking-[0.2em] font-medium transition-all duration-300 relative py-1 hover:text-gold ${
                isLightSection ? 'text-graphite' : 'text-offwhite/90'
              }`}
            >
              Coleções
            </a>

            <a
              href="#atendimento"
              className={`text-caption uppercase tracking-[0.2em] font-medium transition-all duration-300 relative py-1 hover:text-gold ${
                isLightSection ? 'text-graphite' : 'text-offwhite/90'
              }`}
            >
              Atendimento
            </a>

            <div className={`h-3 w-[1px] ${isLightSection ? 'bg-graphite/20' : 'bg-white/20'}`} />

            {/* Canal Oficial Instagram */}
            <a
              href={businessConfig.brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Oficial Nova Ótica Vitaliz"
              className={`p-1.5 transition-colors duration-300 hover:text-gold ${
                isLightSection ? 'text-wine-deep' : 'text-gold'
              }`}
            >
              <InstagramIcon size={18} />
            </a>

            {/* Botão Cápsula Discreto */}
            <a
              href="#colecoes"
              className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[11px] font-sans font-medium uppercase tracking-[0.18em] transition-all duration-300 ${
                isLightSection
                  ? 'border border-wine-deep/30 text-wine-deep hover:bg-wine-deep hover:text-offwhite'
                  : 'border border-gold/50 text-offwhite bg-wine-deep/40 hover:bg-gold hover:text-wine-deep hover:border-gold'
              }`}
            >
              Explorar
            </a>
          </nav>

          {/* Ações Mobile & Tablet: Instagram + Toggle do Menu Compacto */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={businessConfig.brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Oficial Nova Ótica Vitaliz"
              className={`p-2 transition-colors ${
                isLightSection ? 'text-wine-deep hover:text-gold-dark' : 'text-gold hover:text-gold-light'
              }`}
            >
              <InstagramIcon size={19} />
            </a>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold transition-colors ${
                isLightSection ? 'text-wine-deep' : 'text-offwhite'
              }`}
              aria-label={isMobileMenuOpen ? 'Fechar Menu' : 'Abrir Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </Container>
      </header>

      {/* Menu Gaveta Mobile/Tablet Compacto e Acessível */}
      <div
        className={`fixed inset-0 z-40 bg-wine-deep/95 backdrop-blur-xl transition-all duration-400 ease-luxury lg:hidden flex flex-col justify-center px-8 sm:px-12 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-4'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="space-y-6 text-center">
          <span className="font-display text-xs uppercase tracking-[0.3em] text-gold/80 block">
            Nova Ótica Vitaliz
          </span>

          <nav className="flex flex-col gap-5">
            <a
              href="#sobre"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-display text-2xl font-light text-offwhite hover:text-gold transition-colors tracking-wide"
            >
              A Essência
            </a>

            <a
              href="#colecoes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-display text-2xl font-light text-offwhite hover:text-gold transition-colors tracking-wide"
            >
              Coleções
            </a>

            <a
              href="#estilo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-display text-2xl font-light text-offwhite hover:text-gold transition-colors tracking-wide"
            >
              Estilo &amp; Personalidade
            </a>

            <a
              href="#atendimento"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-display text-2xl font-light text-gold hover:text-gold-light transition-colors tracking-wide"
            >
              Atendimento
            </a>

            <div className="pt-2">
              <a
                href={businessConfig.brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-sans text-xs uppercase tracking-[0.2em] text-champagne-light/80 hover:text-gold transition-colors inline-flex items-center justify-center gap-2"
              >
                <InstagramIcon size={16} />
                <span>@nova.oticavitaliz</span>
              </a>
            </div>
          </nav>

          <div className="pt-6">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-6 py-2 rounded-full border border-gold/40 text-gold text-xs uppercase tracking-widest font-medium"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
