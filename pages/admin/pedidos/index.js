// pages/admin/pedidos/index.js
// Todos os pedidos: filtro por status, cliente (nome ou e-mail) e período.
// Filtros na URL (?status=&cliente=&de=&ate=&pagina=), para voltar do detalhe no mesmo lugar.
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { listarPedidosAdmin } from "lib/pedidosAdmin";
import { formatarData, formatarPreco } from "lib/formatar";
import { LISTA_STATUS, rotuloStatus } from "lib/statusPedido";
import { useConsulta } from "hooks/useConsulta";
import { useDebounce } from "hooks/useDebounce";
import { useFiltrosUrl } from "hooks/useFiltrosUrl";
import AdminLayout from "components/admin/AdminLayout";
import StatusBadge from "components/ui/StatusBadge";
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

const PADROES = { status: "", cliente: "", de: "", ate: "", pagina: "1" };

const OPCOES_STATUS = [
  { valor: "", rotulo: "Todos" },
  ...LISTA_STATUS.map((s) => ({ valor: s, rotulo: rotuloStatus(s) })),
];

export default function AdminPedidos() {
  const router = useRouter();
  return (
    <AdminLayout titulo="Pedidos">
      {router.isReady ? <ListaPedidos /> : <Loading />}
    </AdminLayout>
  );
}

function ListaPedidos() {
  const router = useRouter();
  const [filtros, atualizar] = useFiltrosUrl(PADROES);
  const pagina = Math.max(1, parseInt(filtros.pagina, 10) || 1);

  // Cliente: só vai para a URL (e para a API) depois que para de digitar
  const [busca, setBusca] = useState(filtros.cliente);
  const buscaDigitada = useDebounce(busca.trim());
  const enviada = useRef(filtros.cliente);
  useEffect(() => {
    if (buscaDigitada === filtros.cliente) return;
    enviada.current = buscaDigitada;
    atualizar(
      { cliente: buscaDigitada, pagina: 1 },
      { substituir: !!filtros.cliente && !!buscaDigitada },
    );
  }, [buscaDigitada]);
  useEffect(() => {
    if (filtros.cliente !== enviada.current) {
      enviada.current = filtros.cliente;
      setBusca(filtros.cliente);
    }
  }, [filtros.cliente]);

  const { dados, carregando, erro, recarregar } = useConsulta(
    () =>
      listarPedidosAdmin({
        pagina,
        tamanhoPagina: TAMANHO_PAGINA,
        status: filtros.status || undefined,
        cliente: filtros.cliente || undefined,
        de: filtros.de || undefined,
        ate: filtros.ate || undefined,
      }),
    [pagina, filtros.status, filtros.cliente, filtros.de, filtros.ate],
  );

  const filtrando = !!(
    filtros.status ||
    filtros.cliente ||
    filtros.de ||
    filtros.ate
  );

  function limparFiltros() {
    setBusca("");
    atualizar({ ...PADROES });
  }

  // A linha toda abre o pedido; o link do nº continua para teclado e nova aba
  function abrirPedido(e, id) {
    if (e.target.closest("a")) return;
    router.push(`/admin/pedidos/${id}`);
  }

  return (
    <>
      <div className="bu-filtros">
        <Campo label="Status">
          <Select
            opcoes={OPCOES_STATUS}
            value={filtros.status}
            onChange={(e) => atualizar({ status: e.target.value, pagina: 1 })}
            style={{ marginBottom: 0 }}
          />
        </Campo>
        <Campo label="Cliente" style={{ flexGrow: 2 }}>
          <Input
            type="search"
            placeholder="Nome ou e-mail"
            value={busca}
            maxLength={200}
            onChange={(e) => setBusca(e.target.value)}
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
          <Alert>Não foi possível carregar os pedidos: {erro}</Alert>
          <Button variant="outline" onClick={recarregar}>
            Tentar de novo
          </Button>
        </>
      ) : dados.pedidos.length === 0 ? (
        <Vazio>
          {dados.total > 0
            ? "Essa página não existe."
            : filtrando
              ? "Nenhum pedido encontrado com esses filtros."
              : "Nenhum pedido ainda."}
        </Vazio>
      ) : (
        <>
          <p style={{ fontSize: 13, color: S.muted, marginBottom: 10 }}>
            {dados.total} {dados.total === 1 ? "pedido" : "pedidos"}
          </p>
          <div
            className="bu-table-wrap"
            style={{ opacity: carregando ? 0.5 : 1 }}
          >
            <table className="bu-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th className="bu-num">Peças</th>
                  <th className="bu-num">Total</th>
                </tr>
              </thead>
              <tbody>
                {dados.pedidos.map((p) => (
                  <tr
                    key={p.id}
                    className="bu-tr-link"
                    onClick={(e) => abrirPedido(e, p.id)}
                  >
                    <td>
                      <Link
                        href={`/admin/pedidos/${p.id}`}
                        style={{ fontWeight: 600 }}
                        aria-label={`Abrir pedido ${p.id}`}
                      >
                        #{p.id}
                      </Link>
                    </td>
                    <td>
                      <p>{p.cliente.nome}</p>
                      <p style={{ fontSize: 12, color: S.muted }}>
                        {p.cliente.email}
                      </p>
                    </td>
                    <td style={{ color: S.soft, whiteSpace: "nowrap" }}>
                      {formatarData(p.criadoEm, { comHora: true })}
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="bu-num">{p.quantidadePecas}</td>
                    <td className="bu-num">{formatarPreco(p.total)}</td>
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
    </>
  );
}
