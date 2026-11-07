// hooks/useConsulta.js
// Carrega dados da API no navegador: { dados, carregando, erro, recarregar, setDados }.
// setDados troca os dados sem nova requisição, quando a API já devolve o registro atualizado.
// getServerSideProps não serve aqui: o /backend (rewrite + cookie) só existe no browser.

import { useCallback, useEffect, useState } from "react";

export function useConsulta(fn, deps = []) {
  const [versao, setVersao] = useState(0);

  // Cada combinação de deps (e cada "recarregar") é uma consulta. O resultado guarda de qual
  // consulta veio: se não bate com a atual, ela ainda está carregando. Assim o effect não
  // precisa ligar o "carregando" na mão, e os dados antigos continuam na tela até chegar o novo.
  const consulta = JSON.stringify([...deps, versao]);
  const [resultado, setResultado] = useState({
    consulta: null,
    dados: null,
    erro: null,
  });

  useEffect(() => {
    // Resposta que chega depois de desmontar (ou de os deps mudarem) é descartada
    let ativo = true;

    Promise.resolve()
      .then(fn)
      .then((dados) => {
        if (ativo) setResultado({ consulta, dados, erro: null });
      })
      .catch((e) => {
        if (ativo)
          setResultado((atual) => ({
            consulta,
            dados: atual.dados,
            erro: e.message,
          }));
      });

    return () => {
      ativo = false;
    };
    // Os deps vêm de quem chama, como no próprio useEffect: `consulta` muda junto com eles
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consulta]);

  const carregando = resultado.consulta !== consulta;
  const recarregar = useCallback(() => setVersao((v) => v + 1), []);
  const setDados = useCallback(
    (dados) => setResultado((atual) => ({ ...atual, dados })),
    [],
  );

  return {
    dados: resultado.dados,
    carregando,
    erro: carregando ? null : resultado.erro,
    recarregar,
    setDados,
  };
}
