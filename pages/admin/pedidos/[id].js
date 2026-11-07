// pages/admin/pedidos/[id].js
// Detalhe do pedido para a loja: cliente, itens e avanço de status
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { obterPedidoAdmin, alterarStatusPedido } from "lib/pedidosAdmin";
import { formatarData } from "lib/formatar";
import { proximosStatus, rotuloStatus } from "lib/statusPedido";
import { useConsulta } from "hooks/useConsulta";
import AdminShell from "components/admin/AdminShell";
import ItensPedido from "components/pedidos/ItensPedido";
import StatusBadge from "components/ui/StatusBadge";
import Button from "components/ui/Button";
import Confirmar from "components/ui/Confirmar";
import Loading from "components/ui/Loading";
import Vazio from "components/ui/Vazio";
import { S, T } from "styles/theme";

// O que cada mudança faz além de trocar o status (regras da API)
const AVISOS = {
  Pago: "Confirmar o pagamento dá baixa no estoque das peças. Se faltar saldo, a API recusa.",
  Cancelado: "O pedido será cancelado e não poderá ser reaberto.",
  Entregue: "Entregue é o status final do pedido.",
};

export default function AdminPedido() {
  const router = useRouter();
  return (
    <AdminShell titulo={`Pedido #${router.query.id ?? ""}`}>
      {router.isReady ? (
        <DetalhePedido key={router.query.id} id={router.query.id} />
      ) : (
        <Loading />
      )}
    </AdminShell>
  );
}

function Info({ rotulo, children }) {
  return (
    <div>
      <p style={{ ...T.label, marginBottom: 4 }}>{rotulo}</p>
      <div style={{ fontSize: 14 }}>{children}</div>
    </div>
  );
}

function DetalhePedido({ id }) {
  const {
    dados: pedido,
    carregando,
    erro,
    recarregar,
  } = useConsulta(() => obterPedidoAdmin(id), [id]);
  const [novoStatus, setNovoStatus] = useState(null);

  if (carregando && !pedido) return <Loading />;
  if (erro || !pedido)
    return (
      <Vazio acao={<Button href="/admin/pedidos">Voltar aos pedidos</Button>}>
        {erro ?? "Pedido não encontrado."}
      </Vazio>
    );

  const proximos = proximosStatus(pedido.status);

  return (
    <>
      <Link
        href="/admin/pedidos"
        className="bu-link-muted"
        style={{ fontSize: 13, color: S.muted }}
      >
        ← Todos os pedidos
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
          <h1 style={{ ...T.titulo, fontSize: 30 }}>Pedido #{pedido.id}</h1>
          <StatusBadge status={pedido.status} />
        </div>

        {proximos.length > 0 && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {proximos.map((s) => (
              <Button
                key={s}
                variant={s === "Cancelado" ? "danger" : "primary"}
                onClick={() => setNovoStatus(s)}
              >
                {s === "Cancelado"
                  ? "Cancelar pedido"
                  : `Marcar como ${rotuloStatus(s).toLowerCase()}`}
              </Button>
            ))}
          </div>
        )}
      </div>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          background: S.white,
          border: S.line,
          borderRadius: S.radius.xl,
          padding: "20px 24px",
          marginBottom: 24,
        }}
      >
        <Info rotulo="Cliente">
          <p>{pedido.cliente.nome}</p>
          <a
            href={`mailto:${pedido.cliente.email}`}
            className="bu-text-link"
            style={{ fontSize: 13 }}
          >
            {pedido.cliente.email}
          </a>
        </Info>
        <Info rotulo="Criado em">
          {formatarData(pedido.criadoEm, { comHora: true })}
        </Info>
        <Info rotulo="Última atualização">
          {pedido.atualizadoEm
            ? formatarData(pedido.atualizadoEm, { comHora: true })
            : "—"}
        </Info>
      </section>

      <ItensPedido pedido={pedido} />

      {pedido.observacao && (
        <div style={{ marginTop: 24 }}>
          <p style={{ ...T.label, marginBottom: 6 }}>Observação do cliente</p>
          <p style={{ fontSize: 14, color: S.soft, whiteSpace: "pre-line" }}>
            {pedido.observacao}
          </p>
        </div>
      )}

      {novoStatus && (
        <Confirmar
          titulo={`Mudar para "${rotuloStatus(novoStatus)}"?`}
          onConfirmar={async () => {
            await alterarStatusPedido(id, { status: novoStatus });
            recarregar();
          }}
          onClose={() => setNovoStatus(null)}
        >
          <p>
            Pedido #{pedido.id}: {rotuloStatus(pedido.status)} →{" "}
            <strong style={{ color: S.dark }}>
              {rotuloStatus(novoStatus)}
            </strong>
          </p>
          {AVISOS[novoStatus] && (
            <p style={{ marginTop: 12 }}>{AVISOS[novoStatus]}</p>
          )}
        </Confirmar>
      )}
    </>
  );
}
