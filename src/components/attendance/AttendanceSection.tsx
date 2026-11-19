import React from 'react';
import { Container } from '../ui/Container';
import { businessConfig, getWhatsAppLink } from '../../config/business';
import { InstagramIcon } from '../icons/InstagramIcon';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';
import { Sparkles, MapPin, Clock } from 'lucide-react';

export const AttendanceSection: React.FC = () => {
  const whatsAppLink = getWhatsAppLink();
  const isWhatsAppActive = Boolean(businessConfig.status.isWhatsAppConfirmed && whatsAppLink);

  // Link principal do atendimento: WhatsApp oficial confirmado
  const primaryActionUrl = isWhatsAppActive ? (whatsAppLink as string) : businessConfig.brand.instagramUrl;
  const primaryActionLabel = 'FALAR COM A VITALIZ';

  return (
    <section
      id="atendimento"
      aria-label="Atendimento Nova Ótica Vitaliz"
      className="relative py-28 md:py-36 bg-champagne text-graphite overflow-hidden border-b border-champagne-dark"
    >
      {/* Iluminação difusa decorativa */}
      <div
        className="absolute top-1/2 left-0 -translate-y-1/2 w-[450px] h-[450px] bg-gold/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Coluna Editorial Principal (7 colunas) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center gap-2">
              <span className="h-[1px] w-10 bg-gold/60" />
              <span className="text-caption uppercase tracking-[0.25em] text-wine-deep/80 font-semibold text-xs">
                Atendimento Exclusivo
              </span>
            </div>

            {/* Headline Oficial Obrigatória */}
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-wine-deep leading-[1.12] tracking-tight">
              Seu estilo merece{' '}
              <span className="italic font-light text-gold-dark underline decoration-gold/30 underline-offset-8">
                atenção aos detalhes.
              </span>
            </h2>

            {/* Texto Oficial Obrigatório */}
            <p className="font-sans text-body-lg text-graphite-light font-light leading-relaxed max-w-xl text-balance">
              Descubra novas possibilidades para o seu olhar e conheça a Nova Ótica Vitaliz. Entre em
              contato pelos nossos canais oficiais e encontre inspiração para sua próxima escolha.
            </p>

            {/* Ações de Contato & Conversão */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
              {/* CTA Principal */}
              <a
                href={primaryActionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-sm bg-wine-deep text-offwhite hover:bg-gold hover:text-wine-deep font-sans text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-subtle-gold group"
              >
                <WhatsAppIcon size={18} className="text-gold group-hover:text-wine-deep transition-colors" />
                <span>{primaryActionLabel}</span>
              </a>

              {/* CTA Secundário */}
              <a
                href={businessConfig.brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-sm border border-wine-deep/30 text-wine-deep hover:border-gold hover:text-gold font-sans text-xs uppercase tracking-[0.18em] font-medium transition-all duration-300"
              >
                <InstagramIcon size={15} />
                <span>ACOMPANHAR NO INSTAGRAM</span>
              </a>
            </div>
          </div>

          {/* Coluna Card Editorial / Curadoria e Informações Confirmadas (5 colunas) */}
          <div className="lg:col-span-5">
            <div className="rounded-sm bg-offwhite/90 border border-gold/30 shadow-subtle-gold overflow-hidden relative group">
              {/* Fotografia Editorial do Ambiente de Atendimento */}
              <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full overflow-hidden bg-champagne-dark/30 border-b border-gold/20">
                <img
                  src="/assets/images/editorial/vitaliz-atendimento.webp"
                  alt="Ambiente exclusivo de atendimento da Nova Ótica Vitaliz"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-luxury group-hover:scale-103"
                  loading="lazy"
                  width="1199"
                  height="1312"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-wine-deep/70 via-transparent to-transparent pointer-events-none"
                  aria-hidden="true"
                />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-offwhite z-10 text-[11px] font-sans">
                  <span className="uppercase tracking-widest text-gold text-caption font-medium">
                    Atendimento Personalizado
                  </span>
                  <span className="font-mono text-[10px] text-offwhite/70">
                    NOVA ÓTICA VITALIZ
                  </span>
                </div>
              </div>

              {/* Conteúdo Institucional do Card */}
              <div className="p-6 sm:p-8 space-y-6 relative">
                {/* Marca d'água sutil */}
                <div
                  className="absolute -right-8 -bottom-8 w-40 h-40 border border-gold/15 rounded-full pointer-events-none"
                  aria-hidden="true"
                />

                <div className="space-y-2 border-b border-champagne-dark/60 pb-5">
                  <div className="flex items-center gap-2 text-wine-deep">
                    <Sparkles size={16} className="text-gold" />
                    <span className="font-display text-xl font-medium tracking-wide">
                      Experiência Vitaliz
                    </span>
                  </div>
                  <p className="font-sans text-body-sm text-graphite-light font-light leading-relaxed">
                    Atendimento dedicado a harmonizar estética, proporção áurea e bem-estar
                    visual em cada escolha.
                  </p>
                </div>

                {/* Canais Oficiais Confirmados */}
                <div className="space-y-3">
                  <span className="text-caption uppercase tracking-[0.2em] text-wine-deep/70 text-xs font-semibold block">
                    Canais Oficiais Confirmados
                  </span>
                  
                  {/* WhatsApp Oficial */}
                  {isWhatsAppActive && (
                    <a
                      href={whatsAppLink as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3.5 rounded-sm bg-champagne-light/70 border border-champagne-dark/80 hover:border-gold/50 transition-colors group/wa"
                    >
                      <div className="w-10 h-10 rounded-full bg-wine-deep text-gold flex items-center justify-center flex-shrink-0 group-hover/wa:bg-gold group-hover/wa:text-wine-deep transition-colors">
                        <WhatsAppIcon size={20} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-wine-deep block group-hover/wa:text-gold-dark transition-colors">
                          {businessConfig.contact.whatsappFormatted}
                        </span>
                        <span className="text-caption text-graphite/60 text-xs block font-light">
                          Atendimento direto via WhatsApp
                        </span>
                      </div>
                    </a>
                  )}

                  {/* Instagram Oficial */}
                  <a
                    href={businessConfig.brand.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-3.5 rounded-sm bg-champagne-light/50 border border-champagne-dark/70 hover:border-gold/50 transition-colors group/ig"
                  >
                    <div className="w-10 h-10 rounded-full bg-wine-deep text-gold flex items-center justify-center flex-shrink-0 group-hover/ig:bg-gold group-hover/ig:text-wine-deep transition-colors">
                      <InstagramIcon size={20} />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-wine-deep block group-hover/ig:text-gold-dark transition-colors">
                        @nova.oticavitaliz
                      </span>
                      <span className="text-caption text-graphite/60 text-xs block font-light">
                        Atualizações de estilo &amp; novidades
                      </span>
                    </div>
                  </a>
                </div>

                {/* Localização e Horários (Renderização Estritamente Condicional) */}
                {businessConfig.status.isAddressConfirmed && businessConfig.location.address && (
                  <div className="space-y-2 pt-2 border-t border-champagne-dark/60">
                    <div className="flex items-start gap-2 text-body-sm text-graphite-light">
                      <MapPin size={16} className="text-gold flex-shrink-0 mt-1" />
                      <span>
                        {businessConfig.location.address}
                        {businessConfig.location.neighborhood && `, ${businessConfig.location.neighborhood}`}
                        {businessConfig.location.city && ` — ${businessConfig.location.city}`}
                      </span>
                    </div>
                    {businessConfig.location.googleMapsUrl && (
                      <a
                        href={businessConfig.location.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gold-dark hover:underline block pl-6"
                      >
                        Ver localização no mapa &rarr;
                      </a>
                    )}
                  </div>
                )}

                {businessConfig.status.isScheduleConfirmed && businessConfig.schedule.weekdays && (
                  <div className="flex items-center gap-2 text-body-sm text-graphite-light pt-2">
                    <Clock size={16} className="text-gold flex-shrink-0" />
                    <span>{businessConfig.schedule.weekdays}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
