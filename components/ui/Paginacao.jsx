// components/ui/Paginacao.jsx
// Anterior / Página X de Y / Próxima. Some quando tudo cabe numa página.
import { S } from "styles/theme";
import Icon from "./Icon";

function Seta({ direcao, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direcao === "anterior" ? "Página anterior" : "Próxima página"}
      className="bu-nav-btn"
      style={{
        border: S.line,
        borderRadius: S.radius.sm,
        padding: 8,
        display: "flex",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Icon
        name="chevron"
        size={16}
        style={{ transform: `rotate(${direcao === "anterior" ? 90 : -90}deg)` }}
      />
    </button>
  );
}

export default function Paginacao({ pagina, tamanhoPagina, total, onChange }) {
  const totalPaginas = Math.ceil(total / tamanhoPagina);
  if (!totalPaginas || totalPaginas <= 1) return null;

  return (
    <nav
      aria-label="Paginação"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        marginTop: 32,
        fontSize: 13,
        color: S.soft,
      }}
    >
      <Seta
        direcao="anterior"
        disabled={pagina <= 1}
        onClick={() => onChange(pagina - 1)}
      />
      <span>
        Página {pagina} de {totalPaginas}
      </span>
      <Seta
        direcao="proxima"
        disabled={pagina >= totalPaginas}
        onClick={() => onChange(pagina + 1)}
      />
    </nav>
  );
}
