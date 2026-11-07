// pages/admin/produtos/index.js
// Catálogo completo (ativos e inativos), cadastro e ativar/desativar
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  listarProdutosAdmin,
  registrarProduto,
  alterarStatusProduto,
} from "lib/produtosAdmin";
import { formatarPreco } from "lib/formatar";
import { useConsulta } from "hooks/useConsulta";
import { useDebounce } from "hooks/useDebounce";
import AdminShell from "components/admin/AdminShell";
import ProdutoForm from "components/admin/ProdutoForm";
import { BadgeAtivo } from "components/ui/StatusBadge";
import Paginacao from "components/ui/Paginacao";
import Campo from "components/ui/Campo";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import Button from "components/ui/Button";
import Modal from "components/ui/Modal";
import Alert from "components/ui/Alert";
import Loading from "components/ui/Loading";
import Vazio from "components/ui/Vazio";
import Icon from "components/ui/Icon";
import { S } from "styles/theme";

const TAMANHO_PAGINA = 20;

const OPCOES_ATIVO = [
  { valor: "", rotulo: "Todos" },
  { valor: "true", rotulo: "Ativos" },
  { valor: "false", rotulo: "Inativos" },
];

export default function AdminProdutos() {
  return (
    <AdminShell titulo="Produtos">
      <ListaProdutos />
    </AdminShell>
  );
}

function ListaProdutos() {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [ativo, setAtivo] = useState("");
  const [pagina, setPagina] = useState(1);
  const [criando, setCriando] = useState(false);
  const [alterando, setAlterando] = useState(null); // id em alteração
  const [erroAcao, setErroAcao] = useState(null);
  const nome = useDebounce(busca.trim());

  useEffect(() => setPagina(1), [nome, ativo]);

  const { dados, carregando, erro, recarregar } = useConsulta(
    () =>
      listarProdutosAdmin({
        pagina,
        tamanhoPagina: TAMANHO_PAGINA,
        nome: nome || undefined,
        ativo: ativo || undefined,
        ordenarPor: "nome",
        direcao: "asc",
      }),
    [pagina, nome, ativo],
  );

  async function criar(dados) {
    const novo = await registrarProduto(dados);
    router.push(`/admin/produtos/${novo.id}`);
  }

  async function alternar(produto) {
    setAlterando(produto.id);
    setErroAcao(null);
    try {
      await alterarStatusProduto(produto.id, { ativo: !produto.ativo });
      recarregar();
    } catch (e) {
      setErroAcao(e.message);
    } finally {
      setAlterando(null);
    }
  }

  return (
    <>
      <div className="bu-filtros">
        <Campo label="Buscar" style={{ flexGrow: 3 }}>
          <Input
            type="search"
            placeholder="Nome do produto"
            value={busca}
            maxLength={200}
            onChange={(e) => setBusca(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </Campo>
        <Campo label="Situação">
          <Select
            opcoes={OPCOES_ATIVO}
            value={ativo}
            onChange={(e) => setAtivo(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </Campo>
        <div style={{ flex: "0 0 auto" }}>
          <Button onClick={() => setCriando(true)}>
            <Icon name="plus" size={16} color={S.white} stroke={2} />
            Novo produto
          </Button>
        </div>
      </div>

      <Alert>{erro || erroAcao}</Alert>

      {carregando && !dados ? (
        <Loading />
      ) : !dados || dados.produtos.length === 0 ? (
        <Vazio>Nenhum produto encontrado.</Vazio>
      ) : (
        <>
          <div
            className="bu-table-wrap"
            style={{ opacity: carregando ? 0.5 : 1 }}
          >
            <table className="bu-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th className="bu-num">Preço base</th>
                  <th>Situação</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {dados.produtos.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link
                        href={`/admin/produtos/${p.id}`}
                        style={{ fontWeight: 500 }}
                        className="bu-link-muted"
                      >
                        {p.nome}
                      </Link>
                      {p.descricao && (
                        <p
                          style={{
                            fontSize: 12,
                            color: S.muted,
                            marginTop: 2,
                            maxWidth: 420,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.descricao}
                        </p>
                      )}
                    </td>
                    <td className="bu-num">{formatarPreco(p.precoBase)}</td>
                    <td>
                      <BadgeAtivo ativo={p.ativo} />
                    </td>
                    <td className="bu-num">
                      <div
                        style={{
                          display: "flex",
                          gap: 14,
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <button
                          type="button"
                          className="bu-text-link"
                          disabled={alterando === p.id}
                          onClick={() => alternar(p)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: S.sans,
                            padding: 0,
                          }}
                        >
                          {alterando === p.id
                            ? "..."
                            : p.ativo
                              ? "Desativar"
                              : "Ativar"}
                        </button>
                        <Link
                          href={`/admin/produtos/${p.id}`}
                          className="bu-text-link"
                        >
                          Editar
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Paginacao
            pagina={pagina}
            tamanhoPagina={TAMANHO_PAGINA}
            total={dados.total}
            onChange={setPagina}
          />
        </>
      )}

      {criando && (
        <Modal titulo="Novo produto" onClose={() => setCriando(false)}>
          <p style={{ fontSize: 13, color: S.muted, marginBottom: 16 }}>
            Depois de criar, cadastre tamanhos e cores e gere as variantes.
          </p>
          <ProdutoForm onSubmit={criar} textoBotao="Criar produto" />
        </Modal>
      )}
    </>
  );
}
