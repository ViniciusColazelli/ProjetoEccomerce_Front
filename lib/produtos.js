// lib/produtos.js
import api from "lib/api";

const base = "/api/produto";

// GET /api/produto?...  (query: RequestListarProdutos)
// { pagina = 1, tamanhoPagina = 20, nome, ordenarPor: "nome" | "preco",
//   direcao: "asc" | "desc", somenteDisponiveis }
// Retorna: ResponseProdutos
// `config` repassa opções do axios, como { signal } para cancelar a busca anterior
export const listarProdutos = (params, config) =>
  api.get(base, { ...config, params }).then((res) => res.data);

// GET /api/produto/{id} — 404 se não existir/inativo
// Retorna: ResponseProdutoDetalhe
export const obterProduto = (id) =>
  api.get(`${base}/${id}`).then((res) => res.data);
