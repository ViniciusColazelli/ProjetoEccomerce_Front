// components/ui/Modal.jsx
// Janela centralizada com fundo escurecido. Fecha no X, com Esc ou clicando fora.
import { S, T } from "styles/theme";
import { useEsc } from "hooks/useEsc";
import Icon from "./Icon";

export default function Modal({ titulo, onClose, width = 440, children }) {
  useEsc(onClose);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(17,17,17,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        className="bu-pop"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: S.white,
          borderRadius: S.radius.xl,
          padding: 28,
          width,
          maxWidth: "100%",
          maxHeight: "calc(100vh - 32px)",
          overflowY: "auto",
          boxShadow: S.shadow.popup,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 18,
          }}
        >
          <h2 style={{ ...T.titulo, fontSize: 20 }}>{titulo}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="bu-icon-btn"
          >
            <Icon name="x" size={18} color={S.soft} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
