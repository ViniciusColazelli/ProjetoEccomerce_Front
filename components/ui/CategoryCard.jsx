// components/ui/CategoryCard.jsx
import { useState } from "react";

export default function CategoryCard({ cat }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        aspectRatio: "3/4",
        transform: hov ? "translateY(-4px)" : "none",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.15)" : "none",
      }}
    >
      <img
        src={cat.img}
        alt={cat.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          filter: hov ? "brightness(0.8)" : "brightness(0.95)",
          transition: "filter 0.2s",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "14px",
          background: "rgba(17,17,17,0.82)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#fff",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
          }}
        >
          {cat.name}
        </span>
        <span
          style={{
            width: 28,
            height: 28,
            background: "#fff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111"
            strokeWidth="2.2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  );
}
