// components/home/CtaBanner.jsx
// Chamada para pedidos pelo WhatsApp
import Button from "components/ui/Button";
import { S } from "styles/theme";
import { CONTATO, WHATSAPP_URL } from "lib/contato";

export default function CtaBanner() {
  return (
    <section style={{ background: S.secondaryDark, color: S.white }}>
      <div
        className="bu-container bu-cta"
        style={{
          paddingTop: 56,
          paddingBottom: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
        }}
      >
        <div>
          <h2
            className="bu-section-title"
            style={{
              fontFamily: S.serif,
              fontSize: 30,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Precisa de uniforme para a sua equipe?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)" }}>
            Chama a gente no WhatsApp que a gente monta o pedido com você.
          </p>
        </div>

        <div style={{ flexShrink: 0 }}>
          <Button
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="light"
            style={{ padding: "13px 26px" }}
          >
            Chamar no WhatsApp
          </Button>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.6)",
              marginTop: 10,
            }}
          >
            {CONTATO.celular} · {CONTATO.telefone}
          </p>
        </div>
      </div>
    </section>
  );
}
