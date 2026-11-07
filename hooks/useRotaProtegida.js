// hooks/useRotaProtegida.js
// Páginas que exigem login (ou admin). Sem sessão, ou sem isAdmin quando pedido, volta para a home.
// A API continua sendo quem protege os dados (401/403): isto só evita mostrar a tela vazia.

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "context/AuthContext";

export function useRotaProtegida({ admin = false } = {}) {
  const router = useRouter();
  const { usuario, pronto, isAdmin } = useAuthContext();

  const permitido = !!usuario && (!admin || isAdmin);

  useEffect(() => {
    if (pronto && !permitido) router.replace("/");
  }, [pronto, permitido]);

  return { usuario, liberado: pronto && permitido };
}
