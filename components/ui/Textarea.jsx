// components/ui/Textarea.jsx
// Mesmo visual do Input, para textos longos (descrição, observação)
import { S } from "styles/theme";

export default function Textarea({ style, ...props }) {
  return (
    <textarea
      rows={3}
      {...props}
      style={{
        width: "100%",
        padding: "10px 12px",
        border: S.line,
        borderRadius: S.radius.sm,
        fontSize: 14,
        fontFamily: S.sans,
        marginBottom: 12,
        outline: "none",
        background: S.white,
        resize: "vertical",
        ...style,
      }}
    />
  );
}
