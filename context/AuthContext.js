// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { loginCliente, logoutCliente, getPerfilCliente } from "lib/api";
import { marcarSessao, desmarcarSessao } from "lib/sessao";

const AuthContext = createContext(null);

// Checagem que não pode disparar "sessão expirada": visitante anônimo recebe 401.
// Com a marca de sessão (lib/sessao.js), um JWT vencido ainda é renovado pelo lib/api.js:
// quem volta dias depois continua logado
const CHECAGEM_SILENCIOSA = { ignorarSessaoExpirada: true };

// Só o que a Navbar e o perfil usam do ResponseClienteProfile
const dadosDoUsuario = (perfil) => ({
  nome: perfil.nome,
  email: perfil.email,
  role: perfil.role,
});

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [pronto, setPronto] = useState(false); // já perguntou à API se há sessão?
  const router = useRouter();

  // Ao carregar: a API (via cookie) decide se existe sessão
  useEffect(() => {
    let cancelado = false;

    getPerfilCliente(CHECAGEM_SILENCIOSA)
      .then((perfil) => {
        marcarSessao(); // ex.: logado antes de existir a marca
        if (!cancelado) setUsuario(dadosDoUsuario(perfil));
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

  // Reage quando lib/api.js recebe 401 numa rota autenticada mesmo depois de tentar renovar a sessão
  useEffect(() => {
    function aoExpirar() {
      desmarcarSessao();
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
    marcarSessao();
    setUsuario(dadosDoUsuario(perfil));
  }

  // Mantém a Navbar e o perfil em dia após editar os dados
  function atualizarUsuario(parcial) {
    setUsuario((atual) => ({ ...atual, ...parcial }));
  }

  async function logout() {
    try {
      await logoutCliente(); // a API revoga a sessão e apaga os cookies
    } catch {
      // mesmo se falhar, encerra a sessão local
    }
    desmarcarSessao();
    setUsuario(null);
  }

  const isAdmin = usuario?.role === "Admin"; // mesmo valor de Perfis.Admin

  return (
    <AuthContext.Provider
      value={{ usuario, pronto, isAdmin, login, logout, atualizarUsuario }}
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
