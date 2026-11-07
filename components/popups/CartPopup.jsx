// components/popups/CartPopup.jsx
import Popup from "./Popup";
import Button from "components/ui/Button";
import ItemCarrinho from "components/carrinho/ItemCarrinho";
import { useCarrinho } from "context/CarrinhoContext";
import { formatarPreco } from "lib/formatar";
import { S, T } from "styles/theme";

export default function CartPopup({ onClose }) {
  const { itens, totalEstimado } = useCarrinho();

  return (
    <Popup onClose={onClose} width={380}>
      <p style={T.popupTitle}>Meu carrinho</p>

      {itens.length === 0 ? (
        <>
          <p
            style={{
              fontSize: 13,
              color: S.muted,
              textAlign: "center",
              padding: "20px 0",
            }}
          >
            Seu carrinho está vazio.
          </p>
          <Button href="/produtos" full style={{ padding: 10, fontSize: 13 }}>
            Ver produtos
          </Button>
        </>
      ) : (
        <>
          <div style={{ borderTop: S.line }}>
            {itens.map((item) => (
              <ItemCarrinho key={item.chave} item={item} compacto />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              margin: "16px 0",
            }}
          >
            <span style={T.label}>Total</span>
            <span style={{ fontSize: 18, fontWeight: 600 }}>
              {formatarPreco(totalEstimado)}
            </span>
          </div>

          <Button href="/carrinho" full style={{ padding: 11, fontSize: 14 }}>
            Finalizar pedido
          </Button>
        </>
      )}
    </Popup>
  );
}
