// components/ui/StatusBadge.jsx
// Etiqueta colorida do status do pedido
import { STATUS_PEDIDO } from "lib/statusPedido";
import { S } from "styles/theme";

export default function StatusBadge({ status }) {
  const info = STATUS_PEDIDO[status];
  return (
    <Badge bg={info?.cor.bg} color={info?.cor.text}>
      {info?.rotulo ?? status}
    </Badge>
  );
}

// Produto, opção ou variante ativa/inativa
export function BadgeAtivo({ ativo }) {
  return ativo ? (
    <Badge bg={S.success.bg} color={S.success.text}>
      Ativo
    </Badge>
  ) : (
    <Badge>Inativo</Badge>
  );
}

// Etiqueta genérica (ativo/inativo, entrada/saída...)
export function Badge({ bg = "#f5f5f5", color = "#666", children }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        whiteSpace: "nowrap",
        background: bg,
        color,
      }}
    >
      {children}
    </span>
  );
}
