// pages/admin/estoque/index.js
// Saldo de cada variante, com entrada, saída e ajuste.
// Filtros na URL (?produtoId=&somenteZerados=true&pagina=).
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import { listarEstoque } from "lib/estoqueAdmin";
import { descreverVariante } from "lib/formatar";
import { useConsulta } from "hooks/useConsulta";
import { useFiltrosUrl } from "hooks/useFiltrosUrl";
import { useOpcoesProduto } from "hooks/useProdutosAdmin";
import AdminLayout from "components/admin/AdminLayout";
import AbasEstoque from "components/admin/AbasEstoque";
import MovimentarEstoque from "components/admin/MovimentarEstoque";
import { BadgeAtivo } from "components/ui/StatusBadge";
import Paginacao from "components/ui/Paginacao";
import Campo from "components/ui/Campo";
import Select from "components/ui/Select";
import Button from "components/ui/Button";
import Alert from "components/ui/Alert";
import Loading from "components/ui/Loading";
import Vazio from "components/ui/Vazio";
import Icon from "components/ui/Icon";
import { S } from "styles/theme";

const TAMANHO_PAGINA = 20;

const ACOES = [
  ["entrada", "Entrada"],
  ["saida", "Saída"],
  ["ajuste", "Ajuste"],
];

const botaoTexto = {
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  fontFamily: S.sans,
  fontSize: 13,
};

export default function AdminEstoque() {
  const router = useRouter();
  return (
    <AdminLayout titulo="Estoque">
      <AbasEstoque />
      {router.isReady ? <Saldos /> : <Loading />}
    </AdminLayout>
  );
}

function Saldos() {
  const [filtros, atualizar] = useFiltrosUrl({
    produtoId: "",
    somenteZerados: "",
    pagina: "1",
  });
  const pagina = Math.max(1, parseInt(filtros.pagina, 10) || 1);
  const somenteZerados = filtros.somenteZerados === "true";
  const opcoesProduto = useOpcoesProduto();
  const [movimento, setMovimento] = useState(null); // { variante, tipo }

  const { dados, carregando, erro, recarregar, setDados } = useConsulta(
    () =>
      listarEstoque({
        pagina,
        tamanhoPagina: TAMANHO_PAGINA,
        produtoId: filtros.produtoId || undefined,
        somenteZerados,
      }),
    [pagina, filtros.produtoId, somenteZerados],
  );

  // A API devolve a variante com o saldo novo: troca só a linha, sem buscar a lista de novo.
  // Com "só zerados", a linha que deixou de ser zerada fica até a próxima busca (de propósito).
  function trocarLinha(atualizada) {
    setDados((atual) => ({
      ...atual,
      variantes: atual.variantes.map((v) =>
        v.varianteId === atualizada.varianteId ? atualizada : v,
      ),
    }));
  }

  return (
    <>
      <div className="bu-filtros">
        <Campo label="Produto" style={{ flexGrow: 2 }}>
          <Select
            opcoes={opcoesProduto}
            value={filtros.produtoId}
            onChange={(e) =>
              atualizar({ produtoId: e.target.value, pagina: 1 })
            }
            style={{ marginBottom: 0 }}
          />
        </Campo>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            color: S.soft,
            height: 40,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={somenteZerados}
            onChange={(e) =>
              atualizar({
                somenteZerados: e.target.checked ? "true" : "",
                pagina: 1,
              })
            }
          />
          Só com estoque zerado
        </label>
      </div>

      {carregando && !dados ? (
        <Loading />
      ) : erro ? (
        <>
          <Alert>Não foi possível carregar o estoque: {erro}</Alert>
          <Button variant="outline" onClick={recarregar}>
            Tentar de novo
          </Button>
        </>
      ) : dados.variantes.length === 0 ? (
        <Vazio>
          {dados.total > 0
            ? "Essa página não existe."
            : somenteZerados
              ? "Nenhuma variante com estoque zerado."
              : "Nenhuma variante encontrada. Gere as variantes na tela do produto."}
        </Vazio>
      ) : (
        <>
          <p style={{ fontSize: 13, color: S.muted, marginBottom: 10 }}>
            {dados.total} {dados.total === 1 ? "variante" : "variantes"}
          </p>
          <div
            className="bu-table-wrap"
            style={{ opacity: carregando ? 0.5 : 1 }}
          >
            <table className="bu-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Variante</th>
                  <th>Situação</th>
                  <th className="bu-num">Saldo</th>
                  <th className="bu-num">Movimentar</th>
                </tr>
              </thead>
              <tbody>
                {dados.variantes.map((v) => (
                  <tr key={v.varianteId}>
                    <td>
                      <Link
                        href={`/admin/produtos/${v.produtoId}`}
                        className="bu-link-muted"
                        style={{ fontWeight: 500 }}
                      >
                        {v.produto}
                      </Link>
                    </td>
                    <td style={{ color: S.soft }}>
                      {descreverVariante(v.tamanho, v.cor)}
                    </td>
                    <td>
                      <BadgeAtivo ativo={v.ativo} />
                    </td>
                    <td
                      className="bu-num"
                      style={{
                        fontWeight: 600,
                        fontSize: 15,
                        color: v.quantidade === 0 ? S.danger : S.dark,
                      }}
                    >
                      {v.quantidade}
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
                        {ACOES.map(([tipo, rotulo]) => (
                          <button
                            key={tipo}
                            type="button"
                            className="bu-text-link"
                            style={botaoTexto}
                            onClick={() => setMovimento({ variante: v, tipo })}
                          >
                            {rotulo}
                          </button>
                        ))}
                        <Link
                          href={{
                            pathname: "/admin/estoque/movimentacoes",
                            query: {
                              produtoId: v.produtoId,
                              varianteId: v.varianteId,
                            },
                          }}
                          className="bu-icon-btn"
                          aria-label={`Histórico de ${v.produto} ${descreverVariante(v.tamanho, v.cor)}`}
                          title="Ver histórico"
                          style={{ padding: 2 }}
                        >
                          <Icon name="clock" size={15} color={S.muted} />
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
            onChange={(p) => atualizar({ pagina: p })}
          />
        </>
      )}

      {movimento && (
        <MovimentarEstoque
          variante={movimento.variante}
          tipo={movimento.tipo}
          onClose={() => setMovimento(null)}
          onFeito={trocarLinha}
        />
      )}
    </>
  );
}
