// components/ui/NavBtn.jsx
// O fundo e o hover ficam no globals.css (.bu-nav-btn): estilo inline venceria o :hover
// `badge`: número mostra a contagem (some quando 0); true mostra só um ponto
import { S } from "styles/theme";

export default function NavBtn({ onClick, badge, label, children }) {
  const contagem = typeof badge === "number" ? badge : null;
  const mostrar = contagem === null ? !!badge : contagem > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="bu-nav-btn"
      style={{
        border: S.line,
        borderRadius: S.radius.md,
        padding: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {children}
      {mostrar &&
        (contagem === null ? (
          <span
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              width: 7,
              height: 7,
              background: S.primary,
              borderRadius: "50%",
            }}
          />
        ) : (
          <span
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              minWidth: 18,
              height: 18,
              padding: "0 5px",
              background: S.primary,
              color: S.white,
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {contagem > 99 ? "99+" : contagem}
          </span>
        ))}
    </button>
  );
}
