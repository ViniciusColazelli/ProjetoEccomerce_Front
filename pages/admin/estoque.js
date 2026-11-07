// pages/admin/estoque.js
// Saldos por variante (entrada / saída / ajuste) e histórico de movimentações
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { listarEstoque, listarMovimentacoes } from "lib/estoqueAdmin";
import { listarProdutosAdmin } from "lib/produtosAdmin";
import { formatarData, descreverVariante } from "lib/formatar";
import { useConsulta } from "hooks/useConsulta";
import AdminShell from "components/admin/AdminShell";
import MovimentarEstoque from "components/admin/MovimentarEstoque";
import { Badge, BadgeAtivo } from "components/ui/StatusBadge";
import Paginacao from "components/ui/Paginacao";
import Campo from "components/ui/Campo";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import Alert from "components/ui/Alert";
import Loading from "components/ui/Loading";
import Vazio from "components/ui/Vazio";
import Icon from "components/ui/Icon";
import { S } from "styles/theme";

const TAMANHO_PAGINA = 20;

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
    <AdminShell titulo="Estoque">
      {router.isReady ? (
        <Estoque produtoInicial={router.query.produtoId ?? ""} />
      ) : (
        <Loading />
      )}
    </AdminShell>
  );
}

function Estoque({ produtoInicial }) {
  const [aba, setAba] = useState("saldos");
  const [produtoId, setProdutoId] = useState(produtoInicial);
  const [variante, setVariante] = useState(null); // filtro do histórico

  // Lista de produtos para o filtro (a API aceita até 50 por página)
  const { dados: produtos } = useConsulta(
    () =>
      listarProdutosAdmin({
        tamanhoPagina: 50,
        ordenarPor: "nome",
        direcao: "asc",
      }),
    [],
  );
  const opcoesProduto = [
    { valor: "", rotulo: "Todos os produtos" },
    ...(produtos?.produtos ?? []).map((p) => ({
      valor: String(p.id),
      rotulo: p.ativo ? p.nome : `${p.nome} (inativo)`,
    })),
  ];

  function verHistorico(v) {
    setVariante(v);
    setAba("movimentacoes");
  }

  return (
    <>
      <div
        role="tablist"
        style={{ display: "flex", gap: 24, marginTop: -16, marginBottom: 24 }}
      >
        {[
          ["saldos", "Saldos"],
          ["movimentacoes", "Movimentações"],
        ].map(([chave, rotulo]) => (
          <button
            key={chave}
            type="button"
            role="tab"
            className="bu-tab"
            aria-selected={aba === chave}
            onClick={() => setAba(chave)}
          >
            {rotulo}
          </button>
        ))}
      </div>

      {aba === "saldos" ? (
        <Saldos
          produtoId={produtoId}
          setProdutoId={setProdutoId}
          opcoesProduto={opcoesProduto}
          onHistorico={verHistorico}
        />
      ) : (
        <Movimentacoes
          produtoId={produtoId}
          setProdutoId={setProdutoId}
          opcoesProduto={opcoesProduto}
          variante={variante}
          limparVariante={() => setVariante(null)}
        />
      )}
    </>
  );
}

function Saldos({ produtoId, setProdutoId, opcoesProduto, onHistorico }) {
  const [somenteZerados, setSomenteZerados] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [movimento, setMovimento] = useState(null); // { variante, tipo }

  useEffect(() => setPagina(1), [produtoId, somenteZerados]);

  const { dados, carregando, erro, recarregar } = useConsulta(
    () =>
      listarEstoque({
        pagina,
        tamanhoPagina: TAMANHO_PAGINA,
        produtoId: produtoId || undefined,
        somenteZerados,
      }),
    [pagina, produtoId, somenteZerados],
  );

  return (
    <>
      <div className="bu-filtros">
        <Campo label="Produto" style={{ flexGrow: 2 }}>
          <Select
            opcoes={opcoesProduto}
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
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
            onChange={(e) => setSomenteZerados(e.target.checked)}
          />
          Só com estoque zerado
        </label>
      </div>

      <Alert>{erro}</Alert>

      {carregando && !dados ? (
        <Loading />
      ) : !dados || dados.variantes.length === 0 ? (
        <Vazio>
          {somenteZerados
            ? "Nenhuma variante com estoque zerado."
            : "Nenhuma variante encontrada. Gere as variantes na tela do produto."}
        </Vazio>
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
                        }}
                      >
                        {[
                          ["entrada", "Entrada"],
                          ["saida", "Saída"],
                          ["ajuste", "Ajuste"],
                        ].map(([tipo, rotulo]) => (
                          <button
                            key={tipo}
                            type="button"
                            className="bu-text-link"
                            style={botaoTexto}
                            disabled={tipo === "saida" && v.quantidade === 0}
                            onClick={() => setMovimento({ variante: v, tipo })}
                          >
                            {rotulo}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="bu-icon-btn"
                          aria-label="Ver histórico"
                          title="Ver histórico"
                          onClick={() => onHistorico(v)}
                          style={{ padding: 2 }}
                        >
                          <Icon name="clock" size={15} color={S.muted} />
                        </button>
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

      {movimento && (
        <MovimentarEstoque
          variante={movimento.variante}
          tipo={movimento.tipo}
          onClose={() => setMovimento(null)}
          onFeito={recarregar}
        />
      )}
    </>
  );
}

const OPCOES_TIPO = [
  { valor: "", rotulo: "Entradas e saídas" },
  { valor: "Entrada", rotulo: "Só entradas" },
  { valor: "Saida", rotulo: "Só saídas" },
];

function Movimentacoes({
  produtoId,
  setProdutoId,
  opcoesProduto,
  variante,
  limparVariante,
}) {
  const [tipo, setTipo] = useState("");
  const [de, setDe] = useState("");
  const [ate, setAte] = useState("");
  const [pagina, setPagina] = useState(1);

  useEffect(() => setPagina(1), [produtoId, tipo, de, ate, variante]);

  const { dados, carregando, erro } = useConsulta(
    () =>
      listarMovimentacoes({
        pagina,
        tamanhoPagina: TAMANHO_PAGINA,
        // a variante escolhida já define o produto
        varianteId: variante?.varianteId,
        produtoId: variante ? undefined : produtoId || undefined,
        tipo: tipo || undefined,
        de: de || undefined,
        ate: ate || undefined,
      }),
    [pagina, produtoId, tipo, de, ate, variante?.varianteId],
  );

  return (
    <>
      {variante && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: S.white,
            border: S.line,
            borderRadius: 999,
            padding: "6px 8px 6px 14px",
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {variante.produto} ·{" "}
          {descreverVariante(variante.tamanho, variante.cor)}
          <button
            type="button"
            className="bu-icon-btn"
            aria-label="Limpar filtro de variante"
            onClick={limparVariante}
            style={{ padding: 2 }}
          >
            <Icon name="x" size={14} color={S.muted} />
          </button>
        </div>
      )}

      <div className="bu-filtros">
        {!variante && (
          <Campo label="Produto" style={{ flexGrow: 2 }}>
            <Select
              opcoes={opcoesProduto}
              value={produtoId}
              onChange={(e) => setProdutoId(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </Campo>
        )}
        <Campo label="Tipo">
          <Select
            opcoes={OPCOES_TIPO}
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </Campo>
        <Campo label="De">
          <Input
            type="date"
            value={de}
            max={ate || undefined}
            onChange={(e) => setDe(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </Campo>
        <Campo label="Até">
          <Input
            type="date"
            value={ate}
            min={de || undefined}
            onChange={(e) => setAte(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </Campo>
      </div>

      <Alert>{erro}</Alert>

      {carregando && !dados ? (
        <Loading />
      ) : !dados || dados.movimentacoes.length === 0 ? (
        <Vazio>Nenhuma movimentação encontrada.</Vazio>
      ) : (
        <>
          <div
            className="bu-table-wrap"
            style={{ opacity: carregando ? 0.5 : 1 }}
          >
            <table className="bu-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Peça</th>
                  <th>Tipo</th>
                  <th className="bu-num">Qtd.</th>
                  <th>Motivo</th>
                  <th>Pedido</th>
                </tr>
              </thead>
              <tbody>
                {dados.movimentacoes.map((m) => {
                  const entrada = m.tipo === "Entrada";
                  return (
                    <tr key={m.id}>
                      <td style={{ color: S.soft, whiteSpace: "nowrap" }}>
                        {formatarData(m.criadoEm, { comHora: true })}
                      </td>
                      <td>
                        <p style={{ fontWeight: 500 }}>{m.produto}</p>
                        <p style={{ fontSize: 12, color: S.muted }}>
                          {descreverVariante(m.tamanho, m.cor)}
                        </p>
                      </td>
                      <td>
                        {entrada ? (
                          <Badge bg={S.success.bg} color={S.success.text}>
                            Entrada
                          </Badge>
                        ) : (
                          <Badge bg={S.error.bg} color={S.error.text}>
                            Saída
                          </Badge>
                        )}
                      </td>
                      <td
                        className="bu-num"
                        style={{
                          fontWeight: 600,
                          color: entrada ? S.success.text : S.error.text,
                        }}
                      >
                        {entrada ? "+" : "−"}
                        {m.quantidade}
                      </td>
                      <td style={{ color: S.soft, fontSize: 13 }}>
                        {m.motivo ?? "—"}
                      </td>
                      <td>
                        {m.pedidoId ? (
                          <Link
                            href={`/admin/pedidos/${m.pedidoId}`}
                            className="bu-text-link"
                          >
                            #{m.pedidoId}
                          </Link>
                        ) : (
                          <span style={{ color: S.muted }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
    </>
  );
}
