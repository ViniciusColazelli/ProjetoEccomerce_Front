// components/layout/Footer.jsx
import Link from "next/link";
import Icon from "components/ui/Icon";
import { S } from "styles/theme";
import {
  CONTATO,
  WHATSAPP_URL,
  INSTAGRAM_URL,
  ENDERECO,
  HORARIO,
} from "lib/contato";

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

const externo = { target: "_blank", rel: "noopener noreferrer" };

export default function Footer() {
  return (
    <footer id="contato" style={{ background: S.white, borderTop: S.line }}>
      <div
        className="bu-container bu-footer-grid"
        style={{ paddingTop: 56, paddingBottom: 48 }}
      >
        <div>
          <img
            src="/logo.png"
            alt="Belíssima Uniformes"
            style={{
              height: 82,
              width: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
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
          <Link href="/" className="bu-link-muted" style={item}>
            Início
          </Link>
          <Link href="/#categorias" className="bu-link-muted" style={item}>
            Categorias
          </Link>
          <Link href="/#sobre" className="bu-link-muted" style={item}>
            Sobre
          </Link>
        </div>

        <div>
          <p style={titulo}>Contato</p>
          <a
            href={WHATSAPP_URL}
            {...externo}
            className="bu-link-muted"
            style={item}
          >
            <Icon name="whatsapp" size={16} color={S.primary} stroke={1.8} />
            {CONTATO.celular}
          </a>
          <span style={item}>
            <Icon name="phone" size={16} color={S.primary} stroke={1.8} />
            {CONTATO.telefone}
          </span>
          <a
            href={INSTAGRAM_URL}
            {...externo}
            className="bu-link-muted"
            style={item}
          >
            <Icon name="instagram" size={16} color={S.primary} stroke={1.8} />@
            {CONTATO.instagram}
          </a>
        </div>

        <div>
          <h3 style={titulo}>ONDE ESTAMOS</h3>
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
              src="https://maps.google.com/maps?q=-23.672813,-46.480092&hl=pt-BR&z=17&output=embed"
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
