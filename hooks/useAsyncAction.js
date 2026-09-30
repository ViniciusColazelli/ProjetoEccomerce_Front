// hooks/useAsyncAction.js
// Encapsula o padrão loading / erro / sucesso de qualquer ação assíncrona

import { useState } from "react";

export function useAsyncAction(action) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  // Retorna true se deu certo, false se deu erro
  async function run(...args) {
    setLoading(true);
    setErro(null);
    setSucesso(false);
    try {
      await action(...args);
      setSucesso(true);
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setErro(null);
    setSucesso(false);
  }

  return { run, reset, loading, erro, sucesso };
}
