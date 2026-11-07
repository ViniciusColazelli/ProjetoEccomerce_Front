// pages/admin/produtos/novo.js
// Cadastro: nome, descrição e preço base. Depois de criar, segue para a edição,
// onde ficam tamanhos, cores, variantes e estoque.
import Link from "next/link";
import { useRouter } from "next/router";
import { registrarProduto } from "lib/produtosAdmin";
import AdminLayout from "components/admin/AdminLayout";
import ProdutoForm from "components/admin/ProdutoForm";
import Card from "components/ui/Card";
import { S, T } from "styles/theme";

export default function NovoProduto() {
  const router = useRouter();

  async function criar(dados) {
    const novo = await registrarProduto(dados);
    await router.push(`/admin/produtos/${novo.id}`);
  }

  return (
    <AdminLayout titulo="Novo produto">
      <div style={{ maxWidth: 640 }}>
        <Link
          href="/admin/produtos"
          className="bu-link-muted"
          style={{ fontSize: 13, color: S.muted }}
        >
          ← Todos os produtos
        </Link>
        <h1 style={{ ...T.titulo, fontSize: 30, margin: "14px 0 6px" }}>
          Novo produto
        </h1>
        <p style={{ fontSize: 14, color: S.muted, marginBottom: 24 }}>
          Depois de criar, você cadastra os tamanhos e as cores, gera as
          variantes e dá entrada no estoque.
        </p>
        <Card titulo="Dados do produto">
          <ProdutoForm onSubmit={criar} textoBotao="Criar produto" />
        </Card>
      </div>
    </AdminLayout>
  );
}
