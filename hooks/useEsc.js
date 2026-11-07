// hooks/useEsc.js
// Chama `onEsc` quando o usuário aperta Esc (popups e modais)

import { useEffect, useEffectEvent } from "react";

export function useEsc(onEsc) {
  // useEffectEvent sempre enxerga o onEsc mais recente, sem recadastrar o listener a cada render
  const aoEsc = useEffectEvent(() => onEsc?.());

  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === "Escape") aoEsc();
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, []);
}
