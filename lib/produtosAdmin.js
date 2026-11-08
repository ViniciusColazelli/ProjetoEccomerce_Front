// lib/produtosAdmin.js
import api from "lib/api";

const base = "/api/admin/produto";

// ── Produto ───────────────────────────────────────────────────────

// GET /api/admin/produto?...  (query: RequestListarProdutosAdmin)
export const listarProdutosAdmin = (params) =>
  api.get(base, { params }).then((res) => res.data);

// GET /api/admin/produto/{id}
export const obterProdutoAdmin = (id) =>
  api.get(`${base}/${id}`).then((res) => res.data);

// POST /api/admin/produto — retorna 201 com ResponseProdutoRegistrado
export const registrarProduto = (dados) =>
  api.post(base, dados).then((res) => res.data);

// PUT /api/admin/produto/{id} — retorna 204
export const atualizarProduto = (id, dados) =>
  api.put(`${base}/${id}`, dados).then((res) => res.data);

// PATCH /api/admin/produto/{id}/status — retorna 204
export const alterarStatusProduto = (id, dados) =>
  api.patch(`${base}/${id}/status`, dados).then((res) => res.data);

// ── Opções (ex.: cor, tamanho) ────────────────────────────────────

// POST /api/admin/produto/{produtoId}/opcao — retorna 201
export const registrarOpcao = (produtoId, dados) =>
  api.post(`${base}/${produtoId}/opcao`, dados).then((res) => res.data);

// PUT /api/admin/produto/{produtoId}/opcao/{opcaoId} — retorna 204
export const atualizarOpcao = (produtoId, opcaoId, dados) =>
  api
    .put(`${base}/${produtoId}/opcao/${opcaoId}`, dados)
    .then((res) => res.data);

// DELETE /api/admin/produto/{produtoId}/opcao/{opcaoId} — 204 ou 409 (em uso)
export const removerOpcao = (produtoId, opcaoId) =>
  api.delete(`${base}/${produtoId}/opcao/${opcaoId}`).then((res) => res.data);

// PATCH /api/admin/produto/{produtoId}/opcao/{opcaoId}/status — retorna 204
export const alterarStatusOpcao = (produtoId, opcaoId, dados) =>
  api
    .patch(`${base}/${produtoId}/opcao/${opcaoId}/status`, dados)
    .then((res) => res.data);

// ── Variantes ─────────────────────────────────────────────────────

// POST /api/admin/produto/{produtoId}/variante/gerar — retorna ResponseVariantesGeradas
export const gerarVariantes = (produtoId) =>
  api.post(`${base}/${produtoId}/variante/gerar`).then((res) => res.data);

// PATCH /api/admin/produto/{produtoId}/variante/{varianteId}/status — retorna 204
export const alterarStatusVariante = (produtoId, varianteId, dados) =>
  api
    .patch(`${base}/${produtoId}/variante/${varianteId}/status`, dados)
    .then((res) => res.data);

// ── Fotos ─────────────────────────────────────────────────────────
// Até 8 por produto; a de menor ordem é a capa. As URLs vêm prontas da API
// (Supabase em produção, a própria API em desenvolvimento).

// POST /api/admin/produto/{produtoId}/imagem — multipart com "imagem" (até 3 MB) e
// "miniatura" (até 1 MB), já reduzidas no navegador (lib/imagens.js).
// Retorna 201 com { id, url, urlMiniatura, ordem }. 400: tipo, tamanho ou limite de 8 fotos
export const enviarImagem = (produtoId, { imagem, miniatura }, config) => {
  const formulario = new FormData();
  formulario.append("imagem", imagem, "foto" + extensao(imagem));
  formulario.append("miniatura", miniatura, "miniatura" + extensao(miniatura));
  return api
    .post(`${base}/${produtoId}/imagem`, formulario, {
      ...config,
      // Com o "application/json" padrão do lib/api.js, o axios transforma o FormData em JSON
      // (a API responde 415). Com multipart ele mantém o formulário, e o navegador completa o boundary
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

const extensao = (blob) =>
  ({ "image/webp": ".webp", "image/jpeg": ".jpg", "image/png": ".png" })[
    blob.type
  ] ?? "";

// DELETE /api/admin/produto/{produtoId}/imagem/{imagemId} — retorna 204
export const removerImagem = (produtoId, imagemId) =>
  api.delete(`${base}/${produtoId}/imagem/${imagemId}`).then((res) => res.data);

// PUT /api/admin/produto/{produtoId}/imagem/ordem
// Body: { ids: [...] } com TODAS as fotos na ordem nova (a primeira vira capa)
// Retorna a lista já ordenada: [{ id, url, urlMiniatura, ordem }]
export const ordenarImagens = (produtoId, ids) =>
  api.put(`${base}/${produtoId}/imagem/ordem`, { ids }).then((res) => res.data);
