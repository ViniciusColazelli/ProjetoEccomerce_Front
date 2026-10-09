// components/layout/Footer.jsx
import Link from "next/link";
import Icon from "components/ui/Icon";
import { S } from "styles/theme";
import {
  CONTATO,
  WHATSAPP_URL,
  INSTAGRAM_URL,
  MAPS_URL,
  MAPS_EMBED_URL,
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

        <div style={{ minWidth: 260 }}>
          <p style={titulo}>ONDE ESTAMOS</p>
          <div
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
          </div>

          <div
            style={{
              ...item,
              alignItems: "center",
              lineHeight: 1.5,
              marginBottom: 10,
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
          </div>

          <div style={{ marginBottom: 14 }}>
            <a
              href={MAPS_URL}
              {...externo}
              className="bu-link-muted"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 500,
                color: S.primary,
              }}
            >
              <Icon name="external" size={13} color={S.primary} stroke={1.8} />
              Ver no Google Maps
            </a>
          </div>

          <iframe
            src={MAPS_EMBED_URL}
            width="100%"
            height="220"
            style={{
              border: 0,
              borderRadius: "8px",
              display: "block",
            }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Localização Belíssima Uniformes no Google Maps"
          />
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
