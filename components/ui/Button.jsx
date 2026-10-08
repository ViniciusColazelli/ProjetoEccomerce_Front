// components/ui/Button.jsx
// Com `href` vira um link (Next Link) com a mesma aparência do botão
import Link from "next/link";
import { S } from "styles/theme";

const variants = {
  primary: { background: S.primary, color: S.white, border: "none" },
  outline: {
    background: "transparent",
    color: S.dark,
    border: `1px solid ${S.dark}`,
  },
  light: { background: S.white, color: S.primary, border: "none" },
  danger: {
    background: "none",
    color: S.danger,
    border: `0.5px solid ${S.error.border}`,
  },
};

export default function Button({
  variant = "primary",
  full,
  loading,
  href,
  style,
  children,
  ...props
}) {
  const css = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "11px 24px",
    borderRadius: S.radius.sm,
    fontSize: 14,
    fontWeight: 500,
    fontFamily: S.sans,
    cursor: loading ? "not-allowed" : "pointer",
    width: full ? "100%" : undefined,
    ...variants[variant],
    ...(loading && { background: S.disabled }),
    ...style,
  };

  if (href) {
    return (
      <Link href={href} className="bu-btn" style={css} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      {...props}
      className="bu-btn"
      disabled={loading || props.disabled}
      style={css}
    >
      {children}
    </button>
  );
}
