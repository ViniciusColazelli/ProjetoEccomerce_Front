// styles/theme.js
// Fonte única de verdade para cores, tipografia e formas

const border = "#e2e2e2";

export const S = {
  // cores base
  gold: "#8B6914",
  dark: "#111111",
  muted: "#999999",
  soft: "#666666",
  faint: "#bbbbbb",
  white: "#ffffff",
  border,
  heroBg: "#F2EFE8",
  pageBg: "#FAFAF7",
  hoverBg: "#f5f5f5",
  disabled: "#555555",
  danger: "#c0392b",

  // cores semânticas (feedback)
  error: { bg: "#fff5f5", border: "#fca5a5", text: "#b91c1c" },
  success: { bg: "#f0fdf4", border: "#86efac", text: "#166534" },

  // tipografia
  serif: "Georgia, serif",
  sans: "'DM Sans', Arial, sans-serif",

  // forma
  line: `0.5px solid ${border}`,
  radius: { sm: 8, md: 10, lg: 12, xl: 14 },
  shadow: {
    menu: "0 8px 24px rgba(0,0,0,0.10)",
    popup: "0 8px 32px rgba(0,0,0,0.12)",
    lift: "0 8px 24px rgba(0,0,0,0.15)",
  },
};

// Estilos de texto reutilizáveis. Use com spread: {...T.eyebrow, marginBottom: 14}
export const T = {
  eyebrow: {
    fontSize: 11,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: S.gold,
    fontWeight: 400,
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: S.muted,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  popupTitle: {
    fontFamily: S.serif,
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 14,
  },
  cardTitle: {
    fontFamily: S.serif,
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 20,
  },
};
