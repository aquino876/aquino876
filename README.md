# Burger House

Cardápio digital fictício com React, TypeScript, Vite, Tailwind CSS, Motion e Lucide. Interface em português, responsiva, com recursos locais para funcionar sem serviços de terceiros.

## Executar

Requer Node.js 22.12+ (ou 24 LTS) e npm.

```bash
npm ci
npm run dev
```

Abra o endereço indicado pelo Vite (normalmente http://localhost:5173).

```bash
npm run build       # TypeScript + build de produção em dist/
npm run preview     # visualizar o build
npm test            # testes de cálculo e leitura do armazenamento
npm run test:e2e    # build + prévia independente + testes desktop/mobile
npm run format     # formatar código
npm run build:standalone # gerar HTML interativo independente
```

Os testes de navegador usam `/usr/bin/chromium`. Em outra máquina, defina `CHROMIUM_PATH` para o executável local, por exemplo `CHROMIUM_PATH=/caminho/chrome npm run test:e2e`.

## Visualizar interativamente

O ambiente de desenvolvimento escuta em `0.0.0.0:5173`. Se o seu editor oferecer uma aba **Portas / Ports**, encaminhe a porta 5173 e use **Abrir no navegador**. `localhost:5173` só aponta para este servidor quando o navegador está no mesmo ambiente ou existe encaminhamento; o ambiente atual não oferece uma ferramenta para gerar URL pública.

Para visualizar sem Node ou encaminhamento de portas:

```bash
npm run build:standalone
```

Baixe `artifacts/Burger-House.html` e abra no navegador. Fotos, fontes e código estão incorporados no mesmo arquivo; cardápio, personalização, carrinho e checkout continuam interativos. A persistência depende da permissão de armazenamento do navegador. Essa prévia é gerada a partir do build atual, portanto regenere depois de alterações. A política do Chromium deste ambiente bloqueia `file://`; os testes verificam o HTML por uma resposta local, sem carregar recursos externos.

Veja [AUDIT.md](AUDIT.md) para problemas encontrados, arquivos alterados, cobertura e limitações dos testes.

## Funcionalidades

- Hero, destaques no cardápio, combos e história da marca.
- Categorias, busca sem distinção de acentos, filtro de disponíveis e estado sem resultados.
- Produtos disponíveis/esgotados com compra e checkout protegidos.
- Retirada de ingredientes, adicionais, quantidade e observações.
- Carrinho lateral, barra de acesso mobile, remoção, atualização e persistência em `localStorage`.
- Checkout de entrega ou retirada, validação e resumo demonstrativo.
- Modais com Radix Dialog: foco contido, Escape, fechamento e nomes acessíveis.
- Animações com Motion, suporte a movimento reduzido, foco visível e fallback de imagens.

## Organização e decisões

| Arquivo                                               | Responsabilidade                             |
| ----------------------------------------------------- | -------------------------------------------- |
| `src/App.tsx`                                         | Composição da página e abertura dos painéis  |
| `src/components/Header.tsx` e `Hero.tsx`              | Navegação, identidade e apresentação         |
| `src/components/ProductCard.tsx` e `ProductModal.tsx` | Produto e personalização                     |
| `src/components/CartDrawer.tsx`                       | Itens, quantidades e totais                  |
| `src/components/Checkout.tsx`                         | Formulário, validação e resumo               |
| `src/components/Modal.tsx`                            | Base acessível dos diálogos                  |
| `src/hooks/useCart.ts`                                | Estado, ações e persistência                 |
| `src/lib/cart.ts`                                     | Cálculos e validação dos dados persistidos   |
| `src/data/products.ts`                                | Catálogo e adicionais fictícios              |
| `src/types/index.ts`                                  | Contratos de produtos e itens                |
| `src/styles.css`                                      | Identidade visual, componentes e breakpoints |
| `tests/shop.spec.ts`                                  | Fluxos reais no navegador                    |

Os preços são inteiros em centavos para evitar erros de ponto flutuante. O preço é derivado do catálogo e dos adicionais, sem duplicar totais no estado. Cada adição tem um identificador próprio; duas versões do mesmo produto podem coexistir. O armazenamento é validado antes de restaurar itens; caso esteja bloqueado, o carrinho continua em memória com aviso.

Estado fica no ancestral comum, e componentes recebem dados e callbacks por props. A lógica persistente está em um hook e os cálculos em funções puras para facilitar verificação e futuras integrações. Os estilos usam Tailwind via plugin do Vite e CSS de componentes para manter a direção visual explícita.

A disponibilidade é simulada pelos booleanos `available` do catálogo. Crispy Chicken e Fritas Cheddar & Bacon estão esgotados para demonstração. Não há reserva ou compartilhamento de estoque. Itens salvos que ficaram indisponíveis são mantidos no carrinho e bloqueiam o checkout até sua remoção. Ingredientes retirados não alteram o valor da receita. O formato anterior de carrinho é migrado sem perder itens válidos.

`MenuSection.tsx` concentra categorias e busca; `catalog.ts` normaliza o texto. `checkout.ts` contém regras puras de validação e `useToast.ts` gerencia o tempo do feedback. `Availability.tsx` e `ItemCustomization.tsx` evitam duplicar os estados nos cards, carrinho e resumo.

## Testes e limites

Vitest verifica centavos, adicionais, quantidades, formatação e dados persistidos inválidos. Playwright verifica personalização, variantes, persistência após recarga, alteração e remoção, categorias e busca, validação do checkout, entrega e retirada, foco por teclado, menu mobile, imagens e ausência de overflow. Capturas são salvas em `test-results/`.

Aplicação exclusivamente front-end: não envia pedidos, não processa pagamentos, não tem backend nem WhatsApp. Entrega grátis é uma regra fictícia da demonstração. Os dados do checkout ficam apenas na memória da página. Ao concluir a demonstração o carrinho é limpo; fechar o resumo sem concluir preserva os itens. Não houve auditoria manual com leitores de tela ou em dispositivos físicos.

## Recursos visuais

As imagens PNG são recursos demonstrativos do projeto [Responsive Burger Website, de Bedimcode](https://github.com/bedimcode/responsive-burger-website), incluídas localmente. Não se presume licença comercial desses recursos; para uma publicação comercial, substitua por fotografias próprias ou com licença confirmada. As ilustrações SVG de bebidas, fritas e favicon foram criadas para este projeto. Fontes DM Sans e Barlow Condensed são distribuídas pelos pacotes Fontsource sob SIL Open Font License; os avisos estão nos respectivos pacotes.

## Para estudar

1. **Componentes e props:** como dividir a interface e compartilhar callbacks.
2. **`useState` e formulários controlados:** mudanças de categoria, personalização e checkout.
3. **Imutabilidade e listas:** `map`, `filter`, `reduce` e identificadores estáveis.
4. **Hooks e `useEffect`:** separar lógica reutilizável e sincronizar armazenamento.
5. **TypeScript:** interfaces, uniões, `Omit` e validação de dados externos em runtime.
6. **Acessibilidade e testes:** semântica, foco, validação e testes orientados ao comportamento.

Ao trabalhar com IA, peça alterações pequenas, revise o diff e valide o comportamento no navegador. Tipagem e testes ajudam a conferir as sugestões, mas não substituem essa revisão.
