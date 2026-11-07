// hooks/useConsulta.js
// Carrega dados da API no navegador: { dados, carregando, erro, recarregar, setDados }.
// setDados troca os dados sem nova requisição, quando a API já devolve o registro atualizado.
// getServerSideProps não serve aqui: o /backend (rewrite + cookie) só existe no browser.

import { useCallback, useEffect, useState } from "react";

export function useConsulta(fn, deps = []) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    // Resposta que chega depois de desmontar (ou de os deps mudarem) é descartada
    let ativo = true;
    setCarregando(true);
    setErro(null);

    Promise.resolve()
      .then(fn)
      .then((res) => {
        if (ativo) setDados(res);
      })
      .catch((e) => {
        if (ativo) setErro(e.message);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, versao]);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);

  return { dados, carregando, erro, recarregar, setDados };
}
