# AGENTS

Este arquivo define as regras operacionais do projeto Bloom Leads.
Ele existe para reduzir ambiguidade, proteger o estado atual do MVP e evitar alteracoes feitas sem alinhamento previo.

## 1. Regra principal

- Nao comece a codar sem um plano previo.
- Antes de qualquer alteracao, identifique objetivo, escopo, arquivos afetados, riscos e forma de validacao.
- Se o pedido estiver ambigio, pare e esclareca antes de editar arquivos.

## 2. Ordem de trabalho obrigatoria

1. Ler o contexto do projeto.
2. Entender o fluxo e os arquivos envolvidos.
3. Escrever um plano curto e objetivo.
4. Implementar a menor alteracao possivel.
5. Executar testes ou validacoes reproduziveis.
6. Registrar o resultado com clareza.

## 3. Testes sao obrigatorios

- Nenhuma alteracao deve ser considerada pronta sem validacao.
- Se a area alterada for testavel, escreva ou atualize testes automatizados.
- Se o projeto ainda nao tiver suporte suficiente para testes naquele ponto, a tarefa nao termina ate que exista uma validacao minima reproduzivel.
- Ao final, a saida precisa deixar claro o que foi testado e o que ainda ficou como risco.

## 4. Preservacao do trabalho existente

- Nao reverta alteracoes feitas por outras pessoas ou por agentes anteriores sem autorizacao explicita.
- Nao use comandos destrutivos para limpar o repositorio.
- Se houver mudancas conflitantes no mesmo arquivo, pare e combine a melhor estrategia.
- Trabalhe de forma incremental e reversivel sempre que possivel.

## 5. Fonte de verdade do produto

- Este projeto deve ser tratado como um MVP avancado, nao como prototipo descartavel.
- Features simuladas devem ser marcadas como simuladas.
- Persistencia local, mocks e dependencias externas devem ser documentados com transparencia.
- Se uma decisao impactar autenticacao, pipeline, busca ou persistencia, registre a implicacao no contexto.

## 6. Padrao de documentacao

- Atualize a documentacao quando o comportamento do produto mudar de forma relevante.
- Mantenha `PROJECT_CONTEXT.md` como visao do produto e `AGENTS.md` como contrato operacional.
- Evite duplicar informacao solta em varios lugares sem necessidade.
- Prefira linguagem simples, objetiva e sem suposicoes ocultas.

## 7. Validacao minima esperada

Antes de encerrar qualquer trabalho de codigo, confirme pelo menos o seguinte:

- o escopo pedido foi atendido
- os testes ou validacoes relevantes foram executados
- nao houve quebra evidente no fluxo principal
- qualquer limitacao remanescente foi registrada

## 8. Quando parar e pedir ajuda

Pare e consulte o usuario quando ocorrer qualquer um destes casos:

- o pedido exigir uma decisao de produto com impacto nao obvio
- houver conflito entre o objetivo pedido e o estado atual do codigo
- a mudanca depender de credenciais, infraestrutura ou integracao indisponivel
- a validacao nao puder ser concluida com confianca razoavel

## 9. Prioridade pratica

Quando houver tensao entre velocidade e clareza, esta ordem vale:

1. preservar o estado correto do projeto
2. manter baixa ambiguidade
3. testar ou validar de forma reproduzivel
4. so depois otimizar ou expandir
