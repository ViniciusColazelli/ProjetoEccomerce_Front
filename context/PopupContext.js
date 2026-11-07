// context/PopupContext.js
// Qual popup da Navbar está aberto (busca, login, carrinho, menu).
// Fica num contexto para qualquer página conseguir abrir o carrinho ou o login.

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const PopupContext = createContext(null);

export function PopupProvider({ children }) {
  const [popup, setPopup] = useState(null);
  const router = useRouter();

  const abrir = (nome) => setPopup(nome);
  const toggle = (nome) => setPopup((atual) => (atual === nome ? null : nome));
  const close = () => setPopup(null);
  const isOpen = (nome) => popup === nome;

  // Trocou de página: o popup aberto fecha
  useEffect(() => {
    router.events.on("routeChangeStart", close);
    return () => router.events.off("routeChangeStart", close);
  }, [router.events]);

  return (
    <PopupContext.Provider value={{ abrir, toggle, close, isOpen }}>
      {children}
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);
  if (!context)
    throw new Error("usePopup deve ser usado dentro de <PopupProvider>");
  return context;
}
