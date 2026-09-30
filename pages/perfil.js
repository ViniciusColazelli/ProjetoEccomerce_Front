// pages/perfil.js
import { useAuthContext } from "../context/AuthContext";
import { usePerfil } from "../hooks/usePerfil";
import PerfilHeader from "../components/perfil/PerfilHeader";
import DadosPessoaisForm from "../components/perfil/DadosPessoaisForm";
import AlterarSenhaForm from "../components/perfil/AlterarSenhaForm";
import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";

export default function Perfil() {
  const { logout } = useAuthContext();
  const { perfil, carregando, onPerfilAtualizado } = usePerfil();

  if (carregando || !perfil) return <Loading />;

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "52px 24px" }}>
      <PerfilHeader nome={perfil.nome} email={perfil.email} />
      <DadosPessoaisForm perfil={perfil} onSuccess={onPerfilAtualizado} />
      <AlterarSenhaForm />

      {/* logout zera o usuário e o usePerfil redireciona para a home */}
      <Button
        variant="danger"
        onClick={logout}
        style={{ padding: "8px 20px", fontSize: 13 }}
      >
        Sair da conta
      </Button>
    </main>
  );
}
