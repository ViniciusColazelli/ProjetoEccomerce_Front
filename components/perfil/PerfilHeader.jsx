// components/perfil/PerfilHeader.jsx
import Avatar from "../ui/Avatar";
import { S } from "../../styles/theme";

export default function PerfilHeader({ nome, email }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 40,
      }}
    >
      <Avatar nome={nome} size={52} />
      <div>
        <h1
          style={{
            fontFamily: S.serif,
            fontSize: 24,
            fontWeight: 700,
            color: S.dark,
          }}
        >
          {nome}
        </h1>
        <p style={{ fontSize: 13, color: S.muted, marginTop: 2 }}>{email}</p>
      </div>
    </div>
  );
}
