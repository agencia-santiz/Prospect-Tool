# Backlog Executavel - Bloom Leads

Este documento transforma o [ROADMAP_TECNICO.md](./ROADMAP_TECNICO.md) em tarefas praticas, ordenadas e prontas para implementacao.

Leituras base:
- [bloom_leads_pesquisa_tecnica_estrategica.md](./bloom_leads_pesquisa_tecnica_estrategica.md)
- [ROADMAP_TECNICO.md](./ROADMAP_TECNICO.md)
- [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)

## Como usar este backlog

- `P0` = precisa acontecer primeiro ou bloqueia o resto
- `P1` = importante e deve entrar logo apos a fundacao
- `P2` = importante, mas pode esperar a base principal estabilizar
- `P3` = melhoria complementar

## Ordem de execucao sugerida

1. Fundacao de backend, contratos e protecao de segredos
2. Taxonomia de cidade, segmento e pipeline de busca
3. Orquestrador de busca, normalizacao, dedupe e ranking
4. Persistencia de listas, contatos, deals e pipelines
5. Auth, workspaces, limites e eventos de uso
6. Feedback, observabilidade e exportacao real
7. Inteligencia, enriquecimento e refresh

## Fase 0 - Fundacao

### BE-00.01 - Definir dominios e contratos centrais
- Prioridade: `P0`
- Objetivo: separar contratos de `search`, `company`, `lead`, `contact`, `deal`, `pipeline` e `workspace`.
- Dependencias: nenhuma.
- Entregavel: modelo de dominio documentado e tipos compartilhados com a API.
- Pronto quando: os contratos sao unicos, versionados e suficientes para frontend e backend conversarem sem ambiguidade.

### BE-00.02 - Criar backend base com rotas vazias e healthcheck
- Prioridade: `P0`
- Objetivo: criar a espinha dorsal da API.
- Dependencias: BE-00.01.
- Entregavel: projeto backend inicial com `health`, `version` e estrutura de modulos.
- Pronto quando: o backend sobe, responde healthcheck e tem estrutura para evoluir.

### BE-00.03 - Centralizar secrets e env vars no backend
- Prioridade: `P0`
- Objetivo: remover chaves sensiveis do frontend.
- Dependencias: BE-00.02.
- Entregavel: leitura de chaves e credenciais apenas no backend.
- Pronto quando: nenhuma chave de integraçao externa precisa viver no bundle do frontend.

### BE-00.04 - Criar schema inicial de Postgres
- Prioridade: `P0`
- Objetivo: preparar a fonte de verdade.
- Dependencias: BE-00.01.
- Entregavel: migrations iniciais para users, workspaces, searches, companies, leads e listas.
- Pronto quando: banco aplica schema sem inconsistencias.

### BE-00.05 - Configurar logs e observabilidade basica
- Prioridade: `P1`
- Objetivo: enxergar falhas e custo desde cedo.
- Dependencias: BE-00.02.
- Entregavel: logs estruturados, correlation id e erros padronizados.
- Pronto quando: cada requisicao de busca e rastreavel.

### BE-00.06 - Auditar o que sai do frontend
- Prioridade: `P0`
- Objetivo: decidir o que deixa de ser fonte de verdade local.
- Dependencias: BE-00.01.
- Entregavel: mapa de responsabilidades entre frontend e backend.
- Pronto quando: fica claro o que continua no UI e o que migra para backend.

## Fase 1 - Buscador profissional

### SR-01.01 - Implementar LocationResolver
- Prioridade: `P0`
- Objetivo: resolver cidade para IBGE, UF, centroide e bounding box.
- Dependencias: BE-00.04.
- Entregavel: servico de resolucao geografica com cache.
- Pronto quando: qualquer busca parte de uma cidade validada.

### SR-01.02 - Implementar SegmentResolver com taxonomia versionada
- Prioridade: `P0`
- Objetivo: converter segmento livre em segmento canonico.
- Dependencias: BE-00.01.
- Entregavel: taxonomia com aliases, termos positivos/negativos, tipos e CNAEs.
- Pronto quando: o segmento deixa de ser texto solto e passa a ter ID canonico.

### SR-01.03 - Criar SearchOrchestrator
- Prioridade: `P0`
- Objetivo: coordenar a busca em camadas.
- Dependencias: SR-01.01, SR-01.02.
- Entregavel: fluxo que resolve cidade, segmento, fontes e expansoes.
- Pronto quando: a busca tem etapas claras e registraveis.

### SR-01.04 - Integrar Google Places e Geocoding
- Prioridade: `P0`
- Objetivo: usar a fonte principal profissional.
- Dependencias: BE-00.03, SR-01.03.
- Entregavel: adaptador para search e place details.
- Pronto quando: a API busca empresas com melhor cobertura comercial.

### SR-01.05 - Integrar CNPJ/CNAE como validacao setorial
- Prioridade: `P0`
- Objetivo: reforcar aderencia e confianca.
- Dependencias: BE-00.03, SR-01.02.
- Entregavel: conector para dados cadastrais brasileiros.
- Pronto quando: leads brasileiros podem ser confirmados por CNAE e status cadastral.
- Estado: concluido.

### SR-01.06 - Manter OSM/Nominatim/Overpass como camada auxiliar
- Prioridade: `P1`
- Objetivo: preservar cobertura complementar.
- Dependencias: BE-00.03, SR-01.03.
- Entregavel: adaptador de fallback e enriquecimento.
- Pronto quando: OSM entra como complemento, nao como fonte principal.
- Estado: concluido.

### SR-01.07 - Implementar CompanyNormalizer
- Prioridade: `P0`
- Objetivo: padronizar nome, endereco, telefone, site e coordenadas.
- Dependencias: SR-01.03.
- Entregavel: regras de normalizacao por campo.
- Pronto quando: entradas de diferentes fontes chegam em formato unico.
- Estado: concluido.

### SR-01.08 - Implementar CompanyDeduper
- Prioridade: `P0`
- Objetivo: remover repetidos entre fontes.
- Dependencias: SR-01.07.
- Entregavel: dedupe por CNPJ, place_id, telefone, dominio e geografia.
- Pronto quando: duplicados com alta certeza sao fundidos e casos duvidosos sao marcados.
- Estado: concluido.

### SR-01.09 - Implementar LeadRanker
- Prioridade: `P0`
- Objetivo: ordenar por utilidade real.
- Dependencias: SR-01.07, SR-01.08.
- Entregavel: score 0-100 com motivos e penalidades.
- Pronto quando: o topo da lista reflete utilidade comercial, nao ordem da API.
- Estado: concluido.

### SR-01.10 - Mostrar provenance e motivo no card
- Prioridade: `P0`
- Objetivo: explicar por que cada lead apareceu.
- Dependencias: SR-01.07, SR-01.09.
- Entregavel: fonte por campo, score e motivo resumido na interface.
- Pronto quando: o usuario entende o lead sem adivinhar.
- Estado: concluido.

### SR-01.11 - Criar feedback de busca
- Prioridade: `P1`
- Objetivo: captar qualidade percebida pelo usuario.
- Dependencias: SR-01.09.
- Entregavel: eventos de `bom lead`, `duplicado`, `fora da cidade`, `fora do segmento` e `sem contato`.
- Pronto quando: o feedback alimenta melhoria futura.
- Estado: concluido.

### SR-01.12 - Implementar exportacao CSV real
- Prioridade: `P1`
- Objetivo: entregar lista usavel fora do app.
- Dependencias: SR-01.09, BE-00.03.
- Entregavel: exportador real no backend.
- Pronto quando: exportacao gera arquivo com campos confiaveis.
- Estado: concluido.

## Fase 2 - Persistencia e SaaS

### SA-02.01 - Implementar autenticao real
- Prioridade: `P0`
- Objetivo: sair do login simulado.
- Dependencias: BE-00.04.
- Entregavel: fluxo de auth real com sessao persistida.
- Pronto quando: usuario autentica sem mock.
- Estado: concluido.

### SA-02.02 - Implementar workspaces e membros
- Prioridade: `P1`
- Objetivo: estruturar uso por time/conta.
- Dependencias: SA-02.01.
- Entregavel: workspace, membros e roles.
- Pronto quando: dados pertencem a um workspace.
- Estado: concluido.

### SA-02.03 - Migrar listas para Postgres
- Prioridade: `P0`
- Objetivo: tirar listas do localStorage.
- Dependencias: SA-02.01, BE-00.04.
- Entregavel: CRUD de listas no banco.
- Pronto quando: listas sobrevivem a refresh e troca de dispositivo.

### SA-02.04 - Migrar contatos para Postgres
- Prioridade: `P0`
- Objetivo: tornar contatos persistentes.
- Dependencias: SA-02.01, BE-00.04.
- Entregavel: CRUD de contatos com referencia de origem.
- Pronto quando: contatos sobrevivem a refresh e troca de dispositivo.
- Estado: concluido.

### SA-02.05 - Migrar deals e pipelines para Postgres

- Prioridade: `P0`
- Objetivo: consolidar CRM no backend.
- Dependencias: SA-02.01, BE-00.04.
- Entregavel: pipelines, stages, deals e historico.
- Pronto quando: pipeline funciona sem depender de estado local como fonte de verdade.
- Estado: concluido.

### SA-02.06 - Criar usage_events e limites por plano
- Prioridade: `P1`
- Objetivo: medir custo e aplicar quota.
- Dependencias: SA-02.01, BE-00.04.
- Entregavel: eventos de uso e controle de limite mensal.
- Pronto quando: busca, exportacao e enriquecimento geram contabilizacao.
- Estado: concluido.


### SA-02.07 - Criar jobs assincronos de enriquecimento
- Prioridade: `P1`
- Objetivo: desacoplar coleta pesada da UX.
- Dependencias: BE-00.02, BE-00.04.
- Entregavel: fila de jobs para refresh, site, telefone e score.
- Pronto quando: enriquecimento roda em background.
- Estado: concluido.

### SA-02.08 - Definir cache e refresh programado
- Prioridade: `P1`
- Objetivo: reduzir custo e manter dados atuais.
- Dependencias: SA-02.07.
- Entregavel: politica de TTL e revalidacao.
- Pronto quando: dados salvos podem ser atualizados sem perder historico.
- Estado: concluido.

## Fase 3 - Inteligencia e enriquecimento

### IN-03.01 - Implementar classificador de segmento com schema fechado
- Prioridade: `P1`
- Objetivo: usar IA com controle.
- Dependencias: SR-01.02, BE-00.03.
- Entregavel: classificacao com JSON schema e validacao forte.
- Pronto quando: IA nao inventa categoria nem empresa.
- Estado: concluido.

### IN-03.02 - Criar resumo explicavel de relevancia
- Prioridade: `P1`
- Objetivo: mostrar porque o lead e bom.
- Dependencias: SR-01.09, IN-03.01.
- Entregavel: resumo curto com evidencias.
- Pronto quando: a UI consegue exibir um motivo legivel.
- Estado: concluido.

### IN-03.03 - Implementar validacao de telefone e dominio
- Prioridade: `P1`
- Objetivo: reforcar contato util.
- Dependencias: SR-01.07.
- Entregavel: heuristicas e validacoes por campo.
- Pronto quando: contatos ruins recebem penalidade clara.
- Estado: concluido.

### IN-03.04 - Implementar regras de intencao comercial
- Prioridade: `P2`
- Objetivo: ajustar ranking ao que o usuario vende.
- Dependencias: SR-01.02, SR-01.09.
- Entregavel: intent profiles com boosts e penalidades.
- Pronto quando: a busca muda conforme a proposta comercial.
- Estado: concluido.

### IN-03.05 - Implementar refresh automatico de leads salvos
- Prioridade: `P2`
- Objetivo: manter dados vivos.
- Dependencias: SA-02.07, SA-02.08.
- Entregavel: rotina de renovacao de dados importantes.
- Pronto quando: leads antigos podem ser revisados sem acao manual pesada.
- Estado: concluido.

### IN-03.06 - Fechar feedback loop do ranking
- Prioridade: `P2`
- Objetivo: melhorar com uso real.
- Dependencias: SR-01.11.
- Entregavel: uso do feedback para ajustar score e priorizacao.
- Pronto quando: o sistema aprende com sinais do usuario.
- Estado: concluido.

## Fase 4 - Acabamento operacional

### OP-04.01 - Remover login mock quando auth real estiver ativa
- Prioridade: `P0`
- Dependencias: SA-02.01.
- Pronto quando: mock nao e mais caminho principal.
- Estado: concluido.

### OP-04.02 - Remover pricing mock quando planos reais existirem
- Prioridade: `P1`
- Dependencias: SA-02.06.
- Pronto quando: a experiencia de upgrade reflete o produto real.
- Estado: concluido.

### OP-04.03 - Converter exportacao visual em exportacao real end-to-end
- Prioridade: `P1`
- Dependencias: SR-01.12, SA-02.03, SA-02.04.
- Pronto quando: exportar gera arquivo confiavel com dados persistidos.
- Estado: concluido.

### OP-04.04 - Revisar nomes, branding e microcopy
- Prioridade: `P2`
- Dependencias: fase 1 e 2 estaveis.
- Pronto quando: nomenclatura nao contradiz a arquitetura real.
- Estado: concluido.

### OP-04.05 - Fechar observabilidade e rotina de qualidade
- Prioridade: `P1`
- Dependencias: BE-00.05.
- Pronto quando: erros, latencia, custo e zero-result sao acompanhados.
- Estado: concluido.

## Tarefas imediatas sugeridas

Se a proxima sessao de implementacao comecar agora, a ordem minima recomendada e:

1. BE-00.01
2. BE-00.02
3. BE-00.03
4. BE-00.04
5. SR-01.01
6. SR-01.02
7. SR-01.03
8. SR-01.04
9. SR-01.07
10. SR-01.08
11. SR-01.09
12. SR-01.10

## Critério de encerramento por fase

Uma fase so encerra quando:
- as dependencias da fase seguinte estao destravadas
- existe validacao reproduzivel
- o produto atual continua funcionando
- a documentacao foi atualizada
