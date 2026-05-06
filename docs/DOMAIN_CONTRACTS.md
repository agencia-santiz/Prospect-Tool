# Domain Contracts

_Atualizado em 2026-05-05_

Este documento registra o contrato canonico que vai servir de base para a API futura do Bloom Leads.

## Objetivo

- Separar os dominios centrais em contratos estaveis e versionados.
- Reduzir ambiguidade entre frontend e backend.
- Permitir que a migracao para API aconteca por blocos, sem romper o fluxo atual.

## Versao atual

- Versao: `2026-05-05`
- Fonte canonica: [src/domainContracts.ts](/C:/Users/aland/OneDrive/Documentos/New%20project/Prospect-Tool/src/domainContracts.ts)

## Dominios centrais

- `search`
- `company`
- `lead`
- `contact`
- `deal`
- `pipeline`
- `workspace`

## Regras do contrato

- Os nomes canonicos usam ingles e formato de API.
- O contrato deve permanecer independente da UI.
- Campos derivados de tela, copy e simulacao nao devem entrar aqui sem necessidade clara.
- `localStorage` continua sendo a base operacional atual, mas nao e a fonte de verdade do contrato.
- Mudancas de forma relevante devem gerar nova versao do contrato.

## Relacao com o frontend atual

- `src/types.ts` continua representando o modelo de tela e os dados que o MVP usa hoje.
- `src/domainContracts.ts` passa a ser a referencia canonica para a futura API.
- A migracao real para backend deve fazer mapeamento entre os dois modelos antes de cortar a persistencia local.

## Aceite deste passo

- Os dominios centrais estao nomeados.
- O contrato ficou versionado.
- O projeto passou a ter um ponto unico de referencia para a evolucao de backend.
