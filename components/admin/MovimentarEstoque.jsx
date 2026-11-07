// components/admin/MovimentarEstoque.jsx
// Modal de entrada, saída ou ajuste (inventário) de uma variante.
// Ajuste recebe o saldo contado; a API grava a diferença como Entrada ou Saida.
// `onFeito(variante)` recebe a variante atualizada que a API devolve.
import { useRef, useState } from "react";
import { entradaEstoque, saidaEstoque, ajustarEstoque } from "lib/estoqueAdmin";
import { descreverVariante } from "lib/formatar";
import { useAsyncAction } from "hooks/useAsyncAction";
import Modal from "components/ui/Modal";
import FormField from "components/ui/FormField";
import Alert from "components/ui/Alert";
import Button from "components/ui/Button";
import { S } from "styles/theme";

const TIPOS = {
  entrada: {
    titulo: "Entrada de estoque",
    campo: "Quantidade que entrou",
    exemplo: "Ex.: compra do fornecedor",
    enviar: (id, n, motivo) => entradaEstoque(id, { quantidade: n, motivo }),
  },
  saida: {
    titulo: "Saída de estoque",
    campo: "Quantidade que saiu",
    exemplo: "Ex.: peça com defeito",
    enviar: (id, n, motivo) => saidaEstoque(id, { quantidade: n, motivo }),
  },
  ajuste: {
    titulo: "Ajuste de inventário",
    campo: "Saldo contado",
    exemplo: "Ex.: contagem mensal",
    enviar: (id, n, motivo) =>
      ajustarEstoque(id, { novaQuantidade: n, motivo }),
  },
};

export default function MovimentarEstoque({
  variante,
  tipo,
  onClose,
  onFeito,
}) {
  const config = TIPOS[tipo];
  const [quantidade, setQuantidade] = useState(
    tipo === "ajuste" ? String(variante.quantidade) : "",
  );
  const [motivo, setMotivo] = useState("");
  const atualizada = useRef(null); // a API devolve a variante com o saldo novo
  const { run, loading, erro } = useAsyncAction(async () => {
    atualizada.current = await config.enviar(
      variante.varianteId,
      parseInt(quantidade, 10) || 0,
      motivo.trim(),
    );
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (await run()) {
      onFeito(atualizada.current);
      onClose();
    }
  }

  const n = parseInt(quantidade, 10);
  const previsto = Number.isNaN(n)
    ? null
    : tipo === "entrada"
      ? variante.quantidade + n
      : tipo === "saida"
        ? variante.quantidade - n
        : n;

  return (
    <Modal titulo={config.titulo} onClose={() => !loading && onClose()}>
      <p style={{ fontSize: 14, marginBottom: 4, fontWeight: 500 }}>
        {variante.produto}
      </p>
      <p style={{ fontSize: 13, color: S.muted, marginBottom: 18 }}>
        {descreverVariante(variante.tamanho, variante.cor)} · saldo atual:{" "}
        <strong style={{ color: S.dark }}>{variante.quantidade}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <FormField
          label={config.campo}
          type="number"
          inputMode="numeric"
          min={tipo === "ajuste" ? 0 : 1}
          step="1"
          required
          autoFocus
          disabled={loading}
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
        />
        <FormField
          label="Motivo"
          placeholder={config.exemplo}
          required
          maxLength={200}
          disabled={loading}
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />

        {previsto !== null && (
          <p style={{ fontSize: 13, color: S.soft, marginBottom: 14 }}>
            Saldo depois:{" "}
            <strong style={{ color: previsto < 0 ? S.danger : S.dark }}>
              {previsto}
            </strong>
          </p>
        )}

        <Alert>{erro}</Alert>

        <Button type="submit" loading={loading}>
          {loading ? "Salvando..." : "Confirmar"}
        </Button>
      </form>
    </Modal>
  );
}
