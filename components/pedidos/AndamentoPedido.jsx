// components/pedidos/AndamentoPedido.jsx
// Linha do tempo do pedido: recebido → pago → (em produção) → pronto → entregue.
// "Em produção" é opcional na API (peça sem personalização pula essa etapa),
// então só aparece quando o pedido está nela ou tem alguma personalização.
// Pedido cancelado não tem andamento: a página mostra só o aviso.
import { S } from "styles/theme";
import Icon from "components/ui/Icon";

const ETAPAS = [
  { status: "AguardandoPagamento", rotulo: "Pedido recebido" },
  { status: "Pago", rotulo: "Pagamento confirmado" },
  { status: "EmProducao", rotulo: "Em produção", opcional: true },
  { status: "ProntoParaRetirada", rotulo: "Pronto para retirada" },
  { status: "Entregue", rotulo: "Entregue" },
];

export default function AndamentoPedido({ pedido }) {
  if (pedido.status === "Cancelado") return null;

  const temProducao =
    pedido.status === "EmProducao" ||
    pedido.itens.some((i) => i.personalizacoes.length > 0);
  const etapas = ETAPAS.filter((e) => !e.opcional || temProducao);
  const atual = etapas.findIndex((e) => e.status === pedido.status);

  return (
    <ol
      aria-label="Andamento do pedido"
      style={{
        display: "flex",
        listStyle: "none",
        margin: "0 0 20px",
        padding: 0,
      }}
    >
      {etapas.map((etapa, i) => {
        const feita = i < atual || pedido.status === "Entregue";
        const agora = i === atual && pedido.status !== "Entregue";
        const cor = feita || agora ? S.primary : S.border;

        return (
          <li
            key={etapa.status}
            aria-current={agora ? "step" : undefined}
            style={{
              flex: 1,
              position: "relative",
              textAlign: "center",
              minWidth: 0,
            }}
          >
            {/* Linha até a etapa anterior */}
            {i > 0 && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 13,
                  right: "50%",
                  width: "100%",
                  height: 2,
                  background: i <= atual ? S.primary : S.border,
                }}
              />
            )}
            <span
              style={{
                position: "relative",
                width: 28,
                height: 28,
                margin: "0 auto 8px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: feita ? S.primary : S.white,
                border: `2px solid ${cor}`,
              }}
            >
              {feita ? (
                <Icon name="check" size={14} color={S.white} stroke={3} />
              ) : (
                agora && (
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: S.primary,
                    }}
                  />
                )
              )}
            </span>
            <span
              style={{
                display: "block",
                fontSize: 12,
                lineHeight: 1.3,
                padding: "0 4px",
                color: feita || agora ? S.dark : S.muted,
                fontWeight: agora ? 600 : 400,
              }}
            >
              {etapa.rotulo}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
