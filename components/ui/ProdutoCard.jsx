// components/ui/ProdutoCard.jsx
// Cartão da vitrine: miniatura da capa (ou o logo, para produto sem foto), nome e preço
import Link from "next/link";
import { S, T } from "styles/theme";
import { formatarPreco } from "lib/formatar";
import FotoProduto from "./FotoProduto";

export default function ProdutoCard({ produto }) {
  return (
    <Link href={`/produtos/${produto.id}`} className="bu-produto-card">
      <FotoProduto
        src={produto.imagemUrl}
        alt={produto.nome}
        className="bu-produto-img"
        style={{ marginBottom: 14 }}
      />
      <h3 style={{ ...T.titulo, fontSize: 17, marginBottom: 4 }}>
        {produto.nome}
      </h3>
      <p style={{ fontSize: 14, color: S.soft }}>
        {formatarPreco(produto.precoBase)}
      </p>
    </Link>
  );
}
