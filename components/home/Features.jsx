// components/home/Features.jsx
// Faixa com os três pontos do slogan: qualidade, identidade e conforto
import { S } from "styles/theme";

const PILARES = [
  {
    titulo: "Qualidade",
    texto: "Tecido bom e costura bem feita, para durar no dia a dia.",
  },
  {
    titulo: "Identidade",
    texto: "Uniforme com a cara da sua empresa e da sua equipe.",
  },
  {
    titulo: "Conforto",
    texto: "Modelagem que veste bem do começo ao fim do expediente.",
  },
];

export default function Features() {
  return (
    <section id="sobre" style={{ background: S.pageBg, borderBottom: S.line }}>
      <div className="bu-container bu-strip">
        {PILARES.map((p) => (
          <div key={p.titulo} className="bu-strip-item">
            <h3
              style={{
                fontFamily: S.serif,
                fontSize: 19,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              {p.titulo}
            </h3>
            <p style={{ fontSize: 14, color: S.soft, lineHeight: 1.6 }}>
              {p.texto}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
