// pages/pedidos/index.js
// Histórico de pedidos do cliente logado
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
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
        <ListaPedidos />
      </RotaProtegida>
    </main>
  );
}

function ListaPedidos() {
  const [pagina, setPagina] = useState(1);
  const { dados, carregando, erro } = useConsulta(
    () => listarMeusPedidos({ pagina, tamanhoPagina: TAMANHO_PAGINA }),
    [pagina],
  );

  if (carregando && !dados) return <Loading />;
  if (erro) return <Alert>{erro}</Alert>;

  if (dados.pedidos.length === 0)
    return (
      <Vazio acao={<Button href="/produtos">Ver produtos</Button>}>
        Você ainda não fez nenhum pedido.
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
              <th />
            </tr>
          </thead>
          <tbody>
            {dados.pedidos.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>#{p.id}</td>
                <td style={{ color: S.soft }}>{formatarData(p.criadoEm)}</td>
                <td>
                  <StatusBadge status={p.status} />
                </td>
                <td className="bu-num">{p.quantidadePecas}</td>
                <td className="bu-num">{formatarPreco(p.total)}</td>
                <td className="bu-num">
                  <Link href={`/pedidos/${p.id}`} className="bu-text-link">
                    Ver detalhes
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
  );
}
