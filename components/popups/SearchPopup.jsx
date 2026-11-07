// components/popups/SearchPopup.jsx
// Leva para a vitrine já filtrada pelo nome
import { useState } from "react";
import { useRouter } from "next/router";
import Popup from "./Popup";
import Input from "components/ui/Input";
import Button from "components/ui/Button";
import { T } from "styles/theme";

export default function SearchPopup({ onClose }) {
  const router = useRouter();
  const [busca, setBusca] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const nome = busca.trim();
    router.push(
      nome ? { pathname: "/produtos", query: { nome } } : "/produtos",
    );
    onClose();
  }

  return (
    <Popup onClose={onClose}>
      <p style={{ ...T.eyebrow, letterSpacing: "0.2em", marginBottom: 12 }}>
        Pesquisar
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <Input
          autoFocus
          placeholder="Buscar produtos..."
          value={busca}
          maxLength={200}
          onChange={(e) => setBusca(e.target.value)}
          style={{ flex: 1, marginBottom: 0 }}
        />
        <Button type="submit" aria-label="Buscar" style={{ padding: "0 14px" }}>
          →
        </Button>
      </form>
    </Popup>
  );
}
