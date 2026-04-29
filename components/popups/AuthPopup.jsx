// components/popups/AuthPopup.jsx
import { useState } from "react";
import Popup from "./Popup";
import { S } from "../../styles/theme";
import { useAuth } from "../../hooks/useAuth";

export default function AuthPopup({ onClose }) {
  const [tab, setTab] = useState("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const { loading, erro, cadastrar, login, limparErro } = useAuth();

  // ── Trocar aba limpa os campos e erros ──────────────────────────
  function trocarAba(novaAba) {
    setTab(novaAba);
    setNome("");
    setEmail("");
    setSenha("");
    setSucesso(false);
    limparErro();
  }

  // ── Submit ──────────────────────────────────────────────────────
  async function handleSubmit() {
    let ok = false;

    if (tab === "cadastro") {
      ok = await cadastrar({ nome, email, senha });
    } else {
      ok = await login({ email, senha });
    }

    if (ok) {
      setSucesso(true);
      // Fecha o popup após 1.5s para o usuário ver a mensagem de sucesso
      setTimeout(() => onClose(), 1500);
    }
  }

  // ── Estilos compartilhados ──────────────────────────────────────
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
    background: "#fff",
    color: S.dark,
  };

  const btnStyle = {
    width: "100%",
    padding: "11px",
    background: loading ? "#555" : S.dark,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontFamily: S.sans,
    cursor: loading ? "not-allowed" : "pointer",
    transition: "background 0.15s",
    marginTop: 4,
  };

  // ── Tela de sucesso ─────────────────────────────────────────────
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
              color: S.dark,
              marginBottom: 6,
            }}
          >
            {tab === "cadastro" ? "Cadastro realizado!" : "Bem-vindo de volta!"}
          </p>
          <p style={{ fontSize: 13, color: S.muted }}>
            {tab === "cadastro"
              ? "Sua conta foi criada com sucesso."
              : "Login realizado com sucesso."}
          </p>
        </div>
      </Popup>
    );
  }

  // ── Formulário principal ────────────────────────────────────────
  return (
    <Popup onClose={onClose}>
      {/* Tabs */}
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
              transition: "background 0.15s",
            }}
          >
            {t === "login" ? "Entrar" : "Cadastrar"}
          </button>
        ))}
      </div>

      {/* Título */}
      <p
        style={{
          fontFamily: S.serif,
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 14,
          color: S.dark,
        }}
      >
        {tab === "login" ? "Bem-vindo de volta" : "Criar conta"}
      </p>

      {/* Campo nome (só no cadastro) */}
      {tab === "cadastro" && (
        <input
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={inputStyle}
          disabled={loading}
        />
      )}

      {/* Email */}
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
        disabled={loading}
      />

      {/* Senha */}
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        style={inputStyle}
        disabled={loading}
      />

      {/* Mensagem de erro da API */}
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

      {/* Botão de submit */}
      <button style={btnStyle} onClick={handleSubmit} disabled={loading}>
        {loading ? "Aguarde..." : tab === "login" ? "Entrar" : "Criar conta"}
      </button>

      {/* Link esqueci a senha */}
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
