// components/ui/FotoProduto.jsx
// Foto do produto em retrato (4:5). Sem foto, ou se ela não carregar, mostra o logo no lugar.
// As URLs vêm prontas da API (Supabase em produção) e já no tamanho certo: <img> simples basta.
import { useState } from "react";
import { S } from "styles/theme";
import Logo from "./Logo";

export default function FotoProduto({
  src,
  alt = "",
  raio = S.radius.lg,
  larguraLogo = "55%",
  carregamento = "lazy", // "eager" para a foto principal da página
  className,
  style,
}) {
  // Guarda qual endereço falhou: se o src mudar (outra foto da galeria), tenta de novo sozinho
  const [falhou, setFalhou] = useState(null);
  const mostrarFoto = !!src && falhou !== src;

  return (
    <div
      className={className}
      style={{
        aspectRatio: "4 / 5",
        background: S.imageBg,
        borderRadius: raio,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {mostrarFoto ? (
        <img
          src={src}
          alt={alt}
          loading={carregamento}
          decoding="async"
          onError={() => setFalhou(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <div style={{ opacity: 0.35, width: larguraLogo }}>
          <Logo height="auto" />
        </div>
      )}
    </div>
  );
}
