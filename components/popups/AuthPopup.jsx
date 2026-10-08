// components/popups/AuthPopup.jsx
import { useState } from "react";
import Popup from "./Popup";
import Input from "components/ui/Input";
import Alert from "components/ui/Alert";
import Button from "components/ui/Button";
import Icon from "components/ui/Icon";
import { S, T } from "styles/theme";
import { useAuthContext } from "context/AuthContext";
import { useAsyncAction } from "hooks/useAsyncAction";
import { registrarCliente } from "lib/api";

const TABS = { login: "Entrar", cadastro: "Cadastrar" };
const VAZIO = { nome: "", email: "", senha: "" };

export default function AuthPopup({ onClose }) {
  const { login } = useAuthContext();
  const [tab, setTab] = useState("login");
  const [campos, setCampos] = useState(VAZIO);
  const { nome, email, senha } = campos;

  const entrar = useAsyncAction(login);
  const cadastrar = useAsyncAction(registrarCliente);
  const acao = tab === "login" ? entrar : cadastrar;

  const set = (campo) => (e) =>
    setCampos((c) => ({ ...c, [campo]: e.target.value }));

  function trocarAba(nova) {
    setTab(nova);
    setCampos(VAZIO);
    entrar.reset();
    cadastrar.reset();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const dados = tab === "login" ? { email, senha } : { nome, email, senha };
    const ok = await acao.run(dados);
    if (ok) {
      // login: fecha o popup; cadastro: volta para a aba de login
      setTimeout(tab === "login" ? onClose : () => trocarAba("login"), 1500);
    }
  }

  // ── Tela de sucesso ─────────────────────────────────────────
  if (acao.sucesso) {
    const cadastro = tab === "cadastro";
    return (
      <Popup onClose={onClose}>
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: S.success.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
            }}
          >
            <Icon name="check" size={24} color={S.success.text} stroke={2.5} />
          </div>
          <p style={{ ...T.popupTitle, marginBottom: 6 }}>
            {cadastro ? "Cadastro realizado!" : "Bem-vindo de volta!"}
          </p>
          <p style={{ fontSize: 13, color: S.muted }}>
            {cadastro
              ? "Redirecionando para o login..."
              : "Login realizado com sucesso!"}
          </p>
        </div>
      </Popup>
    );
  }

  // ── Formulário ──────────────────────────────────────────────
  return (
    <Popup onClose={onClose}>
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {Object.entries(TABS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => trocarAba(key)}
            style={{
              padding: "6px 14px",
              borderRadius: 7,
              fontSize: 13,
              cursor: "pointer",
              border: "none",
              fontFamily: S.sans,
              background: tab === key ? S.primary : "transparent",
              color: tab === key ? S.white : S.muted,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <p style={T.popupTitle}>
        {tab === "login" ? "Bem-vindo de volta" : "Criar conta"}
      </p>

      <form onSubmit={handleSubmit}>
        {tab === "cadastro" && (
          <Input
            placeholder="Nome completo"
            value={nome}
            onChange={set("nome")}
            disabled={acao.loading}
          />
        )}
        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={set("email")}
          disabled={acao.loading}
        />
        <Input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={set("senha")}
          disabled={acao.loading}
        />

        <Alert>{acao.erro}</Alert>

        <Button type="submit" full loading={acao.loading}>
          {acao.loading
            ? "Aguarde..."
            : tab === "login"
              ? "Entrar"
              : "Criar conta"}
        </Button>
      </form>

      {tab === "login" && (
        <p
          style={{
            fontSize: 12,
            color: S.muted,
            textAlign: "center",
            marginTop: 12,
          }}
        >
          Esqueceu a senha?{" "}
          <span
            style={{
              color: S.dark,
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Recuperar
          </span>
        </p>
      )}
    </Popup>
  );
}
