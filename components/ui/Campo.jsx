// components/ui/Campo.jsx
// Rótulo em cima de qualquer controle (Select, Textarea, Quantidade...).
// Para Input simples continue usando o FormField.
import { T } from "styles/theme";

export default function Campo({ label, children, style }) {
  return (
    <label style={{ display: "block", ...style }}>
      <span style={{ ...T.label, display: "block", marginBottom: 6 }}>
        {label}
      </span>
      {children}
    </label>
  );
}
