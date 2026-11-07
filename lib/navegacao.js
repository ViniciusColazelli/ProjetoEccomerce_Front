// lib/navegacao.js
// Links do menu principal (Navbar) e do rodapé (Footer)

export const LINKS = [
  { label: "Início", href: "/" },
  { label: "Produtos", href: "/produtos" },
  { label: "Categorias", href: "/#categorias" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Contato", href: "#contato" },
];

// Menu do painel admin (o primeiro é a página inicial do painel, ver next.config.js)
export const LINKS_ADMIN = [
  { label: "Produtos", href: "/admin/produtos" },
  { label: "Estoque", href: "/admin/estoque" },
  { label: "Pedidos", href: "/admin/pedidos" },
];
