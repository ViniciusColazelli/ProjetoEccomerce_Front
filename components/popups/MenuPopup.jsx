// components/popups/MenuPopup.jsx
// Links da Navbar em telas pequenas (a barra de links some abaixo de 960px)
import Popup from "./Popup";
import NavLink from "components/ui/NavLink";
import { S, T } from "styles/theme";
import { LINKS } from "lib/navegacao";

export default function MenuPopup({ onClose }) {
  return (
    <Popup onClose={onClose} width={260}>
      <p style={{ ...T.eyebrow, marginBottom: 10 }}>Menu</p>
      <nav style={{ display: "flex", flexDirection: "column" }}>
        {LINKS.map((l) => (
          <NavLink
            key={l.label}
            href={l.href}
            onClick={onClose}
            className="bu-link-muted"
            style={{
              padding: "10px 0",
              fontSize: 15,
              color: S.dark,
              borderBottom: S.line,
            }}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </Popup>
  );
}
