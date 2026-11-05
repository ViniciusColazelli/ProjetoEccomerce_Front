// hooks/usePerfil.js
// O AuthProvider já buscou o perfil ao carregar (ou no login): a página só lê do contexto
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "context/AuthContext";

export function usePerfil() {
  const router = useRouter();
  const { usuario, pronto, atualizarUsuario } = useAuthContext();

  // Sem sessão (visitante, logout ou sessão expirada): volta para a home
  useEffect(() => {
    if (pronto && !usuario) router.replace("/");
  }, [pronto, usuario]);

  return {
    perfil: usuario,
    carregando: !pronto || !usuario,
    onPerfilAtualizado: atualizarUsuario,
  };
}
