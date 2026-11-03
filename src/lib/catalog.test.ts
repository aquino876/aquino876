import { describe, it, expect } from "vitest";
import { filterProducts, normalizeSearch } from "./catalog";
describe("busca e filtros", () => {
  it("normaliza acentos, caixa e espaços", () => {
    expect(normalizeSearch("  ÁGUA   mineral  ")).toBe("agua mineral");
    expect(filterProducts("Bebidas", "  AGUA ")).toHaveLength(1);
  });
  it("combina categoria, texto e disponibilidade", () => {
    expect(filterProducts("Hambúrgueres", "crispy")).toHaveLength(1);
    expect(filterProducts("Hambúrgueres", "crispy", true)).toHaveLength(0);
    expect(filterProducts("Bebidas", "bacon")).toHaveLength(0);
    expect(
      filterProducts("Hambúrgueres", "", true).every(
        (product) => product.available,
      ),
    ).toBe(true);
  });
});
