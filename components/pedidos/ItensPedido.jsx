// components/pedidos/ItensPedido.jsx
// Tabela de itens de um pedido (cliente e admin) com o total no rodapé.
// Os preços são os gravados no momento da compra.
import { S } from "styles/theme";
import { formatarPreco, descreverVariante } from "lib/formatar";

export default function ItensPedido({ pedido }) {
  return (
    <div className="bu-table-wrap">
      <table className="bu-table">
        <thead>
          <tr>
            <th>Peça</th>
            <th className="bu-num">Qtd.</th>
            <th className="bu-num">Unitário</th>
            <th className="bu-num">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {pedido.itens.map((item) => (
            <tr key={item.id}>
              <td>
                <p style={{ fontWeight: 500 }}>{item.produto}</p>
                <p style={{ fontSize: 12, color: S.muted, marginTop: 2 }}>
                  {descreverVariante(item.tamanho, item.cor) ||
                    "Variante removida"}
                </p>
                {item.personalizacoes.length > 0 && (
                  <p style={{ fontSize: 12, color: S.soft, marginTop: 2 }}>
                    +{" "}
                    {item.personalizacoes
                      .map(
                        (p) =>
                          `${p.valor}${p.precoAdicional ? ` (${formatarPreco(p.precoAdicional)})` : ""}`,
                      )
                      .join(", ")}
                  </p>
                )}
              </td>
              <td className="bu-num">{item.quantidade}</td>
              <td className="bu-num">{formatarPreco(item.precoUnitario)}</td>
              <td className="bu-num">{formatarPreco(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td
              colSpan={3}
              style={{
                textAlign: "right",
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: S.muted,
                borderTop: S.line,
              }}
            >
              Total
            </td>
            <td
              className="bu-num"
              style={{ fontSize: 17, fontWeight: 600, borderTop: S.line }}
            >
              {formatarPreco(pedido.total)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
