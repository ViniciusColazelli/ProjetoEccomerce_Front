// lib/sessao.js
// Marca, no navegador, que existe um login. Os cookies da sessão são HttpOnly (o JavaScript não os lê),
// então é por esta marca que a checagem inicial sabe se vale tentar renovar a sessão: sem ela, o
// visitante anônimo faria uma chamada de refresh à toa em cada página aberta.
// Não é segurança: quem decide se a sessão vale é sempre a API.

const CHAVE_STORAGE = "bu-sessao";

// localStorage pode falhar (aba anônima, armazenamento bloqueado): sem a marca, só não tenta renovar
export function temMarcaDeSessao() {
  try {
    return localStorage.getItem(CHAVE_STORAGE) === "1";
  } catch {
    return false;
  }
}

export function marcarSessao() {
  try {
    localStorage.setItem(CHAVE_STORAGE, "1");
  } catch {
    // sem a marca, a sessão só não é renovada ao abrir o site
  }
}

export function desmarcarSessao() {
  try {
    localStorage.removeItem(CHAVE_STORAGE);
  } catch {
    // nada a fazer
  }
}
