// components/popups/SearchPopup.jsx
// Mostra resultados enquanto digita (a partir de 2 letras). Enter ou o botão levam
// para a vitrine filtrada; clicar num resultado abre o produto.
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Popup from "./Popup";
import Input from "components/ui/Input";
import Button from "components/ui/Button";
import FotoProduto from "components/ui/FotoProduto";
import { listarProdutos } from "lib/produtos";
import { formatarPreco } from "lib/formatar";
import { useDebounce } from "hooks/useDebounce";
import { S, T } from "styles/theme";

const MINIMO_LETRAS = 2;
const RESULTADOS = 5;

const chaveDaConsulta = (termo, tentativa) => `${tentativa}|${termo}`;

const linkVitrine = (nome) =>
  nome ? { pathname: "/produtos", query: { nome } } : "/produtos";

function Mensagem({ children }) {
  return (
    <p style={{ fontSize: 13, color: S.muted, padding: "14px 2px 4px" }}>
      {children}
    </p>
  );
}

export default function SearchPopup({ onClose }) {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const termo = useDebounce(busca.trim(), 300);
  const [tentativa, setTentativa] = useState(0);
  // { consulta, termo, produtos, total } da última busca que terminou, ou { consulta, termo, erro }.
  // `consulta` diz de qual termo e tentativa ela veio: se não bate com a atual, ainda está buscando
  const [resultado, setResultado] = useState(null);
  const carregando =
    termo.length >= MINIMO_LETRAS &&
    resultado?.consulta !== chaveDaConsulta(termo, tentativa);

  useEffect(() => {
    if (termo.length < MINIMO_LETRAS) return;

    // Cada letra nova cancela a requisição anterior: a resposta velha nunca sobrescreve a nova
    const controle = new AbortController();
    const consulta = chaveDaConsulta(termo, tentativa);

    listarProdutos(
      { nome: termo, tamanhoPagina: RESULTADOS, somenteDisponiveis: true },
      { signal: controle.signal },
    )
      .then((res) =>
        setResultado({
          consulta,
          termo,
          produtos: res.produtos,
          total: res.total,
        }),
      )
      .catch((e) => {
        if (!e.cancelado) setResultado({ consulta, termo, erro: e.message });
      });

    return () => controle.abort();
  }, [termo, tentativa]);

  // Apagou até ficar curto: some com o resultado antigo, e a próxima busca começa do "Buscando…"
  function handleDigitar(e) {
    setBusca(e.target.value);
    if (e.target.value.trim().length < MINIMO_LETRAS) setResultado(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    router.push(linkVitrine(busca.trim()));
    onClose();
  }

  const curta = busca.trim().length < MINIMO_LETRAS;
  // Ainda dentro dos 300 ms de espera, ou com a requisição em andamento
  const buscando = !curta && (carregando || busca.trim() !== termo);

  let conteudo;
  if (curta) {
    conteudo = (
      <Mensagem>Digite pelo menos {MINIMO_LETRAS} letras para buscar.</Mensagem>
    );
  } else if (buscando && !resultado) {
    conteudo = <Mensagem>Buscando…</Mensagem>;
  } else if (resultado?.erro) {
    conteudo = (
      <div style={{ padding: "14px 2px 4px" }}>
        <p style={{ fontSize: 13, color: S.error.text, marginBottom: 10 }}>
          Não foi possível buscar: {resultado.erro}
        </p>
        <Button
          variant="outline"
          type="button"
          onClick={() => setTentativa((n) => n + 1)}
          style={{ padding: "7px 16px", fontSize: 13 }}
        >
          Tentar de novo
        </Button>
      </div>
    );
  } else if (resultado && resultado.produtos.length === 0) {
    conteudo = buscando ? (
      <Mensagem>Buscando…</Mensagem>
    ) : (
      <Mensagem>Nada encontrado para ‘{resultado.termo}’.</Mensagem>
    );
  } else if (resultado) {
    conteudo = (
      <div
        style={{
          marginTop: 12,
          opacity: buscando ? 0.5 : 1,
          transition: "opacity 0.15s",
        }}
      >
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {resultado.produtos.map((p) => (
            <li key={p.id}>
              <Link
                href={`/produtos/${p.id}`}
                onClick={onClose}
                className="bu-busca-item"
              >
                <FotoProduto
                  src={p.imagemUrl}
                  raio={6}
                  larguraLogo="75%"
                  style={{ width: 36, flexShrink: 0 }}
                />
                <span style={{ fontSize: 14, color: S.dark, flex: 1 }}>
                  {p.nome}
                </span>
                <span style={{ fontSize: 13, color: S.soft, flexShrink: 0 }}>
                  {formatarPreco(p.precoBase)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={linkVitrine(resultado.termo)}
          onClick={onClose}
          className="bu-text-link"
          style={{ display: "inline-block", marginTop: 12, fontSize: 13 }}
        >
          {resultado.total === 1
            ? "Ver 1 resultado na vitrine"
            : `Ver todos os ${resultado.total} resultados`}
        </Link>
      </div>
    );
  }

  return (
    <Popup onClose={onClose} width={360}>
      <p style={{ ...T.eyebrow, letterSpacing: "0.2em", marginBottom: 12 }}>
        Pesquisar
      </p>
      <form
        onSubmit={handleSubmit}
        role="search"
        style={{ display: "flex", gap: 8 }}
      >
        <Input
          autoFocus
          type="search"
          aria-label="Buscar produtos"
          placeholder="Buscar produtos..."
          value={busca}
          maxLength={200}
          onChange={handleDigitar}
          style={{ flex: 1, marginBottom: 0 }}
        />
        <Button type="submit" aria-label="Buscar" style={{ padding: "0 14px" }}>
          →
        </Button>
      </form>
      <div aria-live="polite">{conteudo}</div>
    </Popup>
  );
}
