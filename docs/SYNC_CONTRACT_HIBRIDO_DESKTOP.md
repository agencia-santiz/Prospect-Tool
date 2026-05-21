# Contrato de Sync da trilha hibrida desktop

Este documento fixa o contrato minimo de sincronizacao para o Bloom Leads desktop.

## Objetivo

O contrato define o que e considerado dado compartilhado, o que continua local e qual politica de conflito vale para a trilha.

## Entidades compartilhadas

As entidades abaixo entram no dominio sincronizavel:

- `workspace`
- `pipeline`
- `savedList`
- `contact`
- `deal`

Ordem de processamento:

1. `workspace`
2. `pipeline`
3. `savedList`
4. `contact`
5. `deal`

## Entidades locais

As entidades abaixo continuam locais por enquanto:

- `cardConfig`
- `contactedKeys`
- `whatsappStatusOverrides`
- `citiesCache`

## Politica de conflito

- Se um registro remoto for mais novo, ele vence.
- Se os dois registros tiverem o mesmo timestamp, o registro local vence.
- Se existir apenas um lado, esse lado vence.
- Para entidades locais, o conflito nao e aplicado porque nao ha sync remoto para elas.

## Critério pratico

O contrato e considerado pronto quando:

- a lista de entidades compartilhadas e local-only esta fechada
- a ordem de sync esta definida
- a resolucao de conflito e deterministica
- o contrato pode ser usado pela fila local de mutacoes
