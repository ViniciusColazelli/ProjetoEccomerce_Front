// components/perfil/DadosPessoaisForm.jsx
import { useState } from "react";
import { atualizarCliente } from "lib/api";
import { useAsyncAction } from "hooks/useAsyncAction";
import Card from "components/ui/Card";
import FormField from "components/ui/FormField";
import Alert from "components/ui/Alert";
import Button from "components/ui/Button";

export default function DadosPessoaisForm({ perfil, onSuccess }) {
  const [nome, setNome] = useState(perfil.nome ?? "");
  const [email, setEmail] = useState(perfil.email ?? "");
  const { run, loading, erro, sucesso } = useAsyncAction(atualizarCliente);

  async function handleSubmit(e) {
    e.preventDefault();
    const dados = { nome, email };
    if (await run(dados)) onSuccess(dados);
  }

  return (
    <Card titulo="Dados pessoais">
      <form onSubmit={handleSubmit}>
        <FormField
          label="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          disabled={loading}
        />
        <FormField
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <Alert>{erro}</Alert>
        <Alert type="success">
          {sucesso && "Dados atualizados com sucesso!"}
        </Alert>

        <Button type="submit" loading={loading}>
          {loading ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </Card>
  );
}
