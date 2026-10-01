// hooks/usePerfil.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getPerfilCliente } from "lib/api";
import { useAuthContext } from "context/AuthContext";

export function usePerfil() {
  const router = useRouter();
  const { usuario, pronto, logout, atualizarUsuario } = useAuthContext();
  const [perfil, setPerfil] = useState(null);
  const [buscando, setBuscando] = useState(true);

  const logado = !!usuario;

  useEffect(() => {
    if (!pronto) return; // espera ler o localStorage (corrige o bug do F5)
    if (!logado) {
      router.replace("/");
      return;
    }
    getPerfilCliente()
      .then(setPerfil)
      .catch(() => logout()) // sessão expirou; o próprio effect redireciona
      .finally(() => setBuscando(false));
  }, [pronto, logado]);

  function onPerfilAtualizado(dados) {
    setPerfil((p) => ({ ...p, ...dados }));
    atualizarUsuario({ nome: dados.nome });
  }

  return { perfil, carregando: !pronto || buscando, onPerfilAtualizado };
}
