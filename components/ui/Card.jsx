// components/ui/Card.jsx
import { S, T } from "styles/theme";

export default function Card({ titulo, id, children, style }) {
  return (
    <section
      id={id}
      style={{
        scrollMarginTop: 150,
        background: S.white,
        border: S.line,
        borderRadius: S.radius.xl,
        padding: "28px 32px",
        marginBottom: 24,
        ...style,
      }}
    >
      <h2 style={T.cardTitle}>{titulo}</h2>
      {children}
    </section>
  );
}
