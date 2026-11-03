import { describe, it, expect } from "vitest";
import { cartTotal, unitPrice, parseCart, money, cartIssue } from "./cart";
import type { CartItem } from "../types";
const item: CartItem = {
  id: "1",
  productId: "classic",
  extras: ["cheese", "bacon"],
  removedIngredients: [],
  notes: "Sem cebola",
  quantity: 2,
};
describe("cálculos e persistência do carrinho", () => {
  it("soma adicionais por unidade antes de multiplicar pela quantidade", () => {
    expect(unitPrice(item)).toBe(3890);
    expect(cartTotal([item])).toBe(7780);
  });
  it("mantém personalizações independentes no total", () => {
    expect(
      cartTotal([item, { ...item, id: "2", extras: [], quantity: 1 }]),
    ).toBe(10670);
  });
  it("retorna carrinho vazio para armazenamento inválido", () => {
    for (const value of [null, "{", "null", "{}", '"text"'])
      expect(parseCart(value)).toEqual([]);
  });
  it("rejeita produtos inexistentes, quantidades inválidas e adicionais duplicados", () => {
    const invalid = [
      { ...item, productId: "missing" },
      { ...item, quantity: 1.5 },
      { ...item, quantity: -1 },
      { ...item, quantity: 100 },
      { ...item, extras: ["cheese", "cheese"] },
      { ...item, extras: ["unknown"] },
    ];
    expect(parseCart(JSON.stringify(invalid))).toEqual([]);
    expect(parseCart(JSON.stringify([item]))).toEqual([item]);
  });
  it("formata centavos em reais", () => {
    expect(money(2890).replace(/\s/g, " ")).toBe("R$ 28,90");
    expect(cartTotal([])).toBe(0);
  });
});
describe("compatibilidade, personalização e disponibilidade", () => {
  it("migra carrinhos anteriores sem perder os itens", () => {
    const { removedIngredients: _, ...legacy } = item;
    expect(parseCart(JSON.stringify([legacy]))).toEqual([item]);
  });
  it("retirar ingredientes não dá desconto na receita", () => {
    expect(
      unitPrice({ ...item, removedIngredients: ["lettuce", "tomato"] }),
    ).toBe(unitPrice(item));
  });
  it("rejeita ingredientes inexistentes, repetições e adicionais em bebidas", () => {
    expect(
      parseCart(
        JSON.stringify([
          { ...item, removedIngredients: ["onion"] },
          { ...item, removedIngredients: ["lettuce", "lettuce"] },
          { ...item, productId: "water" },
        ]),
      ),
    ).toEqual([]);
  });
  it("descarta IDs duplicados e preserva itens válidos", () => {
    expect(parseCart(JSON.stringify([item, item, {}, null]))).toEqual([item]);
  });
});

describe("bloqueio do checkout", () => {
  it("bloqueia carrinho vazio, esgotado e inválido", () => {
    expect(cartIssue([])).toContain("vazio");
    expect(
      cartIssue([{ ...item, productId: "chicken", extras: [] }]),
    ).toContain("esgotados");
    expect(cartIssue([{ ...item, quantity: 0 }])).toContain("inválido");
    expect(cartIssue([item])).toBeNull();
  });
});
