# NEWNEO Web Architect — Estado Persistente do Projeto
**Projeto:** Nova Ótica Vitaliz  
**Data:** 18/11/2026  
**Metodologia:** NEWNEO Web Architect v1.0  
**Canal Oficial Confirmado:** https://www.instagram.com/nova.oticavitaliz/

---

## 1. Contexto e Objetivos
* **Objetivo:** Landing page de luxo contemporâneo, moda óptica, elegância e alta estética com experiência cinematográfica no Hero.
* **Master de Vídeo:** `hero cinematografico scrool.mp4` (23.738.122 bytes, intacto na raiz).

---

## 2. Stack Tecnológica Aprovada e Instalada
* **Framework:** React 19 (`^19.0.0`)
* **Linguagem:** TypeScript estrito (`~5.7.2`, target ES2022)
* **Bundler:** Vite (`^6.0.7`) com plugin `@vitejs/plugin-react`
* **Estilização:** Tailwind CSS (`^3.4.17`), PostCSS, Autoprefixer
* **Animações / Scroll:** GSAP (`^3.12.5`) + ScrollTrigger
* **Iconografia:** Lucide React (`^1.75.0`) + Componentes SVG dedicados

---

## 3. Design System — Tokens Semânticos
* **Vinho Profundo:** `#220912` (`bg-wine-deep`, `text-wine-deep`)
* **Champagne:** `#F7F2EC` (`bg-champagne`, `text-champagne`)
* **Off-White:** `#FCFAF8` (`bg-offwhite`, `text-offwhite`)
* **Dourado:** `#C5A059` (`bg-gold`, `text-gold`, `border-gold`)
* **Grafite:** `#1E1E22` (`bg-graphite`, `text-graphite`)
* **Tipografia:** Display: *Cormorant Garamond* | Interface: *Inter*
* **Acessibilidade:** WCAG AA/AAA, classes para `:focus-visible`, `prefers-reduced-motion` com fallback estático.

---

## 4. Status das Etapas NEWNEO

| Etapa | Descrição | Status |
| :--- | :--- | :--- |
| **Etapa 1** | Auditoria Inicial e Planejamento Geral | `APROVADA` |
| **Etapa 2** | Fundação, Setup da Stack e Design System | `APROVADA` |
| **Etapa 3** | Preparação e Otimização da Mídia do Hero | `APROVADA` |
| **Etapa 4** | Implementação do Header e Hero com GSAP ScrollTrigger | `APROVADA` |
| **Ajuste Pontual** | Refinamento da Velocidade do Scroll (4000px) e Redesign do Header | `APROVADA` |
| **Etapa 5** | Seções Institucionais e Coleções | `APROVADA` |
| **Ajustes Etapa 5** | Remoção de Painel de UI, Placeholder de Óculos Solares e Auditoria de Imagens | `APROVADA` |
| **Etapa 6** | Seções de Atendimento, Conversão, Rodapé e Auditoria Mobile Completa | `APROVADA` |
| **Etapa 7** | Auditoria de Performance, Acessibilidade e SEO | `APROVADA` |
| **Integração Imagens** | Integração Definitiva das 6 Imagens Editoriais Aprovadas (WebP) | `APROVADA` |
| **Etapa Final** | WhatsApp Oficial Confirmado, Auditoria e Publicação GitHub | `CONCLUIDA` |

---

## 5. Áreas Congeladas & Decisões Registradas
* **Arquivo Master Intacto:** `hero cinematografico scrool.mp4` (23.738.122 bytes) preservado localmente sem modificações.
* **Hero Cinematográfico:** Implementação congelada e aprovada, sem alterações no seeking ou ScrollTrigger.
* **Header Responsivo:** Calibrado com `lg:flex` (desktop) e `lg:hidden` (menu compacto/gaveta), eliminando qualquer colisão em 768px (tablet) e mantendo linha única em 320px/360px.
* **Sem Autoplay Obrigatório no Mobile:** Fallback estático e elegante para mobile e para usuários com movimento reduzido.
* **Imagens Originais Preservadas:** Os 6 arquivos PNG originais em `imagens/` permanecem salvaguardados e inalterados localmente.
* **Repositório GitHub:** `https://github.com/neol10/nova-otica-vitaliz.git` (branch `main`).

---

## 6. Mapeamento de Imagens Definitivo
Todas as seções contam com seus respectivos ativos editoriais dedicados em `public/assets/images/editorial/`, eliminando qualquer repetição de posters:
* **`vitaliz-essencia.webp` (131.9 KB):** Seção *A Essência Vitaliz* (`#sobre`) — macro de acetato translúcido vinho.
* **`vitaliz-armacoes-grau.webp` (167.0 KB):** Seção *Coleções* (`#colecoes`) — armação de grau cristal com acabamento dourado.
* **`vitaliz-oculos-sol.webp` (155.1 KB):** Seção *Coleções* (`#colecoes`) — óculos solares tartaruga com estojo oficial Vitaliz.
* **`vitaliz-estilos-tendencias.webp` (251.0 KB):** Seção *Coleções* (`#colecoes`) — composição de tendências com trio de armações sobre pedestais.
* **`vitaliz-modelo-editorial.webp` (227.9 KB):** Seção *Estilo e Personalidade* (`#estilo`) — retrato de alto impacto da modelo com armação vinho.
* **`vitaliz-atendimento.webp` (270.5 KB):** Seção *Atendimento* (`#atendimento`) — interior sofisticado da loja e atendimento exclusivo.
* **`hero-poster-desktop.webp` & `hero-final-desktop.webp`:** Uso restrito e exclusivo como posters de carregamento e transição do Hero cinematográfico.

---

## 7. Dados Comerciais Confirmados
* **Nome:** Nova Ótica Vitaliz
* **Instagram Oficial:** `https://www.instagram.com/nova.oticavitaliz/`
* **WhatsApp Oficial:** `(19) 99782-6744` (Link wa.me: `https://wa.me/5519997826744`)

---

## 8. Dados Pendentes para Fases Futuras
* Endereço físico e link do Google Maps.
* Horários de atendimento.
* Relação de marcas e grifes comercializadas.
* Catálogo de serviços clínicos/estéticos.
* Domínio definitivo.

---

## 9. Próximo Passo
Projeto pronto para conexão automática e deploy na Vercel a partir do repositório GitHub.
