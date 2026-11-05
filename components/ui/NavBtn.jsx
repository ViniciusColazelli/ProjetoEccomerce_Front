// components/ui/NavBtn.jsx
// O fundo e o hover ficam no globals.css (.bu-nav-btn): estilo inline venceria o :hover
import { S } from "styles/theme";

export default function NavBtn({ onClick, badge, children }) {
  return (
    <button
      onClick={onClick}
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
      {badge && (
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
      )}
    </button>
  );
}
