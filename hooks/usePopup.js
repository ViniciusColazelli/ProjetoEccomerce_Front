// hooks/usePopup.js
// Isola toda a lógica de abrir/fechar popups

import { useState } from "react";

export function usePopup() {
  const [popup, setPopup] = useState(null);

  const toggle = (name) =>
    setPopup((current) => (current === name ? null : name));
  const close = () => setPopup(null);
  const isOpen = (name) => popup === name;

  return { toggle, close, isOpen };
}
