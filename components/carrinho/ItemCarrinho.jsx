// components/carrinho/ItemCarrinho.jsx
// Uma linha do carrinho: peça, variante, personalizações, quantidade e subtotal.
// `compacto` é a versão do popup.
import Link from "next/link";
import { S } from "styles/theme";
import { formatarPreco, descreverVariante } from "lib/formatar";
import { useCart, MAXIMO_QUANTIDADE } from "context/CartContext";
import Quantidade from "components/ui/Quantidade";
import Icon from "components/ui/Icon";

export default function ItemCarrinho({ item, compacto, disabled }) {
  const { alterarQuantidade, remover } = useCart();

  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        padding: compacto ? "12px 0" : "18px 0",
        borderBottom: S.line,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link
          href={`/produtos/${item.produtoId}`}
          className="bu-link-muted"
          style={{
            fontSize: compacto ? 14 : 15,
            fontWeight: 600,
            color: S.dark,
          }}
        >
          {item.nome}
        </Link>
        <p style={{ fontSize: 12, color: S.muted, marginTop: 2 }}>
          {descreverVariante(item.tamanho, item.cor)}
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 10,
          }}
        >
          <Quantidade
            valor={item.quantidade}
            max={MAXIMO_QUANTIDADE}
            disabled={disabled}
            onChange={(q) => alterarQuantidade(item.chave, q)}
          />
          <button
            type="button"
            onClick={() => remover(item.chave)}
            disabled={disabled}
            aria-label={`Remover ${item.nome}`}
            className="bu-icon-btn"
          >
            <Icon name="trash" size={16} color={S.muted} />
          </button>
        </div>
      </div>

      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600 }}>
          {formatarPreco(item.precoUnitario * item.quantidade)}
        </p>
        {item.quantidade > 1 && (
          <p style={{ fontSize: 12, color: S.muted, marginTop: 2 }}>
            {formatarPreco(item.precoUnitario)} cada
          </p>
        )}
      </div>
    </div>
  );
}
