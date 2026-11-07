// components/admin/VariantesProduto.jsx
// Combinações tamanho × cor de um produto. "Gerar" cria só as que faltam, com estoque 0.
import { useState } from "react";
import Link from "next/link";
import { gerarVariantes, alterarStatusVariante } from "lib/produtosAdmin";
import { useAsyncAction } from "hooks/useAsyncAction";
import Card from "components/ui/Card";
import Button from "components/ui/Button";
import Alert from "components/ui/Alert";
import { BadgeAtivo } from "components/ui/StatusBadge";
import { S } from "styles/theme";

export default function VariantesProduto({ produto, onMudou }) {
  const [ocupado, setOcupado] = useState(null);
  const [erro, setErro] = useState(null);
  const [aviso, setAviso] = useState(null);

  const gerar = useAsyncAction(async () => {
    const res = await gerarVariantes(produto.id);
    const n = res.variantesCriadas.length;
    setAviso(
      n === 0
        ? "Nenhuma variante nova: todas as combinações já existem."
        : `${n} ${n === 1 ? "variante criada" : "variantes criadas"} com estoque 0.`,
    );
    onMudou();
  });

  async function alternar(variante) {
    setOcupado(variante.id);
    setErro(null);
    try {
      await alterarStatusVariante(produto.id, variante.id, {
        ativo: !variante.ativo,
      });
      onMudou();
    } catch (e) {
      setErro(e.message);
    } finally {
      setOcupado(null);
    }
  }

  const variantes = [...produto.variantes].sort(
    (a, b) =>
      a.tamanhoId - b.tamanhoId || (a.cor ?? "").localeCompare(b.cor ?? ""),
  );

  return (
    <Card titulo="Variantes" id="variantes">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          marginTop: -10,
          marginBottom: 18,
        }}
      >
        <p style={{ fontSize: 13, color: S.muted, maxWidth: 520 }}>
          Cada combinação de tamanho e cor ativos vira uma variante com estoque
          próprio. Depois de cadastrar opções novas, gere de novo.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <Button
            variant="outline"
            href={`/admin/estoque?produtoId=${produto.id}`}
          >
            Movimentar estoque
          </Button>
          <Button
            loading={gerar.loading}
            onClick={() => {
              setAviso(null);
              gerar.run();
            }}
          >
            {gerar.loading ? "Gerando..." : "Gerar variantes"}
          </Button>
        </div>
      </div>

      <Alert>{gerar.erro || erro}</Alert>
      <Alert type="success">{aviso}</Alert>

      {variantes.length === 0 ? (
        <p style={{ fontSize: 13, color: S.muted }}>
          Nenhuma variante ainda. Cadastre ao menos um tamanho e clique em
          &quot;Gerar variantes&quot;.
        </p>
      ) : (
        <div className="bu-table-wrap">
          <table className="bu-table">
            <thead>
              <tr>
                <th>Tamanho</th>
                <th>Cor</th>
                <th className="bu-num">Estoque</th>
                <th>Situação</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {variantes.map((v) => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 500 }}>{v.tamanho}</td>
                  <td style={{ color: v.cor ? S.dark : S.muted }}>
                    {v.cor ?? "—"}
                  </td>
                  <td
                    className="bu-num"
                    style={{
                      fontWeight: 600,
                      color: v.quantidade === 0 ? S.danger : S.dark,
                    }}
                  >
                    {v.quantidade}
                  </td>
                  <td>
                    <BadgeAtivo ativo={v.ativo} />
                  </td>
                  <td className="bu-num">
                    <button
                      type="button"
                      className="bu-text-link"
                      disabled={ocupado === v.id}
                      onClick={() => alternar(v)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        fontFamily: S.sans,
                        fontSize: 13,
                      }}
                    >
                      {ocupado === v.id
                        ? "..."
                        : v.ativo
                          ? "Desativar"
                          : "Ativar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p style={{ fontSize: 12, color: S.muted, marginTop: 10 }}>
        <Link
          href={`/admin/estoque?produtoId=${produto.id}`}
          className="bu-text-link"
          style={{ fontSize: 12 }}
        >
          Ver histórico de movimentações
        </Link>
      </p>
    </Card>
  );
}
