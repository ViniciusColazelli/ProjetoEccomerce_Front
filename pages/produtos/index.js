// pages/produtos/index.js
// Vitrine. Os filtros moram na URL (?nome=&pagina=&ordenarPor=&direcao=), então dá para
// compartilhar o link, voltar no navegador e chegar já filtrado pela busca ou pelas categorias.
import { useRouter } from "next/router";
import Head from "next/head";
import { listarProdutos } from "lib/produtos";
import { useConsulta } from "hooks/useConsulta";
import { useCampoNaUrl } from "hooks/useCampoNaUrl";
import CabecalhoPagina from "components/ui/CabecalhoPagina";
import ProdutoCard from "components/ui/ProdutoCard";
import Paginacao from "components/ui/Paginacao";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import Alert from "components/ui/Alert";
import Loading from "components/ui/Loading";
import Vazio from "components/ui/Vazio";
import Button from "components/ui/Button";

const TAMANHO_PAGINA = 12; // a API aceita no máximo 50

const ORDENACOES = [
  { valor: "nome-asc", rotulo: "Nome A–Z", ordenarPor: "nome", direcao: "asc" },
  {
    valor: "preco-asc",
    rotulo: "Menor preço",
    ordenarPor: "preco",
    direcao: "asc",
  },
  {
    valor: "preco-desc",
    rotulo: "Maior preço",
    ordenarPor: "preco",
    direcao: "desc",
  },
];
const ORDEM_PADRAO = ORDENACOES[0];

// Valores inválidos na URL (pagina=abc, ordenarPor=xyz) caem no padrão
function lerFiltros(query) {
  const ordem =
    ORDENACOES.find(
      (o) => o.ordenarPor === query.ordenarPor && o.direcao === query.direcao,
    ) ?? ORDEM_PADRAO;

  return {
    nome: typeof query.nome === "string" ? query.nome.trim() : "",
    pagina: Math.max(1, parseInt(query.pagina, 10) || 1),
    ordem,
  };
}

// Só vai para a URL o que foge do padrão: /produtos fica limpo sem filtros
function montarQuery({ nome, pagina, ordem }) {
  const query = {};
  if (nome) query.nome = nome;
  if (pagina > 1) query.pagina = pagina;
  if (ordem !== ORDEM_PADRAO) {
    query.ordenarPor = ordem.ordenarPor;
    query.direcao = ordem.direcao;
  }
  return query;
}

export default function Produtos() {
  const router = useRouter();
  // Antes do isReady o router.query vem vazio em página estática
  if (!router.isReady) return <Loading />;
  return <Vitrine />;
}

function Vitrine() {
  const router = useRouter();
  const filtros = lerFiltros(router.query);
  const { nome, pagina, ordem } = filtros;

  // Página, ordem e começar uma busca usam push (o "voltar" desfaz);
  // refinar uma busca já feita usa replace, para não criar uma entrada por pausa na digitação
  function navegar(mudancas, { substituir = false } = {}) {
    const query = montarQuery({ ...filtros, ...mudancas });
    router[substituir ? "replace" : "push"](
      { pathname: "/produtos", query },
      undefined,
      { scroll: !substituir },
    );
  }

  // ── Campo de busca ────────────────────────────────────────────
  // Parou de digitar: leva a busca para a URL, voltando para a página 1
  const [busca, setBusca] = useCampoNaUrl(nome, (valor) =>
    navegar({ nome: valor, pagina: 1 }, { substituir: !!nome && !!valor }),
  );

  // ── Dados ─────────────────────────────────────────────────────
  const { dados, carregando, erro, recarregar } = useConsulta(
    () =>
      listarProdutos({
        pagina,
        tamanhoPagina: TAMANHO_PAGINA,
        nome: nome || undefined,
        ordenarPor: ordem.ordenarPor,
        direcao: ordem.direcao,
        somenteDisponiveis: true,
      }),
    [nome, pagina, ordem.valor],
  );

  const produtos = dados?.produtos ?? [];
  const total = dados?.total ?? 0;
  const paginaAlemDoFim = !!dados && produtos.length === 0 && total > 0;

  let conteudo;
  if (carregando && !dados) {
    conteudo = <Loading />;
  } else if (erro) {
    conteudo = (
      <>
        <Alert>Não foi possível carregar os produtos: {erro}</Alert>
        <Button variant="outline" onClick={recarregar}>
          Tentar de novo
        </Button>
      </>
    );
  } else if (paginaAlemDoFim) {
    conteudo = (
      <Vazio
        acao={
          <Button variant="outline" onClick={() => navegar({ pagina: 1 })}>
            Ir para a primeira página
          </Button>
        }
      >
        Essa página não existe.
      </Vazio>
    );
  } else if (produtos.length === 0) {
    conteudo = nome ? (
      <Vazio
        acao={
          <Button variant="outline" onClick={() => setBusca("")}>
            Ver todos os produtos
          </Button>
        }
      >
        Nenhum produto encontrado para ‘{nome}’.
      </Vazio>
    ) : (
      <Vazio>Nenhum produto disponível no momento.</Vazio>
    );
  } else {
    conteudo = (
      <>
        <div
          className="bu-produto-grid"
          style={{ opacity: carregando ? 0.5 : 1, transition: "opacity 0.15s" }}
        >
          {produtos.map((p) => (
            <ProdutoCard key={p.id} produto={p} />
          ))}
        </div>
        <Paginacao
          pagina={pagina}
          tamanhoPagina={TAMANHO_PAGINA}
          total={total}
          onChange={(p) => navegar({ pagina: p })}
        />
      </>
    );
  }

  return (
    <main
      className="bu-container"
      style={{ paddingTop: 48, paddingBottom: 80 }}
    >
      <Head>
        <title>
          {nome
            ? `‘${nome}’ · Produtos · Belíssima Uniformes`
            : "Produtos · Belíssima Uniformes"}
        </title>
      </Head>

      <CabecalhoPagina
        eyebrow="Catálogo"
        titulo={nome ? `Resultados para ‘${nome}’` : "Nossos produtos"}
        subtitulo={
          dados && !erro
            ? `${total} ${total === 1 ? "produto disponível" : "produtos disponíveis"}`
            : " "
        }
      />

      <div className="bu-filtros">
        <Input
          type="search"
          placeholder="Buscar por nome..."
          value={busca}
          maxLength={200}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar por nome"
          style={{ marginBottom: 0 }}
        />
        <Select
          aria-label="Ordenar por"
          opcoes={ORDENACOES}
          value={ordem.valor}
          onChange={(e) =>
            navegar({
              ordem: ORDENACOES.find((o) => o.valor === e.target.value),
              pagina: 1,
            })
          }
          style={{ marginBottom: 0 }}
        />
      </div>

      {conteudo}
    </main>
  );
}
