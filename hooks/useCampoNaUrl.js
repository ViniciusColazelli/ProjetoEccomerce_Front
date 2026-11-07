// hooks/useCampoNaUrl.js
// Campo de texto ligado a um filtro da URL (busca por nome, cliente, nº do pedido).
// Digitar só chama `enviar` depois da pausa do debounce; e se a URL mudar por fora
// (busca da Navbar, voltar do navegador, link de outra tela), o campo acompanha.
//
//   const [busca, setBusca] = useCampoNaUrl(nome, (valor) => navegar({ nome: valor }));

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useDebounce } from "hooks/useDebounce";

const semEspacos = (texto) => texto.trim();

export function useCampoNaUrl(valorNaUrl, enviar, limpar = semEspacos) {
  const [texto, setTexto] = useState(valorNaUrl);
  const digitado = useDebounce(limpar(texto));
  const enviado = useRef(valorNaUrl); // último valor que este campo mandou para a URL

  // useEffectEvent lê o valorNaUrl e o enviar mais recentes, mas o effect só roda
  // quando o texto digitado muda (e não a cada mudança da URL)
  const aoParar = useEffectEvent((valor) => {
    if (valor === valorNaUrl) return;
    enviado.current = valor;
    enviar(valor);
  });
  useEffect(() => aoParar(digitado), [digitado]);

  // A URL mudou por fora: atualiza o campo. Se fomos nós que mandamos, não mexe,
  // porque o usuário pode ter continuado digitando
  useEffect(() => {
    if (valorNaUrl !== enviado.current) {
      enviado.current = valorNaUrl;
      setTexto(valorNaUrl);
    }
  }, [valorNaUrl]);

  return [texto, setTexto];
}
