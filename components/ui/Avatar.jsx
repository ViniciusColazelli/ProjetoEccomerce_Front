// components/ui/Avatar.jsx
import { S } from "../../styles/theme";

export default function Avatar({ nome, size = 26 }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: S.gold,
        color: S.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: S.serif,
        fontSize: Math.round(size * 0.42),
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {nome?.charAt(0).toUpperCase() ?? "U"}
    </span>
  );
}
