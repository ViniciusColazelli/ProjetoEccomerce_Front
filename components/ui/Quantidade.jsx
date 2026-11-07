// components/ui/Quantidade.jsx
// Seletor − 1 + (de `min` a `max`). O número também pode ser digitado.
import { useEffect, useState } from "react";
import { S } from "styles/theme";
import Icon from "./Icon";

const limitar = (n, min, max) => Math.min(max, Math.max(min, n));

function Botao({ icone, label, disabled, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="bu-nav-btn"
      style={{
        border: "none",
        padding: "0 10px",
        height: "100%",
        display: "flex",
        alignItems: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1,
      }}
    >
      <Icon name={icone} size={14} stroke={2} />
    </button>
  );
}

export default function Quantidade({
  valor,
  onChange,
  min = 1,
  max = 999,
  disabled,
}) {
  const [texto, setTexto] = useState(String(valor));

  // Mantém o campo em dia quando o valor muda por fora (botões, carrinho)
  useEffect(() => setTexto(String(valor)), [valor]);

  function confirmar() {
    const n = parseInt(texto, 10);
    const novo = Number.isNaN(n) ? valor : limitar(n, min, max);
    setTexto(String(novo));
    if (novo !== valor) onChange(novo);
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 38,
        border: S.line,
        borderRadius: S.radius.sm,
        background: S.white,
        overflow: "hidden",
      }}
    >
      <Botao
        icone="minus"
        label="Diminuir quantidade"
        disabled={disabled || valor <= min}
        onClick={() => onChange(limitar(valor - 1, min, max))}
      />
      <input
        aria-label="Quantidade"
        inputMode="numeric"
        value={texto}
        disabled={disabled}
        onChange={(e) => setTexto(e.target.value.replace(/\D/g, ""))}
        onBlur={confirmar}
        onKeyDown={(e) =>
          e.key === "Enter" && (e.preventDefault(), confirmar())
        }
        style={{
          width: 40,
          textAlign: "center",
          border: "none",
          fontSize: 14,
          fontFamily: S.sans,
          outline: "none",
          background: "transparent",
          boxShadow: "none",
        }}
      />
      <Botao
        icone="plus"
        label="Aumentar quantidade"
        disabled={disabled || valor >= max}
        onClick={() => onChange(limitar(valor + 1, min, max))}
      />
    </div>
  );
}
