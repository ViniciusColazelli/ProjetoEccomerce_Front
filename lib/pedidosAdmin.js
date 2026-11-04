// lib/pedidosAdmin.js
import api from "lib/api";

const base = "/api/admin/pedidos";

// GET /api/admin/pedidos?...  (query: RequestListarPedidosAdmin)
// { pagina = 1, tamanhoPagina = 20, status, cliente (parte do nome ou e-mail),
//   de: "AAAA-MM-DD", ate: "AAAA-MM-DD" }
// Retorna: ResponsePedidosAdmin
export const listarPedidosAdmin = (params) =>
  api.get(base, { params }).then((res) => res.data);

// GET /api/admin/pedidos/{id}
// Retorna: ResponsePedidoAdmin
export const obterPedidoAdmin = (id) =>
  api.get(`${base}/${id}`).then((res) => res.data);

// POST /api/admin/pedidos/{id}/status — retorna ResponsePedidoAdmin (400/404/409)
// Body: { status }
// "Pago" baixa o estoque; "Cancelado" só é possível antes do pagamento
export const alterarStatusPedido = (id, dados) =>
  api.post(`${base}/${id}/status`, dados).then((res) => res.data);
