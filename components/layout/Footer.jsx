// components/layout/Footer.jsx
import { S } from "styles/theme";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: S.line,
        padding: "26px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 12,
        color: S.faint,
      }}
    >
      <span
        style={{
          fontFamily: S.serif,
          fontSize: 14,
          color: S.soft,
          fontWeight: 700,
        }}
      >
        BelissimaUniformes
      </span>
      <span>© 2026 — Todos os direitos reservados</span>
    </footer>
  );
}
