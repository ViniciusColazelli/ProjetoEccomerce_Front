// pages/admin/produtos/[id].js
// Edição do produto: dados, opções (tamanho/cor/personalização) e variantes
import { useRouter } from "next/router";
import Link from "next/link";
import {
  obterProdutoAdmin,
  atualizarProduto,
  alterarStatusProduto,
} from "lib/produtosAdmin";
import { useConsulta } from "hooks/useConsulta";
import { useAsyncAction } from "hooks/useAsyncAction";
import AdminShell from "components/admin/AdminShell";
import ProdutoForm from "components/admin/ProdutoForm";
import OpcoesProduto from "components/admin/OpcoesProduto";
import VariantesProduto from "components/admin/VariantesProduto";
import { BadgeAtivo } from "components/ui/StatusBadge";
import Card from "components/ui/Card";
import Button from "components/ui/Button";
import Alert from "components/ui/Alert";
import Loading from "components/ui/Loading";
import Vazio from "components/ui/Vazio";
import { S, T } from "styles/theme";

export default function AdminProduto() {
  const router = useRouter();
  return (
    <AdminShell titulo="Editar produto">
      {router.isReady ? (
        <EditarProduto key={router.query.id} id={router.query.id} />
      ) : (
        <Loading />
      )}
    </AdminShell>
  );
}

function EditarProduto({ id }) {
  const {
    dados: produto,
    carregando,
    erro,
    recarregar,
  } = useConsulta(() => obterProdutoAdmin(id), [id]);
  const status = useAsyncAction(async () => {
    await alterarStatusProduto(id, { ativo: !produto.ativo });
    recarregar();
  });

  if (carregando && !produto) return <Loading />;
  if (erro && !produto)
    return (
      <Vazio acao={<Button href="/admin/produtos">Voltar aos produtos</Button>}>
        {erro}
      </Vazio>
    );

  return (
    <div style={{ maxWidth: 900 }}>
      <Link
        href="/admin/produtos"
        className="bu-link-muted"
        style={{ fontSize: 13, color: S.muted }}
      >
        ← Todos os produtos
      </Link>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          margin: "14px 0 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <h1 style={{ ...T.titulo, fontSize: 30 }}>{produto.nome}</h1>
          <BadgeAtivo ativo={produto.ativo} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {produto.ativo && (
            <Button variant="outline" href={`/produtos/${produto.id}`}>
              Ver na loja
            </Button>
          )}
          <Button
            variant={produto.ativo ? "danger" : "primary"}
            loading={status.loading}
            onClick={() => status.run()}
          >
            {produto.ativo ? "Desativar produto" : "Ativar produto"}
          </Button>
        </div>
      </div>

      <Alert>{status.erro || erro}</Alert>

      <Card titulo="Dados do produto">
        <ProdutoForm
          inicial={produto}
          onSubmit={async (dados) => {
            await atualizarProduto(id, dados);
            recarregar();
          }}
          mensagemSucesso="Produto atualizado."
        />
      </Card>

      <OpcoesProduto produto={produto} onMudou={recarregar} />
      <VariantesProduto produto={produto} onMudou={recarregar} />
    </div>
  );
}
