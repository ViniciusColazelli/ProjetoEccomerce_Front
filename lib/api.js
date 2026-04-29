// lib/api.js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function fetchJSON(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  // Extrai mensagem de erro compatível com ExceptionFiltro do ASP.NET
  if (!res.ok) {
    let mensagem = "Erro inesperado. Tente novamente.";
    try {
      const erro = await res.json();
      mensagem = erro.message || erro.title || mensagem;
    } catch (_) {}
    throw new Error(mensagem);
  }

  // 201 Created pode não ter corpo
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ── Autenticação ──────────────────────────────────────────────────

export const registrarCliente = (dados) =>
  fetchJSON("/api/cliente", {
    method: "POST",
    body: JSON.stringify(dados),
  });

export const loginCliente = (dados) =>
  fetchJSON("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(dados),
  });

// ── Produtos / Categorias ─────────────────────────────────────────

export const getCategorias = () => fetchJSON("/api/categorias");
export const getProdutos = () => fetchJSON("/api/produtos");
export const getPorCategoria = (categoria) =>
  fetchJSON(`/api/produtos/${categoria}`);
