// lib/api.js
import axios from "axios";

// ── Instância base ────────────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // envia o cookie de sessão ASP.NET em toda requisição
});

// ── Interceptor de erro ───────────────────────────────────────────
// Compatível com ResponseErro { errors: ["mensagem"] } do back-end
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;

    // ResponseErro retorna { "errors": ["mensagem1", "mensagem2"] }
    const mensagem =
      (Array.isArray(data?.errors) && data.errors.length > 0
        ? data.errors.join(", ")
        : null) ||
      data?.message ||
      data?.title ||
      "Erro inesperado. Tente novamente.";

    return Promise.reject(new Error(mensagem));
  },
);

// ── Autenticação ──────────────────────────────────────────────────

// POST /Login
// Body: { email, senha }
// Retorna: { nome }
// Cria sessão no ASP.NET via cookie
export const loginCliente = (dados) =>
  api.post("/Login", dados).then((res) => res.data);

// ── Cliente ───────────────────────────────────────────────────────

// POST /api/cliente — registra novo usuário
// Body: { nome, email, senha }
// Retorna: { nome }
// NÃO cria sessão — redireciona para /login após cadastro
export const registrarCliente = (dados) =>
  api.post("/api/cliente", dados).then((res) => res.data);

// GET /api/cliente — retorna perfil do cliente logado
// Usa o cookie de sessão ASP.NET para identificar o cliente
// Lança ClienteNaoLogadoException se sessão expirou
export const getPerfilCliente = () =>
  api.get("/api/cliente").then((res) => res.data);

// PUT /api/cliente — atualiza dados do cliente logado
// Body: RequestUpdateCliente { nome, email }
// Retorna: 204 No Content
export const atualizarCliente = (dados) =>
  api.put("/api/cliente", dados).then((res) => res.data);

// PUT /api/cliente/change-password — troca senha do cliente logado
// Body: RequestTrocarSenha { senhaAtual, novaSenha }
// Retorna: 204 No Content
export const trocarSenha = (dados) =>
  api.put("/api/cliente/change-password", dados).then((res) => res.data);
