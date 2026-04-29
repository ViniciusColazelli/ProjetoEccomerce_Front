// components/popups/Popup.jsx
// Wrapper base reutilizado por todos os popups
import { S } from "../../styles/theme";

export default function Popup({ onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: 72,
          right: 32,
          background: "#fff",
          border: `0.5px solid ${S.border}`,
          borderRadius: 12,
          padding: 24,
          width: 300,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
