// components/popups/Popup.jsx
// Wrapper base reutilizado por todos os popups. Fecha ao clicar fora ou com Esc.
import { S } from "styles/theme";
import { useEsc } from "hooks/useEsc";

export default function Popup({ onClose, width = 320, children }) {
  useEsc(onClose);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200 }}>
      <div
        className="bu-pop"
        role="dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: 118,
          right: 16,
          background: S.white,
          border: S.line,
          borderRadius: S.radius.xl,
          padding: 24,
          width,
          maxWidth: "calc(100vw - 32px)",
          maxHeight: "calc(100vh - 140px)",
          overflowY: "auto",
          boxShadow: S.shadow.popup,
        }}
      >
        {children}
      </div>
    </div>
  );
}
