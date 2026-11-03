import { useEffect, useRef, useState } from "react";
import { Menu, X, ShoppingBag, Sandwich, ArrowUpRight } from "lucide-react";
export function Logo() {
  return (
    <a className="logo" href="#inicio" aria-label="Burger House, início">
      <span className="logo-icon">
        <Sandwich size={30} strokeWidth={1.7} />
      </span>
      <span>
        BURGER
        <span className="logo-house">
          HOUSE<span className="logo-dot">®</span>
        </span>
      </span>
    </a>
  );
}
export function Header({
  count,
  onCart,
}: {
  count: number;
  onCart: () => void;
}) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav
          id="main-navigation"
          aria-label="Navegação principal"
          className={open ? "navigation open" : "navigation"}
        >
          <a href="#inicio" onClick={() => setOpen(false)}>
            Início
          </a>
          <a href="#cardapio" onClick={() => setOpen(false)}>
            Cardápio
          </a>
          <a href="#combo" onClick={() => setOpen(false)}>
            Combos <span className="tiny-label">VALE A PENA</span>
          </a>
          <a href="#sobre" onClick={() => setOpen(false)}>
            Nossa história
          </a>
        </nav>
        <div className="header-actions">
          <button
            className="cart-button"
            onClick={onCart}
            aria-label={`Abrir carrinho, ${count} itens`}
          >
            <ShoppingBag size={20} />
            <span className="cart-count">{count}</span>
          </button>
          <a href="#cardapio" className="button small header-cta">
            Fazer meu pedido <ArrowUpRight size={17} />
          </a>
          <button
            ref={toggleRef}
            aria-controls="main-navigation"
            className="icon-button mobile-toggle"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
