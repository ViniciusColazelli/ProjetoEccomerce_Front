// components/layout/Footer.jsx
import { S } from "../../styles/theme";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: `0.5px solid ${S.border}`,
        padding: "26px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 12,
        color: "#bbb",
      }}
    >
      <span
        style={{
          fontFamily: S.serif,
          fontSize: 14,
          color: "#666",
          fontWeight: 700,
        }}
      >
        BelissimaUniformes
      </span>
      <span>© 2026 — Todos os direitos reservados</span>
    </footer>
  );
}
