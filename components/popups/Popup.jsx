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
          background: S.white,
          border: S.line,
          borderRadius: S.radius.lg,
          padding: 24,
          width: 300,
          boxShadow: S.shadow.popup,
        }}
      >
        {children}
      </div>
    </div>
  );
}
