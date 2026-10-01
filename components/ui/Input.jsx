// components/ui/Input.jsx
import { S } from "styles/theme";

export default function Input({ style, ...props }) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "10px 12px",
        border: S.line,
        borderRadius: S.radius.sm,
        fontSize: 14,
        fontFamily: S.sans,
        marginBottom: 12,
        boxSizing: "border-box",
        outline: "none",
        background: S.white,
        ...style,
      }}
    />
  );
}
