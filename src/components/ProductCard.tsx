import { Plus, Flame } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../types";
import { money } from "../lib/cart";
import { Availability } from "./Availability";
import { ProductImage } from "./ProductImage";
export function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (product: Product) => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`product-card ${product.available ? "" : "unavailable"}`}
    >
      <button
        className="product-image-button"
        onClick={() => onSelect(product)}
        disabled={!product.available}
        aria-label={`Ver ${product.name}`}
      >
        <div className="product-photo">
          {product.badge && (
            <span
              className={`product-badge ${product.id === "bacon" ? "red" : ""}`}
            >
              {product.id === "classic" && <Flame size={12} />} {product.badge}
            </span>
          )}
          <ProductImage src={product.image} alt={product.name} />
          <span className="photo-watermark">BH.</span>
        </div>
      </button>
      <div className="product-body">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <Availability available={product.available} />
        <div className="product-bottom">
          <strong>{money(product.price)}</strong>
          <button
            className="add-button"
            onClick={() => onSelect(product)}
            disabled={!product.available}
            aria-label={
              product.available
                ? `Personalizar ${product.name}`
                : `${product.name} esgotado`
            }
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
