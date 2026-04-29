// components/home/Hero.jsx
import { S } from "../../styles/theme";

export default function Hero() {
  return (
    <section style={{ background: S.heroBg, padding: "64px 40px 80px" }}>
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: S.gold,
          fontWeight: 400,
          marginBottom: 14,
        }}
      >
        Coleção 2026
      </p>
      <h1
        style={{
          fontFamily: S.serif,
          fontSize: 46,
          fontWeight: 700,
          lineHeight: 1.1,
          color: S.dark,
          marginBottom: 18,
          maxWidth: 480,
        }}
      >
        Uniformes que fazem a diferença
      </h1>
      <p
        style={{
          fontSize: 15,
          color: "#666",
          fontWeight: 300,
          marginBottom: 32,
          lineHeight: 1.7,
        }}
      >
        Qualidade, identidade e conforto.
      </p>
      <button
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: S.dark,
          color: "#fff",
          padding: "13px 26px",
          borderRadius: 8,
          fontSize: 14,
          border: "none",
          cursor: "pointer",
          fontFamily: S.sans,
        }}
      >
        Ver coleção
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}
