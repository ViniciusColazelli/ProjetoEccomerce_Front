// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { loginCliente } from "lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [pronto, setPronto] = useState(false); // já leu o localStorage?
  const router = useRouter();

  useEffect(() => {
    const salvo = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");
    if (salvo && token) setUsuario(JSON.parse(salvo));
    setPronto(true);
  }, []);

  // Reage quando lib/api.js detecta um 401 em rota autenticada
  useEffect(() => {
    function aoExpirar() {
      setUsuario(null);
      router.push("/");
    }

    window.addEventListener("sessao-expirada", aoExpirar);
    return () => window.removeEventListener("sessao-expirada", aoExpirar);
  }, [router]);

  function salvarSessao(dados) {
    const { token, ...resto } = dados;

    if (token) localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(resto));
    setUsuario(resto);
  }

  // Autentica no back-end e guarda o token JWT retornado
  async function login(credenciais) {
    salvarSessao(await loginCliente(credenciais));
  }

  // Mantém o nome da Navbar em dia após editar o perfil
  function atualizarUsuario(parcial) {
    const dadosAtualizados = { ...usuario, ...parcial };
    localStorage.setItem("usuario", JSON.stringify(dadosAtualizados));
    setUsuario(dadosAtualizados);
  }

  function logout() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, pronto, login, logout, atualizarUsuario }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext deve ser usado dentro de <AuthProvider>");
  return context;
}
