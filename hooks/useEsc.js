// hooks/useEsc.js
// Chama `onEsc` quando o usuário aperta Esc (popups e modais)

import { useEffect, useRef } from "react";

export function useEsc(onEsc) {
  // Guarda a função mais recente sem recadastrar o listener a cada render
  const ref = useRef(onEsc);
  ref.current = onEsc;

  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === "Escape") ref.current?.();
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, []);
}
