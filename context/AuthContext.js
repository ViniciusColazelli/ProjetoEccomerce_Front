// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { loginCliente } from "lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [pronto, setPronto] = useState(false); // já leu o localStorage?

  useEffect(() => {
    const salvo = localStorage.getItem("usuario");
    if (salvo) setUsuario(JSON.parse(salvo));
    setPronto(true);
  }, []);

  function salvarSessao(dados) {
    localStorage.setItem("usuario", JSON.stringify(dados));
    setUsuario(dados);
  }

  // Cria sessão no back-end. Se falhar, o erro sobe para quem chamou.
  async function login(credenciais) {
    salvarSessao(await loginCliente(credenciais));
  }

  // Mantém o nome da Navbar em dia após editar o perfil
  function atualizarUsuario(parcial) {
    salvarSessao({ ...usuario, ...parcial });
  }

  function logout() {
    localStorage.removeItem("usuario");
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
