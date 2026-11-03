import { useState } from "react";
import { MotionConfig } from "motion/react";
import {
  ArrowUpRight,
  Sandwich,
  ArrowRight,
  Check,
  Clock3,
  Heart,
  ShoppingBag,
  X,
} from "lucide-react";
import { MenuSection } from "./components/MenuSection";
import { useToast } from "./hooks/useToast";
import { money, cartIssue } from "./lib/cart";
import { Header, Logo } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProductModal } from "./components/ProductModal";
import { CartDrawer } from "./components/CartDrawer";
import { Checkout } from "./components/Checkout";
import { ProductImage } from "./components/ProductImage";
import { products } from "./data/products";
import { useCart } from "./hooks/useCart";
import type { Product, CartItem } from "./types";
export default function App() {
  const cart = useCart();
  const [selected, setSelected] = useState<Product | null>(null);
  const [panel, setPanel] = useState<"cart" | "checkout" | null>(null);
  const toast = useToast();
  function add(item: Omit<CartItem, "id">): string | null {
    const error = cart.add(item);
    if (error) return error;
    const name = products.find(
      (product) => product.id === item.productId,
    )?.name;
    toast.show(`${item.quantity}× ${name} no carrinho. Boa escolha!`);
    return null;
  }
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#cardapio">
        Pular para o cardápio
      </a>
      <Header count={cart.count} onCart={() => setPanel("cart")} />
      <main>
        <Hero />
        <MenuSection onSelect={setSelected} />
        <section className="combo-section container" id="combo">
          <div className="combo-banner">
            <div className="combo-copy">
              <span className="eyebrow">
                COMBINAÇÃO PERFEITA. PREÇO TAMBÉM.
              </span>
              <h2>
                A FOME É GRANDE?
                <br />
                VAI DE <span>COMBO.</span>
              </h2>
              <p>
                Seu burger favorito + fritas crocantes + refri gelado.
                <br />
                Tudo junto. Tudo de bom.
              </p>
              <button
                className="button"
                disabled={
                  !products.find((product) => product.id === "combo")?.available
                }
                onClick={() =>
                  setSelected(products.find((p) => p.id === "combo")!)
                }
              >
                Quero meu combo <ArrowUpRight size={19} />
              </button>
            </div>
            <div className="combo-visual">
              <span className="combo-stamp">
                COMBO DA
                <br />
                <b>HOUSE</b>
                <small>POR R$ 39,90</small>
              </span>
              <ProductImage
                src="/images/fries.svg"
                alt="Batatas fritas do combo"
                className="combo-fries"
              />
              <ProductImage
                src="/images/drink.svg"
                alt="Refrigerante do combo"
                className="combo-drink"
              />
              <ProductImage
                src="/images/popular-burger-classic.png"
                alt="House Classic do combo"
                className="combo-burger"
              />
            </div>
          </div>
        </section>
        <section className="about-section container" id="sobre">
          <div className="about-emblem">
            <Sandwich size={70} strokeWidth={1} />
            <span>
              FEITO NA BRASA
              <br />
              <b>DESDE 2024</b>
            </span>
          </div>
          <div>
            <div className="eyebrow dark">
              MUITO ALÉM DE PÃO, CARNE E QUEIJO.
            </div>
            <h2>
              A NOSSA CASA.
              <br />O SEU NOVO <span>FAVORITO.</span>
            </h2>
          </div>
          <div className="about-copy">
            <p>
              A Burger House nasceu de uma ideia simples: fazer o burger que a
              gente sempre quis comer. Sem atalhos, com ingredientes de verdade
              e personalidade em cada mordida.
            </p>
            <p>Acenda a fome. A brasa já está pronta.</p>
            <span>
              <Heart size={16} /> Feito com paixão por hambúrguer.
            </span>
          </div>
        </section>
      </main>
      <footer>
        <div className="container footer-main">
          <Logo />
          <p>Feito na brasa. Feito pra você.</p>
          <a href="#cardapio">
            Bora de burger? <ArrowUpRight size={19} />
          </a>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} Burger House. Todos os sabores
            reservados.
          </span>
          <span>Projeto demonstrativo · Hamburgueria fictícia</span>
          <span>
            <Clock3 size={14} /> Aqui, a fome sempre tem vez.
          </span>
        </div>
      </footer>
      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onAdd={add}
        />
      )}
      {panel === "cart" && (
        <CartDrawer
          items={cart.items}
          total={cart.total}
          onUpdate={cart.update}
          onRemove={cart.remove}
          onClose={() => setPanel(null)}
          onCheckout={() => {
            if (!cartIssue(cart.items)) setPanel("checkout");
          }}
        />
      )}
      {panel === "checkout" && (
        <Checkout
          items={cart.items}
          total={cart.total}
          onClose={() => setPanel(null)}
          onBack={() => setPanel("cart")}
          onComplete={() => {
            cart.clear();
            setPanel(null);
          }}
        />
      )}
      <div className="toast-region" role="status" aria-live="polite">
        {toast.message && (
          <div className="toast">
            <Check size={20} />
            <span>{toast.message}</span>
            <button
              onClick={() => {
                toast.dismiss();
                setPanel("cart");
              }}
            >
              Ver carrinho <ArrowRight size={16} />
            </button>
            <button
              className="icon-button toast-dismiss"
              aria-label="Fechar aviso"
              onClick={toast.dismiss}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
      {cart.count > 0 && !selected && !panel && (
        <div className="mobile-cart-bar">
          <button onClick={() => setPanel("cart")}>
            <ShoppingBag size={21} />
            <span>
              <b>
                Ver carrinho · {cart.count}{" "}
                {cart.count === 1 ? "item" : "itens"}
              </b>
              <small>Revise e finalize seu pedido</small>
            </span>
            <strong>{money(cart.total)}</strong>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
      {cart.notice && (
        <div className="restore-notice" role="status">
          <span>{cart.notice}</span>
          <button
            className="icon-button"
            aria-label="Fechar aviso do carrinho"
            onClick={cart.dismissNotice}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {cart.storageError && (
        <div className="storage-message" role="status">
          O navegador não permitiu salvar o carrinho. Seus itens serão mantidos
          enquanto esta página estiver aberta.
        </div>
      )}
    </MotionConfig>
  );
}
