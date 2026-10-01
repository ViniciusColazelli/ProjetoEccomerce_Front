// components/ui/Button.jsx
import { S } from "styles/theme";

const variants = {
  primary: { background: S.dark, color: S.white, border: "none" },
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
  style,
  children,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "11px 24px",
        borderRadius: S.radius.sm,
        fontSize: 14,
        fontFamily: S.sans,
        cursor: loading ? "not-allowed" : "pointer",
        transition: "background 0.15s",
        width: full ? "100%" : undefined,
        ...variants[variant],
        ...(loading && { background: S.disabled }),
        ...style,
      }}
    >
      {children}
    </button>
  );
}
