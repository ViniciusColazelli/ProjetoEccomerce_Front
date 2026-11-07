// context/CarrinhoContext.js
// Carrinho do visitante, guardado no navegador (localStorage).
// Os preços aqui são só estimativa para exibir: no pedido a API recalcula tudo.

import { createContext, useContext, useEffect, useState } from "react";

const CarrinhoContext = createContext(null);
const CHAVE_STORAGE = "bu-carrinho";
export const MAXIMO_ITENS = 50; // mesmo limite do CriarPedidoValidator
export const MAXIMO_QUANTIDADE = 999;

// Mesma variante com as mesmas personalizações = mesma linha do carrinho
const chaveDoItem = (varianteId, personalizacoes) =>
  [varianteId, ...personalizacoes.map((p) => p.id).sort((a, b) => a - b)].join(
    "-",
  );

function lerStorage() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_STORAGE));
    return Array.isArray(salvo) ? salvo : [];
  } catch {
    return [];
  }
}

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);
  const [carregado, setCarregado] = useState(false);

  // localStorage só existe no navegador: lê depois de montar
  useEffect(() => {
    setItens(lerStorage());
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!carregado) return;
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(itens));
    } catch {
      // navegação privada / storage cheio: o carrinho fica só nesta aba
    }
  }, [itens, carregado]);

  // item: { varianteId, produtoId, nome, tamanho, cor, personalizacoes: [{ id, valor, precoAdicional }],
  //         precoUnitario, quantidade }
  // Retorna false se o carrinho já estiver no limite de linhas
  function adicionar(item) {
    const chave = chaveDoItem(item.varianteId, item.personalizacoes);
    const existe = itens.some((i) => i.chave === chave);
    if (!existe && itens.length >= MAXIMO_ITENS) return false;

    setItens((atual) =>
      existe
        ? atual.map((i) =>
            i.chave === chave
              ? {
                  ...i,
                  quantidade: Math.min(
                    MAXIMO_QUANTIDADE,
                    i.quantidade + item.quantidade,
                  ),
                }
              : i,
          )
        : [...atual, { ...item, chave }],
    );
    return true;
  }

  const alterarQuantidade = (chave, quantidade) =>
    setItens((atual) =>
      atual.map((i) => (i.chave === chave ? { ...i, quantidade } : i)),
    );

  const remover = (chave) =>
    setItens((atual) => atual.filter((i) => i.chave !== chave));

  const limpar = () => setItens([]);

  const totalPecas = itens.reduce((soma, i) => soma + i.quantidade, 0);
  const totalEstimado = itens.reduce(
    (soma, i) => soma + i.precoUnitario * i.quantidade,
    0,
  );

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        carregado,
        adicionar,
        alterarQuantidade,
        remover,
        limpar,
        totalPecas,
        totalEstimado,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context)
    throw new Error("useCarrinho deve ser usado dentro de <CarrinhoProvider>");
  return context;
}
