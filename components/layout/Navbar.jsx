// components/layout/Navbar.jsx
// Faixa de contato + barra principal (logo, links e ações), fixas no topo
import Link from "next/link";
import NavBtn from "components/ui/NavBtn";
import Icon from "components/ui/Icon";
import UserMenu from "./UserMenu";
import { S } from "styles/theme";
import { useAuthContext } from "context/AuthContext";
import { CONTATO, WHATSAPP_URL, INSTAGRAM_URL } from "lib/contato";

const LINKS = [
  { label: "Início", href: "/" },
  { label: "Categorias", href: "/#categorias" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Contato", href: "#contato" },
];

const externo = { target: "_blank", rel: "noopener noreferrer" };

function TopBar() {
  return (
    <div style={{ background: S.primary, color: S.white, fontSize: 12 }}>
      <div
        className="bu-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 34,
          gap: 16,
        }}
      >
        <span className="bu-topbar-msg" style={{ letterSpacing: "0.04em" }}>
          Roupas com qualidade
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <a
            href={WHATSAPP_URL}
            {...externo}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Icon name="whatsapp" size={14} color={S.white} stroke={1.8} />
            {CONTATO.celular}
          </a>
          <a
            href={INSTAGRAM_URL}
            {...externo}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Icon name="instagram" size={14} color={S.white} stroke={1.8} />@
            {CONTATO.instagram}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Navbar({ onSearch, onAuth, onCart }) {
  const { usuario } = useAuthContext();

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <TopBar />
      <nav
        style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: S.line,
        }}
      >
        <div
          className="bu-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 100,
            paddingTop: 10,
            paddingBottom: 10,
            gap: 24,
          }}
        >
          {/* Logo — redireciona para a home */}
          <Link
            href="/"
            aria-label="Belíssima Uniformes — início"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src="/logo.png"
              alt="Belíssima Uniformes"
              style={{
                height: 85,
                width: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Link>

          <div
            className="bu-nav-links"
            style={{ display: "flex", alignItems: "center", gap: 32 }}
          >
            {LINKS.map((l) => (
              <Link key={l.label} href={l.href} className="bu-nav-link">
                {l.label}
              </Link>
            ))}
          </div>

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
        </div>
      </nav>
    </header>
  );
}
