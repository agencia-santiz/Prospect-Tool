# PROJECT_CONTEXT

_Atualizado em 2026-05-13_

## Resumo executivo

O Bloom Leads e uma ferramenta de prospeccao B2B focada em descoberta de empresas, organizacao comercial e acompanhamento de pipeline.
O projeto ja saiu do estagio de ideia e hoje esta em um **MVP avancado / prototipo funcional**: as jornadas centrais de login, busca de leads, organizacao em listas, pipeline, exportacao, pricing e observabilidade ja estao operacionais.

## Visao geral do produto

- Aplicacao web construida com React, Vite e TypeScript.
- Fluxo principal orientado a prospeccao comercial, organizacao de contatos e gestao de negocios.
- Persistencia do core de prospeccao baseada principalmente em `localStorage`, com `savedLists`, contatos, pipeline e deals salvos localmente por workspace e partes reais ja apoiadas por backend.
- Integracoes de busca apoiadas por Gemini, Google Maps e camadas abertas de fallback.
- Interface dividida em modulos, com navegacao lateral e areas de trabalho separadas.
- Configuracoes auxiliares do projeto ficam em `config/`, enquanto o codigo principal vive em `src/`.

## Problema e Objetivos desta fase

### Problema

A prospeccao B2B manual e lenta, fragmentada e dependente de muito trabalho repetitivo.
Hoje o usuario precisa alternar entre busca, copia de dados, organizacao em planilhas, registro de contatos, follow-up e acompanhamento do pipeline.
Isso gera perda de tempo, duplicidade de registros, baixa visibilidade do funil e dificuldade para transformar esforco comercial em rotina previsivel.

### Quem sofre

- Founders e donos de pequenas empresas que precisam prospectar sem time dedicado.
- SDRs e BDRs que precisam gerar volume diariamente com pouco atrito.
- Gestores comerciais que acompanham muitos leads sem querer adotar um CRM pesado demais.
- Agencias e consultorias que montam listas manualmente para varios clientes.
- Times enxutos que acumulam pesquisa, qualificacao, registro e follow-up na mesma pessoa.

### Objetivos desta fase

- Reduzir o trabalho manual de descoberta e organizacao de leads.
- Manter um fluxo rapido para buscar, salvar, contatar e mover negocios.
- Consolidar a experiencia central do MVP em busca, listas, contatos e Kanban.
- Preservar uma operacao simples e local enquanto validamos valor de produto.
- Deixar a base pronta para evoluir depois para backend persistente e integracoes reais.

### Nao Objetivos

- Nao faremos processamento de pagamentos complexo, cobranca recorrente, split ou suporte multi-moeda nesta fase.
- Nao faremos permissao granular por cargo, times, aprovadores ou auditoria corporativa avancada alem do modelo simples de workspaces e membros.
- Nao faremos automacoes pesadas como sequencias de email, cadencias omnichannel ou workflows visuais complexos.
- Nao faremos integracoes amplas com varios CRMs, ERPs ou suites de operacao comercial neste momento.
- Nao faremos uma reescrita para mobile nativo, nem uma arquitetura enterprise antes de validar o MVP.

## O que ja foi implementado

### 1. Autenticacao real

- O fluxo de login agora usa `src/contexts/AuthContext.tsx` com Firebase Auth.
- Ha cadastro, login, consulta de sessao e logout com sessao persistida pelo SDK do Firebase.
- O Data Connect ja materializa `users`, `workspaces` e `workspace_members` no Postgres.
- O backend antigo de auth continua no repositorio como referencia legada, mas deixou de ser a fonte de verdade do login.
- Enquanto o Email/Senha do Firebase Auth nao estiver habilitado no projeto, o app usa fallback legado para nao bloquear o fluxo do MVP.
- O login Google simulado foi removido da tela principal.
- Existe bootstrap automatico de usuario e workspace no Data Connect na primeira entrada.
- A sincronizacao com Firebase Data Connect agora e opt-in via `VITE_ENABLE_DATACONNECT_SYNC=true`; sem esse flag, o app opera em modo local/seguro e evita requests 404 para conectores nao provisionados.
- Cada usuario autenticado recebe um workspace proprio, com membership e role.
- O SDK do Firebase ja esta configurado no frontend em `src/lib/firebase.ts`, com variaveis `VITE_FIREBASE_*` lidas do ambiente para preparar a migracao de Auth e Firestore.
- O schema inicial do Firebase Data Connect ja foi criado em `dataconnect/schema/schema.gql`, espelhando o dominio principal do produto para a migracao para Cloud SQL/PostgreSQL.

### 2. Busca de leads com Gemini e Maps

- A geracao/enriquecimento de leads agora passa pelo backend em `server/routes/search.js` e `server/services/geminiService.js`.
- A busca usa Gemini com ferramenta de Google Maps para localizar empresas, mas a chave fica no backend.
- A resposta e tratada como JSON e convertida para a estrutura interna de `Company`.
- O fluxo tenta evitar duplicidade de resultados na pagina "carregar mais".
- A busca depende de chave de ambiente do Gemini e de acesso a servicos externos.

### 3. Autocomplete de cidades

- A lista de cidades e carregada em `src/services/locationService.ts`.
- O sistema combina dados do IBGE com fallback global via Rest Countries.
- Ha cache local para reduzir chamadas repetidas.
- O autocomplete e parte do fluxo de busca e ajuda a validar a localizacao antes da consulta.

### 4. Organizacao comercial

- E possivel salvar leads em listas.
- E possivel marcar contatos como contatados.
- Existe visao em grade e em lista para trabalhar com leads.
- O fluxo de exportacao gera CSV real via backend e entrega o arquivo para download no navegador.

### 5. Pipeline e Kanban

- Ha um pipeline padrao definido em `src/App.tsx`.
- O quadro Kanban vive em `src/components/PipelineBoard.tsx`.
- Negocios podem ser movidos entre etapas por drag and drop.
- Existe modal de detalhes do negocio para edicao e acompanhamento.
- O negocio guarda informacoes de contato, atividades, tarefas e pessoas associadas.

### 6. Interface e experiencia

- A aplicacao tem tela de login, loading states e notificacoes.
- Ha estrutura de navegacao com modulos principais para explorar, listas, contatos e pipeline.
- Os modais de `Pricing` e `Settings` ja estao ligados ao menu do usuario no shell principal.
- O modal de `Pricing` agora reflete o plano e os limites reais do workspace, em vez de um fluxo simulado.
- As configuracoes do `Settings` persistem localmente e afetam a visualizacao do pipeline.
- O sistema de idiomas ja existe.
- A rotina operacional agora registra busca com latencia, quantidade, fontes usadas e resultado zero, exportacao CSV com volume e duracao, e feedback de qualidade com sinal positivo ou negativo.
- O campo de segmento na busca agora usa uma taxonomia versionada compartilhada entre frontend e backend, com sugestoes desde a primeira letra, por prefixo e por apelido, por exemplo `a` ou `adm` -> `Administrativo / Escritório`.
- A busca de leads canoniza o segmento selecionado antes de consultar a fonte ativa; hoje a rota principal prioriza o backend com Google Places/Gemini, aplica filtro de aderencia ao segmento e usa dados abertos apenas como complemento restrito quando necessario.
- A quantidade pedida na busca agora e respeitada de ponta a ponta: buscas pequenas recebem uma folga interna para nao voltar curtas por filtro, e buscas grandes seguem o valor digitado para tentar completar o maximo possivel com as fontes disponiveis.
- O WhatsApp agora aparece com status em tres estados: `confirmado` quando existe evidência explicita como `wa.me`, `não confirmado` quando ha telefone mas sem sinal explicito, e `não possui` quando nao ha evidencia util.
- A selecao de WhatsApp virou um dropdown de status apenas no modal de detalhes do lead, incluindo a opcao `não possui`.
- O modal de detalhes ganhou atalho para Instagram quando o lead tem link cadastrado em `socials.instagram`.
- Os botoes de WhatsApp continuam abrindo a conversa pelo link `wa.me` com o telefone normalizado do lead, para funcionar melhor no navegador.
- No modo grade, os cards de lead agora abrem uma janela flutuante para os detalhes e o status de WhatsApp pode ser ajustado sem abrir outra tela, com persistencia local no navegador.
- Ao sair de uma lista e voltar para `Explorar Negócios`, o app restaura a busca anterior da prospecção e o cabeçalho passa a mostrar o resumo da pesquisa, nao o nome da lista.
- A base visual e modular, com varios componentes prontos para evolucao.

### 7. Correcoes e consolidacao recentes

- A exportacao deixou de ser visual e passou a gerar CSV real end-to-end pelo backend.
- A autenticacao deixou de depender do login mock e agora usa fluxo real com sessao persistida.
- Nomes, branding e microcopy foram padronizados para refletir a linguagem real do produto.
- A observabilidade operacional foi fechada com logs estruturados de busca, exportacao e feedback.
- O corrompimento visual de texto em alguns trechos de docs e UI foi normalizado nos arquivos afetados.
- A trilha hibrida desktop foi iniciada com shell Electron, bootstrap local do backend e comandos de dev dedicados.
- O instalador Windows da trilha desktop hibrida foi gerado com sucesso, usando `asar: false` nesta fase para compatibilidade com o empacotamento local.
- O desktop empacotado agora suporta auto-update via `electron-updater` com GitHub Releases em producao e feed HTTP(S) local para depuracao.
- O projeto continua com um feed local de update em `updates/windows-x64`, com scripts para stage e serve dos artefatos gerados.
- O menu nativo do desktop ganhou as acoes `Abrir console`, `Verificar atualizações` e `Reiniciar para atualizar`.
- Existe um workflow GitHub Actions para publicar o instalador e os artefatos do updater quando uma tag `v*` e enviada.
- O desktop passou a usar armazenamento local em arquivo para o core do workspace e preferencias de interface, reduzindo a dependencia estrutural de `localStorage`.
- A ponte de migracao do `localStorage` legado para o armazenamento novo foi implementada como rotina idempotente de primeira abertura no desktop.
- O desktop passou a registrar uma outbox local de mutacoes de workspace para servir de base ao sync futuro.
- O contrato de sync por entidade e a politica de conflito simples foram formalizados em utilitarios e documento especifico.
- A sessao do desktop agora carrega `workspaceOrigin` e distingue workspace remoto, local e legado no fluxo de autenticacao.
- O topo do app passou a exibir o estado de sync com base na rede, na outbox local e na origem do workspace.
- O desktop agora faz pull do snapshot remoto via Data Connect e faz flush assíncrono da outbox local para as entidades compartilhadas suportadas.
- O motor de busca no desktop ficou mais resiliente: falhas isoladas de geocoding ou de uma fonte principal nao derrubam mais a pesquisa inteira, e o fallback Open Data usa headers explicitos para Nominatim e Overpass.
- Durante a fase de depuracao do desktop, a janela principal abre o DevTools acoplado à direita por padrao; o comportamento pode ser desligado com `BLOOM_DESKTOP_OPEN_DEVTOOLS=0`.
- O desktop agora grava logs persistentes em `userData/logs/desktop.log`, com rotacao simples e fallback para stdout quando o filesystem falha.
- A trilha desktop ganhou smoke de release via `npm run desktop:release:smoke` e um guia curto de operacao/recuperacao.

## Arquitetura atual

### Arquivos centrais

- `src/App.tsx`: orquestracao geral do app, rotas de estado e modulos.
- `src/contexts/AuthContext.tsx`: autenticacao real, token de sessao e estado de usuario.
- `server/routes/search.js`: endpoint principal de busca, instrumentacao e log de resultado.
- `server/routes/export.js`: exportacao CSV real e validacao de payload.
- `server/routes/feedback.js`: captura de feedback de qualidade e telemetria operacional.
- `server/routes/workspaces.js`: workspace atual, membros e roles.
- `src/services/geminiService.ts`: descoberta e enriquecimento de leads.
- `src/services/openDataService.js`: consulta gratuita via Nominatim e Overpass para leads abertos.
- `src/services/locationService.ts`: autocomplete e cache de cidades.
- `src/components/PipelineBoard.tsx`: quadro Kanban do pipeline.
- `src/types.ts`: contratos de dados principais.
- `src/domainContracts.ts`: contrato canonico e versionado para a futura API.
- `server/`: backend base com healthcheck, versionamento e manifest de modulos.
- `server/env.js`: carregador de `.env.local` e variaveis do backend.
- `server/services/geminiService.js`: proxy de enriquecimento com Gemini no backend.
- `server/services/googleMapsService.js`: adaptador de Google Places e Geocoding com normalizacao para o modelo atual.
- `server/services/companyNormalizer.js`: normalizacao canonica de empresa, endereco, telefone, site e coordenadas entre fontes.
- `server/services/companyDeduper.js`: fusao conservadora de duplicados por CNPJ, sourceId, dominio, telefone e geografia.
- `server/services/searchOrchestrator.js`: orquestracao da busca com resolucao de cidade, segmento, plano de fonte e expansao.
- `server/services/openDataService.js`: camada auxiliar de OSM/Nominatim/Overpass reaproveitada pelo backend.
- `server/services/cnpjCnaeService.js`: validacao setorial por CNPJ/CNAE com lookup opcional na API CNPJ do Conecta.
- `server/services/segmentResolver.js`: taxonomia versionada de segmentos com IDs canônicos, aliases e sinais de classificação.
- `server/services/locationResolver.js`: resolucao geografica com IBGE e cache em memoria.
- `server/db/migrations/0001_initial.sql`: schema inicial de Postgres para a fonte de verdade.
- `server/logger.js`: logs estruturados com correlation id por requisicao.
- `src/utils/i18n.ts`: textos e traducao de interface.

### Modelo de dados em uso

- `Company` para empresas e leads.
- `SavedList` para listas salvas.
- `Pipeline` e `Deal` para o CRM / funil.
- `User` para sessao e plano.
- `DOMAIN_CONTRACTS` para a base canonica que orienta a migracao futura.
- A migration inicial de Postgres cobre usuarios, workspaces, pesquisas, empresas, leads, listas, contatos, deals, pipelines, jobs, uso e feedback.
- O `LocationResolver` resolve municipio, UF, centroide e bounding box para cidades brasileiras a partir do IBGE.
- O `SegmentResolver` resolve segmento canonico, sugestoes e metadados de taxonomia a partir de uma base versionada compartilhada com a UI.
- O `SearchOrchestrator` resolve a cidade, canoniza o segmento e monta o plano de fontes e expansao antes de chamar o enriquecimento.
- O `GoogleMapsService` usa Google Geocoding para bias de localizacao e Google Places para descobrir leads principais.
- O `CompanyNormalizer` padroniza os campos principais do lead antes da validacao e da resposta final.
- O `CompanyDeduper` consolida leads repetidos e marca casos duvidosos sem apagar o contexto de origem.
- O `OpenDataService` usa Nominatim e Overpass como camada auxiliar de cobertura, mas os resultados passam por filtro de relevancia de segmento antes de entrar na resposta final.
- O `CnpjCnaeService` adiciona validacao de aderencia setorial para empresas com CNPJ/CNAE conhecido e pode buscar dados cadastrais oficiais quando configurado.

### Persistencia local

O estado funcional do produto usa `localStorage` para:

- sessao do usuario
- listas salvas
- contatos
- pipelines
- deals
- chaves de leads contatados
- cache de cidades

## Estado atual do MVP

O projeto deve ser tratado como um **MVP avancado** com foco em operacao local e validacao de produto.

### Ja esta funcional

- autenticar e entrar no dashboard
- pesquisar leads por cidade e segmento
- carregar mais resultados da busca
- salvar listas e contatos
- agrupar listas em pastas simples na tela de listas
- marcar prospeccoes como contatadas
- criar negocios e mover etapas no Kanban
- abrir e editar detalhes de negocio
- exportar listas em CSV real pelo backend
- visualizar pricing e limites reais do workspace
- registrar eventos de busca, exportacao e feedback para monitoramento

### Ainda esta em consolidacao

- backend base em Node com rotas vazias e healthcheck
- segredos e variaveis sensiveis centralizados no backend
- schema inicial de Postgres versionado
- logs estruturados e correlation id por requisicao
- resolucao geografica canonica para cidades brasileiras
- taxonomia canonica de segmentos com ID estavel, aliases e termos de classificacao
- orquestracao de busca com plano explicito de cidade, segmento e fontes
- integracao principal com Google Places e Geocoding, com fallback preservado para continuidade
- ranking de leads considera avaliacao e volume de reviews do Google quando disponiveis
- persistencia real em backend
- cobranca, checkout e upgrade comercial pago
- validacao de build e CI como rotina do projeto
- amarracao final de algumas telas auxiliares e fluxos secundarios ao fluxo principal

## Escopo da V1

A V1 do Bloom Leads consolida o MVP avancado atual como uma experiencia local-first, com foco no fluxo principal de prospeccao e organizacao comercial. O objetivo e entregar valor com baixa complexidade operacional, sem ampliar o produto para areas fora do core.

### Funcionalidades obrigatorias

- Busca de leads com `Gemini` e `Google Maps`, incluindo descoberta, enriquecimento e carregamento incremental de resultados.
- Kanban / pipeline para acompanhar negocios e mover etapas.
- Listas salvas para organizar, reutilizar e revisar leads.
- Persistencia local funcional enquanto o backend ainda nao for a fonte de verdade.
- Navegacao e modais essenciais para manter o fluxo principal utilizavel sem quebrar a jornada.

### Nao objetivos

- Nao faremos processamento de pagamentos complexo, cobranca recorrente, split ou suporte multi-moeda nesta V1.
- Nao faremos CRM multi-tenant completo, hierarquias empresariais complexas, isolamento por conta muito granular ou estruturas corporativas extensas nesta fase.
- Nao faremos automacoes pesadas como sequencias de email, cadencias omnichannel ou workflows visuais complexos.
- Nao faremos integracoes amplas com varios CRMs, ERPs ou suites de operacao comercial.
- Nao faremos reescrita para aplicativo nativo nem troca da stack principal do frontend.
- Nao faremos a migracao completa para backend nesta V1; essa transicao fica explicitamente em aberto.

### Restricoes tecnicas

- A interface continua obrigatoriamente em `React`, `Vite` e `TypeScript`.
- A arquitetura deve continuar modular e compativel com os contratos atuais de `Company`, `SavedList`, `Pipeline`, `Deal` e `User`.
- `localStorage` continua como base operacional da V1.
- A transicao futura para backend deve preservar os contratos atuais e reduzir ao minimo a ruptura de fluxo.
- Quando o backend entrar, `localStorage` deve ser rebaixado para cache transitorio, preferencias de interface e ponte de migracao.
- Nao introduzir uma API customizada desnecessaria nesta fase; a migracao futura deve ser incremental e reversivel.

### Estado consolidado

- [concluido] Autenticacao real com sessao persistida.
- [concluido] Workspaces e membros com role por usuario.
- [concluido] Padronizacao final de branding e nomenclatura.
- [concluido] Exportacao CSV real end-to-end.
- [concluido] Pricing real do workspace e limites.
- [concluido] Observabilidade operacional de busca, exportacao e feedback.
- [em andamento] Persistencia real em backend via Firebase Data Connect.
- [em andamento] Provisionamento do Cloud SQL do Firebase Data Connect.

### Em aberto

- [aberto] Cobranca, checkout e upgrade comercial pago.
- [aberto] Refinamento da identidade visual e da linguagem de interface.
- [aberto] Amarracao final de algumas telas secundarias e fluxos auxiliares.
- [aberto] Regras finais de CI e release para a operacao continua do projeto.
- [aberto] Estrategia de hospedagem publica do feed de update e ajustes finais de distribuicao desktop.
- [concluido] Ponte de migracao do `localStorage` legado para o armazenamento local novo no desktop.

### Direcao futura priorizada pela pesquisa [aberto]

Quando essa etapa entrar no roadmap, a migracao deve acontecer em blocos pequenos, com corte claro por dominio e validacao ao final de cada passo.

- O frontend continua em `React`, `Vite` e `TypeScript`, mas passa a consumir uma API fina em vez de falar direto com fontes sensiveis.
- O backend centraliza busca, proxy de integracoes, enriquecimento, exportacao e controle de uso.
- O banco de verdade passa a ser `PostgreSQL`, com opcao de infraestrutura em plataformas como Supabase, Neon ou Render, sem fixar o projeto em um unico provedor.
- As fontes principais de leads passam a ser Google Places e CNPJ/CNAE; OpenStreetMap vira complementar.
- `Gemini` deixa de ser fonte primaria de empresas e passa a atuar como classificador, expansor de termos e resumidor.
- `localStorage` deixa de ser base de negocio e passa a servir apenas como cache transitorio, preferencias de interface e ponte de migracao.
- Limites de uso, feedback e eventos de uso continuam no backend e se consolidam junto com a migracao de persistencia.
- Dados aninhados do CRM devem ser persistidos no backend sem duplicar a logica de tela; o formato final deve seguir o que a UI ja consome hoje.

## Pontos de atencao

- A chave do Gemini precisa ser tratada com cuidado no ambiente de execucao.
- A persistencia local e suficiente para o MVP, mas nao e adequada como base final do produto.
- Algumas telas e componentes ja existem, mas ainda podem estar parcialmente desacoplados do fluxo principal.
- Features simuladas devem continuar sendo marcadas como simuladas ate haver backend real.

## Direcao estrategica apos a pesquisa tecnica

A pesquisa tecnica em [bloom_leads_pesquisa_tecnica_estrategica.md](./bloom_leads_pesquisa_tecnica_estrategica.md) mudou a priorizacao do projeto. O objetivo agora nao e apenas polir o MVP atual, mas evoluir o Bloom Leads para um buscador profissional de leads B2B com:

- backend protegendo segredos e integracoes externas
- Google Places e CNPJ/CNAE como fontes principais
- OpenStreetMap como fonte auxiliar
- Gemini como classificador e apoio de inteligencia, nao como fonte primaria de empresas
- score explicavel, provenance por campo e motivo de aparicao do lead
- deduplicacao forte por CNPJ, place_id, telefone, dominio e geolocalizacao
- persistencia comercial real em Postgres
- limites, feedback e eventos de uso
- localStorage apenas como apoio temporario para UI e migracao

## Roadmap resumido

O plano de execucao consolidado esta em [ROADMAP_TECNICO.md](./ROADMAP_TECNICO.md).
A lista executavel de tarefas esta em [BACKLOG_EXECUTAVEL.md](./BACKLOG_EXECUTAVEL.md).

Ordem pratica recomendada:

1. Criar o backend base e proteger as chaves.
2. Tirar a busca do frontend e montar o orquestrador de pesquisa.
3. Implementar taxonomia, normalizacao, dedupe, ranking e provenance.
4. Persistir listas, contatos, deals, pipelines e buscas no banco.
5. Ligar cobranca real, upgrade e limites.
6. Adicionar feedback, observabilidade e enriquecimento gradual.

## Leitura rapida do projeto

Se alguem precisar entender o produto em poucos minutos, a ordem recomendada e:

1. Ler este arquivo.
2. Ler `README.md` para o setup local.
3. Ler `RESUMO_DO_PROJETO.md` para a fotografia do momento.
4. Ler [ROADMAP_TECNICO.md](./ROADMAP_TECNICO.md) para entender a evolucao planejada.
5. Abrir `src/App.tsx` para entender o fluxo principal.
6. Abrir `src/contexts/AuthContext.tsx`, `src/services/geminiService.ts` e `src/components/PipelineBoard.tsx` para ver os tres pilares centrais do MVP.



