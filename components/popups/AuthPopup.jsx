// components/popups/AuthPopup.jsx
import { useState } from "react";
import { useRouter } from "next/router";
import Popup from "./Popup";
import { S } from "../../styles/theme";
import { useAuthContext } from "../../context/AuthContext";

export default function AuthPopup({ onClose }) {
  const router = useRouter();

  const [tab, setTab] = useState("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [msgSucesso, setMsgSucesso] = useState("");

  const { loading, erro, cadastrar, login, limparErro } = useAuthContext();

  function trocarAba(novaAba) {
    setTab(novaAba);
    setNome("");
    setEmail("");
    setSenha("");
    setSucesso(false);
    limparErro();
  }

  async function handleSubmit() {
    if (tab === "cadastro") {
      const ok = await cadastrar({ nome, email, senha });
      if (ok) {
        // Cadastro bem-sucedido — mostra mensagem e redireciona para login
        setMsgSucesso("Cadastro realizado! Redirecionando para o login...");
        setSucesso(true);
        setTimeout(() => {
          onClose();
          trocarAba("login"); // muda para aba de login
        }, 2000);
      }
    } else {
      const ok = await login({ email, senha });
      if (ok) {
        setMsgSucesso("Login realizado com sucesso!");
        setSucesso(true);
        setTimeout(() => onClose(), 1500);
      }
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    border: `0.5px solid ${S.border}`,
    borderRadius: 8,
    fontSize: 13,
    fontFamily: S.sans,
    marginBottom: 10,
    boxSizing: "border-box",
    outline: "none",
  };

  // ── Tela de sucesso ───────────────────────────────────────────
  if (sucesso) {
    return (
      <Popup onClose={onClose}>
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#e6f4ea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2e7d32"
              strokeWidth="2.5"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p
            style={{
              fontFamily: S.serif,
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            {tab === "cadastro" ? "Cadastro realizado!" : "Bem-vindo de volta!"}
          </p>
          <p style={{ fontSize: 13, color: S.muted }}>{msgSucesso}</p>
        </div>
      </Popup>
    );
  }

  // ── Formulário ─────────────────────────────────────────────────
  return (
    <Popup onClose={onClose}>
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {["login", "cadastro"].map((t) => (
          <button
            key={t}
            onClick={() => trocarAba(t)}
            style={{
              padding: "6px 14px",
              borderRadius: 7,
              fontSize: 13,
              cursor: "pointer",
              border: "none",
              fontFamily: S.sans,
              background: tab === t ? S.dark : "transparent",
              color: tab === t ? "#fff" : S.muted,
            }}
          >
            {t === "login" ? "Entrar" : "Cadastrar"}
          </button>
        ))}
      </div>

      <p
        style={{
          fontFamily: S.serif,
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 14,
        }}
      >
        {tab === "login" ? "Bem-vindo de volta" : "Criar conta"}
      </p>

      {tab === "cadastro" && (
        <input
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={inputStyle}
          disabled={loading}
        />
      )}
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        style={inputStyle}
        disabled={loading}
      />

      {erro && (
        <div
          style={{
            background: "#fff5f5",
            border: "0.5px solid #fca5a5",
            borderRadius: 8,
            padding: "8px 12px",
            marginBottom: 10,
            fontSize: 12,
            color: "#b91c1c",
          }}
        >
          {erro}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%",
          padding: 11,
          background: loading ? "#555" : S.dark,
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 14,
          fontFamily: S.sans,
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: 4,
        }}
      >
        {loading ? "Aguarde..." : tab === "login" ? "Entrar" : "Criar conta"}
      </button>

      {tab === "login" && (
        <p
          style={{
            fontSize: 12,
            color: S.muted,
            textAlign: "center",
            marginTop: 12,
            cursor: "pointer",
          }}
        >
          Esqueceu a senha?{" "}
          <span style={{ color: S.dark, textDecoration: "underline" }}>
            Recuperar
          </span>
        </p>
      )}
    </Popup>
  );
}
