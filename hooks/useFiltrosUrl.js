// hooks/useFiltrosUrl.js
// Filtros de listagem guardados na query string: sobrevivem ao voltar do navegador,
// a links de outras telas (ex.: ?pedidoId=12) e a recarregar a página.
//
//   const [filtros, atualizar] = useFiltrosUrl({ produtoId: "", pagina: "1" });
//   atualizar({ produtoId: "3", pagina: "1" });
//
// Os valores são sempre strings. O que estiver igual ao padrão sai da URL.
// Use só depois do router.isReady (antes disso a query vem vazia).

import { useRouter } from "next/router";

export function useFiltrosUrl(padroes) {
  const router = useRouter();

  const filtros = {};
  for (const [chave, padrao] of Object.entries(padroes)) {
    const valor = router.query[chave];
    filtros[chave] = typeof valor === "string" ? valor : padrao;
  }

  // push por padrão (o "voltar" desfaz); replace para mudanças contínuas, como digitar
  function atualizar(mudancas, { substituir = false } = {}) {
    const novos = { ...filtros, ...mudancas };
    const query = {};
    for (const [chave, valor] of Object.entries(novos)) {
      const texto = valor == null ? "" : String(valor);
      if (texto !== "" && texto !== String(padroes[chave]))
        query[chave] = texto;
    }
    router[substituir ? "replace" : "push"](
      { pathname: router.pathname, query },
      undefined,
      { scroll: false },
    );
  }

  return [filtros, atualizar];
}
