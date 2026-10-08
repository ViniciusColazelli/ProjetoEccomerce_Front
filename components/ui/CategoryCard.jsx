// components/ui/CategoryCard.jsx
// O zoom da foto no hover fica no globals.css (.bu-cat-card)
import { S } from "styles/theme";

export default function CategoryCard({ cat }) {
  return (
    <div className="bu-cat-card" style={{ cursor: "pointer" }}>
      <div
        style={{
          background: "#f2f2f2",
          aspectRatio: "4/5",
          borderRadius: S.radius.sm,
          overflow: "hidden",
        }}
      >
        <img
          src={cat.img}
          alt={cat.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginTop: 12,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 600, color: S.dark }}>
          {cat.name}
        </span>
        <span className="bu-cat-link" style={{ fontSize: 13 }}>
          Ver peças
        </span>
      </div>
    </div>
  );
}
