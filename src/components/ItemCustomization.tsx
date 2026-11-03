import { extras, products } from "../data/products";
import type { CartItem } from "../types";
export function ItemCustomization({ item }: { item: CartItem }) {
  const product = products.find((product) => product.id === item.productId);
  const added = extras
    .filter((extra) => item.extras.includes(extra.id))
    .map((extra) => extra.name);
  const removed =
    product?.removableIngredients
      ?.filter((ingredient) => item.removedIngredients.includes(ingredient.id))
      .map((ingredient) => ingredient.name) ?? [];
  return (
    <div className="item-customization">
      {!added.length && !removed.length && <small>Receita original</small>}
      {added.length > 0 && <small>Adicionais: {added.join(" · ")}</small>}
      {removed.length > 0 && <small>Sem: {removed.join(" · ")}</small>}
      {item.notes && <small className="item-notes">Obs.: {item.notes}</small>}
    </div>
  );
}
