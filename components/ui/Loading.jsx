// components/ui/Loading.jsx
import { S } from "styles/theme";

export default function Loading() {
  return (
    <p
      style={{
        color: S.muted,
        fontSize: 14,
        textAlign: "center",
        padding: "80px 0",
      }}
    >
      Carregando...
    </p>
  );
}
