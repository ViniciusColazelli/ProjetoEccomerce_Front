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

  const variantes = produto.variantes;

  // Linhas e colunas da grade: opções ativas e também as inativas que ainda têm variante
  const usada = (campo, id) => variantes.some((v) => v[campo] === id);
  const tamanhos = produto.opcoes.filter(
    (o) => o.tipo === "Tamanho" && (o.ativo || usada("tamanhoId", o.id)),
  );
  const cores = produto.opcoes.filter(
    (o) => o.tipo === "Cor" && (o.ativo || usada("corId", o.id)),
  );
  // Coluna "sem cor": produto sem cor, ou variante antiga gerada antes das cores
  const colunas = [
    ...(cores.length === 0 || usada("corId", null)
      ? [{ id: null, valor: cores.length ? "Sem cor" : "Estoque", ativo: true }]
      : []),
    ...cores,
  ];

  const varianteDe = (tamanhoId, corId) =>
    variantes.find((v) => v.tamanhoId === tamanhoId && v.corId === corId);

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
          <table
            className="bu-table bu-grade"
            aria-label="Variantes: tamanho por cor"
          >
            <thead>
              <tr>
                <th>Tamanho \ Cor</th>
                {colunas.map((c) => (
                  <th key={c.id ?? "sem-cor"} className="bu-centro">
                    {c.valor}
                    {!c.ativo && (
                      <span className="bu-grade-inativo"> (inativa)</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tamanhos.map((t) => (
                <tr key={t.id}>
                  <th scope="row" style={{ fontWeight: 600, color: S.dark }}>
                    {t.valor}
                    {!t.ativo && (
                      <span className="bu-grade-inativo"> (inativo)</span>
                    )}
                  </th>
                  {colunas.map((c) => {
                    const v = varianteDe(t.id, c.id);
                    if (!v)
                      return (
                        <td key={c.id ?? "sem-cor"} className="bu-centro">
                          <span className="bu-grade-vazia">
                            {t.ativo && c.ativo ? "não gerada" : "—"}
                          </span>
                        </td>
                      );
                    return (
                      <td
                        key={c.id ?? "sem-cor"}
                        className="bu-centro"
                        style={{ opacity: v.ativo ? 1 : 0.55 }}
                      >
                        <span
                          title={`Estoque de ${t.valor}${c.id ? ` ${c.valor}` : ""}`}
                          style={{
                            display: "block",
                            fontSize: 17,
                            fontWeight: 600,
                            color: v.quantidade === 0 ? S.danger : S.dark,
                          }}
                        >
                          {v.quantidade}
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            gap: 6,
                            alignItems: "center",
                            marginTop: 4,
                          }}
                        >
                          <BadgeAtivo ativo={v.ativo} />
                          <button
                            type="button"
                            className="bu-text-link"
                            disabled={ocupado === v.id}
                            onClick={() => alternar(v)}
                            aria-label={`${v.ativo ? "Desativar" : "Ativar"} ${t.valor}${c.id ? ` ${c.valor}` : ""}`}
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              cursor: "pointer",
                              fontFamily: S.sans,
                              fontSize: 12,
                            }}
                          >
                            {ocupado === v.id
                              ? "..."
                              : v.ativo
                                ? "Desativar"
                                : "Ativar"}
                          </button>
                        </span>
                      </td>
                    );
                  })}
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
