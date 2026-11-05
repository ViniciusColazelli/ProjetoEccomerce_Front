// components/layout/Footer.jsx
import Link from "next/link";
import Icon from "components/ui/Icon";
import Logo from "components/ui/Logo";
import ContatoLink from "components/ui/ContatoLink";
import { S } from "styles/theme";
import { CONTATO, ENDERECO, HORARIO, MAPS_EMBED_URL } from "lib/contato";
import { LINKS } from "lib/navegacao";

// O rodapé já é a seção de contato: não lista o link para ela mesma
const LINKS_RODAPE = LINKS.filter((l) => l.href !== "#contato");

const titulo = {
  fontSize: 12,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: S.dark,
  fontWeight: 600,
  marginBottom: 18,
};

const item = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontSize: 14,
  color: S.soft,
  marginBottom: 12,
};

export default function Footer() {
  return (
    <footer id="contato" style={{ background: S.white, borderTop: S.line }}>
      <div
        className="bu-container bu-footer-grid"
        style={{ paddingTop: 56, paddingBottom: 48 }}
      >
        <div>
          <Logo height={82} />
          <p
            style={{
              fontSize: 14,
              color: S.soft,
              lineHeight: 1.7,
              marginTop: 18,
              maxWidth: 300,
            }}
          >
            Uniformes que fazem a diferença. Qualidade, identidade e conforto.
          </p>
        </div>

        <div>
          <p style={titulo}>Navegação</p>
          {LINKS_RODAPE.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="bu-link-muted"
              style={item}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div>
          <p style={titulo}>Contato</p>
          <ContatoLink
            rede="whatsapp"
            color={S.primary}
            className="bu-link-muted"
            style={item}
          />
          <span style={item}>
            <Icon name="phone" size={16} color={S.primary} stroke={1.8} />
            {CONTATO.telefone}
          </span>
          <ContatoLink
            rede="instagram"
            color={S.primary}
            className="bu-link-muted"
            style={item}
          />
        </div>

        <div>
          <p style={titulo}>Onde estamos</p>
          <p
            style={{
              ...item,
              alignItems: "flex-start",
              lineHeight: 1.5,
              marginBottom: 10,
            }}
          >
            <Icon
              name="mapPin"
              size={16}
              color={S.primary}
              stroke={1.8}
              style={{ flexShrink: 0, marginTop: 2 }}
            />
            <span>{ENDERECO}</span>
          </p>

          <p
            style={{
              ...item,
              alignItems: "center",
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            <Icon
              name="clock"
              size={16}
              color={S.primary}
              stroke={1.8}
              style={{ flexShrink: 0 }}
            />
            <span>{HORARIO}</span>
          </p>

          <div
            style={{
              width: "100%",
              height: "200px",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <iframe
              src={MAPS_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </div>

      <div style={{ borderTop: S.line }}>
        <div
          className="bu-container bu-bottom-bar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 20,
            paddingBottom: 20,
            fontSize: 12,
            color: S.muted,
          }}
        >
          <span>© 2026 Belíssima Uniformes — Todos os direitos reservados</span>
        </div>
      </div>
    </footer>
  );
}
