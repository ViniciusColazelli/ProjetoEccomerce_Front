// components/ui/Select.jsx
// Mesmo visual do Input. `opcoes`: [{ valor, rotulo }]
import { S } from "styles/theme";

export default function Select({ opcoes, style, ...props }) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        padding: "10px 12px",
        border: S.line,
        borderRadius: S.radius.sm,
        fontSize: 14,
        fontFamily: S.sans,
        marginBottom: 12,
        background: S.white,
        color: S.dark,
        outline: "none",
        cursor: "pointer",
        ...style,
      }}
    >
      {opcoes.map((o) => (
        <option key={o.valor} value={o.valor}>
          {o.rotulo}
        </option>
      ))}
    </select>
  );
}
