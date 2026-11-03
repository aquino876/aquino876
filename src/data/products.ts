import type { Product, Extra } from "../types";
export const categories = [
  "Hambúrgueres",
  "Combos",
  "Acompanhamentos",
  "Bebidas",
] as const;
// Disponibilidade fictícia por produto; não representa estoque ou reservas reais.
export const products: Product[] = [
  {
    id: "classic",
    removableIngredients: [
      { id: "cheddar", name: "Cheddar" },
      { id: "lettuce", name: "Alface" },
      { id: "tomato", name: "Tomate" },
      { id: "sauce", name: "Molho da casa" },
    ],
    available: true,
    name: "House Classic",
    description:
      "Pão brioche, burger de 160g, cheddar, alface, tomate e molho da casa.",
    price: 2890,
    category: "Hambúrgueres",
    image: "/images/popular-burger-classic.png",
    badge: "MAIS PEDIDO",
  },
  {
    id: "bacon",
    removableIngredients: [
      { id: "cheddar", name: "Cheddar" },
      { id: "bacon", name: "Bacon" },
      { id: "sauce", name: "Maionese defumada" },
    ],
    available: true,
    name: "Bacon Lovers",
    description:
      "Burger de 160g, cheddar duplo, bacon crocante e maionese defumada.",
    price: 3490,
    category: "Hambúrgueres",
    image: "/images/popular-burger-meat.png",
    badge: "FAVORITO DA CASA",
  },
  {
    id: "double",
    removableIngredients: [
      { id: "cheese", name: "Queijo" },
      { id: "onion", name: "Cebola roxa" },
    ],
    available: true,
    name: "Double Trouble",
    description:
      "Dois burgers de 160g, queijo derretido, cebola roxa e muito sabor.",
    price: 4290,
    category: "Hambúrgueres",
    image: "/images/popular-burger-big.png",
  },
  {
    id: "chicken",
    removableIngredients: [
      { id: "salad", name: "Salada" },
      { id: "sauce", name: "Molho especial" },
    ],
    available: false,
    name: "Crispy Chicken",
    description:
      "Frango empanado crocante, salada fresca e nosso molho especial.",
    price: 2790,
    category: "Hambúrgueres",
    image: "/images/popular-burger-chicken.png",
    badge: "CROCANTE",
  },
  {
    id: "combo",
    available: true,
    name: "Combo da House",
    description:
      "House Classic + batata frita individual + refrigerante de 350ml.",
    price: 3990,
    category: "Combos",
    image: "/images/popular-burger-classic.png",
    badge: "MELHOR ESCOLHA",
  },
  {
    id: "duo",
    available: true,
    name: "Combo em Dobro",
    description:
      "Dois Bacon Lovers, uma batata grande e dois refrigerantes de 350ml.",
    price: 7990,
    category: "Combos",
    image: "/images/popular-burger-meat.png",
  },
  {
    id: "fries",
    available: true,
    name: "Fritas da House",
    description:
      "Batatas douradas e crocantes, com sal da casa. Porção de 200g.",
    price: 1490,
    category: "Acompanhamentos",
    image: "/images/fries.svg",
  },
  {
    id: "cheddar-fries",
    available: false,
    name: "Fritas Cheddar & Bacon",
    description:
      "Nossas fritas com cheddar cremoso e pedacinhos de bacon. 250g.",
    price: 2290,
    category: "Acompanhamentos",
    image: "/images/fries.svg",
  },
  {
    id: "cola",
    available: true,
    name: "Refrigerante",
    description: "Refrigerante de cola gelado, lata de 350ml.",
    price: 690,
    category: "Bebidas",
    image: "/images/drink.svg",
  },
  {
    id: "water",
    available: true,
    name: "Água mineral",
    description: "Água mineral sem gás, garrafa de 500ml.",
    price: 490,
    category: "Bebidas",
    image: "/images/water.svg",
  },
];
export const extras: Extra[] = [
  { id: "cheese", name: "Queijo extra", price: 400 },
  { id: "bacon", name: "Bacon crocante", price: 600 },
  { id: "patty", name: "Hambúrguer adicional", price: 1200 },
  { id: "sauce", name: "Molho especial", price: 300 },
];
