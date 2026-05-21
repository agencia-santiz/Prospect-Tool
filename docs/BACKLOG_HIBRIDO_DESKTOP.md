# Backlog Executavel - Trilha Hibrida Desktop

Este documento descreve a migracao do Bloom Leads para um modelo hibrido:

- o app principal vira um executavel desktop
- o backend continua existindo e pode rodar junto do app
- o core do produto funciona offline quando possivel
- a sincronizacao com backend remoto entra como camada complementar

Leituras base:

- [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)
- [ROADMAP_TECNICO.md](./ROADMAP_TECNICO.md)
- [BACKLOG_EXECUTAVEL.md](./BACKLOG_EXECUTAVEL.md)
- [README.md](../README.md)

## Como usar este backlog

- `P0` = bloqueia o inicio da trilha ou impede a abertura segura do app desktop
- `P1` = necessario para manter o fluxo principal confiavel
- `P2` = importante, mas pode entrar depois da fundacao estabilizar
- `P3` = melhoria complementar

## Principios da trilha

- Nao reescrever a UI do zero.
- Nao mudar o fluxo principal de prospeccao enquanto a base desktop estiver sendo criada.
- Manter o renderer focado em experiencia e o backend focado em dados, integracoes e segredos.
- Trocar `localStorage` por persistencia local de verdade antes de depender de sync remoto.
- Tratar sincronizacao como extensao do modo local, nao como pre-requisito para abrir o app.

## Escopo desta trilha

### Mantem

- React, Vite e TypeScript no frontend.
- Busca por cidade e segmento.
- Listas, contatos, pipeline e deals.
- Exportacao CSV real.
- Backend Node para busca, integracoes e seguranca.

### Muda

- Distribuicao por executavel desktop.
- Inicializacao local do backend quando o app abrir.
- Persistencia local confiavel para o core do produto.
- Sincronizacao opcional com backend remoto.
- Instalacao e atualizacao do app como software desktop.

## Ordem de execucao sugerida

1. Definir a arquitetura desktop e o runtime inicial.
2. Separar fronteiras entre renderer, backend e persistencia local.
3. Criar o shell desktop e o bootstrap do backend local.
4. Migrar o estado de negocio para armazenamento local robusto.
5. Definir e implementar a camada de sincronizacao.
6. Fechar instalacao, update, logs e validacao de release.

## Fase 0 - Fundacao e decisao tecnica

### Plano de implementacao da Fase 0

Ordem exata recomendada:

1. Registrar a decisao de runtime desktop e o criterio de aceite desta trilha.
2. Criar os scripts de dev, build e execucao para ambiente desktop.
3. Criar o shell desktop e o preload seguro.
4. Garantir que o backend local possa subir, cair e reiniciar de forma previsivel.
5. Conectar o renderer ao backend local sem expor segredos.
6. Introduzir a camada de armazenamento local que vai substituir o `localStorage` estrutural.
7. Adicionar smoke tests e validar o fluxo minimo de abertura.

### Arquivos da Fase 0

Arquivos a criar:

- `desktop/main.js`
- `desktop/preload.js`
- `tests/desktopBootstrap.test.mjs`

Arquivos a atualizar:

- `package.json`
- `README.md`
- `server/index.js`
- `server/app.js`
- `server/config.js`
- `server/env.js`
- `server/http.js`
- `server/logger.js`
- `src/main.tsx`
- `src/contexts/AuthContext.tsx`
- `src/utils/backendUrl.js`
- `src/utils/workspaceDataStore.js`
- `tests/run.mjs`

Arquivos a manter intocados nesta fase:

- `src/App.tsx`
- `src/components/*`
- `server/routes/*` exceto se um detalhe tecnico de bootstrap exigir ajuste minimo

### Passo a passo da Fase 0

#### 0.1 - Fechar a decisao de runtime desktop

- Arquivos: `docs/BACKLOG_HIBRIDO_DESKTOP.md`, `docs/DECISION_LOG.md`
- Objetivo: registrar a tecnologia desktop inicial e os limites da escolha.
- Saida esperada: decisao explicita sobre como o app sera empacotado e distribuido.
- Nao fazer ainda: trocar UI, persistencia ou fluxo de login.

#### 0.2 - Criar scripts de operacao local e desktop

- Arquivos: `package.json`, `README.md`
- Objetivo: padronizar os comandos para iniciar backend, renderer e desktop.
- Saida esperada: comandos claros para `dev`, `backend`, `desktop:dev` e `desktop:build`.
- Nao fazer ainda: empacotar instalador final.

#### 0.3 - Criar o shell desktop

- Arquivos: `desktop/main.js`, `desktop/preload.js`
- Objetivo: abrir a interface fora do navegador e controlar o ciclo de vida do app.
- Saida esperada: janela principal, carregamento da UI e canal seguro para o renderer.
- Nao fazer ainda: mover logica de negocio para o processo principal.

#### 0.4 - Tornar o backend local controlavel

- Arquivos: `server/index.js`, `server/app.js`, `server/config.js`, `server/env.js`, `server/logger.js`, `server/http.js`
- Objetivo: permitir start, stop, healthcheck e log confiavel quando o desktop subir.
- Saida esperada: backend sobe com porta previsivel, responde health e encerra sem travar.
- Nao fazer ainda: alterar rotas de negocio.

#### 0.5 - Ligar renderer ao backend local

- Arquivos: `src/utils/backendUrl.js`, `src/contexts/AuthContext.tsx`, `src/main.tsx`
- Objetivo: garantir que o renderer saiba conversar com o backend local sem depender do navegador.
- Saida esperada: resolucao de base URL compativel com desktop e ambiente local.
- Nao fazer ainda: alterar o dominio funcional do app.

#### 0.6 - Preparar a migracao da persistencia

- Arquivos: `src/utils/workspaceDataStore.js`, `src/contexts/AuthContext.tsx`
- Objetivo: separar persistencia de negocio da API de armazenamento local usada hoje.
- Saida esperada: contrato pronto para trocar `localStorage` por armazenamento local robusto depois.
- Nao fazer ainda: migrar os dados em massa nesta fase.

#### 0.7 - Adicionar smoke tests da fundacao

- Arquivos: `tests/desktopBootstrap.test.mjs`, `tests/backendUrl.test.mjs`, `tests/workspaceDataStore.test.mjs`, `tests/run.mjs`
- Objetivo: validar bootstrap do desktop, URL do backend e persistencia minima.
- Saida esperada: checks reproduziveis para abrir o app e verificar as bases da trilha.
- Nao fazer ainda: testar instalador final ou sync remoto completo.

### HY-00.01 - Confirmar runtime desktop inicial
- Prioridade: `P0`
- Objetivo: consolidar a escolha do runtime desktop inicial para o executavel.
- Dependencias: nenhuma.
- Entregavel: decisao tecnica registrada com justificativa e limites.
- Pronto quando: a equipe sabe qual tecnologia empacota o app e por que ela foi escolhida.

### HY-00.02 - Mapear fronteiras entre renderer, backend e persistencia
- Prioridade: `P0`
- Objetivo: definir o que vive na interface, no backend e no armazenamento local.
- Dependencias: HY-00.01.
- Entregavel: matriz de responsabilidades por dominio e por tipo de dado.
- Pronto quando: fica claro o que sai do frontend e o que permanece local.

### HY-00.03 - Definir modo de operacao local e remoto
- Prioridade: `P0`
- Objetivo: especificar quando o app opera offline, local-first ou sincronizado.
- Dependencias: HY-00.02.
- Entregavel: contrato simples de modos de operacao e estados de conexao.
- Pronto quando: a UX pode mostrar se o usuario esta local, online ou pendente de sync.

### HY-00.04 - Definir estrategia de secrets e configuracao
- Prioridade: `P0`
- Objetivo: evitar segredos no renderer e padronizar bootstrap por ambiente.
- Dependencias: HY-00.02.
- Entregavel: lista de variaveis, fontes de configuracao e regras de carga.
- Pronto quando: nenhuma chave sensivel depende do bundle da interface.

### HY-00.05 - Preparar scripts de dev e build para desktop
- Prioridade: `P1`
- Objetivo: permitir rodar frontend, backend e desktop sem processos manuais fragilizados.
- Dependencias: HY-00.01.
- Entregavel: scripts de desenvolvimento, build e execucao do desktop.
- Pronto quando: a mesma base sobe em modo local, desktop e test.

### HY-00.06 - Definir matriz minima de validacao
- Prioridade: `P1`
- Objetivo: evitar migracao sem criterio de pronto.
- Dependencias: HY-00.03.
- Entregavel: lista de verificacoes para abrir app, autenticar, buscar e persistir dados.
- Pronto quando: existe um checklist reproduzivel para cada entrega da trilha.

## Fase 1 - Shell desktop e bridge local

### HY-01.01 - Criar entrypoint desktop
- Prioridade: `P0`
- Objetivo: empacotar o app como executavel iniciavel fora do navegador.
- Dependencias: HY-00.01, HY-00.05.
- Entregavel: shell desktop que abre o renderer e controla o ciclo de vida do app.
- Pronto quando: o Bloom Leads abre como programa local.

### HY-01.02 - Subir o backend local junto com o app
- Prioridade: `P0`
- Objetivo: fazer o executavel iniciar o backend sem dependencia externa.
- Dependencias: HY-01.01, HY-00.04.
- Entregavel: processo local do backend com healthcheck e encerramento controlado.
- Pronto quando: o app funciona mesmo sem um backend remoto disponivel.

### HY-01.03 - Criar bridge segura entre UI e backend
- Prioridade: `P0`
- Objetivo: centralizar chamadas sensiveis em uma camada controlada.
- Dependencias: HY-01.02.
- Entregavel: interface de IPC ou camada equivalente para busca, exportacao e estado.
- Pronto quando: o renderer nao fala direto com recursos sensiveis.

### HY-01.04 - Separar estado de processo e estado de negocio
- Prioridade: `P1`
- Objetivo: evitar que a interface dependa do ciclo de vida do processo desktop.
- Dependencias: HY-01.03.
- Entregavel: padrao claro para estado temporario, estado local e estado sincronizado.
- Pronto quando: fechar e reabrir o app nao perde o que e persistente.

### HY-01.05 - Adicionar fallback quando o backend local falhar
- Prioridade: `P1`
- Objetivo: mostrar erro util em vez de tela quebrada.
- Dependencias: HY-01.02.
- Entregavel: tratamento de falha de bootstrap e mensagem de recuperacao.
- Pronto quando: o usuario entende o problema e sabe o que fazer.

### HY-01.06 - Validar abertura do app sem navegador
- Prioridade: `P1`
- Objetivo: confirmar que o fluxo desktop substitui a entrega web como entrada principal.
- Dependencias: HY-01.01.
- Entregavel: smoke test de inicializacao do executavel.
- Pronto quando: o app sobe e chega na tela principal de forma previsivel.

## Fase 2 - Persistencia local robusta

### HY-02.01 - Definir armazenamento local principal
- Status: concluido.
- Prioridade: `P0`
- Objetivo: escolher a base local que substitui o papel estrutural do `localStorage`.
- Dependencias: HY-00.02.
- Entregavel: decisao de tecnologia local e esquema inicial.
- Pronto quando: existe uma base confiavel para dados do core.

### HY-02.02 - Migrar listas, contatos, pipeline e deals para armazenamento local
- Status: concluido.
- Prioridade: `P0`
- Objetivo: tirar o dominio comercial do `localStorage`.
- Dependencias: HY-02.01.
- Entregavel: repositorio local para os objetos centrais do produto.
- Pronto quando: reiniciar o app nao apaga o fluxo principal.

### HY-02.03 - Migrar preferencias e configuracoes de interface
- Status: concluido.
- Prioridade: `P1`
- Objetivo: manter tema, idioma, visibilidade e preferencias sem depender do navegador.
- Dependencias: HY-02.01.
- Entregavel: camada de preferencias local integrada ao desktop.
- Pronto quando: a experiencia continua identica apos reinstalar ou trocar de maquina.

### HY-02.04 - Criar ponte de migracao do `localStorage`
- Status: concluido.
- Prioridade: `P0`
- Objetivo: preservar dados existentes dos usuarios atuais.
- Dependencias: HY-02.02.
- Entregavel: rotina de importacao unica com deteccao de conflito.
- Pronto quando: a primeira abertura no desktop reaproveita o maximo possivel dos dados antigos.

### HY-02.05 - Implementar fila local de mutacoes pendentes
- Status: concluido.
- Prioridade: `P1`
- Objetivo: registrar mudancas que ainda nao foram sincronizadas.
- Dependencias: HY-02.02.
- Entregavel: outbox local para create, update e delete.
- Pronto quando: o app guarda alteracoes mesmo sem internet.

### HY-02.06 - Adicionar backup e exportacao local de emergencia
- Prioridade: `P2`
- Objetivo: reduzir risco operacional de perda de dados locais.
- Dependencias: HY-02.02.
- Entregavel: exportacao do banco local e restauracao basica.
- Pronto quando: existe forma simples de recuperar o ambiente do usuario.

## Fase 3 - Sincronizacao e autenticacao

### HY-03.01 - Definir contrato de sync por entidade
- Status: concluido.
- Prioridade: `P0`
- Objetivo: dizer exatamente o que sincroniza e em qual direcao.
- Dependencias: HY-02.02, HY-00.03.
- Entregavel: contrato por entidade e por evento de mudanca.
- Pronto quando: nao existe ambiguidade sobre listas, contatos, deals e workspace.

### HY-03.02 - Amarrar sessao do desktop ao workspace remoto
- Status: concluido.
- Prioridade: `P0`
- Objetivo: manter identidade do usuario ao sincronizar.
- Dependencias: HY-03.01.
- Entregavel: fluxo de login e resolucao de workspace no executavel.
- Pronto quando: o usuario entra e recupera o workspace correto.

### HY-03.03 - Implementar sync de leitura para dados compartilhados
- Status: concluido.
- Prioridade: `P1`
- Objetivo: puxar do backend remoto o que precisa ser comum entre dispositivos.
- Dependencias: HY-03.02.
- Entregavel: sincronizacao de leitura para entidades suportadas.
- Pronto quando: outro computador consegue ver o mesmo contexto comercial.

### HY-03.04 - Implementar sync de escrita via outbox
- Status: concluido.
- Prioridade: `P1`
- Objetivo: enviar alteracoes locais sem travar a UX.
- Dependencias: HY-02.05, HY-03.02.
- Entregavel: envio assincrono com retry.
- Pronto quando: a alteracao feita offline chega ao backend depois.

### HY-03.05 - Definir politica de conflito simples
- Status: concluido.
- Prioridade: `P0`
- Objetivo: evitar perda silenciosa quando a mesma entidade muda em mais de um lugar.
- Dependencias: HY-03.01.
- Entregavel: regra de precedencia e alerta de conflito.
- Pronto quando: conflitos sao previsiveis e auditaveis.

### HY-03.06 - Expor estado de sync na interface
- Status: concluido.
- Prioridade: `P1`
- Objetivo: deixar o usuario consciente do que esta local, pendente ou sincronizado.
- Dependencias: HY-03.03, HY-03.04.
- Entregavel: indicadores de sincronizacao e filas pendentes.
- Pronto quando: o usuario entende o estado do dado sem abrir devtools.

## Fase 4 - Instalacao, update e operacao

### HY-04.01 - Criar instalador para Windows
- Prioridade: `P0`
- Objetivo: distribuir o app como software instalavel.
- Dependencias: HY-01.01, HY-01.06.
- Entregavel: pacote instalavel para Windows.
- Pronto quando: instalar e abrir o app nao exige ambiente de dev.

### HY-04.02 - Definir estrategia de atualizacao
- Prioridade: `P1`
- Objetivo: atualizar o desktop sem quebrar dados locais.
- Dependencias: HY-04.01.
- Entregavel: mecanismo de update ou politica de release manual controlada.
- Pronto quando: existe caminho claro para corrigir bugs e distribuir versao nova.

### HY-04.03 - Adicionar logs locais e diagnostico
- Status: concluido.
- Prioridade: `P1`
- Objetivo: facilitar suporte e investigacao de falhas do executavel.
- Dependencias: HY-01.02.
- Entregavel: logs de bootstrap, sync, erro de rede e falha de armazenamento.
- Pronto quando: um problema real pode ser reproduzido e rastreado.

### HY-04.04 - Criar smoke tests de release
- Status: concluido.
- Prioridade: `P1`
- Objetivo: garantir que a versao empacotada continua abrindo e operando.
- Dependencias: HY-01.06, HY-02.02, HY-03.04.
- Entregavel: bateria minima de verificacoes de abertura, busca, save e sync.
- Pronto quando: a release tem uma validacao objetiva antes de subir.

### HY-04.05 - Documentar modos de uso e recuperacao
- Status: concluido.
- Prioridade: `P2`
- Objetivo: orientar instalacao, abertura, backup e recuperacao.
- Dependencias: HY-04.01, HY-04.03.
- Entregavel: doc curta de operacao do app desktop.
- Pronto quando: o usuario sabe o que fazer em caso de erro ou troca de maquina.

## Tarefas imediatas sugeridas

Se a proxima sessao de implementacao comecar agora, a ordem minima recomendada e:

1. HY-00.01
2. HY-00.02
3. HY-00.03
4. HY-00.04
5. HY-01.01
6. HY-01.02
7. HY-01.03
8. HY-02.01
9. HY-02.02
10. HY-02.04
11. HY-03.01
12. HY-04.01

## Criterio de encerramento por fase

Uma fase so encerra quando:

- as dependencias da fase seguinte estao destravadas
- existe validacao reproduzivel
- o app atual continua abrindo e operando
- a documentacao foi atualizada
