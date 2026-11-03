// lib/estoqueAdmin.js
import api from "lib/api";

const base = "/api/admin/estoque";

// ── Consulta ──────────────────────────────────────────────────────

// GET /api/admin/estoque?...  (query: RequestListarEstoque)
// { pagina = 1, tamanhoPagina = 20, produtoId, somenteZerados }
// Retorna: ResponseEstoque
export const listarEstoque = (params) =>
  api.get(base, { params }).then((res) => res.data);

// GET /api/admin/estoque/{varianteId} — 404 se a variante não existir
// Retorna: ResponseEstoqueVariante
export const obterEstoqueVariante = (varianteId) =>
  api.get(`${base}/${varianteId}`).then((res) => res.data);

// GET /api/admin/estoque/movimentacoes?...  (query: RequestListarMovimentacoes)
// { pagina = 1, tamanhoPagina = 20, varianteId, produtoId, pedidoId,
//   tipo: "Entrada" | "Saida", de: "AAAA-MM-DD", ate: "AAAA-MM-DD" }
// Retorna: ResponseMovimentacoes
export const listarMovimentacoes = (params) =>
  api.get(`${base}/movimentacoes`, { params }).then((res) => res.data);

// ── Movimentação ──────────────────────────────────────────────────

// POST /api/admin/estoque/{varianteId}/entrada
// Body: { quantidade, motivo } — motivo obrigatório
// Retorna: ResponseEstoqueVariante (saldo atualizado) — 400/404/409
export const entradaEstoque = (varianteId, dados) =>
  api.post(`${base}/${varianteId}/entrada`, dados).then((res) => res.data);

// POST /api/admin/estoque/{varianteId}/saida
// Body: { quantidade, motivo } — 409 se não houver saldo suficiente
// Retorna: ResponseEstoqueVariante
export const saidaEstoque = (varianteId, dados) =>
  api.post(`${base}/${varianteId}/saida`, dados).then((res) => res.data);

// POST /api/admin/estoque/{varianteId}/ajuste — inventário
// Body: { novaQuantidade, motivo } — novaQuantidade é o saldo contado;
// a API registra a diferença como Entrada ou Saida
// Retorna: ResponseEstoqueVariante
export const ajustarEstoque = (varianteId, dados) =>
  api.post(`${base}/${varianteId}/ajuste`, dados).then((res) => res.data);
