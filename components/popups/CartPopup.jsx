// components/popups/CartPopup.jsx
import Popup from "./Popup";
import Button from "../ui/Button";
import { S, T } from "../../styles/theme";

export default function CartPopup({ onClose }) {
  return (
    <Popup onClose={onClose}>
      <p style={T.popupTitle}>Meu carrinho</p>
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
      <Button full style={{ padding: 10, fontSize: 13 }}>
        Ver produtos
      </Button>
    </Popup>
  );
}
