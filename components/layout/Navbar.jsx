// components/layout/Navbar.jsx
import NavBtn from "../ui/NavBtn";
import { S } from "../../styles/theme";

export default function Navbar({ onSearch, onAuth, onCart }) {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 40px",
        borderBottom: `0.5px solid ${S.border}`,
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div>
        <div
          style={{
            fontFamily: S.serif,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          BelissimaUniformes
        </div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.22em",
            color: S.muted,
            textTransform: "uppercase",
            marginTop: 2,
            fontWeight: 300,
          }}
        >
          Roupas com Qualidade
        </div>
      </div>

      {/* Ações */}
      <div style={{ display: "flex", gap: 10 }}>
        <NavBtn onClick={onSearch}>
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#333"
            strokeWidth="1.6"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
        </NavBtn>
        <NavBtn onClick={onAuth}>
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#333"
            strokeWidth="1.6"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </NavBtn>
        <NavBtn onClick={onCart} badge>
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#333"
            strokeWidth="1.6"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </NavBtn>
      </div>
    </nav>
  );
}
