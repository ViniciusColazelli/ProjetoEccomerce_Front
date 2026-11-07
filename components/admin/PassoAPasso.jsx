// components/admin/PassoAPasso.jsx
// Guia do cadastro: tamanhos → cores → gerar variantes → estoque.
// O produto nasce ativo, mas a vitrine só mostra o que tem alguma variante ativa com estoque.
import Link from "next/link";
import { S, T } from "styles/theme";
import Icon from "components/ui/Icon";

function analisar(produto) {
  const ativas = (tipo) =>
    produto.opcoes.filter((o) => o.tipo === tipo && o.ativo);
  const tamanhos = ativas("Tamanho");
  const cores = ativas("Cor");

  const tamanhoIds = new Set(tamanhos.map((o) => o.id));
  const corIds = new Set(cores.map((o) => o.id));

  // Mesma regra da vitrine na API (EstaNaVitrine): variante ativa, tamanho ativo
  // e, se tiver cor, cor ativa. Variante sem cor vale mesmo que o produto ganhe cores depois.
  const variantesValidas = produto.variantes.filter(
    (v) =>
      v.ativo &&
      tamanhoIds.has(v.tamanhoId) &&
      (v.corId === null || corIds.has(v.corId)),
  );

  // Combinações tamanho × cor ativas que ainda não viraram variante
  const existentes = new Set(
    produto.variantes.map((v) => `${v.tamanhoId}-${v.corId}`),
  );
  let faltando = 0;
  for (const t of tamanhos)
    for (const c of cores.length ? cores.map((o) => o.id) : [null])
      if (!existentes.has(`${t.id}-${c}`)) faltando++;

  const comEstoque = variantesValidas.filter((v) => v.quantidade > 0);

  return {
    tamanhos: tamanhos.length,
    cores: cores.length,
    variantes: variantesValidas.length,
    faltando,
    comEstoque: comEstoque.length,
    naVitrine: produto.ativo && comEstoque.length > 0,
  };
}

function Passo({ numero, estado, titulo, children }) {
  // estado: "feito" | "opcional" | "pendente"
  const feito = estado === "feito";
  return (
    <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span
        aria-hidden="true"
        style={{
          width: 24,
          height: 24,
          flexShrink: 0,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 600,
          background: feito ? S.success.bg : S.white,
          color: feito ? S.success.text : S.muted,
          border: `1px solid ${feito ? S.success.border : S.border}`,
        }}
      >
        {feito ? (
          <Icon name="check" size={13} color={S.success.text} stroke={2.5} />
        ) : (
          numero
        )}
      </span>
      <div style={{ fontSize: 14 }}>
        <p style={{ fontWeight: 600, color: S.dark }}>
          {titulo}
          {estado === "opcional" && (
            <span style={{ fontWeight: 400, color: S.muted }}> · opcional</span>
          )}
        </p>
        <p style={{ fontSize: 13, color: S.soft, marginTop: 2 }}>{children}</p>
      </div>
    </li>
  );
}

export default function PassoAPasso({ produto }) {
  const a = analisar(produto);

  const aviso = !produto.ativo
    ? {
        tipo: "error",
        texto: "Produto desativado: não aparece na vitrine.",
      }
    : a.naVitrine
      ? { tipo: "success", texto: "Este produto já aparece na vitrine." }
      : {
          tipo: "neutro",
          texto:
            "O produto já está ativo, mas só aparece na vitrine depois de ter estoque em alguma variante.",
        };
  const corAviso =
    aviso.tipo === "neutro"
      ? { bg: "#fff7ed", border: "#fed7aa", text: "#9a3412" }
      : S[aviso.tipo];

  return (
    <section
      aria-label="Passo a passo do cadastro"
      style={{
        background: S.white,
        border: S.line,
        borderRadius: S.radius.xl,
        padding: "22px 28px",
        marginBottom: 24,
      }}
    >
      <p style={{ ...T.label, marginBottom: 14 }}>Passo a passo</p>

      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 16,
        }}
      >
        <Passo
          numero={1}
          estado={a.tamanhos > 0 ? "feito" : "pendente"}
          titulo="Tamanhos"
        >
          {a.tamanhos > 0 ? (
            `${a.tamanhos} ${a.tamanhos === 1 ? "tamanho ativo" : "tamanhos ativos"}.`
          ) : (
            <>
              Cadastre ao menos um em{" "}
              <a
                href="#opcoes"
                className="bu-text-link"
                style={{ fontSize: 13 }}
              >
                Opções
              </a>
              .
            </>
          )}
        </Passo>
        <Passo
          numero={2}
          estado={a.cores > 0 ? "feito" : "opcional"}
          titulo="Cores"
        >
          {a.cores > 0
            ? `${a.cores} ${a.cores === 1 ? "cor ativa" : "cores ativas"}.`
            : "Produto sem cor pula esta etapa."}
        </Passo>
        <Passo
          numero={3}
          estado={a.variantes > 0 && a.faltando === 0 ? "feito" : "pendente"}
          titulo="Gerar variantes"
        >
          {a.tamanhos === 0 ? (
            "Depois dos tamanhos."
          ) : a.faltando > 0 ? (
            <>
              {a.faltando === 1
                ? "Falta 1 combinação."
                : `Faltam ${a.faltando} combinações.`}{" "}
              Use &quot;Gerar variantes&quot; em{" "}
              <a
                href="#variantes"
                className="bu-text-link"
                style={{ fontSize: 13 }}
              >
                Variantes
              </a>
              .
            </>
          ) : a.variantes === 1 ? (
            "1 variante pronta."
          ) : (
            `${a.variantes} variantes prontas.`
          )}
        </Passo>
        <Passo
          numero={4}
          estado={a.comEstoque > 0 ? "feito" : "pendente"}
          titulo="Estoque"
        >
          {a.variantes === 0 ? (
            "Depois das variantes."
          ) : a.comEstoque > 0 ? (
            `${a.comEstoque} de ${a.variantes} ${a.variantes === 1 ? "variante" : "variantes"} com estoque.`
          ) : (
            <>
              Nenhuma variante com estoque.{" "}
              <Link
                href={`/admin/estoque?produtoId=${produto.id}`}
                className="bu-text-link"
                style={{ fontSize: 13 }}
              >
                Dar entrada
              </Link>
            </>
          )}
        </Passo>
      </ol>

      <p
        role="status"
        style={{
          marginTop: 18,
          padding: "10px 14px",
          borderRadius: S.radius.sm,
          fontSize: 13,
          background: corAviso.bg,
          border: `0.5px solid ${corAviso.border}`,
          color: corAviso.text,
        }}
      >
        {aviso.texto}
      </p>
    </section>
  );
}
