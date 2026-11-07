// lib/contato.js
// Dados de contato da loja (do cartão da Belíssima Uniformes)

export const CONTATO = {
  celular: "(11) 94922-2982",
  telefone: "(11) 4512-3767",
  instagram: "uniformes.belissima",
};

export const WHATSAPP_URL = "https://wa.me/5511949222982";

// Abre a conversa já com a mensagem escrita (?text=)
export const whatsappComTexto = (texto) =>
  `${WHATSAPP_URL}?text=${encodeURIComponent(texto)}`;
export const INSTAGRAM_URL = `https://instagram.com/${CONTATO.instagram}`;
// Embed por coordenadas: o embed do "lugar" do Google mostra um cartão que bloqueia o mapa
export const MAPS_EMBED_URL =
  "https://maps.google.com/maps?q=-23.672813,-46.480092&hl=pt-BR&z=17&output=embed";
export const ENDERECO =
  "R. Vicente Scarpelli, 133 - Parque Itrapoã, Mauá - SP, 09371-610";
export const HORARIO = "Segunda a Sexta: 07:30 às 17:30";

// Links para fora do site abrem em outra aba
export const LINK_EXTERNO = { target: "_blank", rel: "noopener noreferrer" };

// Endereço e texto de cada rede (o nome é o mesmo do ícone em components/ui/Icon)
export const REDES = {
  whatsapp: { href: WHATSAPP_URL, texto: CONTATO.celular },
  instagram: { href: INSTAGRAM_URL, texto: `@${CONTATO.instagram}` },
};
