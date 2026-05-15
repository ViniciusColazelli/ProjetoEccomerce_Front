// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { loginCliente, registrarCliente } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const salvo = localStorage.getItem("usuario");
    if (salvo) setUsuario(JSON.parse(salvo));
  }, []);

  // Cadastro — NÃO loga, só registra e retorna true para redirecionar ao /login
  async function cadastrar({ nome, email, senha }) {
    setLoading(true);
    setErro(null);
    try {
      await registrarCliente({ nome, email, senha });
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  // Login — cria sessão no back-end e salva { nome } no localStorage
  async function login({ email, senha }) {
    setLoading(true);
    setErro(null);
    try {
      const result = await loginCliente({ email, senha });
      salvarSessao(result);
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  function salvarSessao(dados) {
    localStorage.setItem("usuario", JSON.stringify(dados));
    setUsuario(dados);
  }

  function limparErro() {
    setErro(null);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, loading, erro, cadastrar, login, logout, limparErro }}
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
