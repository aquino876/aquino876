import { motion } from "motion/react";
import { ArrowUpRight, Flame, Star, Clock3, Bike, Leaf } from "lucide-react";
import { ProductImage } from "./ProductImage";
export function Hero() {
  return (
    <>
      <section className="hero" id="inicio">
        <div className="container hero-grid">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="eyebrow">
              <span /> ARTESANAL DE VERDADE. SEM ATALHOS.
            </div>
            <h1>
              O SABOR QUE
              <br />
              CONQUISTA NA
              <br />
              PRIMEIRA <span>MORDIDA.</span>
            </h1>
            <p>
              Carne na brasa, ingredientes frescos e aquela
              <br className="desktop-break" /> combinação que faz você querer
              mais.
            </p>
            <a className="button hero-button" href="#cardapio">
              Explorar cardápio <ArrowUpRight size={21} />
            </a>
            <div className="hero-social">
              <div className="customer-avatars">
                <span>JP</span>
                <span>AM</span>
                <span>RC</span>
                <span>+</span>
              </div>
              <div>
                <div className="stars">
                  ★★★★★ <strong>4,9</strong>
                </div>
                <small>O favorito de quem entende de burger.</small>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-orbit" />
            <span className="hero-script">
              feito na brasa,
              <br />
              feito pra você.
              <svg viewBox="0 0 100 55" aria-hidden="true">
                <path d="M8 5Q5 52 83 38m-15-12 17 12-18 9" />
              </svg>
            </span>
            <div className="hero-badge">
              <Flame size={22} />
              <span>
                100%
                <br />
                <small>ARTESANAL</small>
              </span>
            </div>
            <ProductImage
              src="/images/hero-burger.png"
              alt="Hambúrguer artesanal com dois burgers, queijo, alface e tomate"
              className="hero-burger"
              loading="eager"
            />
            <div className="hero-product">
              <span>O CLÁSSICO TEM SEU LUGAR.</span>
              <strong>
                House Classic{" "}
                <span>
                  a partir de <b>R$ 28,90</b>
                </span>
              </strong>
            </div>
            <span className="hero-coordinate">
              EST. 2024 · FEITO COM ATITUDE
            </span>
          </motion.div>
        </div>
      </section>
      <div className="benefits">
        <div className="container benefits-inner">
          <span>
            <Flame /> Grelhado na brasa
          </span>
          <i />
          <span>
            <Leaf /> Ingredientes frescos
          </span>
          <i />
          <span>
            <Bike /> Entrega com carinho
          </span>
          <i />
          <span>
            <Clock3 /> Sabor que vale a espera
          </span>
          <Star className="benefits-star" />
        </div>
      </div>
    </>
  );
}
