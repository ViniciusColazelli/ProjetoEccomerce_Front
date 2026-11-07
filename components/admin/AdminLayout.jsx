// components/admin/AdminLayout.jsx
// Moldura de todas as páginas de pages/admin/: menu (Produtos / Estoque / Pedidos) + guarda de admin.
// Sem login ou sem isAdmin volta para a home, e nada do painel aparece antes da confirmação;
// as consultas dos filhos também só disparam depois disso. A API barra de qualquer jeito (403).
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRotaProtegida } from "hooks/useRotaProtegida";
import Loading from "components/ui/Loading";
import { LINKS_ADMIN } from "lib/navegacao";
import { S, T } from "styles/theme";

export default function AdminLayout({ titulo, children }) {
  const router = useRouter();
  const { liberado } = useRotaProtegida({ admin: true });

  return (
    <main
      className="bu-container"
      style={{ paddingTop: 36, paddingBottom: 80 }}
    >
      <Head>
        <title>{`${titulo} · Painel admin · Belíssima Uniformes`}</title>
      </Head>

      {!liberado ? (
        <Loading />
      ) : (
        <>
          <p style={T.eyebrow}>Painel admin</p>
          <nav
            aria-label="Menu do painel"
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
          {children}
        </>
      )}
    </main>
  );
}
