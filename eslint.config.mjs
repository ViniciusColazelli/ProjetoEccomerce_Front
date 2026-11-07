// eslint.config.mjs
// Regras do Next (React, hooks, acessibilidade e Core Web Vitals). A formatação fica com o
// Prettier: o eslint-config-prettier desliga as regras de estilo que brigariam com ele.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  ...nextVitals,
  prettier,
  {
    rules: {
      // Hoje as únicas imagens são o logo (PNG pequeno) e as fotos de categoria, que são
      // placeholders de outro site: o next/image gastaria a cota de otimização da Vercel sem
      // ganho real. Rever quando os produtos tiverem fotos próprias.
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([".next/**", "node_modules/**"]),
]);
