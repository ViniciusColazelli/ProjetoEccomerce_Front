// components/popups/CartPopup.jsx
import Popup from "./Popup";
import { S } from "../../styles/theme";

export default function CartPopup({ onClose }) {
  return (
    <Popup onClose={onClose}>
      <p
        style={{
          fontFamily: S.serif,
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 14,
        }}
      >
        Meu carrinho
      </p>
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
      <button
        style={{
          width: "100%",
          padding: 10,
          background: S.dark,
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 13,
          fontFamily: S.sans,
          cursor: "pointer",
        }}
      >
        Ver produtos
      </button>
    </Popup>
  );
}
