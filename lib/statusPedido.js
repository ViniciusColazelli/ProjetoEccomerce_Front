// lib/statusPedido.js
// Rótulo, cor e transições dos status de pedido.
// Espelha o StatusPedidoExtension da API: quem decide de verdade é o servidor (409 se não puder).

export const STATUS_PEDIDO = {
  AguardandoPagamento: {
    rotulo: "Aguardando pagamento",
    cor: { bg: "#fff7ed", text: "#9a3412" },
  },
  Pago: {
    rotulo: "Pago",
    cor: { bg: "#eff6ff", text: "#1d4ed8" },
  },
  EmProducao: {
    rotulo: "Em produção",
    cor: { bg: "#f5f3ff", text: "#6d28d9" },
  },
  ProntoParaRetirada: {
    rotulo: "Pronto para retirada",
    cor: { bg: "#ecfeff", text: "#0e7490" },
  },
  Entregue: {
    rotulo: "Entregue",
    cor: { bg: "#f0fdf4", text: "#166534" },
  },
  Cancelado: {
    rotulo: "Cancelado",
    cor: { bg: "#f5f5f5", text: "#666666" },
  },
};

// Ordem usada nos filtros
export const LISTA_STATUS = Object.keys(STATUS_PEDIDO);

// EmProducao é opcional: peça sem personalização vai de Pago direto para ProntoParaRetirada.
// Cancelado só antes do pagamento. Entregue e Cancelado são finais.
export const PROXIMOS_STATUS = {
  AguardandoPagamento: ["Pago", "Cancelado"],
  Pago: ["EmProducao", "ProntoParaRetirada"],
  EmProducao: ["ProntoParaRetirada"],
  ProntoParaRetirada: ["Entregue"],
  Entregue: [],
  Cancelado: [],
};

// O que o cliente vê na página do pedido
export const MENSAGEM_CLIENTE = {
  AguardandoPagamento:
    "Recebemos seu pedido! Combine o pagamento com a loja pelo WhatsApp. Assim que ele for confirmado, começamos a separar as peças.",
  Pago: "Pagamento confirmado. Seu pedido está sendo separado.",
  EmProducao: "Suas peças estão sendo personalizadas.",
  ProntoParaRetirada: "Seu pedido está pronto para retirada na loja.",
  Entregue: "Pedido entregue. Obrigado pela preferência!",
  Cancelado: "Este pedido foi cancelado.",
};

export const rotuloStatus = (status) => STATUS_PEDIDO[status]?.rotulo ?? status;

export const proximosStatus = (status) => PROXIMOS_STATUS[status] ?? [];
