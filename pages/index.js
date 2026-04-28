"use client";

import { useState } from "react";
import Image from "next/image";

// ── Troque pelas URLs das suas fotos ──────────────────────────────
const CALCAS_IMG =
  "https://media.istockphoto.com/id/1221134337/pt/foto/front-views-black-trousers.jpg?b=1&s=612x612&w=0&k=20&c=syywxyifQDpCpPT-ZhW6TBgkWFciwVyiNr9kLvNSz5E=";
const CAMISAS_IMG =
  "https://media.istockphoto.com/id/694412908/pt/foto/black-t-shirt-front-and-back-isolated-on-white-background-with-clipping-path.jpg?b=1&s=612x612&w=0&k=20&c=MTvI74ccVt8EKoBdP8nNHXjflb5bYFnbtlJNb9yIO3A=";
const BLUSAS_IMG =
  "https://media.istockphoto.com/id/2177201906/pt/foto/black-mens-hooded-sweatshirt.jpg?b=1&s=612x612&w=0&k=20&c=NhCqZPNyoFQcSkqkfrrs1cBxhUIJbLBg8ViH0AJPQ20=";
const SHORTS_IMG =
  "https://media.istockphoto.com/id/973758234/pt/foto/black-mens-shorts.jpg?b=1&s=612x612&w=0&k=20&c=a5TOZ6cKUIOXigzwhMi6o59tRA4-iKWSF-KhaHOwbqI=";
// ─────────────────────────────────────────────────────────────────

const categories = [
  { name: "Calças", img: CALCAS_IMG },
  { name: "Camisas", img: CAMISAS_IMG },
  { name: "Blusas", img: BLUSAS_IMG },
  { name: "Shorts", img: SHORTS_IMG },
];

/* ── Estilos reutilizáveis ── */
const S = {
  gold: "#8B6914",
  dark: "#111111",
  muted: "#999999",
  border: "#e2e2e2",
  heroBg: "#F2EFE8",
  pageBg: "#FAFAF7",
  serif: "Georgia, serif",
  sans: "'DM Sans', Arial, sans-serif",
};

/* ════════════════════════════════════════
   POP-UPS
════════════════════════════════════════ */
function Popup({ onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: 72,
          right: 32,
          background: "#fff",
          border: `0.5px solid ${S.border}`,
          borderRadius: 12,
          padding: 24,
          width: 300,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function SearchPopup({ onClose }) {
  return (
    <Popup onClose={onClose}>
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: S.gold,
          marginBottom: 12,
        }}
      >
        Pesquisar
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          autoFocus
          placeholder="Buscar produtos..."
          style={{
            flex: 1,
            padding: "9px 12px",
            border: `0.5px solid ${S.border}`,
            borderRadius: 8,
            fontSize: 14,
            fontFamily: S.sans,
            outline: "none",
          }}
        />
        <button
          style={{
            background: S.dark,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "0 14px",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          →
        </button>
      </div>
    </Popup>
  );
}

function AuthPopup({ onClose }) {
  const [tab, setTab] = useState("login");
  const inp = {
    width: "100%",
    padding: "9px 12px",
    border: `0.5px solid ${S.border}`,
    borderRadius: 8,
    fontSize: 13,
    fontFamily: S.sans,
    marginBottom: 10,
    boxSizing: "border-box",
    outline: "none",
  };
  return (
    <Popup onClose={onClose}>
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {["login", "cadastro"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "6px 14px",
              borderRadius: 7,
              fontSize: 13,
              cursor: "pointer",
              border: "none",
              fontFamily: S.sans,
              background: tab === t ? S.dark : "transparent",
              color: tab === t ? "#fff" : S.muted,
            }}
          >
            {t === "login" ? "Entrar" : "Cadastrar"}
          </button>
        ))}
      </div>
      <p
        style={{
          fontFamily: S.serif,
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 14,
        }}
      >
        {tab === "login" ? "Bem-vindo de volta" : "Criar conta"}
      </p>
      {tab === "cadastro" && <input placeholder="Nome completo" style={inp} />}
      <input type="email" placeholder="E-mail" style={inp} />
      <input type="password" placeholder="Senha" style={inp} />
      <button
        style={{
          width: "100%",
          padding: 10,
          background: S.dark,
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 14,
          fontFamily: S.sans,
          cursor: "pointer",
        }}
      >
        {tab === "login" ? "Entrar" : "Cadastrar"}
      </button>
    </Popup>
  );
}

function CartPopup({ onClose }) {
  return (
    <Popup onClose={onClose}>
      <p
        style={{
          fontFamily: S.serif,
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 14,
        }}
      >
        Meu carrinho
      </p>
      <p
        style={{
          fontSize: 13,
          color: S.muted,
          textAlign: "center",
          padding: "20px 0",
        }}
      >
        Seu carrinho está vazio.
      </p>
      <button
        style={{
          width: "100%",
          padding: 10,
          background: S.dark,
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 13,
          fontFamily: S.sans,
          cursor: "pointer",
        }}
      >
        Ver produtos
      </button>
    </Popup>
  );
}

/* ════════════════════════════════════════
   NAVBAR
════════════════════════════════════════ */
function NavBtn({ onClick, badge, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#f5f5f5" : "#fff",
        border: `0.5px solid ${S.border}`,
        borderRadius: 10,
        padding: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.15s",
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
            background: "#c0392b",
            borderRadius: "50%",
          }}
        />
      )}
    </button>
  );
}

function Navbar({ onSearch, onAuth, onCart }) {
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

/* ════════════════════════════════════════
   CATEGORIAS
════════════════════════════════════════ */
function CategoryCard({ cat }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        aspectRatio: "3/4",
        transform: hov ? "translateY(-4px)" : "none",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.15)" : "none",
      }}
    >
      {/* Next.js Image — otimizado automaticamente */}
      <img
        src={cat.img}
        alt={cat.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          filter: hov ? "brightness(0.8)" : "brightness(0.95)",
          transition: "filter 0.2s",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "14px",
          background: "rgba(17,17,17,0.82)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#fff",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
          }}
        >
          {cat.name}
        </span>
        <span
          style={{
            width: 28,
            height: 28,
            background: "#fff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111"
            strokeWidth="2.2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   PAGE (exportado como default para o Next.js)
════════════════════════════════════════ */
export default function Home() {
  const [popup, setPopup] = useState(null);
  const toggle = (name) => setPopup((p) => (p === name ? null : name));
  const close = () => setPopup(null);

  return (
    <div
      style={{
        fontFamily: S.sans,
        background: S.pageBg,
        minHeight: "100vh",
        color: S.dark,
      }}
    >
      {/* Pop-ups */}
      {popup === "search" && <SearchPopup onClose={close} />}
      {popup === "auth" && <AuthPopup onClose={close} />}
      {popup === "cart" && <CartPopup onClose={close} />}

      {/* Navbar */}
      <Navbar
        onSearch={() => toggle("search")}
        onAuth={() => toggle("auth")}
        onCart={() => toggle("cart")}
      />

      {/* Hero */}
      <section style={{ background: S.heroBg, padding: "64px 40px 80px" }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: S.gold,
            fontWeight: 400,
            marginBottom: 14,
          }}
        >
          Coleção 2026
        </p>
        <h1
          style={{
            fontFamily: S.serif,
            fontSize: 46,
            fontWeight: 700,
            lineHeight: 1.1,
            color: S.dark,
            marginBottom: 18,
            maxWidth: 480,
          }}
        >
          Uniformes que fazem a diferença
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "#666",
            fontWeight: 300,
            marginBottom: 32,
            lineHeight: 1.7,
          }}
        >
          Qualidade, identidade e conforto.
        </p>
        <button
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: S.dark,
            color: "#fff",
            padding: "13px 26px",
            borderRadius: 8,
            fontSize: 14,
            border: "none",
            cursor: "pointer",
            fontFamily: S.sans,
          }}
        >
          Ver coleção
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* Categorias */}
      <section style={{ padding: "52px 40px 64px" }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: S.gold,
            fontWeight: 400,
            marginBottom: 6,
          }}
        >
          Explore
        </p>
        <h2
          style={{
            fontFamily: S.serif,
            fontSize: 28,
            fontWeight: 700,
            color: S.dark,
          }}
        >
          +Categorias
        </h2>
        <p
          style={{
            fontSize: 14,
            color: S.muted,
            marginTop: 5,
            marginBottom: 30,
            fontWeight: 300,
          }}
        >
          A peça certa para cada necessidade.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 16,
          }}
        >
          {categories.map((cat) => (
            <CategoryCard key={cat.name} cat={cat} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: `0.5px solid ${S.border}`,
          padding: "26px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 12,
          color: "#bbb",
        }}
      >
        <span
          style={{
            fontFamily: S.serif,
            fontSize: 14,
            color: "#666",
            fontWeight: 700,
          }}
        >
          BelissimaUniformes
        </span>
        <span>© 2026 — Todos os direitos reservados</span>
      </footer>
    </div>
  );
}
