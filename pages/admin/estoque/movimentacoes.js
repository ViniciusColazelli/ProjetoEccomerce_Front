// pages/admin/estoque/movimentacoes.js
// Histórico de entradas e saídas. Filtros na URL, para outras telas linkarem direto:
// ?produtoId=&varianteId=&pedidoId=&tipo=Entrada|Saida&de=AAAA-MM-DD&ate=AAAA-MM-DD&pagina=
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { listarEstoque, listarMovimentacoes } from "lib/estoqueAdmin";
import { formatarData, descreverVariante } from "lib/formatar";
import { useConsulta } from "hooks/useConsulta";
import { useDebounce } from "hooks/useDebounce";
import { useFiltrosUrl } from "hooks/useFiltrosUrl";
import { useOpcoesProduto } from "hooks/useProdutosAdmin";
import AdminLayout from "components/admin/AdminLayout";
import AbasEstoque from "components/admin/AbasEstoque";
import { Badge } from "components/ui/StatusBadge";
import Paginacao from "components/ui/Paginacao";
import Campo from "components/ui/Campo";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import Button from "components/ui/Button";
import Alert from "components/ui/Alert";
import Loading from "components/ui/Loading";
import Vazio from "components/ui/Vazio";
import { S } from "styles/theme";

const TAMANHO_PAGINA = 20;

const PADROES = {
  produtoId: "",
  varianteId: "",
  pedidoId: "",
  tipo: "",
  de: "",
  ate: "",
  pagina: "1",
};

const OPCOES_TIPO = [
  { valor: "", rotulo: "Entradas e saídas" },
  { valor: "Entrada", rotulo: "Só entradas" },
  { valor: "Saida", rotulo: "Só saídas" },
];

export default function AdminMovimentacoes() {
  const router = useRouter();
  return (
    <AdminLayout titulo="Movimentações de estoque">
      <AbasEstoque />
      {router.isReady ? <Movimentacoes /> : <Loading />}
    </AdminLayout>
  );
}

// Variantes do produto escolhido, para o filtro de variante
function useOpcoesVariante(produtoId) {
  const { dados } = useConsulta(
    () =>
      produtoId
        ? listarEstoque({ produtoId, tamanhoPagina: 50 })
        : Promise.resolve(null),
    [produtoId],
  );
  return [
    {
      valor: "",
      rotulo: produtoId ? "Todas as variantes" : "Escolha um produto",
    },
    ...(dados?.variantes ?? []).map((v) => ({
      valor: String(v.varianteId),
      rotulo: descreverVariante(v.tamanho, v.cor),
    })),
  ];
}

function Movimentacoes() {
  const [filtros, atualizar] = useFiltrosUrl(PADROES);
  const pagina = Math.max(1, parseInt(filtros.pagina, 10) || 1);
  const opcoesProduto = useOpcoesProduto();
  const opcoesVariante = useOpcoesVariante(filtros.produtoId);

  // Nº do pedido: aplica depois que para de digitar
  const [pedido, setPedido] = useState(filtros.pedidoId);
  const pedidoDigitado = useDebounce(pedido.replace(/\D/g, ""));
  const enviado = useRef(filtros.pedidoId);
  useEffect(() => {
    if (pedidoDigitado === filtros.pedidoId) return;
    enviado.current = pedidoDigitado;
    atualizar({ pedidoId: pedidoDigitado, pagina: 1 }, { substituir: true });
  }, [pedidoDigitado]);
  useEffect(() => {
    if (filtros.pedidoId !== enviado.current) {
      enviado.current = filtros.pedidoId;
      setPedido(filtros.pedidoId);
    }
  }, [filtros.pedidoId]);

  const { dados, carregando, erro, recarregar } = useConsulta(
    () =>
      listarMovimentacoes({
        pagina,
        tamanhoPagina: TAMANHO_PAGINA,
        produtoId: filtros.produtoId || undefined,
        varianteId: filtros.varianteId || undefined,
        pedidoId: filtros.pedidoId || undefined,
        tipo: filtros.tipo || undefined,
        de: filtros.de || undefined,
        ate: filtros.ate || undefined,
      }),
    [
      pagina,
      filtros.produtoId,
      filtros.varianteId,
      filtros.pedidoId,
      filtros.tipo,
      filtros.de,
      filtros.ate,
    ],
  );

  const filtrando = Object.entries(filtros).some(
    ([k, v]) => k !== "pagina" && v !== "",
  );

  function limparFiltros() {
    setPedido("");
    atualizar({ ...PADROES });
  }

  return (
    <>
      <div className="bu-filtros">
        <Campo label="Produto" style={{ flexGrow: 2 }}>
          <Select
            opcoes={opcoesProduto}
            value={filtros.produtoId}
            // Trocar o produto zera a variante, que é de outro produto
            onChange={(e) =>
              atualizar({
                produtoId: e.target.value,
                varianteId: "",
                pagina: 1,
              })
            }
            style={{ marginBottom: 0 }}
          />
        </Campo>
        <Campo label="Variante">
          <Select
            opcoes={opcoesVariante}
            value={filtros.varianteId}
            disabled={!filtros.produtoId}
            onChange={(e) =>
              atualizar({ varianteId: e.target.value, pagina: 1 })
            }
            style={{ marginBottom: 0 }}
          />
        </Campo>
        <Campo label="Pedido nº">
          <Input
            inputMode="numeric"
            placeholder="Ex.: 12"
            value={pedido}
            onChange={(e) => setPedido(e.target.value.replace(/\D/g, ""))}
            style={{ marginBottom: 0 }}
          />
        </Campo>
        <Campo label="Tipo">
          <Select
            opcoes={OPCOES_TIPO}
            value={filtros.tipo}
            onChange={(e) => atualizar({ tipo: e.target.value, pagina: 1 })}
            style={{ marginBottom: 0 }}
          />
        </Campo>
        <Campo label="De">
          <Input
            type="date"
            value={filtros.de}
            max={filtros.ate || undefined}
            onChange={(e) => atualizar({ de: e.target.value, pagina: 1 })}
            style={{ marginBottom: 0 }}
          />
        </Campo>
        <Campo label="Até">
          <Input
            type="date"
            value={filtros.ate}
            min={filtros.de || undefined}
            onChange={(e) => atualizar({ ate: e.target.value, pagina: 1 })}
            style={{ marginBottom: 0 }}
          />
        </Campo>
      </div>

      {filtrando && (
        <button
          type="button"
          className="bu-text-link"
          onClick={limparFiltros}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontFamily: S.sans,
            marginBottom: 16,
          }}
        >
          Limpar filtros
        </button>
      )}

      {carregando && !dados ? (
        <Loading />
      ) : erro ? (
        <>
          <Alert>Não foi possível carregar as movimentações: {erro}</Alert>
          <Button variant="outline" onClick={recarregar}>
            Tentar de novo
          </Button>
        </>
      ) : dados.movimentacoes.length === 0 ? (
        <Vazio>
          {dados.total > 0
            ? "Essa página não existe."
            : "Nenhuma movimentação encontrada."}
        </Vazio>
      ) : (
        <>
          <p style={{ fontSize: 13, color: S.muted, marginBottom: 10 }}>
            {dados.total} {dados.total === 1 ? "movimentação" : "movimentações"}
          </p>
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
            onChange={(p) => atualizar({ pagina: p })}
          />
        </>
      )}
    </>
  );
}
