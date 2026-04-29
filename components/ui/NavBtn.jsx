// components/ui/NavBtn.jsx
import { useState } from "react";
import { S } from "../../styles/theme";

export default function NavBtn({ onClick, badge, children }) {
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#f5f5f5" : "#fff",
        border: `0.5px solid ${S.border}`,
        borderRadius: 10,
        padding: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.15s",
      }}
    >
      {children}
      {badge && (
        <span
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            width: 7,
            height: 7,
            background: "#c0392b",
            borderRadius: "50%",
          }}
        />
      )}
    </button>
  );
}
