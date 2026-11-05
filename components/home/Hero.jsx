// components/home/Hero.jsx
import Button from "components/ui/Button";
import { S, T } from "styles/theme";
import { CATEGORIES } from "lib/categorias";
import { WHATSAPP_URL, LINK_EXTERNO } from "lib/contato";

const camisas = CATEGORIES[1];

export default function Hero() {
  return (
    <section style={{ background: S.white, borderBottom: S.line }}>
      <div
        className="bu-container bu-hero-grid"
        style={{ paddingTop: 64, paddingBottom: 64 }}
      >
        <div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: S.primary,
              marginBottom: 18,
            }}
          >
            Coleção 2026
          </p>
          <h1
            className="bu-hero-title"
            style={{
              ...T.titulo,
              fontSize: 54,
              lineHeight: 1.1,
              color: S.dark,
              marginBottom: 18,
              maxWidth: 520,
            }}
          >
            Uniformes que fazem a diferença
          </h1>
          <p
            style={{
              fontSize: 17,
              color: S.soft,
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            Qualidade, identidade e conforto.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <Button href="/#categorias" style={{ padding: "13px 28px" }}>
              Ver coleção
            </Button>
            <a href={WHATSAPP_URL} {...LINK_EXTERNO} className="bu-text-link">
              ou fale com a gente no WhatsApp
            </a>
          </div>
        </div>

        <figure style={{ margin: 0 }}>
          <div
            className="bu-hero-visual"
            style={{
              background: S.imageBg,
              height: 440,
              borderRadius: S.radius.sm,
              overflow: "hidden",
            }}
          >
            <img
              src={camisas.img}
              alt="Camisas pretas, frente e costas"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <figcaption
            style={{
              fontSize: 13,
              color: S.muted,
              marginTop: 10,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Camisa básica</span>
            <span>Coleção 2026</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
