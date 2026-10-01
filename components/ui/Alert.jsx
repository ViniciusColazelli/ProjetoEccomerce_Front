// components/ui/Alert.jsx
// Retorna null quando não há conteúdo, então dispensa o {erro && (...)} nas páginas
import { S } from "styles/theme";

export default function Alert({ type = "error", children }) {
  if (!children) return null;
  const c = S[type]; // S.error ou S.success

  return (
    <div
      style={{
        background: c.bg,
        border: `0.5px solid ${c.border}`,
        color: c.text,
        borderRadius: S.radius.sm,
        padding: "8px 12px",
        marginBottom: 12,
        fontSize: 13,
      }}
    >
      {children}
    </div>
  );
}
