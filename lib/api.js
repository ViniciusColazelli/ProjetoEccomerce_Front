// lib/api.js
import axios from "axios";

// ── Instância base ────────────────────────────────────────────────
// Produção: sem NEXT_PUBLIC_API_URL, usa "/backend" (proxy da Vercel → Render)
// Local: NEXT_PUBLIC_API_URL aponta direto para a API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/backend",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // o navegador envia o cookie HttpOnly sozinho
});

// ── Interceptor de erro ───────────────────────────────────────────
// Repassa a mensagem do back-end (ResponseErro { errors: [...] })
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;

    // 401 em rota autenticada = cookie expirado/inválido → derruba a sessão.
    // Ignora o login/logout (credenciais erradas) e a checagem inicial de sessão.
    const eraLogin = config?.url?.includes("/Login");
    if (
      response?.status === 401 &&
      !eraLogin &&
      !config?.ignorarSessaoExpirada
    ) {
      window.dispatchEvent(new Event("sessao-expirada"));
    }

    const erros = response?.data?.errors;
    const mensagem = Array.isArray(erros) ? erros.join(", ") : error.message;

    return Promise.reject(new Error(mensagem));
  },
);

// ── Autenticação ──────────────────────────────────────────────────

// POST /api/Login
// Body: { email, senha }
// Retorna: { nome, token: "" } — o token vai no cookie HttpOnly, não no corpo
export const loginCliente = (dados) =>
  api.post("/api/Login", dados).then((res) => res.data);

// POST /api/Login/logout — a API apaga o cookie
export const logoutCliente = () => api.post("/api/Login/logout");

// ── Cliente ───────────────────────────────────────────────────────

// POST /api/cliente — registra novo usuário
// Body: { nome, email, senha }
// Retorna: { nome, token: "" } — registro não loga
export const registrarCliente = (dados) =>
  api.post("/api/cliente", dados).then((res) => res.data);

// GET /api/cliente — perfil do cliente logado (identificado pelo cookie)
// Aceita opções do axios (usado na checagem inicial de sessão)
export const getPerfilCliente = (config) =>
  api.get("/api/cliente", config).then((res) => res.data);

// PUT /api/cliente — atualiza dados do cliente logado
// Body: { nome, email } — retorna 204
export const atualizarCliente = (dados) =>
  api.put("/api/cliente", dados).then((res) => res.data);

// PUT /api/cliente/change-password — troca a senha
// Body: { senha, novaSenha } — "senha" é a senha ATUAL — retorna 204
export const trocarSenha = (dados) =>
  api.put("/api/cliente/change-password", dados).then((res) => res.data);
