import { useEffect, useState } from "react";
import { cartTotal, isCartItem, parseCart } from "../lib/cart";
import { products } from "../data/products";
import type { CartItem } from "../types";
const STORAGE_KEY = "burger-house-cart-v1";
function readCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const items = parseCart(raw);
    let notice = "";
    if (raw) {
      try {
        const data: unknown = JSON.parse(raw);
        if (!Array.isArray(data) || data.length !== items.length)
          notice =
            "Não foi possível recuperar alguns itens salvos. Confira seu carrinho.";
      } catch {
        notice = "O carrinho salvo estava inválido e foi reiniciado.";
      }
    }
    return { items, notice };
  } catch {
    return { items: [] as CartItem[], notice: "" };
  }
}
export function useCart() {
  const [restored] = useState(readCart);
  const [items, setItems] = useState(restored.items);
  const [storageError, setStorageError] = useState(false);
  const [notice, setNotice] = useState(restored.notice);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [items]);
  function add(input: Omit<CartItem, "id">): string | null {
    const product = products.find((product) => product.id === input.productId);
    if (!product?.available)
      return "Este produto está esgotado. Escolha outra opção do cardápio.";
    const item = { ...input, id: crypto.randomUUID() };
    if (!isCartItem(item))
      return "Não foi possível adicionar este produto. Revise a personalização.";
    setItems((previous) => [...previous, item]);
    return null;
  }
  return {
    items,
    storageError,
    notice,
    dismissNotice: () => setNotice(""),
    total: cartTotal(items),
    count: items.reduce((count, item) => count + item.quantity, 0),
    add,
    update: (id: string, delta: number) =>
      setItems((previous) =>
        previous.map((item) => {
          if (
            item.id !== id ||
            !Number.isInteger(delta) ||
            (delta > 0 &&
              !products.find((product) => product.id === item.productId)
                ?.available)
          )
            return item;
          return {
            ...item,
            quantity: Math.max(1, Math.min(99, item.quantity + delta)),
          };
        }),
      ),
    remove: (id: string) =>
      setItems((previous) => previous.filter((item) => item.id !== id)),
    clear: () => setItems([]),
  };
}
