# Roadmap Tecnico - Bloom Leads

Este documento transforma a pesquisa tecnica em um plano de implementacao. A ideia e sair de um MVP local-first e evoluir para um buscador profissional de leads B2B, com fonte rastreavel, score explicavel, deduplicacao, persistencia real e backend protegido.

Base de referencia:
- [bloom_leads_pesquisa_tecnica_estrategica.md](./bloom_leads_pesquisa_tecnica_estrategica.md)
- [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)
- [DOCUMENTACAO_DO_APP.md](./DOCUMENTACAO_DO_APP.md)
- [BACKLOG_EXECUTAVEL.md](./BACKLOG_EXECUTAVEL.md)

## 1. Objetivo

Construir um motor de prospeccao B2B que:
- encontre empresas com mais assertividade
- mostre por que cada lead apareceu
- proteja chaves e integracoes sensiveis
- persista dados comerciais no backend
- mantenha o fluxo rapido de buscar, salvar, contatar e mover no pipeline

## 2. Regras de produto definidas pela pesquisa

### Manter
- React, Vite, TypeScript e Tailwind no frontend
- busca por cidade e segmento
- autocomplete de cidade
- catalogo de segmentos com aliases
- listas, contatos e pipeline Kanban
- WhatsApp e Google Maps como atalho de acao
- OpenStreetMap como fonte auxiliar

### Mudar
- busca externa sai do frontend
- Gemini deixa de gerar lista de empresas
- IA passa a classificar, resumir e expandir termos
- localStorage deixa de ser fonte de verdade
- ranking passa a ser explicavel
- cards precisam mostrar fonte, score e motivo

### Ja concluido
- chaves sensiveis sairam do bundle do frontend
- login mock em producao foi removido
- pricing real do workspace ja esta no fluxo principal
- exportacao CSV real ja funciona end-to-end
- exibicao de lead sem provenance foi substituida por logs, rastreio e contexto operacional
- autenticacao real e workspaces ja estao ativos

## 3. Arquitetura alvo

### Frontend
- continua com React 19, Vite e TypeScript
- consome uma API fina
- mostra score, motivo, fonte e confianca
- preserva os modulos atuais de listas, contatos e pipeline

### Backend
- Node.js com Fastify ou NestJS
- proxy para fontes externas
- rotas para busca, enriquecimento, exportacao e feedback
- protecao de segredos e controle de custo

### Banco de dados
- Postgres como fonte de verdade
- entidades versionadas para usuarios, workspaces, searches, companies, leads, lists, contacts, deals, pipelines e jobs
- company_sources para provenance
- usage_events para custo e auditoria
- search_feedback para melhoria continua

### Infra de apoio
- fila de jobs para enriquecimento e refresh
- cache com TTL por fonte
- logs estruturados
- monitoramento e alertas

### Estado atual da implementação
- autenticação real com sessao persistida
- workspaces e membros ativos no fluxo principal
- pricing real do workspace
- exportacao CSV real via backend
- observabilidade operacional de busca, exportacao e feedback
- padronizacao de branding e microcopy concluida

## 4. Pipeline de busca desejado

1. Resolver cidade para IBGE, UF, centroide e bounding box.
2. Resolver segmento para uma taxonomia canonica versionada.
3. Buscar na fonte primaria.
4. Ampliar de forma controlada se a resposta vier fraca.
5. Complementar com fontes auxiliares.
6. Normalizar nomes, telefones, sites e enderecos.
7. Deduplicar por IDs, telefone, dominio e geografia.
8. Calcular score e motivo.
9. Exibir os melhores resultados.
10. Coletar feedback do usuario.

## 5. Fases de implementacao

### Fase 0 - Fundacao
Objetivo: preparar a base para a migracao sem quebrar o MVP atual.

Entregas:
- backend inicial com estrutura de rotas
- definicao de dominio e contratos
- estrategia de secrets e env vars
- banco Postgres pronto
- logging e observabilidade basica
- auditoria do que continua no frontend e do que sai dele

Aceite:
- o app atual continua funcionando
- nenhuma chave sensivel fica no frontend
- a nova base aceita evolucao incremental

### Fase 1 - Buscador profissional
Objetivo: tornar a busca mais confiavel e rastreavel.

Entregas:
- `LocationResolver`
- `SegmentResolver` com taxonomia versionada
- `SearchOrchestrator`
- integracao com Google Places e Geocoding
- integracao com CNPJ/CNAE quando disponivel
- OSM/Nominatim/Overpass como camada auxiliar
- `CompanyNormalizer`
- `CompanyDeduper`
- `LeadRanker`
- provenance por campo
- score e motivo no card
- feedback de usuario
- exportacao CSV real

Aceite:
- a busca responde com origem clara
- o usuario entende por que o lead apareceu
- duplicados diminuem de forma visivel
- os resultados sao ordenados por utilidade

### Fase 2 - Persistencia e SaaS
Objetivo: tirar o produto do localStorage como fonte de verdade.

Entregas:
- autenticacao real
- workspaces e membros
- planos e limites de uso
- listas, contatos, deals e pipelines no banco
- eventos de uso e quota
- jobs assincronos de enriquecimento
- cache de resultados e refresh programado

Aceite:
- dados comerciais sobrevivem a refresh e troca de dispositivo
- limites por plano funcionam
- o produto suporta multiplos usuarios sem perder integridade

### Fase 3 - Inteligencia e enriquecimento
Objetivo: aumentar assertividade e valor dos leads.

Entregas:
- classificador de segmento com schema fechado
- resumo explicavel de relevancia
- enriquecimento de site e telefone
- validacao de telefone e dominio
- regras de intencao comercial
- refresh automatico de leads salvos
- feedback loop do ranking

Aceite:
- IA nao inventa dados
- os resultados ficam mais uteis com o uso real
- o score melhora com o feedback

## 6. Modelo de dados minimo

### Obrigatorios
- users
- workspaces
- workspace_members
- searches
- companies
- company_sources
- leads
- saved_lists
- saved_list_items
- contacts
- deals
- pipelines
- pipeline_stages
- enrichment_jobs
- usage_events
- search_feedback

### Campos de alto valor
- provenance por campo
- source confidence
- location score
- segment match score
- completeness score
- dedupe confidence
- reasons e penalties

## 7. O que continua simulado ate nova ordem

- algumas configuracoes locais enquanto a migracao nao acontece
- cache local de apoio
- cobertura total de persistencia comercial no backend
- cobranca, checkout e upgrade comercial

## 8. Critérios de qualidade

### Buscador
- resultado precisa indicar fonte
- resultado precisa indicar motivo
- lead sem telefone ou site recebe penalidade
- lead fora da cidade nao entra por engano

### Dados
- todo dado importante precisa ter origem
- dedupe precisa ser previsivel
- o sistema precisa permitir refresh sem perder historico

### Operacao
- logs por busca
- logs por fonte
- contagem de custo e uso
- feedback do usuario persistido

## 9. Sequencia recomendada de execucao

1. Criar backend base e contratos.
2. Definir taxonomia de cidade e segmento.
3. Proteger integracoes e mover chaves para o backend.
4. Implementar busca profissional em camadas.
5. Implementar dedupe, ranking e provenance.
6. Persistir dominio comercial em Postgres.
7. Consolidar limites, billing e upgrade.
8. Adicionar feedback e observabilidade.
9. Abrir caminho para enriquecimento e inteligencia adicional.

Para a lista detalhada e executavel de tarefas, consultar [BACKLOG_EXECUTAVEL.md](./BACKLOG_EXECUTAVEL.md).

## 10. Riscos principais

- custo de fontes externas
- qualidade irregular do OSM
- matching incorreto entre empresas parecidas
- dados cadastrais desatualizados
- risco de alucinacao da IA
- complexidade de migrar o MVP sem quebrar o fluxo atual

## 11. Regra de ouro

IA nao e a base de verdade do produto. A base de verdade e:
- fonte rastreavel
- score explicavel
- dado comercial util
- persistencia confiavel

Se uma tarefa nao ajudar a deixar o lead mais confiavel, mais util ou mais rastreavel, ela deve ficar fora do caminho principal por enquanto.
