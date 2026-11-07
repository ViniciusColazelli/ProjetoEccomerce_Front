// context/CartContext.js
// Carrinho do visitante, salvo no navegador (localStorage).
// Os preços aqui são estimativa para exibir: ao criar o pedido a API recalcula tudo.

import { createContext, useContext, useEffect, useState } from "react";

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

export function CartProvider({ children }) {
  const [itens, setItens] = useState([]);
  const [carregado, setCarregado] = useState(false);

  // localStorage só existe no navegador: lê depois de montar (o HTML do servidor sai vazio)
  useEffect(() => {
    setItens(lerStorage());
    setCarregado(true);
  }, []);

  // Só grava depois de ler, senão o [] inicial apagaria o carrinho salvo
  useEffect(() => {
    if (!carregado) return;
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(itens));
    } catch {
      // navegação privada ou storage cheio: o carrinho fica só nesta aba
    }
  }, [itens, carregado]);

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

  const limpar = () => setItens([]);

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
