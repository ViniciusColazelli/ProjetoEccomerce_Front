// components/popups/Popup.jsx
// Wrapper base reutilizado por todos os popups
import { S } from "styles/theme";

export default function Popup({ onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200 }}>
      <div
        className="bu-pop"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: 118,
          right: 16,
          background: S.white,
          border: S.line,
          borderRadius: S.radius.xl,
          padding: 24,
          width: 320,
          maxWidth: "calc(100vw - 32px)",
          boxShadow: S.shadow.popup,
        }}
      >
        {children}
      </div>
    </div>
  );
}
