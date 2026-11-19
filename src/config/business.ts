/**
 * Configuração Centralizada de Dados Comerciais da Nova Ótica Vitaliz
 * Metodologia NEWNEO Web Architect
 *
 * REGRA RIGOROSA:
 * Não inventar dados comerciais (endereço, telefone, marcas, preços, horários).
 * Campos pendentes são marcados como null ou opcionais com flag isConfirmed: false.
 */

export interface BusinessConfig {
  brand: {
    name: string;
    tagline: string;
    instagramUrl: string;
    logoUrl?: string;
  };
  contact: {
    whatsappNumber: string | null;
    whatsappFormatted?: string;
    whatsappDefaultMessage: string;
    phone: string | null;
    email: string | null;
  };
  location: {
    address: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    googleMapsUrl: string | null;
    embedMapUrl: string | null;
  };
  schedule: {
    weekdays: string | null;
    saturday: string | null;
    sunday: string | null;
  };
  catalog: {
    brands: string[];
    services: string[];
  };
  domain: {
    productionUrl: string | null;
  };
  status: {
    isWhatsAppConfirmed: boolean;
    isAddressConfirmed: boolean;
    isScheduleConfirmed: boolean;
    isServicesConfirmed: boolean;
    isBrandsConfirmed: boolean;
    isDomainConfirmed: boolean;
  };
}

export const businessConfig: BusinessConfig = {
  brand: {
    name: 'Nova Ótica Vitaliz',
    tagline: 'Moda Óptica, Elegância e Alta Estética para o Seu Olhar',
    instagramUrl: 'https://www.instagram.com/nova.oticavitaliz/',
    logoUrl: undefined, // Aguardando vetor/arquivo oficial
  },
  contact: {
    whatsappNumber: '5519997826744',
    whatsappFormatted: '(19) 99782-6744',
    whatsappDefaultMessage: 'Olá! Gostaria de conhecer as armações e saber mais sobre o atendimento da Nova Ótica Vitaliz.',
    phone: null, // PENDENTE DE CONFIRMAÇÃO
    email: null, // PENDENTE DE CONFIRMAÇÃO
  },
  location: {
    address: null, // PENDENTE DE CONFIRMAÇÃO
    neighborhood: null, // PENDENTE DE CONFIRMAÇÃO
    city: null, // PENDENTE DE CONFIRMAÇÃO
    state: null, // PENDENTE DE CONFIRMAÇÃO
    postalCode: null, // PENDENTE DE CONFIRMAÇÃO
    googleMapsUrl: null, // PENDENTE DE CONFIRMAÇÃO
    embedMapUrl: null, // PENDENTE DE CONFIRMAÇÃO
  },
  schedule: {
    weekdays: null, // PENDENTE DE CONFIRMAÇÃO
    saturday: null, // PENDENTE DE CONFIRMAÇÃO
    sunday: null, // PENDENTE DE CONFIRMAÇÃO
  },
  catalog: {
    brands: [], // PENDENTE DE CONFIRMAÇÃO
    services: [], // PENDENTE DE CONFIRMAÇÃO
  },
  domain: {
    productionUrl: null, // PENDENTE DE CONFIRMAÇÃO
  },
  status: {
    isWhatsAppConfirmed: true,
    isAddressConfirmed: false,
    isScheduleConfirmed: false,
    isServicesConfirmed: false,
    isBrandsConfirmed: false,
    isDomainConfirmed: false,
  },
};

/**
 * Utilitário para gerar link do WhatsApp quando disponível
 */
export function getWhatsAppLink(): string | null {
  if (!businessConfig.contact.whatsappNumber) {
    return null;
  }
  const cleanNumber = businessConfig.contact.whatsappNumber.replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(businessConfig.contact.whatsappDefaultMessage);
  return `https://wa.me/${cleanNumber}?text=${encodedMsg}`;
}
