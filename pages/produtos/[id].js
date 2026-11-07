// pages/produtos/[id].js
// Detalhe do produto: escolhe tamanho, cor, personalizações e quantidade, e põe no carrinho
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { obterProduto } from "lib/produtos";
import { formatarPreco } from "lib/formatar";
import { whatsappComTexto, LINK_EXTERNO } from "lib/contato";
import { useConsulta } from "hooks/useConsulta";
import { useCart, MAXIMO_ITENS, MAXIMO_QUANTIDADE } from "context/CartContext";
import { usePopup } from "context/PopupContext";
import Button from "components/ui/Button";
import Quantidade from "components/ui/Quantidade";
import Alert from "components/ui/Alert";
import Loading from "components/ui/Loading";
import Vazio from "components/ui/Vazio";
import Logo from "components/ui/Logo";
import Icon from "components/ui/Icon";
import { S, T } from "styles/theme";

export default function ProdutoPage() {
  const router = useRouter();
  if (!router.isReady) return <Loading />;
  return <Detalhe key={router.query.id} id={router.query.id} />;
}

function Detalhe({ id }) {
  // 404 (não existe ou saiu da vitrine) vira `null`: é "não encontrado", não erro
  const {
    dados: produto,
    carregando,
    erro,
    recarregar,
  } = useConsulta(
    () =>
      obterProduto(id).catch((e) => {
        if (e.status === 404) return null;
        throw e;
      }),
    [id],
  );

  if (carregando) return <Loading />;

  if (erro)
    return (
      <main className="bu-container" style={{ paddingTop: 48 }}>
        <Vazio
          acao={
            <Button variant="outline" onClick={recarregar}>
              Tentar de novo
            </Button>
          }
        >
          Não foi possível carregar o produto: {erro}
        </Vazio>
      </main>
    );

  if (!produto)
    return (
      <main className="bu-container" style={{ paddingTop: 48 }}>
        <Head>
          <title>Produto não encontrado · Belíssima Uniformes</title>
        </Head>
        <Vazio acao={<Button href="/produtos">Ver todos os produtos</Button>}>
          Produto não encontrado.
        </Vazio>
      </main>
    );

  return <ProdutoDetalhe produto={produto} />;
}

function Grupo({ titulo, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <p style={{ ...T.label, marginBottom: 10 }}>{titulo}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {children}
      </div>
    </div>
  );
}

function ProdutoDetalhe({ produto }) {
  const { adicionar } = useCart();
  const { abrir } = usePopup();
  const { tamanhos, cores, personalizacoes, variantes } = produto;
  const temCor = cores.length > 0;

  // Com uma opção só, ela já vem marcada
  const [tamanhoId, setTamanhoId] = useState(
    tamanhos.length === 1 ? tamanhos[0].id : null,
  );
  const [corId, setCorId] = useState(cores.length === 1 ? cores[0].id : null);
  const [extras, setExtras] = useState([]); // ids das personalizações
  const [quantidade, setQuantidade] = useState(1);
  const [aviso, setAviso] = useState(null);

  useEffect(() => setAviso(null), [tamanhoId, corId, extras, quantidade]);

  // Só para riscar a opção: continua clicável, e a combinação escolhida mostra "Esgotado"
  const tamanhoTemEstoque = (t) =>
    variantes.some(
      (v) => v.tamanhoId === t && v.disponivel && (!corId || v.corId === corId),
    );
  const corTemEstoque = (c) =>
    variantes.some(
      (v) =>
        v.corId === c &&
        v.disponivel &&
        (!tamanhoId || v.tamanhoId === tamanhoId),
    );

  // Produto sem cor: as variantes têm corId null, e o corId escolhido também fica null
  const variante = useMemo(
    () => variantes.find((v) => v.tamanhoId === tamanhoId && v.corId === corId),
    [variantes, tamanhoId, corId],
  );

  // Tamanho e cor nunca somam: só as personalizações marcadas
  const escolhidas = personalizacoes.filter((p) => extras.includes(p.id));
  const precoUnitario =
    produto.precoBase + escolhidas.reduce((s, p) => s + p.precoAdicional, 0);

  const faltaEscolher = !tamanhoId
    ? "Escolha um tamanho"
    : temCor && !corId
      ? "Escolha uma cor"
      : null;
  const esgotado = !faltaEscolher && !variante?.disponivel;

  function alternarExtra(pid) {
    setExtras((atual) =>
      atual.includes(pid) ? atual.filter((x) => x !== pid) : [...atual, pid],
    );
  }

  function handleAdicionar() {
    if (faltaEscolher || esgotado) return;

    const ok = adicionar({
      varianteId: variante.id,
      produtoId: produto.id,
      nome: produto.nome,
      tamanho: tamanhos.find((t) => t.id === tamanhoId)?.valor,
      cor: cores.find((c) => c.id === corId)?.valor ?? null,
      personalizacoes: escolhidas.map(({ id, valor, precoAdicional }) => ({
        id,
        valor,
        precoAdicional,
      })),
      precoUnitario,
      quantidade,
    });

    if (!ok)
      return setAviso(
        `Seu carrinho já está no limite de ${MAXIMO_ITENS} itens diferentes.`,
      );
    setQuantidade(1);
    abrir("cart");
  }

  return (
    <main
      className="bu-container"
      style={{ paddingTop: 36, paddingBottom: 80 }}
    >
      <Head>
        <title>{`${produto.nome} · Belíssima Uniformes`}</title>
      </Head>

      <nav style={{ fontSize: 13, color: S.muted, marginBottom: 24 }}>
        <Link href="/produtos" className="bu-link-muted">
          Produtos
        </Link>{" "}
        / <span style={{ color: S.dark }}>{produto.nome}</span>
      </nav>

      <div className="bu-detalhe-grid">
        <div
          style={{
            aspectRatio: "4 / 5",
            background: S.imageBg,
            borderRadius: S.radius.xl,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ opacity: 0.35, width: "50%" }}>
            <Logo height="auto" />
          </div>
        </div>

        <div>
          <h1
            className="bu-section-title"
            style={{ ...T.titulo, fontSize: 34, marginBottom: 10 }}
          >
            {produto.nome}
          </h1>
          <p style={{ fontSize: 22, fontWeight: 500, marginBottom: 20 }}>
            {formatarPreco(precoUnitario)}
          </p>

          {produto.descricao && (
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: S.soft,
                marginBottom: 28,
                whiteSpace: "pre-line",
              }}
            >
              {produto.descricao}
            </p>
          )}

          {!produto.disponivel ? (
            <div
              style={{
                background: S.white,
                border: S.line,
                borderRadius: S.radius.lg,
                padding: "18px 20px",
              }}
            >
              <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                Produto indisponível no momento
              </p>
              <p style={{ fontSize: 14, color: S.soft, marginBottom: 14 }}>
                Fale com a gente no WhatsApp para saber quando volta ou fazer
                uma encomenda.
              </p>
              <Button
                href={whatsappComTexto(
                  `Olá! Tenho interesse no produto "${produto.nome}", que está indisponível no site.`,
                )}
                {...LINK_EXTERNO}
              >
                <Icon name="whatsapp" size={18} color={S.white} />
                Chamar no WhatsApp
              </Button>
            </div>
          ) : (
            <>
              <Grupo titulo="Tamanho">
                {tamanhos.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className="bu-chip"
                    aria-pressed={tamanhoId === t.id}
                    data-esgotado={!tamanhoTemEstoque(t.id)}
                    onClick={() =>
                      setTamanhoId((atual) => (atual === t.id ? null : t.id))
                    }
                  >
                    {t.valor}
                  </button>
                ))}
              </Grupo>

              {temCor && (
                <Grupo titulo="Cor">
                  {cores.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className="bu-chip"
                      aria-pressed={corId === c.id}
                      data-esgotado={!corTemEstoque(c.id)}
                      onClick={() =>
                        setCorId((atual) => (atual === c.id ? null : c.id))
                      }
                    >
                      {c.valor}
                    </button>
                  ))}
                </Grupo>
              )}

              {personalizacoes.length > 0 && (
                <div style={{ marginBottom: 22 }}>
                  <p style={{ ...T.label, marginBottom: 10 }}>
                    Personalização (opcional)
                  </p>
                  {personalizacoes.map((p) => (
                    <label
                      key={p.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 14,
                        padding: "6px 0",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={extras.includes(p.id)}
                        onChange={() => alternarExtra(p.id)}
                      />
                      <span style={{ flex: 1 }}>{p.valor}</span>
                      {p.precoAdicional > 0 && (
                        <span style={{ color: S.muted }}>
                          + {formatarPreco(p.precoAdicional)}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}

              <Grupo titulo="Quantidade">
                <Quantidade
                  valor={quantidade}
                  max={MAXIMO_QUANTIDADE}
                  onChange={setQuantidade}
                />
              </Grupo>

              {esgotado && (
                <Alert>
                  Esgotado nessa combinação. Escolha outro tamanho ou cor.
                </Alert>
              )}
              <Alert>{aviso}</Alert>

              <Button
                full
                onClick={handleAdicionar}
                disabled={!!faltaEscolher || esgotado}
                style={{ padding: 14 }}
              >
                {faltaEscolher ??
                  (esgotado
                    ? "Esgotado"
                    : `Adicionar ao carrinho · ${formatarPreco(precoUnitario * quantidade)}`)}
              </Button>
              <p style={{ fontSize: 12, color: S.muted, marginTop: 10 }}>
                O pagamento é combinado com a loja depois do pedido.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
