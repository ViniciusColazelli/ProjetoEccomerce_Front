// lib/pedidos.js
import api from "lib/api";

const base = "/api/pedidos";

// Cada rota só enxerga os pedidos do cliente logado (identificado pelo cookie)

// GET /api/pedidos?...  (query: RequestListarMeusPedidos)
// { pagina = 1, tamanhoPagina = 10 }
// Retorna: ResponsePedidos { pedidos: [{ id, status, total, quantidadePecas, criadoEm }],
//   pagina, tamanhoPagina, total }
export const listarMeusPedidos = (params) =>
  api.get(base, { params }).then((res) => res.data);

// GET /api/pedidos/{id} — 404 se não existir ou não for do cliente
// Retorna: ResponsePedido
export const obterMeuPedido = (id) =>
  api.get(`${base}/${id}`).then((res) => res.data);

// POST /api/pedidos — retorna 201 com ResponsePedido (400/409)
// Body: { itens: [{ varianteId, quantidade, personalizacaoIds: [] }], observacao }
// Mande só o que o cliente escolheu: preços e totais são calculados no servidor
export const criarPedido = (dados) =>
  api.post(base, dados).then((res) => res.data);

// POST /api/pedidos/{id}/cancelar — só antes do pagamento (409 depois)
// Retorna: ResponsePedido
export const cancelarMeuPedido = (id) =>
  api.post(`${base}/${id}/cancelar`).then((res) => res.data);
