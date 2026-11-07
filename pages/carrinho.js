// pages/carrinho.js
// Revisão do carrinho e envio do pedido. Precisa estar logado só na hora de finalizar.
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { criarPedido } from "lib/pedidos";
import { formatarPreco } from "lib/formatar";
import { useAsyncAction } from "hooks/useAsyncAction";
import { useCarrinho } from "context/CarrinhoContext";
import { useAuthContext } from "context/AuthContext";
import { usePopup } from "context/PopupContext";
import ItemCarrinho from "components/carrinho/ItemCarrinho";
import CabecalhoPagina from "components/ui/CabecalhoPagina";
import Campo from "components/ui/Campo";
import Textarea from "components/ui/Textarea";
import Button from "components/ui/Button";
import Alert from "components/ui/Alert";
import Loading from "components/ui/Loading";
import Vazio from "components/ui/Vazio";
import { S, T } from "styles/theme";

const MAXIMO_OBSERVACAO = 500;

export default function Carrinho() {
  const router = useRouter();
  const { itens, carregado, totalPecas, totalEstimado, limpar } = useCarrinho();
  const { usuario } = useAuthContext();
  const { abrir } = usePopup();
  const [observacao, setObservacao] = useState("");
  const criado = useRef(null); // o run() só diz se deu certo: o pedido fica aqui

  const enviar = useAsyncAction(async () => {
    criado.current = await criarPedido({
      itens: itens.map((i) => ({
        varianteId: i.varianteId,
        quantidade: i.quantidade,
        personalizacaoIds: i.personalizacoes.map((p) => p.id),
      })),
      observacao: observacao.trim() || null,
    });
  });

  async function handleFinalizar() {
    if (await enviar.run()) {
      // Vai para o pedido antes de esvaziar, para não piscar o "carrinho vazio"
      await router.push(`/pedidos/${criado.current.id}?novo=1`);
      limpar();
    }
  }

  if (!carregado) return <Loading />;

  return (
    <main
      className="bu-container"
      style={{ paddingTop: 48, paddingBottom: 80 }}
    >
      <Head>
        <title>Carrinho · Belíssima Uniformes</title>
      </Head>

      <CabecalhoPagina eyebrow="Seu pedido" titulo="Carrinho" />

      {itens.length === 0 ? (
        <Vazio acao={<Button href="/produtos">Ver produtos</Button>}>
          Seu carrinho está vazio.
        </Vazio>
      ) : (
        <div className="bu-checkout-grid">
          <section style={{ borderTop: S.line }}>
            {itens.map((item) => (
              <ItemCarrinho
                key={item.chave}
                item={item}
                disabled={enviar.loading}
              />
            ))}
          </section>

          <aside
            style={{
              background: S.white,
              border: S.line,
              borderRadius: S.radius.xl,
              padding: 24,
              position: "sticky",
              top: 160,
            }}
          >
            <p style={T.cardTitle}>Resumo</p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                color: S.soft,
                marginBottom: 8,
              }}
            >
              <span>Peças</span>
              <span>{totalPecas}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "14px 0",
                borderTop: S.line,
                marginTop: 8,
                marginBottom: 16,
              }}
            >
              <span style={T.label}>Total</span>
              <span style={{ fontSize: 22, fontWeight: 600 }}>
                {formatarPreco(totalEstimado)}
              </span>
            </div>

            <Campo label="Observação (opcional)">
              <Textarea
                value={observacao}
                maxLength={MAXIMO_OBSERVACAO}
                disabled={enviar.loading}
                placeholder="Ex.: nome para bordar, prazo, forma de pagamento..."
                onChange={(e) => setObservacao(e.target.value)}
                style={{ marginBottom: 4 }}
              />
            </Campo>
            <p
              style={{
                fontSize: 11,
                color: S.muted,
                textAlign: "right",
                marginBottom: 14,
              }}
            >
              {observacao.length}/{MAXIMO_OBSERVACAO}
            </p>

            <Alert>{enviar.erro}</Alert>

            {usuario ? (
              <Button
                full
                loading={enviar.loading}
                onClick={handleFinalizar}
                style={{ padding: 13 }}
              >
                {enviar.loading ? "Enviando pedido..." : "Finalizar pedido"}
              </Button>
            ) : (
              <Button
                full
                onClick={() => abrir("auth")}
                style={{ padding: 13 }}
              >
                Entrar para finalizar
              </Button>
            )}

            <p
              style={{
                fontSize: 12,
                color: S.muted,
                marginTop: 12,
                lineHeight: 1.5,
              }}
            >
              Os valores são confirmados pela loja ao criar o pedido. O
              pagamento é combinado depois, e o estoque só é reservado quando
              ele for confirmado.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
