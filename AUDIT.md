# Auditoria e melhorias — Burger House

Auditoria realizada em 3 de novembro de 2026, sobre a aplicação existente, sem reconstrução. O arquivo `userREADME.md` e os componentes funcionais foram preservados.

## Antes das alterações

Foram executados os 5 testes unitários e 10 cenários de navegador já existentes, todos aprovados, além de uma sessão exploratória com Chromium via Playwright na aplicação da porta 5173.

| Fluxo           | Resultado da auditoria inicial                                                                                  |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| Navegação       | Início, Cardápio, Combos e Nossa história chegam às respectivas âncoras                                         |
| CTAs            | Explorar cardápio e Fazer meu pedido levam ao cardápio; Quero meu combo abre o produto; link do rodapé funciona |
| Categorias      | Alteram os produtos apresentados                                                                                |
| Busca           | Filtra na categoria, mas `agua` não encontra `Água mineral`                                                     |
| Personalização  | Adicionais, quantidade e observações funcionam; faltam controles para retirar ingredientes                      |
| Carrinho        | Adição, aumento, diminuição e remoção funcionam, com estado vazio                                               |
| Valores         | Centavos, adicionais por unidade e multiplicação por quantidade corretos                                        |
| Persistência    | Itens retornam após recarregar a página                                                                         |
| Checkout        | Entrega, retirada e resumo funcionam; nome numérico `12` é aceito indevidamente                                 |
| Disponibilidade | Não há modelo, indicadores ou bloqueio de produtos esgotados                                                    |
| Prévia          | Servidor ativo no ambiente, mas não há ferramenta de URL pública ou encaminhamento disponível                   |

Não foram encontrados botões decorativos sem ação nos fluxos auditados. A presença de componentes não foi usada como evidência de funcionamento: os fluxos foram acionados no navegador.

Na leitura do código também foram identificadas oportunidades: retorno de foco sem um `Dialog.Trigger`, erros de formulário pouco associados aos campos, temporizadores concorrentes do toast e ausência de acesso ao carrinho após rolar a página no celular.

## O que foi implementado

- **Disponibilidade local:** `available` no catálogo. Crispy Chicken e Fritas Cheddar & Bacon começam esgotados para demonstrar o estado. Alterar os booleanos em `src/data/products.ts` modifica a simulação. Não há contagem, reserva, estoque real ou sincronização entre usuários.
- **Bloqueio em várias etapas:** card e foto desabilitados; modal, ação de adicionar, aumento de quantidade e checkout também verificam a disponibilidade. Itens que já estavam salvos continuam visíveis, com instrução para removê-los antes de finalizar. Nada é comprado ou enviado.
- **Ingredientes:** é possível desmarcar ingredientes da receita e selecionar adicionais pagos. Retirar ingredientes não concede desconto; essa regra aparece no modal. As escolhas persistem e aparecem no carrinho e no resumo.
- **Busca:** aceita caixa, acentos e espaços nas pontas; continua combinada com a categoria. Um filtro opcional mostra somente disponíveis. Estado vazio permite limpar busca e filtros.
- **Checkout:** validação por campo, nomes sem números, telefone com DDD (incluindo formato +55), endereço obrigatório somente para entrega, `aria-invalid`, mensagens associadas e foco no primeiro erro. Número S/N é aceito. A confirmação mostra claramente que nenhum pedido foi enviado.
- **Carrinho e feedback:** toast com nome, quantidade, acesso ao carrinho e fechamento; temporizador reiniciado a cada adição. Carrinho antigo é migrado e entradas inválidas ou duplicadas são descartadas com aviso. Falha do armazenamento mantém a experiência em memória.
- **Visual e mobile:** identidade carvão/laranja preservada; header fixo, cards com disponibilidade, texto mais legível, controles de toque maiores, campos com 16 px para evitar zoom no iOS, áreas seguras e barra fixa do carrinho com total no celular.
- **Diálogos:** abertura e fechamento discretos, Escape, foco contido e retorno ao acionador, respeitando movimento reduzido. O menu mobile também fecha com Escape.
- **Prévia interativa:** `npm run build:standalone` gera `artifacts/Burger-House.html`, com React, estilos, fotos e fontes incorporados. É a mesma aplicação compilada, sem outra implementação dos fluxos.

## Arquivos alterados ou adicionados nesta evolução

| Arquivos                                                                      | Responsabilidade                                           |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `src/types/index.ts`, `src/data/products.ts`                                  | Tipos, disponibilidade e ingredientes removíveis           |
| `src/lib/cart.ts`, `src/hooks/useCart.ts`                                     | Validação, migração, proteção de compra e persistência     |
| `src/lib/catalog.ts`, `src/components/MenuSection.tsx`                        | Busca e filtros separados da composição da página          |
| `src/lib/checkout.ts`, `src/components/Checkout.tsx`                          | Regras de validação e interface de checkout                |
| `src/components/Availability.tsx`, `ItemCustomization.tsx`                    | Estados e resumo de escolhas reutilizáveis                 |
| `src/components/ProductCard.tsx`, `ProductModal.tsx`, `CartDrawer.tsx`        | Integração de disponibilidade e personalização             |
| `src/components/Modal.tsx`, `Header.tsx`                                      | Foco, teclado, navegação e transições                      |
| `src/hooks/useToast.ts`, `src/App.tsx`, `src/styles.css`                      | Feedback, composição, barra mobile e refinamentos visuais  |
| `src/lib/*.test.ts`, `tests/improvements.spec.ts`, `tests/standalone.spec.ts` | Novos testes e adaptação do teste de carrinho ao novo tipo |
| `scripts/build-standalone.mjs`, `package.json`, `.gitignore`                  | Geração da prévia e comandos                               |
| `README.md`, `AUDIT.md`                                                       | Como visualizar, decisões e evidências                     |

`tests/shop.spec.ts` foi preservado como regressão dos fluxos originais.

## Validação

- `npm test`: **26 testes unitários**, abrangendo cálculo em centavos, migração, dados inválidos e duplicados, ingredientes, disponibilidade, busca, nomes, telefone e endereço.
- `npm run test:e2e`: build de produção, geração da prévia e **28 cenários em Chromium**, distribuídos entre desktop 1440 × 1000 e mobile 375 × 812, com verificações adicionais em 320 × 740.
- Interações cobrem navegação, CTAs, filtros, esgotados, ingredientes, variantes, recarga, quantidades, remoção, valores, entrega, retirada, foco, Escape, imagens indisponíveis, armazenamento bloqueado e corrompido.
- A prévia autossuficiente é exercitada com a rede offline e apenas o documento HTML respondido localmente pelo teste: nenhuma imagem, fonte ou script exige requisição HTTP adicional. O Chromium gerenciado bloqueia navegação em `file://`; por isso essa forma específica de abrir o arquivo não foi validada aqui. O artefato foi preparado para abrir em navegadores comuns a partir do arquivo baixado.
- Sessão exploratória adicional: menu mobile com Escape, retirada de tomate + bacon adicional (R$ 34,90), barra mobile e validação com foco. Nenhum erro de JavaScript. A página foi verificada sem overflow em 320, 390, 768, 1024 e 1440 px; evidências em `artifacts/review/interaction-report.json`.
- Capturas em `test-results/` e `artifacts/review/` complementam a revisão; não substituem as interações.

Limites: testes em Chromium, sem dispositivos físicos, sem auditoria com leitores de tela e sem execução em Safari/Firefox. A aplicação continua exclusivamente front-end, sem backend, banco, pagamento ou envio real de pedidos. O ambiente não forneceu uma URL pública de prévia; a alternativa entregue é o HTML interativo independente, além do servidor na porta 5173.
