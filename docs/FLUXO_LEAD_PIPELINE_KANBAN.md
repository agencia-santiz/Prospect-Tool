# Fluxo Lead -> Pipeline / Kanban

Este documento descreve o fluxo real do Bloom Leads entre descoberta de lead, conversao em oportunidade, acompanhamento no Kanban e persistencia atual.

Ele foi escrito para servir como briefing operacional para pessoas e IAs que vao melhorar o fluxo.

## Resumo curto

Hoje o fluxo funciona assim:

1. O lead nasce na busca/exploracao ou em uma lista salva.
2. O usuario clica em `Adicionar ao pipeline`.
3. Um modal pede a escolha do pipeline de destino.
4. O app cria um `Deal` local com dados basicos do lead.
5. O deal aparece no Kanban na primeira etapa do pipeline.
6. O usuario pode arrastar o deal entre etapas.
7. O usuario pode abrir o detalhe, editar, salvar ou excluir.
8. Tudo isso fica salvo no `localStorage` por workspace.

O fluxo e funcional como MVP local. Ainda nao e um CRM profissional multi-dispositivo, porque o fluxo principal de pipeline nao usa o backend como fonte de verdade.

## Entradas do fluxo

### 1. Lead vindo da exploracao

O lead aparece em:

- `LeadCard` no modo grade
- `LeadListView` no modo tabela
- `LeadQuickViewModal` para consulta rapida dos dados do lead

Os CTAs que levam ao pipeline aparecem nesses pontos:

- `Adicionar ao pipeline` no card do lead
- `Adicionar ao pipeline` na tabela
- abertura de detalhes do lead para consulta antes da conversao

### 2. Lead vindo de listas salvas

O usuario pode reabrir uma lista salva e a partir dela seguir para o mesmo CTA de pipeline.

### 3. Lead no contexto de detalhes

O modal de detalhe do lead ajuda a decidir se vale criar oportunidade, mas nao cria o deal sozinho.

## Conversao lead -> deal

### Componente de entrada

O CTA `Adicionar ao pipeline` chama `handleOpenAddToPipeline(company)` em `src/App.tsx`.

Isso abre `AddToPipelineModal`.

### Escolha do pipeline

O modal:

- lista os pipelines disponiveis
- seleciona por padrao o pipeline marcado como `isDefault`, ou o primeiro da lista
- deixa o usuario confirmar ou cancelar

### Criacao do deal

Ao confirmar, `confirmAddToPipeline(pipelineId)` cria um novo `Deal` com:

- `id` gerado localmente
- `companyId`
- `companyName`
- `value = 0`
- `pipelineId`
- `stageId` da primeira etapa do pipeline
- `priority = MEDIUM`
- `createdAt`
- `contactInfo` com telefone, site e localizacao
- `customFields` basicos com segmento e origem
- arrays vazios de `activities`, `people` e `tasks`

Depois disso o deal e inserido no estado local e o lead tambem entra na lista de contatos se ainda nao existir.

## Kanban

### Como o board funciona

O `PipelineBoard` recebe:

- um pipeline
- a lista de deals
- o handler de mover deal
- o handler de abrir detalhe
- o handler de adicionar novo deal
- a configuracao de visibilidade dos cards

O board:

- organiza as colunas por etapa
- calcula quantidade e valor total por etapa
- mostra os deals filtrando por `pipelineId` e `stageId`
- permite drag and drop entre etapas
- mostra botao de novo negocio em cada coluna

### O que o botao `Novo negocio` faz hoje

Hoje o botao existe como affordance visual, mas nao cria um deal manualmente no board.

O handler atual manda o usuario de volta para `Explorar Negocios` e mostra uma notificacao para buscar uma empresa antes de adicionar ao pipeline.

Isso funciona como atalho de navegacao, mas nao como criacao direta dentro do Kanban.

### Movimento entre etapas

O arraste de um card atualiza apenas `stageId` do deal no estado local.

O board nao tem, hoje, uma alternativa equivalente por teclado ou touch para mover card sem drag and drop.

## Edicao de deal

### Modal de detalhes

`DealDetailsModal` concentra:

- dados gerais do deal
- estagio atual
- prioridade
- idade do deal
- proxima acao
- tarefas
- atividades
- pessoas associadas
- exclusao do deal

### O que e real e o que e simulado no detalhe

Reais:

- edicao de campos
- tarefas
- atividades locais
- pessoas locais
- exclusao
- links de WhatsApp e mapeamento de status

Simulados:

- insights da empresa
- revelacao de email deterministico
- alguns blocos de apoio e inteligencia de detalhe

## Persistencia atual

### Fonte operacional real

Hoje o estado do CRM do browser vive em `localStorage`, por workspace:

- listas salvas
- contatos
- pipelines
- deals

Isso e reidratado ao abrir o app e escrito de volta a cada mudanca relevante.

### O que existe no backend

O projeto ja tem:

- schema SQL com `pipelines`, `pipeline_stages` e `deals`
- contratos gerados de Data Connect para pipeline e deals
- uso de `upsertDeal` em um job de background

Mas a tela principal do CRM ainda nao usa esse backend como fonte de verdade.

## O que e funcional hoje

- criar oportunidade a partir de um lead
- escolher pipeline de destino
- ver o deal no Kanban
- mover deal entre etapas
- abrir detalhes do deal
- editar deal
- excluir deal
- ajustar nome e etapas do pipeline
- persistir o estado no browser por workspace

## O que ainda nao e profissional

- o Kanban principal nao cria deal direto no board
- a UI principal trabalha quase sempre com `pipelines[0]`
- multi-pipeline existe como dado, mas nao como experiencia completa
- a persistencia principal ainda e `localStorage`
- nao ha sync entre dispositivos
- nao ha tratamento de conflito
- nao ha alternativas completas para teclado e mobile em drag and drop
- os insights ricos do detalhe sao majoritariamente simulados
- nao ha modelo de contato comercial separado de empresa

## O que precisaria mudar para virar CRM profissional

### Produto

- definir se o produto vai ser single pipeline de verdade ou multi-pipeline de verdade
- criar fluxo direto de novo negocio dentro do Kanban
- separar contato comercial de empresa
- registrar owner, SLA, next step estruturado e historico de mudancas

### Dados

- colocar pipeline, etapa e deal no backend como fonte de verdade
- garantir validacao de entrada e integridade transacional
- impedir ou sinalizar deals duplicados por empresa/pipeline
- tratar exclusao ou rearranjo de etapas com deals existentes

### UX

- remover dependencia excessiva de hover
- oferecer alternativas para drag and drop
- melhorar a experiencia mobile do board
- padronizar modais e focos
- dar mais destaque ao CTA principal de conversao

### Confiabilidade

- tornar erros de persistencia visiveis
- registrar auditoria de criacao, edicao e movimento
- cobrir o fluxo com testes de criacao, movimento e reidracao

## Regra pratica para a proxima IA

Se a proxima IA for mexer nesse fluxo, ela deve tratar este ponto como verdade central:

- o fluxo atual e real no front
- o fluxo ainda nao e um CRM profissional no backend
- o maior ganho vem de transformar o pipeline em fonte de verdade, nao de adicionar mais enfeite visual

