// components/layout/Navbar.jsx
// Faixa de contato + barra principal (logo, links e ações), fixas no topo
import Link from "next/link";
import NavBtn from "components/ui/NavBtn";
import Icon from "components/ui/Icon";
import Logo from "components/ui/Logo";
import ContatoLink from "components/ui/ContatoLink";
import UserMenu from "./UserMenu";
import { S } from "styles/theme";
import { useAuthContext } from "context/AuthContext";
import { usePopup } from "context/PopupContext";
import { useCarrinho } from "context/CarrinhoContext";
import { LINKS } from "lib/navegacao";

const linkTopo = { display: "flex", alignItems: "center", gap: 6 };

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
          <ContatoLink
            rede="whatsapp"
            iconSize={14}
            color={S.white}
            style={linkTopo}
          />
          <ContatoLink
            rede="instagram"
            iconSize={14}
            color={S.white}
            style={linkTopo}
          />
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { usuario } = useAuthContext();
  const { toggle } = usePopup();
  const { totalPecas } = useCarrinho();

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
            <Logo height={85} />
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
            <NavBtn onClick={() => toggle("search")} label="Buscar produtos">
              <Icon name="search" />
            </NavBtn>

            {usuario ? (
              <UserMenu />
            ) : (
              <NavBtn onClick={() => toggle("auth")} label="Entrar">
                <Icon name="user" />
              </NavBtn>
            )}

            <NavBtn
              onClick={() => toggle("cart")}
              badge={totalPecas}
              label="Carrinho"
            >
              <Icon name="bag" />
            </NavBtn>

            <span className="bu-nav-menu">
              <NavBtn onClick={() => toggle("menu")} label="Menu">
                <Icon name="menu" />
              </NavBtn>
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}
