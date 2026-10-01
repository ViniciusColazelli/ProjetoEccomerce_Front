// components/ui/CategoryCard.jsx
import { useState } from "react";
import { S } from "styles/theme";
import Icon from "./Icon";

export default function CategoryCard({ cat }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: S.radius.lg,
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        aspectRatio: "3/4",
        transform: hov ? "translateY(-4px)" : "none",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: hov ? S.shadow.lift : "none",
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
          padding: 14,
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
            color: S.white,
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
            background: S.white,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name="arrow" size={13} color={S.dark} stroke={2.2} />
        </span>
      </div>
    </div>
  );
}
