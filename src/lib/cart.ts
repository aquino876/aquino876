import { extras, products } from "../data/products";
import type { CartItem } from "../types";
const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
export const money = (cents: number) => currency.format(cents / 100);
export const unitPrice = (item: CartItem) =>
  (products.find((product) => product.id === item.productId)?.price ?? 0) +
  extras
    .filter((extra) => item.extras.includes(extra.id))
    .reduce((sum, extra) => sum + extra.price, 0);
export const cartTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + unitPrice(item) * item.quantity, 0);

function isStringList(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((id) => typeof id === "string") &&
    new Set(value).size === value.length
  );
}
// Validate at the boundary: localStorage can contain stale or edited data.
export function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;
  const product = products.find((product) => product.id === item.productId);
  return (
    !!product &&
    typeof item.id === "string" &&
    item.id.length > 0 &&
    typeof item.notes === "string" &&
    item.notes.length <= 300 &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    item.quantity <= 99 &&
    isStringList(item.extras) &&
    item.extras.every(
      (id) =>
        product.category === "Hambúrgueres" &&
        extras.some((extra) => extra.id === id),
    ) &&
    isStringList(item.removedIngredients) &&
    item.removedIngredients.every((id) =>
      product.removableIngredients?.some((ingredient) => ingredient.id === id),
    )
  );
}
export function parseCart(value: string | null): CartItem[] {
  try {
    const data: unknown = JSON.parse(value ?? "[]");
    if (!Array.isArray(data)) return [];
    const ids = new Set<string>();
    return data.flatMap((value) => {
      if (!value || typeof value !== "object") return [];
      // Migration from the original cart format without ingredient removals.
      const item = {
        ...value,
        removedIngredients:
          value.removedIngredients === undefined
            ? []
            : value.removedIngredients,
      };
      if (!isCartItem(item) || ids.has(item.id)) return [];
      ids.add(item.id);
      return [item];
    });
  } catch {
    return [];
  }
}
export function cartIssue(items: CartItem[]): string | null {
  if (!items.length)
    return "Seu carrinho está vazio. Escolha um produto para continuar.";
  if (items.some((item) => !isCartItem(item)))
    return "Há um item inválido no carrinho. Remova-o e adicione novamente.";
  if (
    items.some(
      (item) =>
        !products.find((product) => product.id === item.productId)?.available,
    )
  )
    return "Há produtos esgotados no carrinho. Remova-os para continuar.";
  return null;
}
