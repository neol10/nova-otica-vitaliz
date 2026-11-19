import React from 'react';
import { Container } from '../ui/Container';
import { businessConfig, getWhatsAppLink } from '../../config/business';
import { InstagramIcon } from '../icons/InstagramIcon';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';
import { MapPin, Clock } from 'lucide-react';

export const FooterFoundation: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const whatsAppLink = getWhatsAppLink();

  return (
    <footer className="w-full bg-wine-deep text-offwhite border-t border-gold/30 pt-16 pb-12 mt-auto">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-white/10">
          {/* Identidade */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-semibold tracking-wider text-gold">
              {businessConfig.brand.name}
            </h3>
            <p className="text-body-sm text-offwhite/80 max-w-sm font-light leading-relaxed">
              {businessConfig.brand.tagline}. A sofisticação do design contemporâneo aliada à atenção
              minuciosa ao seu olhar.
            </p>
          </div>

          {/* Navegação Interna Completa e Funcional */}
          <div className="space-y-3">
            <h4 className="text-caption uppercase tracking-widest text-gold/90 font-medium text-xs">
              Navegação
            </h4>
            <ul className="space-y-2 text-body-sm text-offwhite/70">
              <li>
                <a href="#sobre" className="hover:text-gold transition-colors">
                  A Essência Vitaliz
                </a>
              </li>
              <li>
                <a href="#colecoes" className="hover:text-gold transition-colors">
                  Coleções &amp; Curadoria
                </a>
              </li>
              <li>
                <a href="#estilo" className="hover:text-gold transition-colors">
                  Estilo e Personalidade
                </a>
              </li>
              <li>
                <a href="#atendimento" className="hover:text-gold transition-colors">
                  Atendimento
                </a>
              </li>
            </ul>
          </div>

          {/* Canais Oficiais e Contato Confirmado */}
          <div className="space-y-4">
            <h4 className="text-caption uppercase tracking-widest text-gold/90 font-medium text-xs">
              Canais Oficiais
            </h4>
            <div className="flex flex-col gap-3">
              {/* WhatsApp Oficial */}
              {businessConfig.status.isWhatsAppConfirmed && businessConfig.contact.whatsappFormatted && whatsAppLink && (
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-body-sm text-offwhite/90 hover:text-gold transition-colors group"
                  aria-label={`WhatsApp Oficial ${businessConfig.brand.name} ${businessConfig.contact.whatsappFormatted}`}
                >
                  <div className="w-8 h-8 rounded-full bg-wine-soft/60 border border-gold/40 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-wine-deep transition-colors">
                    <WhatsAppIcon size={16} />
                  </div>
                  <span>{businessConfig.contact.whatsappFormatted}</span>
                </a>
              )}

              {/* Instagram Oficial */}
              <a
                href={businessConfig.brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-body-sm text-offwhite/90 hover:text-gold transition-colors group"
                aria-label={`Instagram Oficial ${businessConfig.brand.name} @nova.oticavitaliz`}
              >
                <div className="w-8 h-8 rounded-full bg-wine-soft/60 border border-gold/40 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-wine-deep transition-colors">
                  <InstagramIcon size={16} />
                </div>
                <span>@nova.oticavitaliz</span>
              </a>
            </div>

            {/* Suporte Estritamente Condicional para Localização e Horários Confirmados */}
            {businessConfig.status.isAddressConfirmed && businessConfig.location.address && (
              <div className="pt-2 flex items-start gap-2 text-caption text-offwhite/70">
                <MapPin size={14} className="text-gold flex-shrink-0 mt-0.5" />
                <span>
                  {businessConfig.location.address}
                  {businessConfig.location.city && `, ${businessConfig.location.city}`}
                </span>
              </div>
            )}

            {businessConfig.status.isScheduleConfirmed && businessConfig.schedule.weekdays && (
              <div className="flex items-center gap-2 text-caption text-offwhite/70">
                <Clock size={14} className="text-gold flex-shrink-0" />
                <span>{businessConfig.schedule.weekdays}</span>
              </div>
            )}
          </div>
        </div>

        {/* Linha de Direitos Autorais Limpa (sem textos técnicos ou de auditoria na UI) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-caption text-offwhite/60 text-xs">
          <p>
            &copy; {currentYear} {businessConfig.brand.name}. Todos os direitos reservados.
          </p>
          <p className="tracking-widest uppercase text-[10px] text-offwhite/40">
            Moda Óptica &bull; Design &bull; Sofisticação
          </p>
        </div>
      </Container>
    </footer>
  );
};
