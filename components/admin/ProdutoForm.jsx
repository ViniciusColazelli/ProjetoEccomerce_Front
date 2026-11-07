// components/admin/ProdutoForm.jsx
// Nome, descrição e preço base. Usado no "Novo produto" e na edição.
// `onSubmit(dados)` deve lançar erro em caso de falha (vira Alert aqui).
import { useState } from "react";
import { useAsyncAction } from "hooks/useAsyncAction";
import FormField from "components/ui/FormField";
import Campo from "components/ui/Campo";
import Textarea from "components/ui/Textarea";
import Alert from "components/ui/Alert";
import Button from "components/ui/Button";

export default function ProdutoForm({
  inicial = {},
  onSubmit,
  textoBotao = "Salvar",
  mensagemSucesso,
}) {
  const [nome, setNome] = useState(inicial.nome ?? "");
  const [descricao, setDescricao] = useState(inicial.descricao ?? "");
  const [preco, setPreco] = useState(
    inicial.precoBase != null ? String(inicial.precoBase) : "",
  );
  const { run, loading, erro, sucesso } = useAsyncAction(onSubmit);

  function handleSubmit(e) {
    e.preventDefault();
    run({
      nome: nome.trim(),
      descricao: descricao.trim() || null,
      precoBase: Number(preco.replace(",", ".")) || 0,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        label="Nome"
        value={nome}
        maxLength={200}
        required
        disabled={loading}
        onChange={(e) => setNome(e.target.value)}
      />
      <Campo label="Descrição">
        <Textarea
          value={descricao}
          maxLength={1000}
          rows={4}
          disabled={loading}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </Campo>
      <FormField
        label="Preço base (R$)"
        type="number"
        inputMode="decimal"
        min="0"
        step="0.01"
        value={preco}
        required
        disabled={loading}
        onChange={(e) => setPreco(e.target.value)}
      />

      <Alert>{erro}</Alert>
      <Alert type="success">{sucesso && mensagemSucesso}</Alert>

      <Button type="submit" loading={loading}>
        {loading ? "Salvando..." : textoBotao}
      </Button>
    </form>
  );
}
