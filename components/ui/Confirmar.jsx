// components/ui/Confirmar.jsx
// Modal "tem certeza?" com loading e erro da ação.
// `onConfirmar` é assíncrona; se der certo o modal chama `onClose` sozinho.
import { useAsyncAction } from "hooks/useAsyncAction";
import { S } from "styles/theme";
import Modal from "./Modal";
import Alert from "./Alert";
import Button from "./Button";

export default function Confirmar({
  titulo,
  textoConfirmar = "Confirmar",
  textoVoltar = "Voltar",
  onConfirmar,
  onClose,
  children,
}) {
  const { run, loading, erro } = useAsyncAction(onConfirmar);

  async function confirmar() {
    if (await run()) onClose();
  }

  return (
    <Modal titulo={titulo} onClose={() => !loading && onClose()}>
      <div
        style={{
          fontSize: 14,
          color: S.soft,
          lineHeight: 1.6,
          marginBottom: 20,
        }}
      >
        {children}
      </div>
      <Alert>{erro}</Alert>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {textoVoltar}
        </Button>
        <Button loading={loading} onClick={confirmar}>
          {loading ? "Aguarde..." : textoConfirmar}
        </Button>
      </div>
    </Modal>
  );
}
