// components/home/Hero.jsx
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import { S, T } from "../../styles/theme";

export default function Hero() {
  return (
    <section style={{ background: S.heroBg, padding: "64px 40px 80px" }}>
      <p style={{ ...T.eyebrow, letterSpacing: "0.26em", marginBottom: 14 }}>
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
          color: S.soft,
          fontWeight: 300,
          marginBottom: 32,
          lineHeight: 1.7,
        }}
      >
        Qualidade, identidade e conforto.
      </p>
      <Button style={{ padding: "13px 26px" }}>
        Ver coleção
        <Icon name="arrow" size={14} color={S.white} stroke={2} />
      </Button>
    </section>
  );
}
