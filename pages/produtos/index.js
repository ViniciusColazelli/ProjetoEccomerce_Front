// pages/produtos/index.js
// Vitrine: busca por nome, ordenação, só disponíveis e paginação
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { listarProdutos } from "lib/produtos";
import { useConsulta } from "hooks/useConsulta";
import { useDebounce } from "hooks/useDebounce";
import CabecalhoPagina from "components/ui/CabecalhoPagina";
import ProdutoCard from "components/ui/ProdutoCard";
import Paginacao from "components/ui/Paginacao";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import Alert from "components/ui/Alert";
import Loading from "components/ui/Loading";
import Vazio from "components/ui/Vazio";
import Button from "components/ui/Button";
import { S } from "styles/theme";

const TAMANHO_PAGINA = 12;

const ORDENACOES = [
  { valor: "nome-asc", rotulo: "Nome (A–Z)" },
  { valor: "nome-desc", rotulo: "Nome (Z–A)" },
  { valor: "preco-asc", rotulo: "Menor preço" },
  { valor: "preco-desc", rotulo: "Maior preço" },
];

export default function Produtos() {
  const router = useRouter();
  if (!router.isReady) return <Loading />;
  return <Vitrine buscaInicial={router.query.nome ?? ""} />;
}

function Vitrine({ buscaInicial }) {
  const router = useRouter();
  const [busca, setBusca] = useState(buscaInicial);
  const [ordem, setOrdem] = useState("nome-asc");
  const [somenteDisponiveis, setSomenteDisponiveis] = useState(false);
  const [pagina, setPagina] = useState(1);
  const nome = useDebounce(busca.trim());

  // A busca da Navbar troca o ?nome= com a vitrine já aberta
  useEffect(() => {
    setBusca(router.query.nome ?? "");
  }, [router.query.nome]);

  // Filtro novo começa da primeira página
  useEffect(() => setPagina(1), [nome, ordem, somenteDisponiveis]);

  const [ordenarPor, direcao] = ordem.split("-");
  const { dados, carregando, erro } = useConsulta(
    () =>
      listarProdutos({
        pagina,
        tamanhoPagina: TAMANHO_PAGINA,
        nome: nome || undefined,
        ordenarPor,
        direcao,
        somenteDisponiveis,
      }),
    [pagina, nome, ordem, somenteDisponiveis],
  );

  const produtos = dados?.produtos ?? [];
  const filtrando = !!nome || somenteDisponiveis;

  return (
    <main
      className="bu-container"
      style={{ paddingTop: 48, paddingBottom: 80 }}
    >
      <Head>
        <title>Produtos · Belíssima Uniformes</title>
      </Head>

      <CabecalhoPagina
        eyebrow="Catálogo"
        titulo="Nossos produtos"
        subtitulo={
          dados
            ? `${dados.total} ${dados.total === 1 ? "produto" : "produtos"}`
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
          value={ordem}
          onChange={(e) => setOrdem(e.target.value)}
          style={{ marginBottom: 0 }}
        />
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
            checked={somenteDisponiveis}
            onChange={(e) => setSomenteDisponiveis(e.target.checked)}
          />
          Só disponíveis
        </label>
      </div>

      <Alert>{erro}</Alert>

      {carregando && !dados ? (
        <Loading />
      ) : produtos.length === 0 ? (
        <Vazio
          acao={
            filtrando && (
              <Button
                variant="outline"
                onClick={() => {
                  setBusca("");
                  setSomenteDisponiveis(false);
                }}
              >
                Limpar filtros
              </Button>
            )
          }
        >
          {filtrando
            ? "Nenhum produto encontrado com esses filtros."
            : "Ainda não há produtos no catálogo."}
        </Vazio>
      ) : (
        <div
          className="bu-produto-grid"
          style={{ opacity: carregando ? 0.5 : 1, transition: "opacity 0.15s" }}
        >
          {produtos.map((p) => (
            <ProdutoCard key={p.id} produto={p} />
          ))}
        </div>
      )}

      {dados && (
        <Paginacao
          pagina={pagina}
          tamanhoPagina={TAMANHO_PAGINA}
          total={dados.total}
          onChange={(p) => {
            setPagina(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </main>
  );
}
