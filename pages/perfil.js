// pages/perfil.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getPerfilCliente, atualizarCliente, trocarSenha } from "../lib/api";
import { useAuthContext } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { S } from "../styles/theme";
import { usePopup } from "../hooks/usePopup";
import SearchPopup from "../components/popups/SearchPopup";
import CartPopup from "../components/popups/CartPopup";
import AuthPopup from "../components/popups/AuthPopup";

export default function Perfil() {
  const router = useRouter();
  const { usuario, logout } = useAuthContext();
  const { toggle, close, isOpen } = usePopup();

  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Formulário de atualização
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [erroUpdate, setErroUpdate] = useState(null);
  const [sucessoUpdate, setSucessoUpdate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  // Formulário de troca de senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [erroSenha, setErroSenha] = useState(null);
  const [sucessoSenha, setSucessoSenha] = useState(false);
  const [loadingSenha, setLoadingSenha] = useState(false);

  // Redireciona para home se não estiver logado
  useEffect(() => {
    if (!usuario) {
      router.push("/");
    }
  }, [usuario]);

  // Busca perfil do cliente via sessão do back-end
  useEffect(() => {
    if (!usuario) return;

    async function carregarPerfil() {
      try {
        const data = await getPerfilCliente();
        setPerfil(data);
        setNome(data.nome ?? "");
        setEmail(data.email ?? "");
      } catch (e) {
        // Sessão expirada — desloga e redireciona
        logout();
        router.push("/");
      } finally {
        setCarregando(false);
      }
    }

    carregarPerfil();
  }, [usuario]);

  // ── Atualizar dados ───────────────────────────────────────────
  async function handleAtualizar(e) {
    e.preventDefault();
    setLoadingUpdate(true);
    setErroUpdate(null);
    setSucessoUpdate(false);
    try {
      await atualizarCliente({ nome, email });
      setSucessoUpdate(true);
    } catch (e) {
      setErroUpdate(e.message);
    } finally {
      setLoadingUpdate(false);
    }
  }

  // ── Trocar senha ──────────────────────────────────────────────
  async function handleTrocarSenha(e) {
    e.preventDefault();
    setLoadingSenha(true);
    setErroSenha(null);
    setSucessoSenha(false);
    try {
      await trocarSenha({ senhaAtual, novaSenha });
      setSucessoSenha(true);
      setSenhaAtual("");
      setNovaSenha("");
    } catch (e) {
      setErroSenha(e.message);
    } finally {
      setLoadingSenha(false);
    }
  }

  // ── Estilos ───────────────────────────────────────────────────
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: `0.5px solid ${S.border}`,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: S.sans,
    marginBottom: 12,
    boxSizing: "border-box",
    outline: "none",
    background: "#fff",
  };

  const btnStyle = (loading) => ({
    padding: "11px 24px",
    background: loading ? "#555" : S.dark,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontFamily: S.sans,
    cursor: loading ? "not-allowed" : "pointer",
    transition: "background 0.15s",
  });

  if (!usuario || carregando) {
    return (
      <div
        style={{
          fontFamily: S.sans,
          background: S.pageBg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: S.muted, fontSize: 14 }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: S.sans,
        background: S.pageBg,
        minHeight: "100vh",
        color: S.dark,
      }}
    >
      {isOpen("search") && <SearchPopup onClose={close} />}
      {isOpen("auth") && <AuthPopup onClose={close} />}
      {isOpen("cart") && <CartPopup onClose={close} />}

      <Navbar
        onSearch={() => toggle("search")}
        onAuth={() => toggle("auth")}
        onCart={() => toggle("cart")}
      />

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "52px 24px" }}>
        {/* Header da página */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: S.gold,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: S.serif,
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {usuario.nome?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1
                style={{
                  fontFamily: S.serif,
                  fontSize: 24,
                  fontWeight: 700,
                  color: S.dark,
                }}
              >
                {perfil?.nome ?? usuario.nome}
              </h1>
              <p style={{ fontSize: 13, color: S.muted, marginTop: 2 }}>
                {perfil?.email ?? ""}
              </p>
            </div>
          </div>
        </div>

        {/* ── Seção: Atualizar dados ── */}
        <section
          style={{
            background: "#fff",
            borderRadius: 14,
            border: `0.5px solid ${S.border}`,
            padding: "28px 32px",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontFamily: S.serif,
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            Dados pessoais
          </h2>

          <form onSubmit={handleAtualizar}>
            <label
              style={{
                fontSize: 12,
                color: S.muted,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Nome completo
            </label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{ ...inputStyle, marginTop: 6 }}
              disabled={loadingUpdate}
            />

            <label
              style={{
                fontSize: 12,
                color: S.muted,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ ...inputStyle, marginTop: 6 }}
              disabled={loadingUpdate}
            />

            {erroUpdate && (
              <div
                style={{
                  background: "#fff5f5",
                  border: "0.5px solid #fca5a5",
                  borderRadius: 8,
                  padding: "8px 12px",
                  marginBottom: 12,
                  fontSize: 13,
                  color: "#b91c1c",
                }}
              >
                {erroUpdate}
              </div>
            )}

            {sucessoUpdate && (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "0.5px solid #86efac",
                  borderRadius: 8,
                  padding: "8px 12px",
                  marginBottom: 12,
                  fontSize: 13,
                  color: "#166534",
                }}
              >
                Dados atualizados com sucesso!
              </div>
            )}

            <button
              type="submit"
              style={btnStyle(loadingUpdate)}
              disabled={loadingUpdate}
            >
              {loadingUpdate ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        </section>

        {/* ── Seção: Trocar senha ── */}
        <section
          style={{
            background: "#fff",
            borderRadius: 14,
            border: `0.5px solid ${S.border}`,
            padding: "28px 32px",
          }}
        >
          <h2
            style={{
              fontFamily: S.serif,
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            Alterar senha
          </h2>

          <form onSubmit={handleTrocarSenha}>
            <label
              style={{
                fontSize: 12,
                color: S.muted,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Senha atual
            </label>
            <input
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              style={{ ...inputStyle, marginTop: 6 }}
              disabled={loadingSenha}
            />

            <label
              style={{
                fontSize: 12,
                color: S.muted,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Nova senha
            </label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              style={{ ...inputStyle, marginTop: 6 }}
              disabled={loadingSenha}
            />

            {erroSenha && (
              <div
                style={{
                  background: "#fff5f5",
                  border: "0.5px solid #fca5a5",
                  borderRadius: 8,
                  padding: "8px 12px",
                  marginBottom: 12,
                  fontSize: 13,
                  color: "#b91c1c",
                }}
              >
                {erroSenha}
              </div>
            )}

            {sucessoSenha && (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "0.5px solid #86efac",
                  borderRadius: 8,
                  padding: "8px 12px",
                  marginBottom: 12,
                  fontSize: 13,
                  color: "#166534",
                }}
              >
                Senha alterada com sucesso!
              </div>
            )}

            <button
              type="submit"
              style={btnStyle(loadingSenha)}
              disabled={loadingSenha}
            >
              {loadingSenha ? "Alterando..." : "Alterar senha"}
            </button>
          </form>
        </section>
        {/* Botão de logout */}
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          style={{
            marginTop: 14,
            padding: "8px 20px",
            background: "none",
            border: `0.5px solid #fca5a5`,
            borderRadius: 8,
            fontSize: 13,
            fontFamily: S.sans,
            color: "#c0392b",
            cursor: "pointer",
          }}
        >
          Sair da conta
        </button>
      </main>

      <Footer />
    </div>
  );
}
