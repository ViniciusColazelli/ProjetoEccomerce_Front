// lib/api.js
import axios from "axios";
import { temMarcaDeSessao, desmarcarSessao } from "lib/sessao";

// ── Instância base ────────────────────────────────────────────────
// Sempre "/backend": o rewrite do next.config.js repassa para API_URL
// (Render em produção, localhost:5136 local). Mesma origem do site, então o cookie vai junto
const api = axios.create({
  baseURL: "/backend",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // o navegador envia o cookie HttpOnly sozinho
});

// ── Renovação da sessão ───────────────────────────────────────────
// O JWT (cookie access_token) dura minutos; o cookie refresh_token troca por um novo sem pedir a senha.
// Cada refresh token vale uma vez, então dois refreshes com o mesmo cookie não podem sair juntos:
// - na mesma aba, as chamadas que recebem 401 ao mesmo tempo esperam a mesma renovação;
// - entre abas, o navigator.locks faz uma esperar a outra. Como o cookie é compartilhado,
//   a segunda já sai com o refresh token que a primeira acabou de gravar.
const TRAVA_RENOVACAO = "bu-renovar-sessao";
let renovacaoEmAndamento = null;

function renovarSessao() {
  if (!renovacaoEmAndamento) {
    const renovar = () => api.post("/api/Login/refresh");

    renovacaoEmAndamento = (
      typeof navigator !== "undefined" && navigator.locks
        ? navigator.locks.request(TRAVA_RENOVACAO, renovar)
        : renovar()
    )
      .catch(() => {
        // a chamada original é repetida mesmo assim (ver abaixo) e decide se a sessão acabou
      })
      .finally(() => {
        renovacaoEmAndamento = null;
      });
  }
  return renovacaoEmAndamento;
}

// Login, refresh e logout: 401 ali é senha errada ou sessão já encerrada, nunca motivo para renovar
const ehRotaDeSessao = (config) => config?.url?.includes("/Login");

// A checagem inicial (ignorarSessaoExpirada) só renova se este navegador tinha login (lib/sessao.js)
const podeRenovar = (config) =>
  !!config &&
  !config._repetida &&
  !ehRotaDeSessao(config) &&
  (!config.ignorarSessaoExpirada || temMarcaDeSessao());

// ── Interceptor de erro ───────────────────────────────────────────
// Repassa a mensagem do back-end (ResponseErro { errors: [...] })
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    // 401 = JWT vencido: renova e repete a chamada uma vez. Repete mesmo se a renovação falhar:
    // outra aba pode ter renovado no meio do caminho. O 401 vem antes de a API executar a ação,
    // então repetir um POST (criar pedido, enviar foto) não duplica nada
    if (response?.status === 401 && podeRenovar(config)) {
      await renovarSessao();
      return api.request({ ...config, _repetida: true });
    }

    // 401 mesmo depois de renovar = a sessão acabou (vencida, logout em outra aba, senha trocada).
    // A checagem inicial só limpa a marca: visitante anônimo não "perde" sessão nenhuma
    if (response?.status === 401 && !ehRotaDeSessao(config)) {
      desmarcarSessao();
      if (!config?.ignorarSessaoExpirada)
        window.dispatchEvent(new Event("sessao-expirada"));
    }

    const erros = response?.data?.errors;
    // Nunca mostra a mensagem crua do axios ("Request failed with status code 404")
    const mensagem =
      response?.status === 403
        ? "Você não tem permissão para esta ação."
        : Array.isArray(erros)
          ? erros.join(", ")
          : !response
            ? "Não foi possível conectar ao servidor. Tente de novo."
            : `Erro inesperado no servidor (código ${response.status}).`;

    // `status` deixa a página tratar casos como o 404 ("Produto não encontrado").
    // `cancelado`: abortada pelo AbortController (busca substituída), não é erro para mostrar
    const erro = new Error(mensagem);
    erro.status = response?.status;
    erro.cancelado = axios.isCancel(error);
    return Promise.reject(erro);
  },
);

// ── Autenticação ──────────────────────────────────────────────────

// POST /api/Login
// Body: { email, senha }
// Retorna: { nome, token: "" } — os tokens vão nos cookies HttpOnly (access_token e refresh_token)
export const loginCliente = (dados) =>
  api.post("/api/Login", dados).then((res) => res.data);

// POST /api/Login/logout — a API revoga a sessão e apaga os dois cookies
export const logoutCliente = () => api.post("/api/Login/logout");

// ── Cliente ───────────────────────────────────────────────────────

// POST /api/cliente — registra novo usuário
// Body: { nome, email, senha }
// Retorna: { nome, token: "" } — registro não loga
export const registrarCliente = (dados) =>
  api.post("/api/cliente", dados).then((res) => res.data);

// GET /api/cliente — perfil do cliente logado (identificado pelo cookie)
// Aceita opções do axios (usado na checagem inicial de sessão)
export const getPerfilCliente = (config) =>
  api.get("/api/cliente", config).then((res) => res.data);

// PUT /api/cliente — atualiza dados do cliente logado
// Body: { nome, email } — retorna 204
export const atualizarCliente = (dados) =>
  api.put("/api/cliente", dados).then((res) => res.data);

// PUT /api/cliente/change-password — troca a senha
// Body: { senha, novaSenha } — "senha" é a senha ATUAL — retorna 204
export const trocarSenha = (dados) =>
  api.put("/api/cliente/change-password", dados).then((res) => res.data);

export default api;
