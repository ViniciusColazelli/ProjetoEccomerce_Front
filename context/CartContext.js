// context/CartContext.js
// Carrinho do visitante, salvo no navegador (localStorage).
// Os preços aqui são estimativa para exibir: ao criar o pedido a API recalcula tudo.

import { createContext, useContext, useSyncExternalStore } from "react";

const CartContext = createContext(null);
const CHAVE_STORAGE = "bu-carrinho";

// Mesmos limites do CriarPedidoValidator da API
export const MAXIMO_ITENS = 50;
export const MINIMO_QUANTIDADE = 1;
export const MAXIMO_QUANTIDADE = 999;

const limitarQuantidade = (n) =>
  Math.min(MAXIMO_QUANTIDADE, Math.max(MINIMO_QUANTIDADE, Math.trunc(n) || 1));

// varianteId + ids das personalizações em ordem: a mesma combinação soma a quantidade,
// e a mesma peça com e sem bordado vira duas linhas
const chaveDoItem = (varianteId, personalizacoes) =>
  [varianteId, ...personalizacoes.map((p) => p.id).sort((a, b) => a - b)].join(
    "-",
  );

// O que estiver salvo pode ser de uma versão antiga ou ter sido editado à mão
function lerStorage() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_STORAGE));
    if (!Array.isArray(salvo)) return [];
    return salvo
      .filter((i) => i && Number.isInteger(i.varianteId))
      .map((i) => {
        const personalizacoes = Array.isArray(i.personalizacoes)
          ? i.personalizacoes
          : [];
        return {
          ...i,
          personalizacoes,
          quantidade: limitarQuantidade(i.quantidade),
          chave: chaveDoItem(i.varianteId, personalizacoes),
        };
      })
      .slice(0, MAXIMO_ITENS);
  } catch {
    return [];
  }
}

// ── O carrinho salvo, fora do React ───────────────────────────────
// O localStorage é um "sistema externo": o React lê por useSyncExternalStore.
// No servidor (e durante a hidratação) o carrinho é [], e logo depois vira o que está salvo.
let cache = null; // a mesma lista enquanto nada muda (o React compara por referência)
const ouvintes = new Set();

function lerItens() {
  if (cache === null) cache = lerStorage();
  return cache;
}

function gravarItens(itens) {
  cache = itens;
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(itens));
  } catch {
    // navegação privada ou storage cheio: o carrinho fica só nesta aba
  }
  ouvintes.forEach((avisar) => avisar());
}

// Mudou o carrinho em outra aba: relê, e esta aba acompanha
function inscrever(avisar) {
  ouvintes.add(avisar);
  function aoMudarEmOutraAba(e) {
    if (e.key !== CHAVE_STORAGE) return;
    cache = lerStorage();
    avisar();
  }
  window.addEventListener("storage", aoMudarEmOutraAba);
  return () => {
    ouvintes.delete(avisar);
    window.removeEventListener("storage", aoMudarEmOutraAba);
  };
}

const VAZIO = [];
const semInscricao = () => () => {};

export function CartProvider({ children }) {
  const itens = useSyncExternalStore(inscrever, lerItens, () => VAZIO);
  // false no servidor e na hidratação, true logo depois: a página do carrinho espera
  // o carrinho salvo, para não mostrar "vazio" por um instante
  const carregado = useSyncExternalStore(
    semInscricao,
    () => true,
    () => false,
  );

  const setItens = (mudar) => gravarItens(mudar(lerItens()));

  // item: { varianteId, produtoId, nome, tamanho, cor,
  //         personalizacoes: [{ id, valor, precoAdicional }], precoUnitario, quantidade }
  // Retorna false quando o carrinho já tem 50 linhas e o item seria uma linha nova
  function adicionar(item) {
    const chave = chaveDoItem(item.varianteId, item.personalizacoes);
    const existe = itens.some((i) => i.chave === chave);
    if (!existe && itens.length >= MAXIMO_ITENS) return false;

    const quantidade = limitarQuantidade(item.quantidade);
    setItens((atual) =>
      existe
        ? atual.map((i) =>
            i.chave === chave
              ? {
                  ...i,
                  quantidade: limitarQuantidade(i.quantidade + quantidade),
                }
              : i,
          )
        : [...atual, { ...item, quantidade, chave }],
    );
    return true;
  }

  const alterarQuantidade = (chave, quantidade) =>
    setItens((atual) =>
      atual.map((i) =>
        i.chave === chave
          ? { ...i, quantidade: limitarQuantidade(quantidade) }
          : i,
      ),
    );

  const remover = (chave) =>
    setItens((atual) => atual.filter((i) => i.chave !== chave));

  const limpar = () => setItens(() => []);

  const total = itens.reduce((s, i) => s + i.precoUnitario * i.quantidade, 0);
  const quantidadeItens = itens.reduce((s, i) => s + i.quantidade, 0); // peças

  return (
    <CartContext.Provider
      value={{
        itens,
        carregado,
        adicionar,
        alterarQuantidade,
        remover,
        limpar,
        total,
        quantidadeItens,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return context;
}
