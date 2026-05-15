// components/layout/Navbar.jsx
import { useState } from "react";
import { useRouter } from "next/router";
import NavBtn from "../ui/NavBtn";
import { S } from "../../styles/theme";
import { useAuthContext } from "../../context/AuthContext";

export default function Navbar({ onSearch, onAuth, onCart }) {
  const router = useRouter();
  const { usuario, logout } = useAuthContext();
  const [dropdown, setDropdown] = useState(false);

  function handleLogout() {
    logout();
    setDropdown(false);
    router.push("/");
  }

  const inicial = usuario?.nome?.charAt(0).toUpperCase() ?? "U";
  const primeiroNome = usuario?.nome?.split(" ")[0] ?? "Usuário";

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
      {/* Logo — botão que redireciona para a home */}
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

        {usuario ? (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setDropdown((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 12px",
                border: `0.5px solid ${S.border}`,
                borderRadius: 10,
                background: "#fff",
                cursor: "pointer",
                fontFamily: S.sans,
                fontSize: 13,
                color: S.dark,
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: S.gold,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {inicial}
              </span>
              <span>{primeiroNome}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#999"
                strokeWidth="2"
                style={{
                  transform: dropdown ? "rotate(180deg)" : "none",
                  transition: "transform 0.15s",
                }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {dropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  background: "#fff",
                  border: `0.5px solid ${S.border}`,
                  borderRadius: 10,
                  padding: 8,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
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
                  style={{
                    height: "0.5px",
                    background: S.border,
                    margin: "8px 0",
                  }}
                />

                {/* Link para página de perfil */}
                <button
                  onClick={() => {
                    router.push("/perfil");
                    setDropdown(false);
                  }}
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
                    color: S.dark,
                  }}
                >
                  Minha conta
                </button>

                <button
                  onClick={handleLogout}
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
                    color: "#c0392b",
                  }}
                >
                  Sair da conta
                </button>
              </div>
            )}
          </div>
        ) : (
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
        )}

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
