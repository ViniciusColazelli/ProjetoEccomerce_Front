// lib/formatar.js
// Formatação de valores para exibição (sempre pt-BR)

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

// A API manda as datas em UTC (com "Z"): mostramos no horário da loja
const FUSO = "America/Sao_Paulo";

const data = new Intl.DateTimeFormat("pt-BR", {
  timeZone: FUSO,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const dataHora = new Intl.DateTimeFormat("pt-BR", {
  timeZone: FUSO,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

// 89.9 → "R$ 89,90"
export const formatarPreco = (valor) => moeda.format(Number(valor) || 0);

// ("M", "Azul") → "M · Azul"; sem cor → "M"
export const descreverVariante = (tamanho, cor) =>
  [tamanho, cor].filter(Boolean).join(" · ");

// "2026-11-07T17:32:00Z" → "07/11/2026" (ou "07/11/2026, 14:32" com hora)
export function formatarData(iso, { comHora = false } = {}) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return (comHora ? dataHora : data).format(d);
}
