// pages/admin/pedidos/[id].js
// Detalhe do pedido para a loja: cliente, itens e avanço de status.
// Só aparecem os próximos status permitidos (lib/statusPedido.js); a API confere de novo (409).
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { obterPedidoAdmin, alterarStatusPedido } from "lib/pedidosAdmin";
import { formatarData } from "lib/formatar";
import { proximosStatus, rotuloStatus } from "lib/statusPedido";
import { useConsulta } from "hooks/useConsulta";
import AdminLayout from "components/admin/AdminLayout";
import ItensPedido from "components/pedidos/ItensPedido";
import StatusBadge from "components/ui/StatusBadge";
import Button from "components/ui/Button";
import Confirmar from "components/ui/Confirmar";
import Alert from "components/ui/Alert";
import Loading from "components/ui/Loading";
import Vazio from "components/ui/Vazio";
import { S, T } from "styles/theme";

// Mudanças com efeito além do status pedem confirmação antes
const CONFIRMAR = {
  Pago: {
    titulo: "Confirmar o pagamento?",
    texto:
      "Isso dá baixa no estoque das peças do pedido. Se faltar alguma peça, a API recusa e nada muda.",
    botao: "Confirmar pagamento",
  },
  Cancelado: {
    titulo: "Cancelar o pedido?",
    texto:
      "O pedido será cancelado e não poderá ser reaberto. Nenhum estoque foi baixado, porque ele ainda não foi pago.",
    botao: "Sim, cancelar",
  },
};

// Depois do pagamento existem saídas de estoque ligadas ao pedido
const BAIXOU_ESTOQUE = ["Pago", "EmProducao", "ProntoParaRetirada", "Entregue"];

export default function AdminPedido() {
  const router = useRouter();
  return (
    <AdminLayout titulo="Pedido">
      {router.isReady ? (
        <DetalhePedido key={router.query.id} id={router.query.id} />
      ) : (
        <Loading />
      )}
    </AdminLayout>
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
  // 404 vira null: "Pedido não encontrado"
  const {
    dados: pedido,
    carregando,
    erro,
    recarregar,
    setDados,
  } = useConsulta(
    () =>
      obterPedidoAdmin(id).catch((e) => {
        if (e.status === 404) return null;
        throw e;
      }),
    [id],
  );
  const [confirmando, setConfirmando] = useState(null); // status que pede confirmação
  const [mudando, setMudando] = useState(null); // status sendo gravado sem confirmação
  const [erroStatus, setErroStatus] = useState(null);

  // A API devolve o pedido atualizado: a tela usa a resposta, sem buscar de novo
  async function gravarStatus(status) {
    setErroStatus(null);
    setDados(await alterarStatusPedido(id, { status }));
  }

  async function mudarDireto(status) {
    setMudando(status);
    try {
      await gravarStatus(status);
    } catch (e) {
      setErroStatus(e.message);
    } finally {
      setMudando(null);
    }
  }

  if (carregando && !pedido) return <Loading />;

  if (erro && !pedido)
    return (
      <Vazio
        acao={
          <Button variant="outline" onClick={recarregar}>
            Tentar de novo
          </Button>
        }
      >
        Não foi possível carregar o pedido: {erro}
      </Vazio>
    );

  if (!pedido)
    return (
      <Vazio acao={<Button href="/admin/pedidos">Ver todos os pedidos</Button>}>
        Pedido não encontrado.
      </Vazio>
    );

  const proximos = proximosStatus(pedido.status);

  return (
    <>
      <Head>
        <title>{`Pedido #${pedido.id} · Painel admin · Belíssima Uniformes`}</title>
      </Head>

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
                loading={mudando === s}
                disabled={!!mudando}
                onClick={() =>
                  CONFIRMAR[s] ? setConfirmando(s) : mudarDireto(s)
                }
              >
                {mudando === s
                  ? "Salvando..."
                  : s === "Cancelado"
                    ? "Cancelar pedido"
                    : `Marcar como ${rotuloStatus(s).toLowerCase()}`}
              </Button>
            ))}
          </div>
        )}
      </div>

      <Alert>{erroStatus}</Alert>

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
        <Info rotulo="Estoque">
          {BAIXOU_ESTOQUE.includes(pedido.status) ? (
            <Link
              href={`/admin/estoque/movimentacoes?pedidoId=${pedido.id}`}
              className="bu-text-link"
              style={{ fontSize: 13 }}
            >
              Ver movimentações do pedido
            </Link>
          ) : (
            <span style={{ color: S.muted, fontSize: 13 }}>
              {pedido.status === "Cancelado"
                ? "Cancelado antes do pagamento: nada foi baixado."
                : "A baixa acontece quando o pagamento for confirmado."}
            </span>
          )}
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

      {confirmando && (
        <Confirmar
          titulo={CONFIRMAR[confirmando].titulo}
          textoConfirmar={CONFIRMAR[confirmando].botao}
          onConfirmar={() => gravarStatus(confirmando)}
          onClose={() => setConfirmando(null)}
        >
          <p>
            Pedido #{pedido.id}: {rotuloStatus(pedido.status)} →{" "}
            <strong style={{ color: S.dark }}>
              {rotuloStatus(confirmando)}
            </strong>
          </p>
          <p style={{ marginTop: 12 }}>{CONFIRMAR[confirmando].texto}</p>
        </Confirmar>
      )}
    </>
  );
}
