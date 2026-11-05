// components/ui/ContatoLink.jsx
// Link de WhatsApp ou Instagram com ícone. className e style ficam com quem usa
import Icon from "./Icon";
import { REDES, LINK_EXTERNO } from "lib/contato";

export default function ContatoLink({ rede, iconSize = 16, color, ...props }) {
  const { href, texto } = REDES[rede];

  return (
    <a href={href} {...LINK_EXTERNO} {...props}>
      <Icon name={rede} size={iconSize} color={color} stroke={1.8} />
      {texto}
    </a>
  );
}
