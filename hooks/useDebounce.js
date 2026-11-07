// hooks/useDebounce.js
// Devolve o valor só depois de `atraso` ms sem mudar (busca enquanto digita)

import { useEffect, useState } from "react";

export function useDebounce(valor, atraso = 400) {
  const [atual, setAtual] = useState(valor);

  useEffect(() => {
    const t = setTimeout(() => setAtual(valor), atraso);
    return () => clearTimeout(t);
  }, [valor, atraso]);

  return atual;
}
