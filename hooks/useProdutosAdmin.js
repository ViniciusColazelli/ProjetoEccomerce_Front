// hooks/useProdutosAdmin.js
// Opções do <Select> de produto nos filtros do painel (a API aceita até 50 por página)
import { listarProdutosAdmin } from "lib/produtosAdmin";
import { useConsulta } from "hooks/useConsulta";

export function useOpcoesProduto() {
  const { dados } = useConsulta(
    () =>
      listarProdutosAdmin({
        tamanhoPagina: 50,
        ordenarPor: "nome",
        direcao: "asc",
      }),
    [],
  );

  return [
    { valor: "", rotulo: "Todos os produtos" },
    ...(dados?.produtos ?? []).map((p) => ({
      valor: String(p.id),
      rotulo: p.ativo ? p.nome : `${p.nome} (inativo)`,
    })),
  ];
}
