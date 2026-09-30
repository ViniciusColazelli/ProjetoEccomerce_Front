// components/popups/SearchPopup.jsx
import Popup from "./Popup";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { T } from "../../styles/theme";

export default function SearchPopup({ onClose }) {
  return (
    <Popup onClose={onClose}>
      <p style={{ ...T.eyebrow, letterSpacing: "0.2em", marginBottom: 12 }}>
        Pesquisar
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <Input
          autoFocus
          placeholder="Buscar produtos..."
          style={{ flex: 1, marginBottom: 0 }}
        />
        <Button style={{ padding: "0 14px" }}>→</Button>
      </div>
    </Popup>
  );
}
