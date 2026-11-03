import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Modal } from "./Modal";
import { ProductImage } from "./ProductImage";
import { extras } from "../data/products";
import { money, unitPrice } from "../lib/cart";
import { Availability } from "./Availability";
import type { Product, CartItem } from "../types";
export function Quantity({
  value,
  onChange,
  canIncrease = true,
}: {
  value: number;
  onChange: (delta: number) => void;
  canIncrease?: boolean;
}) {
  return (
    <div className="quantity">
      <button
        type="button"
        onClick={() => onChange(-1)}
        aria-label="Diminuir quantidade"
        disabled={value <= 1}
      >
        <Minus size={16} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => onChange(1)}
        aria-label="Aumentar quantidade"
        disabled={value >= 99 || !canIncrease}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
export function ProductModal({
  product,
  onClose,
  onAdd,
}: {
  product: Product;
  onClose: () => void;
  onAdd: (item: Omit<CartItem, "id">) => string | null;
}) {
  const [selected, setSelected] = useState<string[]>([]),
    [quantity, setQuantity] = useState(1),
    [notes, setNotes] = useState(""),
    [removedIngredients, setRemovedIngredients] = useState<string[]>([]),
    [error, setError] = useState("");
  const price = unitPrice({
    id: "preview",
    productId: product.id,
    extras: selected,
    removedIngredients,
    quantity,
    notes,
  });
  return (
    <Modal
      title={product.name}
      description="Do seu jeito, com o sabor da House."
      onClose={onClose}
    >
      <div className="modal-scroll">
        <div className="modal-product-image">
          <ProductImage src={product.image} alt={product.name} />
        </div>
        <p className="description">{product.description}</p>
        <Availability available={product.available} />
        {product.removableIngredients?.length && (
          <fieldset className="ingredients extras">
            <legend>
              Ingredientes da receita <small>Do seu jeito</small>
            </legend>
            <p className="field-hint">
              Desmarque para retirar. O preço não muda.
            </p>
            {product.removableIngredients.map((ingredient) => (
              <label className="extra-option" key={ingredient.id}>
                <span>
                  <input
                    type="checkbox"
                    aria-label={ingredient.name}
                    checked={!removedIngredients.includes(ingredient.id)}
                    onChange={() =>
                      setRemovedIngredients((list) =>
                        list.includes(ingredient.id)
                          ? list.filter((id) => id !== ingredient.id)
                          : [...list, ingredient.id],
                      )
                    }
                  />
                  {ingredient.name}
                </span>
                <small aria-hidden="true">Incluso</small>
              </label>
            ))}
          </fieldset>
        )}

        {product.category === "Hambúrgueres" && (
          <fieldset className="extras">
            <legend>
              Deixe ainda melhor <small>Opcional</small>
            </legend>
            {extras.map((extra) => (
              <label className="extra-option" key={extra.id}>
                <span>
                  <input
                    type="checkbox"
                    checked={selected.includes(extra.id)}
                    onChange={() =>
                      setSelected((list) =>
                        list.includes(extra.id)
                          ? list.filter((id) => id !== extra.id)
                          : [...list, extra.id],
                      )
                    }
                  />
                  {extra.name}
                </span>
                <b>+ {money(extra.price)}</b>
              </label>
            ))}
          </fieldset>
        )}
        <label className="field">
          Alguma observação?
          <textarea
            placeholder="Ex.: sem cebola, por favor."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={300}
          />
          <small>{notes.length}/300</small>
        </label>
        {(!product.available || error) && (
          <p role="alert" className="error-message">
            {error || "Este produto está esgotado. Escolha outra opção."}
          </p>
        )}
      </div>
      <div className="modal-footer">
        <Quantity
          value={quantity}
          onChange={(delta) =>
            setQuantity((n) => Math.max(1, Math.min(99, n + delta)))
          }
        />
        <button
          className="button"
          disabled={!product.available}
          onClick={() => {
            const error = onAdd({
              productId: product.id,
              extras: selected,
              quantity,
              notes: notes.trim(),
              removedIngredients,
            });
            if (error) setError(error);
            else onClose();
          }}
        >
          <ShoppingBag size={18} />
          <span>
            Adicionar <b>{money(price * quantity)}</b>
          </span>
        </button>
      </div>
    </Modal>
  );
}
