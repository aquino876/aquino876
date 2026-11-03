import { products } from "../data/products";
import type { Category } from "../types";
export const normalizeSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim()
    .replace(/\s+/g, " ");
export function filterProducts(
  category: Category,
  query: string,
  onlyAvailable = false,
) {
  const search = normalizeSearch(query);
  return products.filter(
    (product) =>
      product.category === category &&
      (!onlyAvailable || product.available) &&
      normalizeSearch(`${product.name} ${product.description}`).includes(
        search,
      ),
  );
}
