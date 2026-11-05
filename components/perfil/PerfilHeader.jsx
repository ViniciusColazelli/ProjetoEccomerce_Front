// components/perfil/PerfilHeader.jsx
import Avatar from "components/ui/Avatar";
import { S, T } from "styles/theme";

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
        <h1 style={{ ...T.titulo, fontSize: 24, color: S.dark }}>{nome}</h1>
        <p style={{ fontSize: 13, color: S.muted, marginTop: 2 }}>{email}</p>
      </div>
    </div>
  );
}
