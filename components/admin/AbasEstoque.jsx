// components/admin/AbasEstoque.jsx
// Saldos (/admin/estoque) e Movimentações (/admin/estoque/movimentacoes).
// Leva o produto escolhido de uma aba para a outra.
import Link from "next/link";
import { useRouter } from "next/router";

const ABAS = [
  { href: "/admin/estoque", rotulo: "Saldos" },
  { href: "/admin/estoque/movimentacoes", rotulo: "Movimentações" },
];

export default function AbasEstoque() {
  const router = useRouter();
  const { produtoId } = router.query;

  return (
    <nav
      aria-label="Seções do estoque"
      style={{ display: "flex", gap: 24, marginTop: -16, marginBottom: 24 }}
    >
      {ABAS.map((a) => (
        <Link
          key={a.href}
          href={produtoId ? { pathname: a.href, query: { produtoId } } : a.href}
          className="bu-tab"
          aria-current={router.pathname === a.href ? "page" : undefined}
        >
          {a.rotulo}
        </Link>
      ))}
    </nav>
  );
}
