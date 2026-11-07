// pages/pedidos/index.js
// Histórico de pedidos do cliente logado. A página fica na URL (?pagina=2),
// então voltar do detalhe do pedido cai na mesma página da lista.
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { listarMeusPedidos } from "lib/pedidos";
import { formatarData, formatarPreco } from "lib/formatar";
import { useConsulta } from "hooks/useConsulta";
import RotaProtegida from "components/layout/RotaProtegida";
import CabecalhoPagina from "components/ui/CabecalhoPagina";
import StatusBadge from "components/ui/StatusBadge";
import Paginacao from "components/ui/Paginacao";
import Alert from "components/ui/Alert";
import Loading from "components/ui/Loading";
import Vazio from "components/ui/Vazio";
import Button from "components/ui/Button";
import { S } from "styles/theme";

const TAMANHO_PAGINA = 10;

export default function MeusPedidos() {
  const router = useRouter();
  return (
    <main
      className="bu-container"
      style={{ paddingTop: 48, paddingBottom: 80 }}
    >
      <Head>
        <title>Meus pedidos · Belíssima Uniformes</title>
      </Head>
      <CabecalhoPagina eyebrow="Minha conta" titulo="Meus pedidos" />
      <RotaProtegida>
        {router.isReady ? <ListaPedidos /> : <Loading />}
      </RotaProtegida>
    </main>
  );
}

function ListaPedidos() {
  const router = useRouter();
  const pagina = Math.max(1, parseInt(router.query.pagina, 10) || 1);

  const { dados, carregando, erro, recarregar } = useConsulta(
    () => listarMeusPedidos({ pagina, tamanhoPagina: TAMANHO_PAGINA }),
    [pagina],
  );

  const irParaPagina = (p) =>
    router.push(p > 1 ? `/pedidos?pagina=${p}` : "/pedidos");

  // A linha toda abre o pedido. O link do nº continua lá para teclado e "abrir em nova aba"
  function abrirPedido(e, id) {
    if (e.target.closest("a")) return;
    router.push(`/pedidos/${id}`);
  }

  if (carregando && !dados) return <Loading />;

  if (erro)
    return (
      <>
        <Alert>Não foi possível carregar seus pedidos: {erro}</Alert>
        <Button variant="outline" onClick={recarregar}>
          Tentar de novo
        </Button>
      </>
    );

  if (dados.pedidos.length === 0)
    return pagina > 1 ? (
      <Vazio
        acao={
          <Button variant="outline" onClick={() => irParaPagina(1)}>
            Ir para a primeira página
          </Button>
        }
      >
        Essa página não existe.
      </Vazio>
    ) : (
      <Vazio acao={<Button href="/produtos">Ver produtos</Button>}>
        Você ainda não fez pedidos.
      </Vazio>
    );

  return (
    <>
      <div className="bu-table-wrap" style={{ opacity: carregando ? 0.5 : 1 }}>
        <table className="bu-table">
          <thead>
            <tr>
              <th>Pedido</th>
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
                    href={`/pedidos/${p.id}`}
                    style={{ fontWeight: 600 }}
                    aria-label={`Abrir pedido ${p.id}`}
                  >
                    #{p.id}
                  </Link>
                </td>
                <td style={{ color: S.soft }}>{formatarData(p.criadoEm)}</td>
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
        onChange={irParaPagina}
      />
    </>
  );
}
