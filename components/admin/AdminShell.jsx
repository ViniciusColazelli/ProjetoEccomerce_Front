// components/admin/AdminShell.jsx
// Moldura das telas do painel: abas (Pedidos / Produtos / Estoque) + guarda de admin.
// O conteúdo (children) só monta depois de confirmar que é admin.
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import RotaProtegida from "components/layout/RotaProtegida";
import { LINKS_ADMIN } from "lib/navegacao";
import { S, T } from "styles/theme";

export default function AdminShell({ titulo, children }) {
  const router = useRouter();

  return (
    <main
      className="bu-container"
      style={{ paddingTop: 36, paddingBottom: 80 }}
    >
      <Head>
        <title>{`${titulo} · Painel · Belíssima Uniformes`}</title>
      </Head>

      <p style={T.eyebrow}>Painel administrativo</p>
      <nav
        style={{
          display: "flex",
          gap: 28,
          borderBottom: S.line,
          marginBottom: 32,
          overflowX: "auto",
        }}
      >
        {LINKS_ADMIN.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="bu-tab"
            aria-current={
              router.pathname.startsWith(l.href) ? "page" : undefined
            }
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <RotaProtegida admin>{children}</RotaProtegida>
    </main>
  );
}
