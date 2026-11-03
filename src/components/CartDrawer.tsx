import { ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { products } from "../data/products";
import { ItemCustomization } from "./ItemCustomization";
import { Availability } from "./Availability";
import { money, unitPrice, cartIssue } from "../lib/cart";
import type { CartItem } from "../types";
import { Modal } from "./Modal";
import { ProductImage } from "./ProductImage";
import { Quantity } from "./ProductModal";
export function CartDrawer({
  items,
  total,
  onClose,
  onUpdate,
  onRemove,
  onCheckout,
}: {
  items: CartItem[];
  total: number;
  onClose: () => void;
  onUpdate: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}) {
  const issue = cartIssue(items);
  return (
    <Modal
      title="Seu carrinho"
      description="Uma boa escolha merece uma boa mordida."
      onClose={onClose}
      drawer
    >
      {!items.length ? (
        <div className="empty-cart">
          <ShoppingBag size={56} strokeWidth={1} />
          <h3>A fome a gente resolve.</h3>
          <p>Escolha seu favorito e comece por aqui.</p>
          <a className="button" href="#cardapio" onClick={onClose}>
            Explorar cardápio <ArrowRight size={18} />
          </a>
        </div>
      ) : (
        <>
          <div className="modal-scroll cart-items">
            {items.map((item) => {
              const product = products.find((p) => p.id === item.productId)!;
              return (
                <article className="cart-item" key={item.id}>
                  <ProductImage src={product.image} alt={product.name} />
                  <div>
                    <h3>{product.name}</h3>
                    {!product.available && <Availability available={false} />}
                    <ItemCustomization item={item} />
                    <strong>{money(unitPrice(item) * item.quantity)}</strong>
                    <div className="cart-item-actions">
                      <Quantity
                        value={item.quantity}
                        canIncrease={product.available}
                        onChange={(delta) => onUpdate(item.id, delta)}
                      />
                      <button
                        className="icon-button"
                        aria-label={`Remover ${product.name}`}
                        onClick={() => onRemove(item.id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="cart-summary">
            <div>
              <span>Subtotal</span>
              <span>{money(total)}</span>
            </div>
            <div>
              <span>Entrega</span>
              <span>Grátis nesta demonstração</span>
            </div>
            <div className="total">
              <strong>Total</strong>
              <strong>{money(total)}</strong>
            </div>
            {issue && (
              <p className="error-message cart-issue" role="alert">
                {issue}
              </p>
            )}
            <button
              className="button full"
              disabled={!!issue}
              onClick={onCheckout}
            >
              Finalizar pedido <ArrowRight size={19} />
            </button>
            <small>Você poderá revisar tudo na próxima etapa.</small>
          </div>
        </>
      )}
    </Modal>
  );
}
