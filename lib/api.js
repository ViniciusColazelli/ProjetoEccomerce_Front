// lib/api.js
import axios from "axios";

// ── Instância base ────────────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// ── Interceptor de request ────────────────────────────────────────
// Injeta o token JWT salvo no login em toda requisição autenticada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Interceptor de erro ───────────────────────────────────────────
// Compatível com ResponseErro { errors: ["mensagem"] } do back-end
// e com o ProblemDetails do ASP.NET { errors: { Campo: ["mensagem"] } }
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;

    // Sessão expirada/inválida: só dispara se havia um token em uso
    // (não confundir com 401 de credenciais erradas no /Login)
    const eraRotaAutenticada = Boolean(localStorage.getItem("token"));
    const eraLogin = config?.url?.includes("/Login");

    if (response?.status === 401 && eraRotaAutenticada && !eraLogin) {
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("sessao-expirada"));
    }

    const data = response?.data;

    let mensagem = null;
    if (Array.isArray(data?.errors)) {
      mensagem = data.errors.filter(Boolean).join(", ");
    } else if (data?.errors && typeof data.errors === "object") {
      mensagem = Object.values(data.errors).flat().join(", ");
    }

    mensagem =
      mensagem ||
      data?.message ||
      data?.title ||
      "Erro inesperado. Tente novamente.";

    if (process.env.NODE_ENV === "development") {
      console.error("API error:", response?.status, data);
    }

    return Promise.reject(new Error(mensagem));
  },
);

// ── Autenticação ──────────────────────────────────────────────────

// POST /Login
// Body: { email, senha }
// Retorna: { nome, token }
export const loginCliente = (dados) =>
  api.post("/Login", dados).then((res) => res.data);

// ── Cliente ───────────────────────────────────────────────────────

// POST /api/cliente — registra novo usuário
// Body: { nome, email, senha }
// Retorna: { nome, token: "" }  ← token sempre vazio, registro não loga
// Redireciona para /login após cadastro
export const registrarCliente = (dados) =>
  api.post("/api/cliente", dados).then((res) => res.data);

// GET /api/cliente — retorna perfil do cliente logado
// Requer header Authorization: Bearer <token>
export const getPerfilCliente = () =>
  api.get("/api/cliente").then((res) => res.data);

// PUT /api/cliente — atualiza dados do cliente logado
// Body: RequestUpdateCliente { nome, email }
// Retorna: 204 No Content
export const atualizarCliente = (dados) =>
  api.put("/api/cliente", dados).then((res) => res.data);

// PUT /api/cliente/change-password — troca senha do cliente logado
// Body: RequestTrocarSenha { senha, novaSenha }  ← "senha" é a senha ATUAL
// Retorna: 204 No Content
export const trocarSenha = (dados) =>
  api.put("/api/cliente/change-password", dados).then((res) => res.data);
