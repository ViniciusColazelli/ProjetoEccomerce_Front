// pages/admin/pedidos/index.js
// Todos os pedidos: filtro por status, cliente e período
import { useEffect, useState } from "react";
import Link from "next/link";
import { listarPedidosAdmin } from "lib/pedidosAdmin";
import { formatarData, formatarPreco } from "lib/formatar";
import { LISTA_STATUS, rotuloStatus } from "lib/statusPedido";
import { useConsulta } from "hooks/useConsulta";
import { useDebounce } from "hooks/useDebounce";
import AdminLayout from "components/admin/AdminLayout";
import StatusBadge from "components/ui/StatusBadge";
import Paginacao from "components/ui/Paginacao";
import Campo from "components/ui/Campo";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import Alert from "components/ui/Alert";
import Loading from "components/ui/Loading";
import Vazio from "components/ui/Vazio";
import { S } from "styles/theme";

const TAMANHO_PAGINA = 20;

const OPCOES_STATUS = [
  { valor: "", rotulo: "Todos" },
  ...LISTA_STATUS.map((s) => ({ valor: s, rotulo: rotuloStatus(s) })),
];

export default function AdminPedidos() {
  return (
    <AdminLayout titulo="Pedidos">
      <ListaPedidos />
    </AdminLayout>
  );
}

function ListaPedidos() {
  const [status, setStatus] = useState("");
  const [busca, setBusca] = useState("");
  const [de, setDe] = useState("");
  const [ate, setAte] = useState("");
  const [pagina, setPagina] = useState(1);
  const cliente = useDebounce(busca.trim());

  useEffect(() => setPagina(1), [status, cliente, de, ate]);

  const { dados, carregando, erro } = useConsulta(
    () =>
      listarPedidosAdmin({
        pagina,
        tamanhoPagina: TAMANHO_PAGINA,
        status: status || undefined,
        cliente: cliente || undefined,
        de: de || undefined,
        ate: ate || undefined,
      }),
    [pagina, status, cliente, de, ate],
  );

  return (
    <>
      <div className="bu-filtros">
        <Campo label="Status">
          <Select
            opcoes={OPCOES_STATUS}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
      ) : !dados || dados.pedidos.length === 0 ? (
        <Vazio>Nenhum pedido encontrado.</Vazio>
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
                  <th />
                </tr>
              </thead>
              <tbody>
                {dados.pedidos.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>#{p.id}</td>
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
                    <td className="bu-num">
                      <Link
                        href={`/admin/pedidos/${p.id}`}
                        className="bu-text-link"
                      >
                        Abrir
                      </Link>
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
    </>
  );
}
