// components/ui/Logo.jsx
export default function Logo({ height }) {
  return (
    <img
      src="/logo.png"
      alt="Belíssima Uniformes"
      style={{ height, width: "auto", objectFit: "contain", display: "block" }}
    />
  );
}
