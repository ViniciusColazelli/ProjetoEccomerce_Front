// components/ui/CabecalhoPagina.jsx
// Eyebrow + título serifado + ações à direita (botões)
import { S, T } from "styles/theme";

export default function CabecalhoPagina({ eyebrow, titulo, subtitulo, acoes }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 28,
      }}
    >
      <div>
        {eyebrow && <p style={T.eyebrow}>{eyebrow}</p>}
        <h1
          className="bu-section-title"
          style={{ ...T.titulo, fontSize: 32, color: S.dark }}
        >
          {titulo}
        </h1>
        {subtitulo && (
          <p style={{ fontSize: 14, color: S.muted, marginTop: 6 }}>
            {subtitulo}
          </p>
        )}
      </div>
      {acoes && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {acoes}
        </div>
      )}
    </div>
  );
}
