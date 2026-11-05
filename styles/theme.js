// styles/theme.js
// Fonte única de verdade para cores, tipografia e formas

const border = "#e2e2e2";

export const S = {
  // cores da marca (logo Belíssima Uniformes)
  primary: "#A52021",
  secondary: "#647C84",
  secondaryDark: "#46585E",

  // cores base
  dark: "#111111",
  muted: "#999999",
  soft: "#666666",
  white: "#ffffff",
  border,
  pageBg: "#FAFBFB",
  imageBg: "#f2f2f2", // fundo das fotos enquanto carregam
  disabled: "#555555",
  danger: "#c0392b",

  // cores semânticas (feedback)
  error: { bg: "#fff5f5", border: "#fca5a5", text: "#b91c1c" },
  success: { bg: "#f0fdf4", border: "#86efac", text: "#166534" },

  // tipografia
  serif: "'Playfair Display', Georgia, serif",
  sans: "'DM Sans', Arial, sans-serif",

  // forma
  line: `0.5px solid ${border}`,
  radius: { sm: 8, md: 10, lg: 12, xl: 14 },
  shadow: {
    menu: "0 8px 24px rgba(0,0,0,0.10)",
    popup: "0 8px 32px rgba(0,0,0,0.12)",
  },
};

// Base de todo título com a fonte serifada
const titulo = { fontFamily: S.serif, fontWeight: 700 };

// Estilos de texto reutilizáveis. Use com spread: {...T.eyebrow, marginBottom: 14}
export const T = {
  titulo,
  eyebrow: {
    fontSize: 11,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: S.primary,
    fontWeight: 400,
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: S.muted,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  popupTitle: { ...titulo, fontSize: 16, marginBottom: 14 },
  cardTitle: { ...titulo, fontSize: 18, marginBottom: 20 },
};
