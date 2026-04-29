// components/popups/SearchPopup.jsx
import Popup from "./Popup";
import { S } from "../../styles/theme";

export default function SearchPopup({ onClose }) {
  return (
    <Popup onClose={onClose}>
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: S.gold,
          marginBottom: 12,
        }}
      >
        Pesquisar
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          autoFocus
          placeholder="Buscar produtos..."
          style={{
            flex: 1,
            padding: "9px 12px",
            border: `0.5px solid ${S.border}`,
            borderRadius: 8,
            fontSize: 14,
            fontFamily: S.sans,
            outline: "none",
          }}
        />
        <button
          style={{
            background: S.dark,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "0 14px",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          →
        </button>
      </div>
    </Popup>
  );
}
