// components/layout/UserMenu.jsx
// Botão com avatar + dropdown (Minha conta / Sair)
import { useState } from "react";
import { useRouter } from "next/router";
import { S } from "styles/theme";
import { useAuthContext } from "context/AuthContext";
import Avatar from "components/ui/Avatar";
import Icon from "components/ui/Icon";

function MenuItem({ onClick, color = S.dark, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "7px 8px",
        border: "none",
        background: "none",
        borderRadius: 7,
        fontSize: 13,
        cursor: "pointer",
        fontFamily: S.sans,
        color,
      }}
    >
      {children}
    </button>
  );
}

export default function UserMenu() {
  const router = useRouter();
  const { usuario, logout } = useAuthContext();
  const [aberto, setAberto] = useState(false);

  const primeiroNome = usuario.nome?.split(" ")[0] ?? "Usuário";

  function ir(rota) {
    router.push(rota);
    setAberto(false);
  }

  function handleLogout() {
    logout();
    setAberto(false);
    router.push("/");
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setAberto((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 12px",
          border: S.line,
          borderRadius: S.radius.md,
          background: S.white,
          cursor: "pointer",
          fontFamily: S.sans,
          fontSize: 13,
          color: S.dark,
        }}
      >
        <Avatar nome={usuario.nome} />
        <span>{primeiroNome}</span>
        <Icon
          name="chevron"
          size={12}
          color={S.muted}
          stroke={2}
          style={{
            transform: aberto ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
          }}
        />
      </button>

      {aberto && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: S.white,
            border: S.line,
            borderRadius: S.radius.md,
            padding: 8,
            boxShadow: S.shadow.menu,
            minWidth: 180,
            zIndex: 200,
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: S.dark,
              padding: "4px 8px 2px",
            }}
          >
            {usuario.nome}
          </p>
          <div
            style={{ height: "0.5px", background: S.border, margin: "8px 0" }}
          />
          <MenuItem onClick={() => ir("/perfil")}>Minha conta</MenuItem>
          <MenuItem color={S.danger} onClick={handleLogout}>
            Sair da conta
          </MenuItem>
        </div>
      )}
    </div>
  );
}
