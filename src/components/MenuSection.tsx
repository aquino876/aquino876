import { useState } from "react";
import {
  Search,
  Sandwich,
  Package,
  UtensilsCrossed,
  CupSoda,
  Flame,
  ArrowRight,
  Heart,
} from "lucide-react";
import { categories } from "../data/products";
import { filterProducts } from "../lib/catalog";
import { ProductCard } from "./ProductCard";
import type { Category, Product } from "../types";
const categoryIcons = [Sandwich, Package, UtensilsCrossed, CupSoda];
export function MenuSection({
  onSelect,
}: {
  onSelect: (product: Product) => void;
}) {
  const [category, setCategory] = useState<Category>("Hambúrgueres");
  const [search, setSearch] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const filtered = filterProducts(category, search, onlyAvailable);
  return (
    <section
      className="menu-section container"
      id="cardapio"
      tabIndex={-1}
      aria-labelledby="menu-title"
    >
      <div className="section-top">
        <div>
          <div className="eyebrow dark">
            <Flame size={15} /> SUA PRÓXIMA MORDIDA ESTÁ AQUI
          </div>
          <h2 id="menu-title">
            ESCOLHA SEU <span>FAVORITO.</span>
          </h2>
          <p>Feitos na hora. Do jeito que um burger de verdade deve ser.</p>
        </div>
        <div className="handwritten" aria-hidden="true">
          difícil vai ser
          <br />
          escolher só um! <span>↙</span>
        </div>
      </div>
      <div className="menu-toolbar">
        <div
          className="category-tabs"
          role="group"
          aria-label="Categorias do cardápio"
        >
          {categories.map((name, index) => {
            const Icon = categoryIcons[index];
            return (
              <button
                key={name}
                className={category === name ? "active" : ""}
                aria-pressed={category === name}
                onClick={() => setCategory(name)}
              >
                <Icon size={19} />
                {name}
              </button>
            );
          })}
        </div>
        <div className="search">
          <Search size={18} />
          <input
            aria-label="Buscar no cardápio"
            aria-describedby="search-hint"
            placeholder={`Buscar em ${category.toLowerCase()}`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} aria-label="Limpar busca">
              ×
            </button>
          )}
        </div>
      </div>
      <div className="menu-filter-row">
        <span id="search-hint">
          Busque pelo nome ou ingrediente nesta categoria.
        </span>
        <label>
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(event) => setOnlyAvailable(event.target.checked)}
          />{" "}
          Somente disponíveis
        </label>
      </div>
      <div className="menu-caption">
        <span>
          {category === "Hambúrgueres"
            ? "OS QUERIDINHOS DA HOUSE"
            : category.toUpperCase()}
        </span>
        <small role="status" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "opção" : "opções"} para
          você
        </small>
      </div>
      <div className="products-grid">
        {filtered.map((product) => (
          <ProductCard product={product} key={product.id} onSelect={onSelect} />
        ))}
      </div>
      {!filtered.length && (
        <div className="no-results">
          <Search size={32} />
          <h3>Nenhuma mordida por aqui.</h3>
          <p>Tente outro nome, escolha uma categoria ou limpe os filtros.</p>
          <button
            onClick={() => {
              setSearch("");
              setOnlyAvailable(false);
            }}
            className="text-button"
          >
            Limpar busca e filtros <ArrowRight size={16} />
          </button>
        </div>
      )}
      <div className="menu-footnote">
        <Heart size={14} /> Cada burger é preparado na hora, com ingredientes
        selecionados e muito cuidado.
      </div>
    </section>
  );
}
