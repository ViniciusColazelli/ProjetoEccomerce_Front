// components/home/CategoryGrid.jsx
import CategoryCard from "components/ui/CategoryCard";
import { S } from "styles/theme";
import { CATEGORIES } from "lib/categorias";

export default function CategoryGrid() {
  return (
    <section id="categorias">
      <div
        className="bu-container"
        style={{ paddingTop: 64, paddingBottom: 72 }}
      >
        <div style={{ marginBottom: 28 }}>
          <h2
            className="bu-section-title"
            style={{
              fontFamily: S.serif,
              fontSize: 32,
              fontWeight: 700,
              color: S.dark,
            }}
          >
            +Categorias
          </h2>
          <p style={{ fontSize: 15, color: S.muted, marginTop: 6 }}>
            A peça certa para cada necessidade.
          </p>
        </div>
        <div className="bu-cat-grid">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.name} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
