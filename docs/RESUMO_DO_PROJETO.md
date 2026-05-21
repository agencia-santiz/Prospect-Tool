# Resumo do Projeto

**Nome do produto:** Bloom Leads  
**Tipo:** ferramenta de prospeccao B2B com foco em geracao de leads, organizacao comercial e pipeline de vendas.

## Visao geral

O Bloom Leads e um app web construido com React, Vite e TypeScript para ajudar times comerciais a encontrar empresas, salvar listas, acompanhar contatos e mover negocios em um pipeline estilo CRM.

A proposta atual combina:
- busca de leads com apoio de Gemini e Google Maps
- organizacao de listas salvas
- controle de contatos e status de prospeccao
- pipeline Kanban para negocios
- painel com detalhes do negocio, atividades e tarefas
- interface multilíngue

## O que ja temos ate agora

### 1. Base do aplicativo
- Estrutura principal em [App.tsx](./src/App.tsx)
- Renderizacao inicial em [index.tsx](./src/main.tsx)
- Estilo global e sistema visual em [index.css](./src/index.css)
- Configuracao do Vite em [vite.config.ts](./vite.config.ts)

### 2. Autenticacao
- Fluxo de login real em [contexts/AuthContext.tsx](./src/contexts/AuthContext.tsx) usando Firebase Auth
- Sessao persistida pelo SDK do Firebase
- Login por email e senha com cadastro na propria tela
- Workspace padrao por usuario com membros e roles, bootstrapado no Data Connect
- Controle de uso mensal da conta
- SDK do Firebase ja preparado no frontend em [lib/firebase.ts](./src/lib/firebase.ts) para Auth, Firestore e Data Connect
- Schema inicial do Firebase Data Connect ja criado em [dataconnect/schema/schema.gql](./dataconnect/schema/schema.gql) para a base em Cloud SQL/PostgreSQL

### 3. Prospecao de leads
- Busca de cidades via [services/locationService.ts](./src/services/locationService.ts)
- Enriquecimento e geracao de leads via [services/geminiService.ts](./src/services/geminiService.ts)
- Busca por cidade, segmento e quantidade
- Carregamento incremental de resultados
- Autocomplete de cidade

### 4. Organizacao comercial
- Salvamento de leads em listas
- Visualizacao em grade e lista
- Marcacao de contatos como "contatado"
- Exportacao CSV real via backend
- Pricing real do workspace com limites visiveis no menu do usuario
- Logs estruturados de busca, exportacao e feedback

### 5. CRM / Pipeline
- Pipeline padrao definido em [App.tsx](./src/App.tsx)
- Quadro Kanban em [src/components/PipelineBoard.tsx](./src/components/PipelineBoard.tsx)
- Adicao de lead ao pipeline
- Tela de detalhes do negocio em [src/components/DealDetailsModal.tsx](./src/components/DealDetailsModal.tsx)
- Tarefas, atividades e pessoas de contato dentro do negocio

### 6. Interface e experiencia
- Cards de lead em [src/components/LeadCard.tsx](./src/components/LeadCard.tsx)
- Lista de leads em [src/components/LeadListView.tsx](./src/components/LeadListView.tsx)
- Tela de carregamento em [src/components/LoadingBar.tsx](./src/components/LoadingBar.tsx)
- Tela de login em [src/components/LoginScreen.tsx](./src/components/LoginScreen.tsx)
- Sistema de idiomas em [utils/i18n.ts](./src/utils/i18n.ts)
- Estrutura visual e diretrizes em [DESIGN.md](./DESIGN.md)

### 7. Estrutura de dados
- Tipos principais em [types.ts](./src/types.ts)
- Estrutura de listas, empresas, deals, pipeline e configuracoes de card
- Documento de schema SQL embutido para referencia de backend

## Estado atual do projeto

Hoje o projeto esta em um estagio de **MVP avancado / prototipo funcional**.

O que ja funciona bem:
- autenticar e entrar no dashboard
- buscar leads e navegar pelos resultados
- salvar listas e contatos
- marcar prospeccoes como contatadas
- criar negocios e gerenciar pipeline
- abrir detalhes do negocio e editar informacoes
- exportar listas em CSV real
- visualizar pricing e limites reais do workspace
- registrar eventos operacionais de busca, exportacao e feedback

O que ainda esta em consolidacao:
- persistencia real em backend
- motor de busca profissional com score, fonte e motivo
- deduplicacao mais forte entre fontes
- integracao de cobranca, checkout e upgrade
- refinamento de identidade visual e linguagem de interface
- amarracao final de alguns fluxos secundarios
- validacao de build/CI no ambiente atual

## Arquivos de apoio ja preparados

- [src/components/PricingModal.tsx](./src/components/PricingModal.tsx)
- [src/components/SettingsModal.tsx](./src/components/SettingsModal.tsx)

Esses componentes existem e ja estao conectados ao fluxo principal da aplicacao como parte da experiencia atual.

## Nova direcao estrategica

A pesquisa tecnica mudou o foco do produto: agora o Bloom Leads precisa evoluir de um MVP local-first para um buscador profissional de leads B2B.

Os pilares da nova fase sao:
- busca protegida em backend
- Google Places e CNPJ/CNAE como fontes principais
- OSM como complemento
- Gemini como classificador e apoio de inteligencia
- score explicavel e provenance
- deduplicacao forte
- persistencia real em Postgres

## Resumo curto

O Bloom Leads ja e um produto navegavel e util para prospeccao comercial. Ele nao esta apenas em ideia: a busca de leads, a organizacao em listas, o pipeline, a exportacao real, o pricing conectado ao workspace e a observabilidade basica ja estao implementados. O proximo salto e consolidar persistencia real, ranking, auditoria de fonte e dados persistentes.

## Proximos passos sugeridos

1. Implementar o backend de busca e proteger as chaves.
2. Migrar listas, contatos, deals e pipelines para o banco.
3. Introduzir score, motivo, provenance e feedback do usuario.
4. Consolidar persistencia real, cobranca e CI operacional.


