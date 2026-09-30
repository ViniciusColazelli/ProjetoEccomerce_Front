// components/ui/Icon.jsx
// Todos os SVGs do projeto num lugar só

const paths = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="22" y2="22" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </>
  ),
  bag: (
    <>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </>
  ),
  arrow: <path d="M5 12h14M12 5l7 7-7 7" />,
  chevron: <path d="M6 9l6 6 6-6" />,
  check: <path d="M5 13l4 4L19 7" />,
};

export default function Icon({
  name,
  size = 19,
  color = "#333",
  stroke = 1.6,
  style,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      style={style}
    >
      {paths[name]}
    </svg>
  );
}
