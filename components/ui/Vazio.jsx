// components/ui/Vazio.jsx
// Mensagem de lista vazia, com uma ação opcional embaixo
import { S } from "styles/theme";

export default function Vazio({ children, acao }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "56px 16px",
        color: S.muted,
        fontSize: 14,
      }}
    >
      <p>{children}</p>
      {acao && <div style={{ marginTop: 18 }}>{acao}</div>}
    </div>
  );
}
