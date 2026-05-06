# Bloom Leads — Pesquisa técnica e estratégica para buscador profissional de leads B2B

Este documento consolida uma análise técnica e estratégica para transformar o Bloom Leads em um buscador profissional, confiável e assertivo de empresas/leads B2B por localização, segmento e intenção comercial.

Base considerada:
- React 19, Vite, TypeScript e Tailwind CSS.
- Busca por cidade e segmento.
- Autocomplete de cidade.
- Autocomplete de segmento com catálogo local e aliases.
- Fonte aberta local-first com Nominatim + Overpass/OpenStreetMap.
- Fallback com Gemini 2.5 Flash usando ferramenta Google Maps.
- Resultados em cards/lista.
- Salvamento de leads em listas.
- Contatos.
- Pipeline Kanban.
- Dados em localStorage.
- Login, plano, exportação e backend ainda simulados.

---

## 1. Diagnóstico direto do app atual

O Bloom Leads já tem a jornada central de prospecção: buscar, visualizar, salvar, marcar como contatado, organizar contatos e acompanhar no pipeline. O problema central é que a base técnica ainda é de protótipo local, não de produto B2B profissional.

### O que está correto

- A base visual está adequada para MVP B2B.
- A jornada “buscar → salvar → contatar → pipeline” está correta.
- O autocomplete de cidade é necessário e deve ser mantido.
- O autocomplete de segmento com aliases é uma boa decisão.
- O catálogo local de segmentos deve evoluir para uma taxonomia versionada no backend.
- OpenStreetMap é útil como fonte complementar.
- IA como fallback/classificador é útil, desde que não seja a fonte primária.
- Listas, contatos e Kanban devem permanecer porque fecham o ciclo comercial.

### Problemas e correções

| Problema | Correção recomendada | Prioridade |
|---|---|---|
| Busca depende demais de OSM/Overpass, que tem cobertura irregular de telefone, site, horário e categoria comercial. | Usar OSM como fonte complementar. Promover Google Places + base CNPJ/CNAE para fontes principais no MVP profissional. | Alta |
| Gemini retorna lista de leads diretamente. | Usar IA para classificação, expansão de termos e resumo. Não usar IA como fonte primária de empresas. | Alta |
| API keys e chamadas externas no frontend. | Criar backend proxy para Google, Gemini, CNPJ, SERP e OSM. Nenhuma chave sensível no bundle Vite. | Alta |
| Login, plano e créditos simulados. | Implementar autenticação real, workspace, usage_events e limites por plano no backend. | Alta |
| localStorage é fonte de verdade. | Migrar listas, contatos, leads, deals, buscas e feedback para Postgres. localStorage só para preferências de UI. | Alta |
| Exportação é simulada. | Gerar CSV/XLSX real no backend, registrar evento de uso e armazenar arquivo temporário. | Alta |
| Resultado não mostra confiabilidade. | Exibir fonte, última verificação, score, motivo do match e campos ausentes no card. | Alta |
| Deduplicação por nome/endereço é fraca. | Criar dedupe por CNPJ, Google place_id, OSM id, telefone normalizado, domínio, geohash e similaridade de nome. | Alta |
| Não há validação forte de cidade. | Resolver cidade para código IBGE, UF, centroide, bounding box e polígonos quando possível. | Alta |
| Não há vínculo com CNAE. | Mapear segmentos para CNAEs principais/secundários e usar CNPJ como confirmação setorial. | Alta |
| Segmento é tratado como label única. | Criar taxonomia com segmento canônico, aliases, termos de busca, tags OSM, tipos Google Places, CNAEs e termos negativos. | Alta |
| Fallback só acontece quando retorna zero. | Implementar busca em camadas: fonte principal, expansão moderada, fonte complementar, expansão ampla e IA classificadora. | Alta |
| Cards mostram leads sem telefone/site com o mesmo peso visual. | Ranking deve penalizar lead sem telefone e sem canal de contato. | Alta |
| Não há “motivo do resultado”. | Mostrar: “Encontrado por Google Places; categoria loja de roupas; dentro de Marília; telefone validado”. | Média |
| Não há feedback estruturado do usuário. | Adicionar botões: “não é do segmento”, “fora da cidade”, “duplicado”, “sem contato útil”, “bom lead”. | Média |
| Não há histórico de busca. | Salvar busca, parâmetros, fontes, versão da taxonomia, resultados e feedback. | Média |
| “Qtd” pode sugerir precisão que a fonte não garante. | Tratar quantidade como meta, não promessa. Mostrar “5 bons leads encontrados de 9 solicitados”. | Média |
| O Kanban já existe, mas lead e empresa parecem misturados. | Separar company, lead, contact e deal no modelo de dados. | Alta |
| Não há enriquecimento gradual. | Buscar primeiro dados baratos; enriquecer telefone/site/CNPJ depois por job assíncrono. | Média |
| Falta compliance de atribuição de fonte. | Exibir atribuições exigidas por Google Maps/OSM e guardar provenance por campo. | Alta |
| UI não mostra filtros profissionais. | Adicionar filtros: com telefone, com site, ativo na Receita, matriz/filial, porte, CNAE, distância, fonte. | Média |
| Não há monitoramento de falhas. | Registrar logs por busca, fonte, latência, custo, taxa de zero-result e taxa de duplicados. | Alta |
| Não há controle de custo por fonte. | Criar orçamento por workspace e limite diário/mensal de chamadas externas. | Alta |

---

## 2. Tecnologias de pesquisa que devem ser consideradas

| Tecnologia | Para que serve | Quando usar | Vantagem | Risco/limitação | MVP agora |
|---|---|---|---|---|---|
| Google Places API | Descobrir empresas por texto, categoria, área e Place ID. | Busca principal por cidade + segmento. | Melhor cobertura comercial local, telefone, horário, rating, website e status. | Custo, termos de uso, variação de resultados, necessidade de field masks. | Sim |
| Google Maps Platform | Places, Geocoding, Maps JS, Address Validation, Routes. | Places + Geocoding no backend; mapa visual depois. | Ecossistema confiável para localização e estabelecimentos. | Regras de atribuição, billing e restrições de armazenamento de conteúdo. | Sim, só Places/Geocoding |
| Place ID do Google | Identificador estável para reconsultar empresa. | Deduplicação e refresh de dados Google. | Pode ser armazenado e reutilizado. | Pode mudar ou ficar obsoleto. | Sim |
| OpenStreetMap / Overpass | Fonte aberta de pontos comerciais e tags geográficas. | Fallback, complemento e cobertura alternativa. | Sem lock-in, útil para dados geográficos e alguns segmentos. | Cobertura irregular, limites de uso e dados incompletos. | Parcial |
| Nominatim | Geocoding/reverse geocoding via OSM. | Resolver cidade/endereço quando Google não for usado. | Aberto e simples. | Não deve ser usado em alto volume no endpoint público. | Parcial |
| SerpAPI | Capturar SERP, Google Search/Maps e resultados estruturados via provedor. | Quando Places API não entregar cobertura suficiente ou para enriquecer web. | Retorna dados já estruturados. | Custo, dependência de terceiro e compliance. | Não como fonte principal |
| DataForSEO | SERP, Google Maps SERP, ranking local e business data. | Alternativa a SerpAPI para escala/custo. | Modos assíncronos e dados estruturados. | Custo e latência. | Talvez fase 2 |
| Bing Search API | Busca web geral. | Não priorizar. | Era opção para web search programático. | APIs tradicionais foram aposentadas/migradas para soluções novas. | Não |
| Google Custom Search JSON API | Busca web programática. | Apenas se já houver acesso/cliente existente. | JSON simples para resultados web. | Restrições comerciais e disponibilidade limitada. | Não |
| Brave Search API | Busca web independente. | Descobrir sites oficiais e páginas de contato. | Índice próprio. | Cobertura local menor que Google Maps. | Talvez |
| Tavily / Exa | Busca web orientada a IA/RAG. | Enriquecer website, resumo e evidências. | Boa para pesquisa em páginas. | Não substitui fonte cadastral/local. | Depois |
| APIs de CNPJ / dados públicos brasileiros | Consultar razão social, situação, endereço, CNAE, porte e sócios conforme fonte. | Enriquecer e validar empresas brasileiras. | Forte camada cadastral para B2B Brasil. | Matching nome/endereço nem sempre trivial. | Sim |
| Receita Federal / dados cadastrais | Fonte oficial para dados de pessoa jurídica. | Validação cadastral e status ativo/inapto/baixado. | CNPJ é referência cadastral brasileira. | Não resolve telefone atual nem intenção comercial. | Sim |
| CNAE / IBGE Concla | Classificação econômica setorial. | Confirmar aderência do segmento e criar filtros profissionais. | Permite mapear segmento para atividade econômica formal. | CNAE pode ser genérico ou desatualizado. | Sim |
| Scraping ético | Coleta controlada de páginas públicas, respeitando robots.txt, termos e limites. | Site oficial, página de contato e páginas públicas permitidas. | Ajuda a obter site, telefone, e-mail genérico e descrição. | LGPD, termos de uso e risco operacional. | Só com regras rígidas |
| Enriquecimento de dados | Completar empresa com CNPJ, CNAE, telefone, site, e-mail, redes, porte e status. | Após descoberta inicial. | Aumenta utilidade do lead. | Custo e risco de dados desatualizados. | Sim, gradual |
| Validação de telefone | Normalizar DDI/DDD, móvel/fixo, formato e duplicidade. | Antes de exibir WhatsApp/exportar. | Reduz contato inválido. | Saber se tem WhatsApp real exige integração específica ou heurística. | Sim |
| Validação de site | Resolver domínio, HTTP status, redirect e página ativa. | Enriquecimento assíncrono. | Identifica empresa ativa e domínio canônico. | Site pode estar temporariamente fora do ar. | Sim |
| Validação de e-mail | Sintaxe, domínio, MX e verificação controlada. | Para e-mails genéricos e contatos. | Reduz bounce. | Pode ser bloqueado; dados pessoais exigem cuidado legal. | Depois |
| Geocoding e reverse geocoding | Converter endereço em coordenadas e coordenadas em endereço. | Sempre que houver cidade/endereço. | Permite distância, bounding box, filtro de cidade e dedupe espacial. | Custo e ambiguidade de endereços. | Sim |
| Deduplicação de empresas | Unificar registros de Google, CNPJ, OSM, SERP e scraping. | Depois de cada coleta. | Evita repetição e melhora confiança. | Fuzzy matching errado pode fundir empresas diferentes. | Sim |
| Ranking e score | Ordenar leads por aderência e qualidade. | Antes de exibir e exportar. | Produto parece assertivo, não lista aleatória. | Score ruim destrói confiança. | Sim |

Decisão: para MVP profissional, implemente Google Places + CNPJ/CNAE + dedupe + ranking. Mantenha OSM como camada auxiliar. Use SERP API apenas para enriquecer site ou validar presença web.

---

## 3. Inteligência por trás da busca

A busca não deve ser um prompt. Deve ser um pipeline determinístico com camadas inteligentes.

### 3.1 Normalização de segmento

Crie uma entidade `segments` no backend.

```ts
{
  id: "food_service",
  label: "Alimentação / Food Service",
  aliases: ["alimentação", "food service", "restaurantes", "bares", "lanchonetes", "delivery", "padarias"],
  googleTypes: ["restaurant", "meal_takeaway", "bakery", "cafe", "bar"],
  googleTextQueries: ["restaurante", "lanchonete", "padaria", "delivery de comida", "buffet", "marmitaria"],
  osmTags: [
    { key: "amenity", values: ["restaurant", "fast_food", "cafe", "bar"] },
    { key: "shop", values: ["bakery"] }
  ],
  cnaeCodes: ["5611-2/01", "5611-2/03", "5620-1/01", "5620-1/02", "5620-1/04"],
  negativeTerms: ["supermercado", "atacado de alimentos", "distribuidora", "agropecuária"],
  broadParent: "comercio_servicos"
}
```

Regra prática:

```txt
input = "food service"
normalizado = removeAcento(lowercase(trim(input)))
se match exato em aliases => segmento canônico
se similaridade >= 0.86 => segmento canônico
se contém termo ambíguo => pedir desambiguação visual ou usar intenção
```

### 3.2 Aliases e sinônimos

Separe aliases de usuário, termos por fonte, CNAE e termos negativos.

Exemplo para “Vestuário / Moda”:

```ts
aliasesUsuario = ["moda", "vestuário", "roupas", "loja de roupa", "confecção", "moda feminina", "brechó"];
googleTextQueries = ["loja de roupas", "moda feminina", "moda masculina", "loja de calçados", "brechó"];
googleTypes = ["clothing_store", "shoe_store"];
osmTags = [
  { key: "shop", values: ["clothes", "shoes", "fashion_accessories", "boutique", "second_hand"] },
  { key: "craft", values: ["tailor"] }
];
negativeTerms = ["lavanderia", "costura industrial sem varejo", "tecido por atacado"];
```

### 3.3 Expansão semântica da busca

Use níveis. Não expanda tudo de uma vez.

```txt
Nível 0: termo canônico exato
"loja de roupas em Marília"

Nível 1: aliases próximos
"moda feminina", "moda masculina", "brechó", "loja de calçados"

Nível 2: categoria ampla
"vestuário", "boutique", "acessórios de moda"

Nível 3: fallback amplo com filtro posterior
"comércio varejista em Marília" + classificador de segmento
```

Regra:

```txt
se resultados úteis >= qtd solicitada:
  parar
senão:
  expandir um nível
```

### 3.4 Classificação por CNAE

Crie tabela `segment_cnae_rules`.

Exemplo para food service:

```txt
CNAE principal forte:
- 5611-2/01 Restaurantes e similares
- 5611-2/03 Lanchonetes, casas de chá, de sucos e similares
- 5620-1/02 Serviços de alimentação para eventos e recepções - bufê

CNAE aceitável:
- 4721, 4729, padarias/comércio de alimentos

CNAE negativo:
- indústria alimentícia
- comércio atacadista
- supermercados
- agropecuária
```

Heurística:

```txt
se CNAE principal está no mapa forte: cnae_score = 1.0
se CNAE secundário está no mapa forte: cnae_score = 0.75
se CNAE está no mapa aceitável: cnae_score = 0.55
se CNAE está no mapa negativo: rejeitar ou cnae_score = 0
se não há CNPJ/CNAE: cnae_score = null, não rejeitar
```

### 3.5 Intenção comercial

Adicionar campo opcional: “O que você quer vender?” ou “Tipo de cliente”.

Exemplo:

```txt
Segmento: Alimentação / Food Service
Intenção: vender embalagens descartáveis
```

Isso muda o ranking:

```txt
mais aderentes:
- restaurantes
- lanchonetes
- marmitarias
- delivery
- bares
- padarias

menos aderentes:
- mercado
- indústria alimentícia
- distribuidora
```

Modelo simples:

```ts
intentRules = {
  "embalagens_descartaveis": {
    boostTerms: ["delivery", "marmitaria", "lanchonete", "restaurante", "açaí", "sorveteria"],
    penalizeTerms: ["supermercado", "atacado", "indústria"],
    requiredFields: ["phone"]
  }
}
```

### 3.6 Score de confiabilidade do lead

Calcule por fonte e por campo.

```txt
Google Places telefone: 0.90
Receita endereço/CNPJ/CNAE: 0.85
OSM telefone/site: 0.45
SERP site oficial: 0.65
Website oficial extraído: 0.80
Usuário confirmou: 1.00
```

Exemplo:

```json
{
  "phone": { "value": "(14) 3402-2200", "source": "google_places", "confidence": 0.9 },
  "cnae": { "value": "4781-4/00", "source": "receita_federal", "confidence": 0.85 },
  "website": { "value": null, "source": null, "confidence": 0 }
}
```

### 3.7 Score de completude dos dados

```txt
completude =
  nome 15
+ endereço 15
+ cidade/UF 10
+ telefone 20
+ site 10
+ CNPJ 15
+ CNAE 10
+ horário/status 5
```

### 3.8 Score de proximidade geográfica

```txt
1.0 = ponto dentro do polígono/cidade
0.8 = dentro do bounding box e UF correta
0.5 = cidade vizinha até 10 km
0.0 = fora da cidade/UF
```

MVP sem polígono:

```txt
se address.city normalizado == city_input && state == uf_input => 1.0
senão se distância até centroide <= raio_por_tamanho_da_cidade => 0.8
senão se UF igual e distância <= 25 km => 0.4
senão rejeitar
```

### 3.9 Score de aderência ao segmento

```txt
categoria Google bate segmento: +40%
CNAE bate segmento: +30%
nome/descrição contém termo positivo: +15%
OSM tag bate segmento: +10%
site oficial confirma segmento: +5%
termo negativo encontrado: rejeitar ou -40%
```

### 3.10 Remoção de duplicados

Ordem de dedupe:

```txt
1. CNPJ igual => mesma empresa/estabelecimento
2. Google place_id igual => mesmo local
3. OSM id igual => mesmo local
4. telefone normalizado igual + cidade igual => provável duplicado
5. domínio igual + nome parecido => provável duplicado
6. nome parecido >= 0.90 + distância <= 100m => provável duplicado
7. nome parecido >= 0.85 + rua/número igual => provável duplicado
```

Implementação:

```txt
criar candidatos de match
calcular confidence
se confidence >= 0.92: merge automático
se 0.75 a 0.91: marcar como possible_duplicate
se < 0.75: manter separado
```

### 3.11 Fusão de dados de múltiplas fontes

Regra de precedência:

```txt
identidade:
  CNPJ > Google place_id > telefone+endereço > nome+geolocalização

nome:
  Google displayName se houver; Receita legal_name como razão social; OSM como fallback

endereço:
  Google/Geocoding para exibição; Receita para confirmação cadastral; OSM como fallback

telefone:
  Google/website oficial > Receita/OSM > SERP

segmento:
  CNAE + Google category + OSM tag + website text

status:
  Google business status + Receita situação cadastral + validação do site
```

### 3.12 Detecção de empresa inválida, fechada ou irrelevante

```txt
se Receita situação != ativa => penalizar forte ou ocultar por padrão
se Google business_status = CLOSED_PERMANENTLY => rejeitar
se nome contém "em breve", "sem nome", "teste", "residencial" => penalizar
se endereço não tem cidade/UF alvo => rejeitar
se telefone ausente e site ausente => score máximo limitado a 55
se segment_match < 0.45 => ocultar por padrão
```

### 3.13 Reordenação dos resultados

```txt
1. Leads com telefone validado e segmento forte
2. Leads com telefone + site
3. Leads com CNAE confirmado
4. Leads só com fonte local, mas sem contato
5. Leads incertos ou incompletos
```

### 3.14 Cache inteligente

```txt
search_cache_key =
  city_ibge_code + canonical_segment_id + intent_id + expansion_level + filters_hash
```

TTL recomendado:

```txt
Google Places Search: 7 a 30 dias, respeitando termos
Place Details: revalidar sob demanda
CNPJ: até próxima atualização mensal/import
OSM: 30 a 90 dias
SERP/site: 7 a 30 dias
```

### 3.15 Fallback quando não retorna nada

```txt
1. Verificar cidade resolvida
2. Verificar segmento resolvido
3. Buscar termo canônico
4. Buscar aliases próximos
5. Buscar tipos/categorias
6. Buscar CNAEs locais se existir base CNPJ
7. Buscar SERP/site
8. Buscar amplo e classificar
9. Só então usar IA para sugerir nova expansão
```

---

## 4. Arquitetura recomendada

Arquitetura realista para solo founder/MVP:

```txt
Frontend
React 19 + Vite + TypeScript + Tailwind
↓
Backend API
Node.js + Fastify ou NestJS
↓
Postgres
Supabase, Neon ou Render Postgres
↓
Queue
pg-boss inicialmente; BullMQ + Redis se crescer
↓
External Sources
Google Places / Geocoding
Receita/CNPJ provider
OSM/Nominatim/Overpass
SERP provider opcional
Gemini/OpenAI para classificação
↓
Observabilidade
Sentry + logs estruturados + tabela search_runs/source_calls
```

### Frontend

Mantenha React, Vite, TypeScript e Tailwind.

Mudanças:

```txt
- Remover chamadas diretas para APIs externas.
- App.tsx não deve orquestrar busca externa.
- Criar client HTTP: /api/searches, /api/leads, /api/lists, /api/deals.
- Mostrar estados: buscando, enriquecendo, parcial, erro de fonte, cacheado.
- Adicionar filtros profissionais.
- Adicionar score e motivo do match nos cards.
```

Componentes novos:

```txt
SearchForm
SearchProgress
LeadQualityBadge
LeadSourceBadge
LeadScoreBreakdown
SearchFeedbackButtons
CompanyDetailsDrawer
ExportModal
```

### Backend

Use Fastify se quiser velocidade e simplicidade. Use NestJS se quiser estrutura mais opinativa. Para solo founder, Fastify + Zod + Prisma é suficiente.

Módulos:

```txt
auth
workspaces
searches
sources
companies
leads
lists
contacts
pipelines
deals
exports
usage
enrichment
feedback
```

Serviços centrais:

```ts
LocationResolver
SegmentResolver
SearchOrchestrator
GooglePlacesAdapter
OpenStreetMapAdapter
CnpjAdapter
SerpAdapter
CompanyNormalizer
CompanyDeduper
LeadRanker
EnrichmentScheduler
UsageLimiter
ExportService
```

### Banco de dados

Use Postgres.

Extensões úteis:

```sql
pg_trgm
postgis
uuid-ossp
```

Se PostGIS for exagero no primeiro deploy, comece com `lat`, `lng`, `geohash` e cálculo de distância no backend.

### Filas/jobs assíncronos

Comece com `pg-boss`. Evita Redis no início.

Jobs:

```txt
enrich_company_cnpj
enrich_company_website
validate_phone
validate_website
refresh_google_place
dedupe_company_cluster
generate_export
recalculate_lead_score
```

Quando escalar, migre para BullMQ + Redis.

### Cache

```txt
1. DB cache: search_results e company_sources
2. Redis/Upstash: autocomplete, cidade, segmento e buscas recentes
3. In-memory LRU no backend: taxonomia e CNAE maps
```

### Logs

Registre por fonte:

```json
{
  "search_id": "...",
  "source": "google_places",
  "query": "loja de roupas em Marília SP",
  "latency_ms": 842,
  "status": "success",
  "results_count": 20,
  "credits_used": 3,
  "error_code": null
}
```

### Monitoramento

Métricas obrigatórias:

```txt
zero_result_rate
avg_results_per_search
useful_lead_rate
duplicate_rate
outside_city_rate
no_phone_rate
source_error_rate
cost_per_search
p95_search_latency
export_count
save_rate
```

### Créditos/limites

Cada chamada externa vira `usage_event`.

```txt
search_base = 1 crédito
google_places_search = 2 créditos
place_details = 1 crédito por lote/empresa
cnpj_enrichment = 1 crédito
serp_enrichment = 3 créditos
ai_classification = 1 crédito
export = 2 créditos
```

### Autenticação real

Opções práticas:

```txt
Supabase Auth: rápido, integrado ao Postgres.
Clerk: melhor UX, mais SaaS, custo maior.
Auth.js: flexível, mais trabalho.
```

Decisão MVP: Supabase Auth se a prioridade for velocidade. Clerk se a prioridade for UX pronta para organizações.

### Workspace/usuários

```txt
user pertence a workspace
workspace tem plano, créditos, listas, pipeline, buscas e leads
usuário tem role: owner, admin, member
```

### Histórico de buscas

Guardar:

```txt
input original
cidade resolvida
segmento resolvido
intenção
fontes usadas
expansões
quantidade solicitada
quantidade encontrada
tempo
custo
snapshot dos resultados
feedback
```

### Exportação real

```txt
POST /exports
cria job
gera CSV/XLSX no backend
salva arquivo temporário
retorna signed URL
registra usage_event
```

### Enriquecimento gradual

```txt
T0: mostrar leads básicos ranqueados
T+5s: enriquecer telefone/site/CNPJ nos top 10
T+30s: enriquecer demais resultados em background
T+1 dia: refresh de leads salvos
```

---

## 5. Pipeline ideal de busca de leads

Exemplo: usuário digita “Alimentação / Food Service em Marília - SP”.

```txt
1. Entrada do usuário
raw_location = "Marília - SP"
raw_segment = "Alimentação / Food Service"
intent = opcional
quantity = 20
```

```txt
2. Resolução da cidade
- normalizar "Marília - SP"
- resolver para cidade IBGE
- obter UF, país, centroide, bbox
- opcional: polígono do município
- salvar city_resolution_confidence
```

```txt
3. Resolução do segmento
- normalizar texto
- match em aliases
- canonical_segment = food_service
- carregar Google types, OSM tags, CNAEs, positiveTerms, negativeTerms
```

```txt
4. Expansão de termos
expansion_level_0:
- "restaurante em Marília SP"
- "lanchonete em Marília SP"
- "padaria em Marília SP"

expansion_level_1:
- "marmitaria em Marília SP"
- "delivery de comida em Marília SP"
- "buffet em Marília SP"
- "bar em Marília SP"
```

```txt
5. Consulta em múltiplas fontes
Fonte A: Google Places Text Search / Nearby Search
Fonte B: CNPJ/CNAE por município e códigos compatíveis
Fonte C: OSM/Overpass por bbox + tags
Fonte D: SERP/site apenas para enriquecer top resultados
Fonte E: IA apenas para classificar ambiguidade ou resumir
```

```txt
6. Normalização dos dados
CompanyCandidate:
- name
- legal_name
- cnpj
- address
- city
- state
- lat/lng
- phone
- website
- categories
- cnae
- source_ids
- raw_source_payload
```

```txt
7. Deduplicação
- agrupar por CNPJ
- agrupar por place_id
- agrupar por telefone
- agrupar por domínio
- fuzzy nome + distância
- criar company canônica
```

```txt
8. Enriquecimento
Top N primeiro:
- Place Details
- consulta CNPJ
- validação de telefone
- validação de site
- extração controlada da página de contato
```

```txt
9. Pontuação
- segment_match_score
- location_score
- contactability_score
- source_confidence_score
- completeness_score
- recency_score
- penalties
```

```txt
10. Ordenação
- remover fechados/fora da cidade
- ordenar por score desc
- desempatar por telefone, site, fonte confiável, distância
```

```txt
11. Exibição
Card mostra:
- nome
- segmento detectado
- telefone
- WhatsApp provável
- site
- endereço
- score
- motivo do match
- fonte
- última verificação
```

```txt
12. Salvar/exportar
- salvar como lead em lista
- criar contato
- criar deal opcional
- exportar CSV/XLSX
- registrar usage_event
```

```txt
13. Feedback
Usuário marca:
- útil
- duplicado
- fora da cidade
- não é do segmento
- sem contato útil
```

---

## 6. Como melhorar a assertividade

| Falha | Correção direta |
|---|---|
| Resultado zero quando existem empresas | Implementar busca em níveis: canônico → aliases → tipos Google/OSM → CNAE local → SERP → expansão ampla classificada. Não parar em uma fonte. |
| Segmento muito restrito | Criar `expansion_level`. Exemplo: “moda feminina” expande para “loja de roupas”, “boutique”, “vestuário”, mantendo score maior para moda feminina. |
| Segmento muito amplo | Pedir filtro interno por intenção, CNAE, tipo e termos negativos. Exemplo: “alimentação” não deve misturar restaurante, indústria, atacado e mercado sem reclassificar. |
| Empresas repetidas | Dedupe com CNPJ, place_id, telefone, domínio, geohash, nome normalizado e distância. |
| Empresas fora da cidade | Usar city_id/código IBGE, UF, bbox/polígono e reverse geocoding. Rejeitar UF divergente. |
| Empresas que não são do segmento | Classificador determinístico por categoria, CNAE, nome, website e termos negativos. IA só como apoio. |
| Empresas sem telefone | Place Details nos top resultados, consulta CNPJ, website oficial e SERP. Se continuar sem telefone, limitar score máximo a 55. |
| Dados desatualizados | Guardar `last_verified_at`, TTL por fonte e refresh automático de leads salvos. |
| Resultados ruins de OpenStreetMap | Reduzir peso da fonte OSM, usar só como complemento e exigir telefone/site/categoria forte para subir no ranking. |
| Respostas inconsistentes de IA | Usar JSON Schema, validação Zod, temperatura baixa, enum fechado, saída com `unknown`, e rejeição de empresas não presentes em fontes verificadas. |
| Busca dependente demais de prompt | Criar taxonomia e pipeline de busca. Prompt só classifica, resume ou sugere expansão. |
| Grandes redes dominando resultados locais | Adicionar filtro “excluir redes/franquias” e penalizar nomes em lista de chains. |
| Lead visualmente fraco no card | Mostrar score, fonte, telefone, status, aderência e motivo. |
| Usuário não sabe por que recebeu aquele resultado | Adicionar “Por que apareceu?” com breakdown: segmento, localização, fonte, contato, CNAE. |
| Dados legais/pessoais mal tratados | Guardar base legal, fonte, data de coleta, opt-out e nunca vender/mostrar dados pessoais sensíveis. |

---

## 7. Roadmap técnico em 3 fases

### Fase 1: Correções críticas do buscador

| O que implementar | Por que implementar | Complexidade | Impacto |
|---|---|---:|---:|
| Backend `/api/searches` | Tirar busca do frontend e proteger chaves. | Média | Muito alto |
| Google Places Text Search + Place Details | Melhorar cobertura comercial imediatamente. | Média | Muito alto |
| LocationResolver com cidade/UF/código IBGE/bbox | Evitar lead fora da cidade. | Média | Alto |
| SegmentResolver backend com taxonomia versionada | Evitar busca por texto solto. | Média | Alto |
| Dedupe v1 | Remover repetidos entre fontes. | Média | Alto |
| LeadRanker v1 | Ordenar por utilidade, não por ordem da API. | Baixa/Média | Muito alto |
| Score e motivo no card | Aumentar confiança do usuário. | Baixa | Alto |
| Export CSV real | Produto B2B precisa entregar lista usável. | Baixa/Média | Alto |
| Usage events | Controlar custo por busca. | Baixa | Alto |
| Feedback “não é segmento/duplicado/fora da cidade” | Gerar aprendizado prático desde o MVP. | Baixa | Médio/Alto |

### Fase 2: Backend e dados profissionais

| O que implementar | Por que implementar | Complexidade | Impacto |
|---|---|---:|---:|
| Auth real + workspaces | Produto SaaS real. | Média | Alto |
| Postgres com companies/leads/searches | Persistência confiável e multiusuário. | Média | Muito alto |
| Listas salvas no banco | Tirar dependência de localStorage. | Baixa/Média | Alto |
| Contatos e deals no banco | CRM deixa de ser simulado. | Média | Alto |
| Import/consulta CNPJ | Validar status, razão social, CNAE e endereço. | Média/Alta | Muito alto |
| Mapa segmento → CNAE | Aumentar precisão setorial. | Média | Alto |
| Jobs assíncronos de enriquecimento | Melhorar dados sem travar busca. | Média | Alto |
| Cache por busca/fonte | Reduzir custo e latência. | Média | Alto |
| Logs e monitoramento | Descobrir onde a busca falha. | Baixa/Média | Alto |
| Export XLSX com colunas configuráveis | Valor comercial claro. | Média | Médio/Alto |

### Fase 3: Inteligência, ranking e enriquecimento

| O que implementar | Por que implementar | Complexidade | Impacto |
|---|---|---:|---:|
| Score 0–100 com breakdown | Priorizar leads úteis. | Média | Muito alto |
| Fusão multi-fonte por campo | Aumentar confiabilidade. | Alta | Muito alto |
| Enriquecimento de website | Capturar telefone, e-mail genérico e descrição. | Média/Alta | Alto |
| Classificador IA com JSON Schema | Resolver ambiguidades sem alucinar. | Média | Alto |
| Reordenação por intenção comercial | Adaptar busca ao que o usuário vende. | Média | Alto |
| Feedback loop no ranking | Melhorar com uso real. | Média | Alto |
| Detecção de redes/franquias | Melhorar foco em PME local. | Média | Médio |
| Refresh automático de leads salvos | Evitar dados velhos. | Média | Alto |
| Integrações CRM externas | HubSpot/Pipedrive etc. | Alta | Depois |
| Enriquecimento de pessoas decisoras | Aumentar valor, mas exige mais compliance. | Alta | Depois |

---

## 8. Modelo de dados recomendado

Use Postgres. Campos `jsonb` são úteis, mas não substituem colunas indexáveis.

### users

```sql
id uuid pk
email text unique not null
name text
avatar_url text
auth_provider text
auth_provider_id text
status text -- active, invited, disabled
last_login_at timestamptz
created_at timestamptz
updated_at timestamptz
```

### workspaces

```sql
id uuid pk
name text not null
owner_user_id uuid fk users
plan text -- free, starter, pro, agency
billing_status text
monthly_credit_limit int
monthly_credit_used int
settings jsonb
created_at timestamptz
updated_at timestamptz
```

### workspace_members

```sql
id uuid pk
workspace_id uuid fk
user_id uuid fk
role text -- owner, admin, member
created_at timestamptz
unique(workspace_id, user_id)
```

### searches

```sql
id uuid pk
workspace_id uuid fk
user_id uuid fk
raw_location text
city_name text
state_code text
country_code text default 'BR'
city_ibge_code text
lat double precision
lng double precision
bbox jsonb
raw_segment text
canonical_segment_id text
intent_id text
quantity_requested int
filters jsonb
query_expansions jsonb
sources_requested text[]
sources_used text[]
status text -- queued, running, partial, completed, failed
total_candidates int
total_companies int
total_leads_shown int
zero_result boolean
cost_credits int
started_at timestamptz
finished_at timestamptz
created_at timestamptz
```

### companies

```sql
id uuid pk
canonical_name text not null
trade_name text
legal_name text
cnpj text
cnpj_root text
status text -- active, inactive, closed, unknown
status_reason text
main_cnae_code text
main_cnae_description text
secondary_cnaes jsonb
company_size text -- mei, me, epp, demais, unknown
address_street text
address_number text
address_complement text
district text
city_name text
state_code text
postal_code text
country_code text default 'BR'
lat double precision
lng double precision
geohash text
primary_phone text
primary_phone_normalized text
whatsapp_likely boolean
email text
website_url text
domain text
opening_hours text
rating numeric
review_count int
is_chain boolean default false
data_completeness_score numeric
source_confidence_score numeric
last_verified_at timestamptz
created_at timestamptz
updated_at timestamptz
```

Índices recomendados:

```sql
unique(cnpj) where cnpj is not null
index(domain)
index(primary_phone_normalized)
index(city_ibge_code, main_cnae_code)
gist/trgm(canonical_name)
geo index se usar PostGIS
```

### company_sources

```sql
id uuid pk
company_id uuid fk
source_type text -- google_places, receita, osm, serp, website, user
source_external_id text -- place_id, osm_id, cnpj, url
source_url text
license_label text
attribution_required boolean
raw_payload jsonb
field_values jsonb
field_confidence jsonb
fetched_at timestamptz
expires_at timestamptz
created_at timestamptz
unique(source_type, source_external_id)
```

### leads

```sql
id uuid pk
workspace_id uuid fk
company_id uuid fk
search_id uuid fk nullable
owner_user_id uuid fk nullable
status text -- new, saved, contacted, qualified, rejected
score int
score_breakdown jsonb
segment_match_score numeric
location_score numeric
contactability_score numeric
source_confidence_score numeric
completeness_score numeric
rejection_reason text
notes text
first_seen_at timestamptz
last_seen_at timestamptz
last_contacted_at timestamptz
created_at timestamptz
updated_at timestamptz
unique(workspace_id, company_id)
```

### saved_lists

```sql
id uuid pk
workspace_id uuid fk
name text not null
description text
created_by_user_id uuid fk
source_search_id uuid fk nullable
filters_snapshot jsonb
created_at timestamptz
updated_at timestamptz
```

### saved_list_items

```sql
id uuid pk
saved_list_id uuid fk
lead_id uuid fk
company_id uuid fk
added_by_user_id uuid fk
created_at timestamptz
unique(saved_list_id, lead_id)
```

### contacts

```sql
id uuid pk
workspace_id uuid fk
company_id uuid fk nullable
lead_id uuid fk nullable
name text
title text
department text
email text
email_status text -- unknown, valid, invalid, risky
phone text
phone_normalized text
whatsapp text
linkedin_url text
source_type text
confidence numeric
legal_basis text -- legitimate_interest, consent, public_data, customer_provided
opt_out boolean default false
last_verified_at timestamptz
created_at timestamptz
updated_at timestamptz
```

### deals

```sql
id uuid pk
workspace_id uuid fk
lead_id uuid fk nullable
company_id uuid fk
pipeline_id uuid fk
stage_id uuid fk
title text
value numeric
currency text default 'BRL'
probability int
status text -- open, won, lost, archived
owner_user_id uuid fk
expected_close_date date
lost_reason text
notes text
custom_fields jsonb
created_at timestamptz
updated_at timestamptz
```

### pipelines

```sql
id uuid pk
workspace_id uuid fk
name text
is_default boolean
created_at timestamptz
updated_at timestamptz
```

### pipeline_stages

```sql
id uuid pk
pipeline_id uuid fk
name text
position int
probability int
color text
created_at timestamptz
updated_at timestamptz
```

### enrichment_jobs

```sql
id uuid pk
workspace_id uuid fk
company_id uuid fk nullable
lead_id uuid fk nullable
search_id uuid fk nullable
job_type text -- cnpj, place_details, website, phone_validation, score_refresh
status text -- queued, running, succeeded, failed, cancelled
priority int
attempts int
max_attempts int default 3
input jsonb
output jsonb
error_code text
error_message text
run_after timestamptz
started_at timestamptz
finished_at timestamptz
created_at timestamptz
```

### usage_events

```sql
id uuid pk
workspace_id uuid fk
user_id uuid fk nullable
event_type text -- search, source_call, export, enrichment, ai_classification
source_type text
search_id uuid fk nullable
company_id uuid fk nullable
units int
credits int
cost_estimate_usd numeric
metadata jsonb
created_at timestamptz
```

### search_feedback

```sql
id uuid pk
workspace_id uuid fk
search_id uuid fk
lead_id uuid fk nullable
company_id uuid fk nullable
user_id uuid fk
feedback_type text -- useful, duplicate, not_segment, outside_city, bad_phone, outdated, irrelevant
rating int -- -1, 0, 1 or 1-5
comment text
metadata jsonb
created_at timestamptz
```

---

## 9. Algoritmo de ranking

Score final de 0 a 100:

```txt
score =
  25 * segment_match
+ 12 * location_match
+ 10 * phone_available
+  5 * whatsapp_likely
+  6 * website_available
+ 12 * cnae_match
+  8 * data_completeness
+  8 * source_reliability
+  5 * data_recency
+  5 * uniqueness
+  4 * name_address_quality
- penalties
```

Todos os componentes variam de 0 a 1.

### Componentes

| Componente | Regra |
|---|---|
| segment_match | 1.0 categoria/CNAE/termo forte; 0.7 alias próximo; 0.4 amplo; 0.0 fora do segmento. |
| location_match | 1.0 dentro da cidade; 0.8 bbox/UF correta; 0.4 cidade vizinha; 0.0 fora. |
| phone_available | 1.0 telefone válido; 0.7 telefone com formato incerto; 0.0 ausente. |
| whatsapp_likely | 1.0 celular BR provável; 0.5 telefone móvel incerto; 0.0 fixo/ausente. |
| website_available | 1.0 site válido; 0.5 rede social; 0.0 ausente. |
| cnae_match | 1.0 CNAE forte; 0.75 CNAE secundário; 0.5 CNAE amplo; 0.0 negativo/desconhecido. |
| data_completeness | Campos preenchidos ponderados por importância. |
| source_reliability | Média ponderada das fontes usadas por campo. |
| data_recency | 1.0 verificado <30 dias; 0.7 <90; 0.4 <180; 0.2 desconhecido. |
| uniqueness | 1.0 único; 0.5 possível duplicado; 0.0 duplicado confirmado. |
| name_address_quality | 1.0 nome específico + endereço completo; 0.5 nome genérico/endereço parcial; 0.0 ruim. |

### Penalidades duras

```txt
closed_permanently = -40
receita_inativa = -30
outside_city = -30
high_duplicate_confidence = -25
negative_segment_term = -20
no_phone_and_no_site = -15
generic_name = -8
```

Depois:

```txt
score = clamp(round(score), 0, 100)
```

### Exemplo

Lead: “Restaurante Bom Prato”, Marília - SP.

```txt
segment_match = 1.0
location_match = 1.0
phone_available = 1.0
whatsapp_likely = 1.0
website_available = 0.0
cnae_match = 1.0
data_completeness = 0.8
source_reliability = 0.9
data_recency = 1.0
uniqueness = 1.0
name_address_quality = 1.0
penalties = 0
```

Cálculo:

```txt
25 + 12 + 10 + 5 + 0 + 12 + 6.4 + 7.2 + 5 + 5 + 4 = 91.6
score = 92
```

Card:

```txt
Score 92
Motivos:
- Segmento confirmado por categoria e CNAE
- Dentro de Marília - SP
- Telefone disponível
- WhatsApp provável
- Dados verificados há menos de 30 dias
```

---

## 10. Prompt e uso de IA dentro do app

IA deve ser camada auxiliar controlada por schema, não fonte primária.

### Onde IA ajuda

```txt
- Normalizar segmento livre para segmento canônico.
- Sugerir aliases de busca.
- Classificar se uma empresa pertence ao segmento.
- Resumir “por que este lead é relevante”.
- Extrair telefone/e-mail genérico de texto de site já coletado.
- Classificar intenção comercial.
- Identificar termos negativos.
- Gerar mensagem de abordagem personalizada.
```

### Onde IA não deve ser fonte primária

```txt
- Inventar lista de empresas.
- Criar telefone, e-mail, site ou CNPJ.
- Confirmar se uma empresa está aberta sem fonte.
- Decidir localização sem geocoding.
- Deduplicar sozinha.
- Fazer ranking sem dados estruturados.
```

### Prompt estruturado para classificação

Entrada:

```json
{
  "task": "classify_company_segment_fit",
  "target_segment": {
    "id": "food_service",
    "label": "Alimentação / Food Service",
    "positive_terms": ["restaurante", "lanchonete", "padaria", "marmitaria", "delivery", "buffet"],
    "negative_terms": ["supermercado", "indústria", "atacado", "agropecuária"],
    "cnae_codes": ["5611-2/01", "5611-2/03", "5620-1/02"]
  },
  "company": {
    "name": "Bom Prato Restaurante",
    "categories": ["restaurant"],
    "cnae": "5611-2/01",
    "address": "Marília - SP",
    "website_text": "Restaurante self-service e marmitas para entrega."
  }
}
```

Saída esperada:

```json
{
  "segment_fit": "strong",
  "confidence": 0.94,
  "positive_evidence": [
    "categoria restaurant",
    "CNAE compatível",
    "texto do site menciona restaurante e marmitas"
  ],
  "negative_evidence": [],
  "recommended_action": "keep",
  "notes": "Lead aderente ao segmento Alimentação / Food Service."
}
```

### JSON confiável

No backend TypeScript:

```ts
const schema = z.object({
  segment_fit: z.enum(["strong", "medium", "weak", "no_match", "unknown"]),
  confidence: z.number().min(0).max(1),
  positive_evidence: z.array(z.string()).max(5),
  negative_evidence: z.array(z.string()).max(5),
  recommended_action: z.enum(["keep", "penalize", "reject", "review"]),
  notes: z.string().max(500)
});
```

Regras:

```txt
- response_mime_type = application/json
- response_schema obrigatório
- temperature = 0 ou baixo
- enums fechados
- permitir unknown
- validar com Zod
- se falhar schema, retry uma vez
- se falhar de novo, marcar ai_status = invalid
```

### Validação da resposta da IA

```txt
se IA disser "strong", mas cnae é negativo => não aceitar automaticamente
se IA citar evidência que não existe no input => rejeitar
se IA retornar campo fora do enum => rejeitar
se confidence > 0.95 sem evidência forte => reduzir confiança
se recommended_action = keep e location_score = 0 => rejeitar
```

### Como evitar alucinações

```txt
- Não pedir “liste empresas”.
- Fornecer somente dados coletados.
- Exigir evidências extraídas do input.
- Não aceitar campos novos não presentes nas fontes.
- Guardar raw_input e raw_output para auditoria.
- Usar IA como feature de classificação, não como database.
```

---

## 11. Benchmark conceitual

Ferramentas profissionais de prospecção não vendem apenas “busca”. Elas vendem dados confiáveis, filtros, enriquecimento, priorização, automação e integração com CRM.

### Recursos padrão de mercado

```txt
- Busca por empresa e contato
- Filtros por localização, setor, tamanho, cargo, tecnologia, intenção
- Enriquecimento de empresa
- Enriquecimento de pessoas
- Validação de e-mail/telefone
- Score de lead/account
- Exportação CSV/XLSX
- Integração CRM
- Histórico e listas
- Automação de abordagem
- Sinais de intenção
- Atualização periódica dos dados
- Auditoria de fonte e confiança
```

### Onde o Bloom Leads pode competir primeiro

```txt
- Prospecção local brasileira por cidade e segmento
- CNAE como camada nativa
- CNPJ/Receita como validação cadastral
- Foco em PMEs locais
- Busca simples em português
- Leads com WhatsApp provável
- Fluxo direto: buscar → salvar → contatar → Kanban
```

### Diferenciais possíveis

```txt
- “Por que este lead apareceu?”
- Score transparente por lead
- Segmentos brasileiros com aliases reais
- Busca por intenção comercial: “quero vender embalagens para food service”
- Filtro por empresas ativas na Receita
- Excluir redes/franquias
- CRM leve embutido
- Enriquecimento gradual com custo controlado
```

### O que não tentar copiar agora

```txt
- Base própria nacional completa de contatos pessoais
- Intent data complexo de navegação web
- Sequências de e-mail multicanal
- Chrome extension
- Integração profunda com LinkedIn
- Enriquecimento internacional
```

---

## 12. Lista final de decisões técnicas

### Mantenha

```txt
React 19 + Vite + TypeScript + Tailwind
Autocomplete de cidade
Autocomplete de segmento
Catálogo de segmentos e aliases
Cards e lista
Salvamento em listas
Contatos
Pipeline Kanban
Links para WhatsApp e Google Maps
OpenStreetMap como fonte auxiliar
IA como fallback/classificador
```

### Mude

```txt
Busca externa sai do frontend e vai para backend
localStorage deixa de ser fonte de verdade
Gemini deixa de gerar lista de leads
OSM deixa de ser fonte principal
Segmento vira taxonomia versionada
Cidade vira entidade resolvida com IBGE/UF/geo
Deduplicação passa a usar IDs, telefone, domínio e geolocalização
Ranking deixa de ser heurística oculta e vira score 0–100
Cards passam a mostrar fonte, confiança, score e motivo
Exportação passa a gerar arquivo real
```

### Remova

```txt
Login mock em produção
Plano/pricing mock em produção
Export falso
Dependência de prompt para achar empresas
Chaves de API no frontend
Parse frágil de JSON livre de IA como fonte de leads
Uso de localStorage para dados comerciais reais
Exibição de lead sem fonte/proveniência
```

### Implemente agora

```txt
Backend API
Postgres
Auth real
Workspace
Google Places Text Search
Google Place Details
LocationResolver
SegmentResolver
SearchOrchestrator
CompanyNormalizer
CompanyDeduper
LeadRanker
Score 0–100
company_sources com raw_payload/proveniência
usage_events
Export CSV real
Feedback de busca
Filtros: com telefone, com site, ativo, fonte, score mínimo
CNPJ/CNAE para validação brasileira
```

### Deixe para depois

```txt
SERP API como fonte principal
Busca web ampla com IA
Enriquecimento de pessoas decisoras
Sequências automáticas de e-mail
Integração HubSpot/Pipedrive
Chrome extension
Intent data avançado
Mapa interativo complexo
Machine learning treinado
Base CNPJ completa própria em infraestrutura pesada
Internacionalização de dados
Automação multicanal
```

---

## Decisão central

O Bloom Leads deve virar um motor de busca determinístico com múltiplas fontes, taxonomia própria, deduplicação, enriquecimento e ranking.

IA deve operar como camada auxiliar controlada por schema.

A confiabilidade do produto virá menos do layout e mais de três coisas:

1. fonte rastreável;
2. score explicável;
3. dados úteis para contato.
