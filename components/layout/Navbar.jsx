// components/layout/Navbar.jsx
import { useRouter } from "next/router";
import NavBtn from "../ui/NavBtn";
import Icon from "../ui/Icon";
import UserMenu from "./UserMenu";
import { S } from "../../styles/theme";
import { useAuthContext } from "../../context/AuthContext";

export default function Navbar({ onSearch, onAuth, onCart }) {
  const router = useRouter();
  const { usuario } = useAuthContext();

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 40px",
        borderBottom: S.line,
        background: S.white,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo — redireciona para a home */}
      <button
        onClick={() => router.push("/")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          textAlign: "left",
        }}
      >
        <div
          style={{
            fontFamily: S.serif,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.02em",
            color: S.dark,
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
      </button>

      {/* Ações */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <NavBtn onClick={onSearch}>
          <Icon name="search" />
        </NavBtn>

        {usuario ? (
          <UserMenu />
        ) : (
          <NavBtn onClick={onAuth}>
            <Icon name="user" />
          </NavBtn>
        )}

        <NavBtn onClick={onCart} badge>
          <Icon name="bag" />
        </NavBtn>
      </div>
    </nav>
  );
}
