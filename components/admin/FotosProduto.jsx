// components/admin/FotosProduto.jsx
// Fotos do produto: enviar (reduzidas no navegador), mudar a ordem e apagar.
// A primeira é a capa que aparece na vitrine, na busca e no carrinho.
import { useRef, useState } from "react";
import { enviarImagem, removerImagem, ordenarImagens } from "lib/produtosAdmin";
import { prepararFoto, TIPOS_ACEITOS, MAXIMO_FOTOS } from "lib/imagens";
import Card from "components/ui/Card";
import Button from "components/ui/Button";
import Alert from "components/ui/Alert";
import Confirmar from "components/ui/Confirmar";
import Icon from "components/ui/Icon";
import { Badge } from "components/ui/StatusBadge";
import { S } from "styles/theme";

function BotaoIcone({ label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      className="bu-icon-btn"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default function FotosProduto({ produto, onMudou }) {
  const imagens = produto.imagens ?? [];
  const vagas = MAXIMO_FOTOS - imagens.length;

  const [envio, setEnvio] = useState(null); // { atual, total, progresso }
  const [ocupado, setOcupado] = useState(false); // reordenando
  const [erros, setErros] = useState([]);
  const [apagando, setApagando] = useState(null); // foto à espera de confirmação
  const entrada = useRef(null);

  const travado = !!envio || ocupado;

  // Uma foto por vez: se uma falhar, as outras seguem, e os erros aparecem juntos no fim
  async function handleEscolher(e) {
    const arquivos = [...e.target.files];
    e.target.value = ""; // deixa escolher o mesmo arquivo de novo
    if (arquivos.length === 0) return;

    const fila = arquivos.slice(0, vagas);
    const falhas =
      arquivos.length > vagas
        ? [
            `Só cabem mais ${vagas} ${vagas === 1 ? "foto" : "fotos"} (máximo de ${MAXIMO_FOTOS}). As demais foram ignoradas.`,
          ]
        : [];
    setErros([]);

    for (let i = 0; i < fila.length; i++) {
      setEnvio({ atual: i + 1, total: fila.length, progresso: 0 });
      try {
        const versoes = await prepararFoto(fila[i]);
        await enviarImagem(produto.id, versoes, {
          onUploadProgress: (ev) =>
            ev.total &&
            setEnvio((atual) => ({
              ...atual,
              progresso: Math.round((ev.loaded / ev.total) * 100),
            })),
        });
      } catch (erro) {
        falhas.push(`${fila[i].name}: ${erro.message}`);
      }
    }

    setEnvio(null);
    setErros(falhas);
    onMudou();
  }

  // A API recebe a lista completa na ordem nova
  async function mover(de, para) {
    const ids = imagens.map((foto) => foto.id);
    const [id] = ids.splice(de, 1);
    ids.splice(para, 0, id);

    setOcupado(true);
    setErros([]);
    try {
      await ordenarImagens(produto.id, ids);
      onMudou();
    } catch (erro) {
      setErros([erro.message]);
    } finally {
      setOcupado(false);
    }
  }

  return (
    <Card titulo="Fotos" id="fotos">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          marginTop: -10,
          marginBottom: 18,
        }}
      >
        <p style={{ fontSize: 13, color: S.muted, maxWidth: 520 }}>
          A primeira foto é a capa da vitrine. JPEG, PNG ou WebP, reduzidas
          automaticamente antes do envio. {imagens.length} de {MAXIMO_FOTOS}.
        </p>

        <input
          ref={entrada}
          type="file"
          accept={TIPOS_ACEITOS.join(",")}
          multiple
          hidden
          onChange={handleEscolher}
        />
        <Button
          loading={!!envio}
          disabled={travado || vagas <= 0}
          onClick={() => entrada.current?.click()}
        >
          <Icon name="plus" size={16} color={S.white} stroke={2} />
          {envio
            ? `Enviando ${envio.atual} de ${envio.total} (${envio.progresso}%)`
            : "Adicionar fotos"}
        </Button>
      </div>

      <Alert>
        {erros.length > 0 && erros.map((erro) => <div key={erro}>{erro}</div>)}
      </Alert>

      {imagens.length === 0 ? (
        <p style={{ fontSize: 13, color: S.muted }}>
          Nenhuma foto ainda. Sem foto, a loja mostra o logo no lugar.
        </p>
      ) : (
        <ul className="bu-fotos-grid">
          {imagens.map((foto, i) => (
            <li key={foto.id} className="bu-foto">
              <div style={{ position: "relative" }}>
                <img
                  src={foto.urlMiniatura}
                  alt={`Foto ${i + 1} de ${produto.nome}`}
                  loading="lazy"
                  className="bu-foto-img"
                />
                {i === 0 && (
                  <span style={{ position: "absolute", top: 8, left: 8 }}>
                    <Badge bg={S.primary} color={S.white}>
                      Capa
                    </Badge>
                  </span>
                )}
              </div>
              <div className="bu-foto-acoes">
                <BotaoIcone
                  label="Mover para a esquerda"
                  disabled={travado || i === 0}
                  onClick={() => mover(i, i - 1)}
                >
                  <Icon
                    name="chevron"
                    size={16}
                    style={{ transform: "rotate(90deg)" }}
                  />
                </BotaoIcone>
                <BotaoIcone
                  label="Mover para a direita"
                  disabled={travado || i === imagens.length - 1}
                  onClick={() => mover(i, i + 1)}
                >
                  <Icon
                    name="chevron"
                    size={16}
                    style={{ transform: "rotate(-90deg)" }}
                  />
                </BotaoIcone>
                {i > 0 && (
                  <button
                    type="button"
                    className="bu-text-link"
                    disabled={travado}
                    onClick={() => mover(i, 0)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      fontFamily: S.sans,
                      fontSize: 12,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Usar como capa
                  </button>
                )}
                <span style={{ flex: 1 }} />
                <BotaoIcone
                  label="Apagar foto"
                  disabled={travado}
                  onClick={() => setApagando(foto)}
                >
                  <Icon name="trash" size={16} color={S.danger} />
                </BotaoIcone>
              </div>
            </li>
          ))}
        </ul>
      )}

      {apagando && (
        <Confirmar
          titulo="Apagar esta foto?"
          textoConfirmar="Apagar"
          onConfirmar={async () => {
            await removerImagem(produto.id, apagando.id);
            onMudou();
          }}
          onClose={() => setApagando(null)}
        >
          <img
            src={apagando.urlMiniatura}
            alt=""
            style={{
              width: 120,
              aspectRatio: "4 / 5",
              objectFit: "cover",
              borderRadius: S.radius.md,
              display: "block",
              marginBottom: 12,
            }}
          />
          A foto sai da loja e o arquivo é apagado de vez.
          {imagens[0]?.id === apagando.id &&
            imagens.length > 1 &&
            " A próxima foto vira a capa."}
        </Confirmar>
      )}
    </Card>
  );
}
