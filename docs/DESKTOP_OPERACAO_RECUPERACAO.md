# Operacao e recuperacao do desktop

Este guia resume o uso normal da trilha desktop hibrida e o que fazer em caso de falha.

## Instalacao e abertura

- Instale o executavel gerado pelo `npm run desktop:installer`.
- Abra o app pelo atalho criado no Windows ou pelo executavel instalado.
- O desktop sobe o backend local junto com a interface.

## Logs locais

- Os logs persistentes ficam em `userData/logs/desktop.log`.
- O arquivo rota de forma simples quando atinge o limite configurado.
- Se houver falha no filesystem, o app continua abrindo e registra o que conseguir em stdout.

## Estado local

- O estado persistente do desktop fica em `userData/persistent-state.json`.
- Esse arquivo guarda workspace, preferencias de interface e caches locais do app.
- Se o arquivo for perdido, o app recria a estrutura local, mas os dados nao sincronizados podem ser perdidos.

## Validacao de release

- Use `npm run desktop:release:smoke` para validar a combinacao de instalador, feed e staging local.
- Use `npm run desktop:feed:stage` para copiar os artefatos da release para o feed local.
- Use `npm run desktop:feed:serve` para servir o feed local em testes.

## Recuperacao

- Se o app nao abrir, confira primeiro o arquivo de log local.
- Se houver erro de atualizacao, recrie o feed com `npm run desktop:feed:stage`.
- Se estiver trocando de maquina, preserve a pasta `userData` quando for necessario manter configuracoes e dados locais.

## Limites conhecidos

- A publicacao do feed de update em infraestrutura externa continua dependente de decisao operacional.
