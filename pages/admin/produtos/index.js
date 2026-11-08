// pages/admin/produtos/index.js
// Catálogo completo (ativos e inativos): busca, filtro de situação, paginação e ativar/desativar.
// Os filtros ficam na URL (?nome=&ativo=&pagina=) para sobreviver à ida e volta da edição.
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { listarProdutosAdmin, alterarStatusProduto } from "lib/produtosAdmin";
import { formatarPreco } from "lib/formatar";
import { useConsulta } from "hooks/useConsulta";
import { useCampoNaUrl } from "hooks/useCampoNaUrl";
import AdminLayout from "components/admin/AdminLayout";
import { BadgeAtivo } from "components/ui/StatusBadge";
import Paginacao from "components/ui/Paginacao";
import Campo from "components/ui/Campo";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import Button from "components/ui/Button";
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
  const router = useRouter();
  return (
    <AdminLayout titulo="Produtos">
      {router.isReady ? <ListaProdutos /> : <Loading />}
    </AdminLayout>
  );
}

function lerFiltros(query) {
  return {
    nome: typeof query.nome === "string" ? query.nome.trim() : "",
    ativo: query.ativo === "true" || query.ativo === "false" ? query.ativo : "",
    pagina: Math.max(1, parseInt(query.pagina, 10) || 1),
  };
}

function ListaProdutos() {
  const router = useRouter();
  const filtros = lerFiltros(router.query);
  const { nome, ativo, pagina } = filtros;

  function navegar(mudancas, { substituir = false } = {}) {
    const f = { ...filtros, ...mudancas };
    const query = {};
    if (f.nome) query.nome = f.nome;
    if (f.ativo) query.ativo = f.ativo;
    if (f.pagina > 1) query.pagina = f.pagina;
    router[substituir ? "replace" : "push"]({
      pathname: "/admin/produtos",
      query,
    });
  }

  // Busca: digitar atualiza a URL depois da pausa (mesma lógica da vitrine)
  const [busca, setBusca] = useCampoNaUrl(nome, (valor) =>
    navegar({ nome: valor, pagina: 1 }, { substituir: !!nome && !!valor }),
  );

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

  // Ativar/desativar direto na lista
  const [alterando, setAlterando] = useState(null); // id em alteração
  const [erroAcao, setErroAcao] = useState(null);

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

  const filtrando = !!nome || !!ativo;

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
            onChange={(e) => navegar({ ativo: e.target.value, pagina: 1 })}
            style={{ marginBottom: 0 }}
          />
        </Campo>
        <div style={{ flex: "0 0 auto" }}>
          <Button href="/admin/produtos/novo">
            <Icon name="plus" size={16} color={S.white} stroke={2} />
            Novo produto
          </Button>
        </div>
      </div>

      <Alert>{erroAcao}</Alert>

      {carregando && !dados ? (
        <Loading />
      ) : erro ? (
        <>
          <Alert>Não foi possível carregar os produtos: {erro}</Alert>
          <Button variant="outline" onClick={recarregar}>
            Tentar de novo
          </Button>
        </>
      ) : dados.produtos.length === 0 ? (
        dados.total > 0 ? (
          <Vazio
            acao={
              <Button variant="outline" onClick={() => navegar({ pagina: 1 })}>
                Ir para a primeira página
              </Button>
            }
          >
            Essa página não existe.
          </Vazio>
        ) : (
          <Vazio
            acao={
              filtrando ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setBusca("");
                    navegar({ nome: "", ativo: "", pagina: 1 });
                  }}
                >
                  Limpar filtros
                </Button>
              ) : (
                <Button href="/admin/produtos/novo">
                  Cadastrar o primeiro produto
                </Button>
              )
            }
          >
            {filtrando
              ? "Nenhum produto encontrado com esses filtros."
              : "Nenhum produto cadastrado ainda."}
          </Vazio>
        )
      ) : (
        <>
          <p style={{ fontSize: 13, color: S.muted, marginBottom: 10 }}>
            {dados.total} {dados.total === 1 ? "produto" : "produtos"}
          </p>
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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        {p.imagemUrl ? (
                          <img
                            src={p.imagemUrl}
                            alt=""
                            loading="lazy"
                            className="bu-mini-produto"
                          />
                        ) : (
                          <span className="bu-mini-produto" title="Sem foto" />
                        )}
                        <div style={{ minWidth: 0 }}>
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
                        </div>
                      </div>
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
            onChange={(p) => navegar({ pagina: p })}
          />
        </>
      )}
    </>
  );
}
