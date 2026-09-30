// components/perfil/AlterarSenhaForm.jsx
import { useState } from "react";
import { trocarSenha } from "../../lib/api";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import Card from "../ui/Card";
import FormField from "../ui/FormField";
import Alert from "../ui/Alert";
import Button from "../ui/Button";

export default function AlterarSenhaForm() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const { run, loading, erro, sucesso } = useAsyncAction(trocarSenha);

  async function handleSubmit(e) {
    e.preventDefault();
    // O back (RequestTrocarSenha) espera "Senha" para a senha atual
    if (await run({ senha: senhaAtual, novaSenha })) {
      setSenhaAtual("");
      setNovaSenha("");
    }
  }

  return (
    <Card titulo="Alterar senha">
      <form onSubmit={handleSubmit}>
        <FormField
          label="Senha atual"
          type="password"
          autoComplete="current-password"
          value={senhaAtual}
          onChange={(e) => setSenhaAtual(e.target.value)}
          disabled={loading}
        />
        <FormField
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          disabled={loading}
        />

        <Alert>{erro}</Alert>
        <Alert type="success">{sucesso && "Senha alterada com sucesso!"}</Alert>

        <Button type="submit" loading={loading}>
          {loading ? "Alterando..." : "Alterar senha"}
        </Button>
      </form>
    </Card>
  );
}