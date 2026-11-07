// components/ui/ProdutoCard.jsx
// Cartão da vitrine. A API ainda não tem fotos: o placeholder usa o logo sobre S.imageBg.
import Link from "next/link";
import { S, T } from "styles/theme";
import { formatarPreco } from "lib/formatar";
import Logo from "./Logo";

export default function ProdutoCard({ produto }) {
  return (
    <Link href={`/produtos/${produto.id}`} className="bu-produto-card">
      <div
        className="bu-produto-img"
        style={{
          aspectRatio: "4 / 5",
          background: S.imageBg,
          borderRadius: S.radius.lg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
          overflow: "hidden",
        }}
      >
        <div style={{ opacity: 0.35, width: "55%" }}>
          <Logo height="auto" />
        </div>
      </div>
      <h3 style={{ ...T.titulo, fontSize: 17, marginBottom: 4 }}>
        {produto.nome}
      </h3>
      <p style={{ fontSize: 14, color: S.soft }}>
        {formatarPreco(produto.precoBase)}
      </p>
    </Link>
  );
}
