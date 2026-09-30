// components/ui/Card.jsx
import { S, T } from "../../styles/theme";

export default function Card({ titulo, children, style }) {
  return (
    <section
      style={{
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
