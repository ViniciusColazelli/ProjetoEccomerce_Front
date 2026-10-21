// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { loginCliente, logoutCliente, getPerfilCliente } from "lib/api";

const AuthContext = createContext(null);

// Checagem que não pode disparar "sessão expirada": visitante anônimo recebe 401
const CHECAGEM_SILENCIOSA = { ignorarSessaoExpirada: true };

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [pronto, setPronto] = useState(false); // já perguntou à API se há sessão?
  const router = useRouter();

  // Ao carregar: a API (via cookie) decide se existe sessão
  useEffect(() => {
    let cancelado = false;

    getPerfilCliente(CHECAGEM_SILENCIOSA)
      .then((perfil) => {
        if (!cancelado) setUsuario({ nome: perfil.nome, email: perfil.email });
      })
      .catch(() => {
        if (!cancelado) setUsuario(null); // sem sessão válida
      })
      .finally(() => {
        if (!cancelado) setPronto(true);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  // Reage quando lib/api.js detecta 401 numa rota autenticada
  useEffect(() => {
    function aoExpirar() {
      setUsuario(null);
      router.push("/");
    }

    window.addEventListener("sessao-expirada", aoExpirar);
    return () => window.removeEventListener("sessao-expirada", aoExpirar);
  }, [router]);

  // O login grava o cookie; em seguida buscamos o perfil completo.
  // Se o cookie não foi aceito, esta chamada falha e o erro aparece no formulário.
  async function login(credenciais) {
    await loginCliente(credenciais);
    const perfil = await getPerfilCliente(CHECAGEM_SILENCIOSA);
    setUsuario({ nome: perfil.nome, email: perfil.email });
  }

  // Mantém o nome da Navbar em dia após editar o perfil
  function atualizarUsuario(parcial) {
    setUsuario((atual) => ({ ...atual, ...parcial }));
  }

  async function logout() {
    try {
      await logoutCliente(); // a API apaga o cookie
    } catch {
      // mesmo se falhar, encerra a sessão local
    }
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
