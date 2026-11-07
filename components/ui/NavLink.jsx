// components/ui/NavLink.jsx
// Link do menu. Âncora da própria página ("#contato") vira <a> simples: o Link do Next
// resolve o "#" contra a URL atual, e no HTML do servidor a query some
// (/produtos?nome=calca#contato vira /produtos#contato, perdendo o filtro ao clicar).
import Link from "next/link";

export default function NavLink({ href, ...props }) {
  if (href.startsWith("#")) return <a href={href} {...props} />;
  return <Link href={href} {...props} />;
}
