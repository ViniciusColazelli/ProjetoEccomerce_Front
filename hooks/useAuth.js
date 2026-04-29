// hooks/useAuth.js
// Gerencia o estado de autenticação em toda a aplicação

import { useState, useEffect } from "react";
import { registrarCliente, loginCliente } from "../lib/api";

export function useAuth() {
  const [usuario, setUsuario] = useState(null); // dados do usuário logado
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  // Recupera sessão salva ao carregar a página
  useEffect(() => {
    const salvo = localStorage.getItem("usuario");
    if (salvo) setUsuario(JSON.parse(salvo));
  }, []);

  // ── Cadastro ────────────────────────────────────────────────────
  async function cadastrar({ nome, email, senha }) {
    setLoading(true);
    setErro(null);
    try {
      const result = await registrarCliente({ nome, email, senha });
      // Após cadastro, salva o usuário retornado pela API
      salvarSessao(result);
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  // ── Login ───────────────────────────────────────────────────────
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

  // ── Logout ──────────────────────────────────────────────────────
  function logout() {
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  // ── Helpers ─────────────────────────────────────────────────────
  function salvarSessao(dados) {
    localStorage.setItem("usuario", JSON.stringify(dados));
    setUsuario(dados);
  }

  function limparErro() {
    setErro(null);
  }

  return { usuario, loading, erro, cadastrar, login, logout, limparErro };
}
