// components/produto/GaleriaProduto.jsx
// Foto grande + miniaturas para trocar. A primeira é a capa; sem fotos, fica o placeholder do logo.
import { useState } from "react";
import FotoProduto from "components/ui/FotoProduto";
import { S } from "styles/theme";

export default function GaleriaProduto({ nome, imagens = [] }) {
  const [atual, setAtual] = useState(0);
  const foto = imagens[atual] ?? imagens[0];

  return (
    <div>
      <FotoProduto
        src={foto?.url}
        alt={
          imagens.length > 1
            ? `${nome}, foto ${atual + 1} de ${imagens.length}`
            : nome
        }
        raio={S.radius.xl}
        larguraLogo="50%"
        carregamento="eager"
      />

      {imagens.length > 1 && (
        <div
          className="bu-galeria-miniaturas"
          role="group"
          aria-label="Fotos do produto"
        >
          {imagens.map((imagem, i) => (
            <button
              key={imagem.id}
              type="button"
              className="bu-galeria-miniatura"
              aria-pressed={i === atual}
              aria-label={`Ver foto ${i + 1} de ${imagens.length}`}
              onClick={() => setAtual(i)}
            >
              <FotoProduto
                src={imagem.urlMiniatura}
                raio={S.radius.sm}
                larguraLogo="70%"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
