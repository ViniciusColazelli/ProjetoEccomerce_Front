// hooks/usePerfil.js
// O AuthProvider já buscou o perfil ao carregar (ou no login): a página só lê do contexto
import { useAuthContext } from "context/AuthContext";
import { useRotaProtegida } from "hooks/useRotaProtegida";

export function usePerfil() {
  const { atualizarUsuario } = useAuthContext();

  // Sem sessão (visitante, logout ou sessão expirada): volta para a home
  const { usuario, liberado } = useRotaProtegida();

  return {
    perfil: usuario,
    carregando: !liberado,
    onPerfilAtualizado: atualizarUsuario,
  };
}
