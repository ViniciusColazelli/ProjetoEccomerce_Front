// pages/pedidos/[id].js
// Detalhe do pedido do cliente. Dá para cancelar enquanto aguarda o pagamento.
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { obterMeuPedido, cancelarMeuPedido } from "lib/pedidos";
import { formatarData, formatarPreco } from "lib/formatar";
import { MENSAGEM_CLIENTE } from "lib/statusPedido";
import { whatsappComTexto, LINK_EXTERNO, ENDERECO, HORARIO } from "lib/contato";
import { useConsulta } from "hooks/useConsulta";
import RotaProtegida from "components/layout/RotaProtegida";
import ItensPedido from "components/pedidos/ItensPedido";
import StatusBadge from "components/ui/StatusBadge";
import Button from "components/ui/Button";
import Confirmar from "components/ui/Confirmar";
import Alert from "components/ui/Alert";
import Loading from "components/ui/Loading";
import Vazio from "components/ui/Vazio";
import Icon from "components/ui/Icon";
import { S, T } from "styles/theme";

export default function PedidoPage() {
  const router = useRouter();
  return (
    <main
      className="bu-container"
      style={{ paddingTop: 36, paddingBottom: 80, maxWidth: 900 }}
    >
      <Head>
        <title>Pedido · Belíssima Uniformes</title>
      </Head>
      <nav style={{ fontSize: 13, color: S.muted, marginBottom: 24 }}>
        <Link href="/pedidos" className="bu-link-muted">
          Meus pedidos
        </Link>{" "}
        / <span style={{ color: S.dark }}>Pedido #{router.query.id}</span>
      </nav>
      <RotaProtegida>
        {router.isReady ? (
          <DetalhePedido
            key={router.query.id}
            id={router.query.id}
            novo={router.query.novo === "1"}
          />
        ) : (
          <Loading />
        )}
      </RotaProtegida>
    </main>
  );
}

function DetalhePedido({ id, novo }) {
  // 404: não existe ou é de outro cliente (a API não diferencia) → "não encontrado"
  const {
    dados: pedido,
    carregando,
    erro,
    recarregar,
  } = useConsulta(
    () =>
      obterMeuPedido(id).catch((e) => {
        if (e.status === 404) return null;
        throw e;
      }),
    [id],
  );
  const [confirmando, setConfirmando] = useState(false);

  if (carregando && !pedido) return <Loading />;

  if (erro)
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
      <Vazio acao={<Button href="/pedidos">Ver meus pedidos</Button>}>
        Pedido não encontrado.
      </Vazio>
    );

  const aguardando = pedido.status === "AguardandoPagamento";
  const linkPagamento = whatsappComTexto(
    `Olá! Fiz o pedido #${pedido.id} no site, no valor de ${formatarPreco(pedido.total)}. Como faço o pagamento?`,
  );

  return (
    <>
      <Head>
        <title>{`Pedido #${pedido.id} · Belíssima Uniformes`}</title>
      </Head>
      {novo && aguardando && (
        <Alert type="success">Pedido #{pedido.id} criado com sucesso!</Alert>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ ...T.titulo, fontSize: 30, marginBottom: 6 }}>
            Pedido #{pedido.id}
          </h1>
          <p style={{ fontSize: 13, color: S.muted }}>
            Feito em {formatarData(pedido.criadoEm, { comHora: true })}
            {pedido.atualizadoEm &&
              ` · atualizado em ${formatarData(pedido.atualizadoEm, { comHora: true })}`}
          </p>
        </div>
        <StatusBadge status={pedido.status} />
      </div>

      <section
        style={{
          background: S.white,
          border: S.line,
          borderRadius: S.radius.xl,
          padding: "20px 24px",
          marginBottom: 24,
        }}
      >
        {aguardando && (
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
            Combine o pagamento pelo WhatsApp
          </p>
        )}
        <p style={{ fontSize: 15, lineHeight: 1.6 }}>
          {MENSAGEM_CLIENTE[pedido.status]}
        </p>
        {pedido.status === "ProntoParaRetirada" && (
          <p style={{ fontSize: 14, color: S.soft, marginTop: 8 }}>
            {ENDERECO}
            <br />
            {HORARIO}
          </p>
        )}
        {aguardando && (
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 16,
            }}
          >
            <Button href={linkPagamento} {...LINK_EXTERNO}>
              <Icon name="whatsapp" size={18} color={S.white} />
              Chamar no WhatsApp
            </Button>
            <Button variant="danger" onClick={() => setConfirmando(true)}>
              Cancelar pedido
            </Button>
          </div>
        )}
      </section>

      <ItensPedido pedido={pedido} />

      {pedido.observacao && (
        <div style={{ marginTop: 24 }}>
          <p style={{ ...T.label, marginBottom: 6 }}>Observação</p>
          <p style={{ fontSize: 14, color: S.soft, whiteSpace: "pre-line" }}>
            {pedido.observacao}
          </p>
        </div>
      )}

      {confirmando && (
        <Confirmar
          titulo="Cancelar pedido?"
          textoConfirmar="Sim, cancelar"
          onConfirmar={async () => {
            await cancelarMeuPedido(id);
            recarregar();
          }}
          onClose={() => setConfirmando(false)}
        >
          O pedido #{pedido.id} será cancelado e não poderá ser reaberto.
        </Confirmar>
      )}
    </>
  );
}
