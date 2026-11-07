// components/layout/RotaProtegida.jsx
// Só monta o conteúdo depois de confirmar a sessão (e o admin, se pedido).
// Assim as consultas dos filhos não disparam para quem vai ser redirecionado.
import { useRotaProtegida } from "hooks/useRotaProtegida";
import Loading from "components/ui/Loading";

export default function RotaProtegida({ admin, children }) {
  const { liberado } = useRotaProtegida({ admin });
  return liberado ? children : <Loading />;
}
