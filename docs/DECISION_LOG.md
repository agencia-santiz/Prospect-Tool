# Decision Log - Bloom Leads

## 2026-05-05 - Contratos de dominio versionados

- Decisao: o projeto passa a ter um contrato canonico em `src/domainContracts.ts` para `search`, `company`, `lead`, `contact`, `deal`, `pipeline` e `workspace`.
- Motivo: reduzir ambiguidade antes da migracao para backend e manter a UI desacoplada da forma final da API.
- Impacto: `src/types.ts` continua atendendo a UI atual, enquanto o novo contrato orienta a evolucao futura.
- Aberto: mapeamento completo entre o modelo de tela atual e o modelo de persistencia da API.

## 2026-05-05 - Backend base com healthcheck e manifest de modulos

- Decisao: o projeto passa a ter um backend minimo em `server/` com rotas `GET /`, `GET /health` e `GET /version`.
- Motivo: destravar a fundacao da API sem antecipar integracoes ou persistencia que ainda nao estao prontas.
- Impacto: o frontend continua responsavel pela experiencia atual, enquanto o backend ja responde como espinha dorsal evolutiva.
- Aberto: adicionar rotas de dominio reais e ligar contratos compartilhados quando a fase de integracao comecar.

## 2026-05-05 - Segredos centralizados no backend

- Decisao: `GEMINI_API_KEY` deixa de ser injetada no frontend e passa a ser lida apenas pelo backend via `.env.local` ou variaveis de processo.
- Motivo: proteger a chave, remover segredo do bundle e preparar o app para proxy seguro de integracoes.
- Impacto: o frontend chama o backend para enriquecimento e continua usando Open Data como fallback.
- Aberto: adicionar outros segredos e credenciais ao mesmo padrao quando novas integracoes entrarem.

## 2026-05-05 - Schema inicial de Postgres versionado

- Decisao: o esquema inicial do banco vive em `server/db/migrations/0001_initial.sql`.
- Motivo: registrar a fonte de verdade em uma migration versionada e validar a estrutura antes do backend persistente existir.
- Impacto: os dominios comerciais podem evoluir sem ficar presos ao `localStorage` como unico formato.
- Aberto: aplicar o schema em um banco real e ligar o backend as tabelas criadas.

## 2026-05-05 - Logs estruturados e correlation id

- Decisao: o backend emite logs JSON por requisicao e devolve `X-Request-Id` em toda resposta.
- Motivo: rastrear erros, latencia e fluxo de cada chamada sem depender de logs soltos no console.
- Impacto: o backend fica pronto para correlacionar healthchecks, buscas e falhas com uma unica chave.
- Aberto: plugar esses logs em um observability stack real quando a operacao pedir.

## 2026-05-05 - LocationResolver com IBGE e cache em memoria

- Decisao: a resolucao geografica canonica para cidades brasileiras passa a usar a API de localidades e a API de malhas do IBGE.
- Motivo: garantir cidade validada, UF, centroide e bounding box a partir de fonte oficial, com cache local para reduzir chamadas repetidas.
- Impacto: a futura orquestracao de busca pode comecar a partir de uma cidade canonica em vez de uma string solta.
- Aberto: ligar esse resolver ao fluxo de busca principal e decidir a estrategia para cidades fora do Brasil.

## 2026-05-05 - SegmentResolver com taxonomia versionada

- Decisao: o segmento deixa de ser apenas texto livre e passa a ter uma taxonomia versionada com IDs canônicos, aliases, termos positivos e negativos, tipos e CNAEs, consumida pelo backend e reutilizada pela UI.
- Motivo: reduzir ambiguidade, padronizar a entrada da busca e preparar a orquestração futura para trabalhar com ID estavel em vez de texto solto.
- Impacto: o autocomplete do frontend continua funcional, mas agora depende da mesma taxonomia que o backend usa para resolver o segmento.
- Aberto: ampliar a cobertura de CNAEs e sinais por segmento conforme a busca evolua para classificadores e ranking.

## 2026-05-05 - SearchOrchestrator com plano explicito de busca

- Decisao: a busca passa a ser coordenada por um `SearchOrchestrator` que resolve cidade, segmento, nivel de expansao e plano de fontes antes de chamar o enriquecimento.
- Motivo: tornar o fluxo rastreavel e preparar a futura expansao por etapas sem espalhar essa logica pelo frontend ou pela rota de entrada.
- Impacto: a rota `/search/enrich` deixa de fazer a composicao diretamente e passa a delegar para um servico unico, mas a resposta segue compatível com o frontend atual.
- Aberto: incorporar fontes auxiliares reais no plano quando Google Places, OSM e CNPJ entrarem de forma formal no backend.

## 2026-05-05 - Google Places e Geocoding como fonte principal

- Decisao: a descoberta principal de leads passa a usar Google Places Text Search, com Google Geocoding para bias de localizacao e a base IBGE continua como validacao canonica da cidade.
- Motivo: usar a fonte comercial mais forte para cobrir telefone, website e place metadata, sem perder a garantia de cidade validada pelo resolver local.
- Impacto: o backend agora normaliza resultados do Google para o mesmo modelo da UI e mantém Gemini como fallback quando o Google nao estiver disponivel ou vier vazio.
- Aberto: complementar a descoberta com Place Details, Open Data e fontes auxiliares conforme a cobertura e o custo exigirem.

## 2026-05-05 - CNPJ/CNAE como validacao setorial

- Decisao: a busca ganhou um `CnpjCnaeService` para validar aderencia setorial por CNPJ e CNAE, com lookup opcional na API oficial quando houver credenciais.
- Motivo: reduzir falsos positivos e permitir confirmacao cadastral de empresas brasileiras sem depender apenas do nome comercial ou do tipo de lugar.
- Impacto: o `SearchOrchestrator` agora pode anexar validacao setorial ao plano e aos leads que tragam evidencias cadastrais, sem alterar o contrato basico da resposta.
- Aberto: ampliar a cobertura de fontes de CNPJ/CNAE e decidir quando essa validacao deve filtrar versus apenas sinalizar os leads.

## 2026-05-05 - OSM/Nominatim/Overpass como camada auxiliar

- Decisao: OSM via Nominatim e Overpass passou a atuar como camada auxiliar no backend, depois de Google Places e Gemini.
- Motivo: preservar cobertura gratuita/complementar para setores com menor presencia em Google e manter a busca operando quando a fonte principal vier vazia.
- Impacto: o `SearchOrchestrator` pode pedir `open_data` como fallback terciario, sem trocar a fonte principal nem o contrato da resposta.
- Aberto: avaliar quando a camada auxiliar deve ser expandida com ranking proprio ou filtros mais finos por segmento.

## 2026-05-05 - CompanyNormalizer como camada canonica de entrada

- Decisao: os leads passam por um `CompanyNormalizer` no backend antes de serem validados ou devolvidos.
- Motivo: manter nome, endereco, telefone, site e coordenadas em um formato unico, independentemente da fonte de origem.
- Impacto: Google, Gemini e Open Data chegam ao restante do fluxo com o mesmo contrato normalizado, reduzindo a dependencia de adaptacoes espalhadas.
- Aberto: enriquecer a normalizacao com regras mais fortes de geocodificacao, dominio e fonte primarias quando o dedupe entrar.

## 2026-05-05 - CompanyDeduper com fusao conservadora

- Decisao: o backend passa a consolidar leads repetidos em um `CompanyDeduper` depois da normalizacao.
- Motivo: remover duplicados de alta certeza por CNPJ, sourceId, dominio, telefone e geografia, sem apagar casos que ainda merecem revisao.
- Impacto: a rota de busca agora devolve a lista já consolidada e inclui um resumo de dedupe para auditoria.
- Aberto: evoluir as heuristicas de proximidade geografica e de telefone conforme mais fontes entrarem no fluxo.
