// components/admin/OpcoesProduto.jsx
// Tamanhos, cores e personalizações de um produto: cadastrar, editar, ativar/desativar e remover.
// Só personalização tem preço adicional (a API e o banco recusam nas outras).
import { useState } from "react";
import {
  registrarOpcao,
  atualizarOpcao,
  removerOpcao,
  alterarStatusOpcao,
} from "lib/produtosAdmin";
import { formatarPreco } from "lib/formatar";
import { useAsyncAction } from "hooks/useAsyncAction";
import Card from "components/ui/Card";
import Campo from "components/ui/Campo";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import Button from "components/ui/Button";
import Modal from "components/ui/Modal";
import Confirmar from "components/ui/Confirmar";
import Alert from "components/ui/Alert";
import Icon from "components/ui/Icon";
import { BadgeAtivo } from "components/ui/StatusBadge";
import { S, T } from "styles/theme";

const TIPOS = [
  { valor: "Tamanho", rotulo: "Tamanho", plural: "Tamanhos" },
  { valor: "Cor", rotulo: "Cor", plural: "Cores" },
  {
    valor: "Personalizacao",
    rotulo: "Personalização",
    plural: "Personalizações",
  },
];

const temPreco = (tipo) => tipo === "Personalizacao";
const paraNumero = (texto) => Number(String(texto).replace(",", ".")) || 0;

const botaoTexto = {
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  fontFamily: S.sans,
  fontSize: 13,
};

function NovaOpcao({ produtoId, onCriada }) {
  const [tipo, setTipo] = useState("Tamanho");
  const [valor, setValor] = useState("");
  const [preco, setPreco] = useState("");
  const { run, loading, erro } = useAsyncAction((dados) =>
    registrarOpcao(produtoId, dados),
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await run({
      tipo,
      valor: valor.trim(),
      precoAdicional: temPreco(tipo) ? paraNumero(preco) : 0,
    });
    if (ok) {
      setValor("");
      setPreco("");
      onCriada();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bu-filtros" style={{ marginBottom: 8 }}>
        <Campo label="Tipo">
          <Select
            opcoes={TIPOS}
            value={tipo}
            disabled={loading}
            onChange={(e) => setTipo(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </Campo>
        <Campo label="Valor" style={{ flexGrow: 2 }}>
          <Input
            placeholder={
              tipo === "Tamanho"
                ? "Ex.: M"
                : tipo === "Cor"
                  ? "Ex.: Azul marinho"
                  : "Ex.: Bordado com nome"
            }
            value={valor}
            maxLength={200}
            required
            disabled={loading}
            onChange={(e) => setValor(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </Campo>
        {temPreco(tipo) && (
          <Campo label="Preço adicional (R$)">
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              value={preco}
              disabled={loading}
              onChange={(e) => setPreco(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </Campo>
        )}
        <div style={{ flex: "0 0 auto" }}>
          <Button type="submit" loading={loading}>
            <Icon name="plus" size={16} color={S.white} stroke={2} />
            Adicionar
          </Button>
        </div>
      </div>
      <Alert>{erro}</Alert>
    </form>
  );
}

function EditarOpcao({ produtoId, opcao, onClose, onSalva }) {
  const [valor, setValor] = useState(opcao.valor);
  const [preco, setPreco] = useState(String(opcao.precoAdicional));
  const { run, loading, erro } = useAsyncAction((dados) =>
    atualizarOpcao(produtoId, opcao.id, dados),
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await run({
      valor: valor.trim(),
      precoAdicional: temPreco(opcao.tipo) ? paraNumero(preco) : 0,
    });
    if (ok) {
      onSalva();
      onClose();
    }
  }

  return (
    <Modal titulo="Editar opção" onClose={() => !loading && onClose()}>
      <form onSubmit={handleSubmit}>
        <Campo label="Valor">
          <Input
            value={valor}
            maxLength={200}
            required
            autoFocus
            disabled={loading}
            onChange={(e) => setValor(e.target.value)}
          />
        </Campo>
        {temPreco(opcao.tipo) && (
          <Campo label="Preço adicional (R$)">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={preco}
              disabled={loading}
              onChange={(e) => setPreco(e.target.value)}
            />
          </Campo>
        )}
        <Alert>{erro}</Alert>
        <Button type="submit" loading={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Modal>
  );
}

export default function OpcoesProduto({ produto, onMudou }) {
  const [editando, setEditando] = useState(null);
  const [removendo, setRemovendo] = useState(null);
  const [ocupado, setOcupado] = useState(null);
  const [erro, setErro] = useState(null);

  async function alternar(opcao) {
    setOcupado(opcao.id);
    setErro(null);
    try {
      await alterarStatusOpcao(produto.id, opcao.id, { ativo: !opcao.ativo });
      onMudou();
    } catch (e) {
      setErro(e.message);
    } finally {
      setOcupado(null);
    }
  }

  return (
    <Card titulo="Opções" id="opcoes">
      <p
        style={{
          fontSize: 13,
          color: S.muted,
          marginTop: -10,
          marginBottom: 18,
        }}
      >
        Tamanhos e cores formam as variantes. Personalizações são extras que o
        cliente pode marcar e somam ao preço.
      </p>

      <NovaOpcao produtoId={produto.id} onCriada={onMudou} />
      <Alert>{erro}</Alert>

      {TIPOS.map(({ valor: tipo, plural }) => {
        const opcoes = produto.opcoes.filter((o) => o.tipo === tipo);
        return (
          <div key={tipo} style={{ marginTop: 22 }}>
            <p style={{ ...T.label, marginBottom: 8 }}>
              {plural} ({opcoes.length})
            </p>
            {opcoes.length === 0 ? (
              <p style={{ fontSize: 13, color: S.muted }}>
                Nenhuma cadastrada.
              </p>
            ) : (
              <div className="bu-table-wrap">
                <table className="bu-table">
                  <tbody>
                    {opcoes.map((o) => (
                      <tr key={o.id}>
                        <td style={{ fontWeight: 500 }}>{o.valor}</td>
                        {temPreco(tipo) && (
                          <td className="bu-num" style={{ color: S.soft }}>
                            + {formatarPreco(o.precoAdicional)}
                          </td>
                        )}
                        <td style={{ width: 90 }}>
                          <BadgeAtivo ativo={o.ativo} />
                        </td>
                        <td className="bu-num" style={{ width: 220 }}>
                          <div
                            style={{
                              display: "flex",
                              gap: 14,
                              justifyContent: "flex-end",
                              alignItems: "center",
                            }}
                          >
                            <button
                              type="button"
                              className="bu-text-link"
                              style={botaoTexto}
                              onClick={() => setEditando(o)}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="bu-text-link"
                              style={botaoTexto}
                              disabled={ocupado === o.id}
                              onClick={() => alternar(o)}
                            >
                              {ocupado === o.id
                                ? "..."
                                : o.ativo
                                  ? "Desativar"
                                  : "Ativar"}
                            </button>
                            <button
                              type="button"
                              className="bu-icon-btn"
                              aria-label={`Remover ${o.valor}`}
                              onClick={() => setRemovendo(o)}
                            >
                              <Icon name="trash" size={16} color={S.danger} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}

      {editando && (
        <EditarOpcao
          produtoId={produto.id}
          opcao={editando}
          onClose={() => setEditando(null)}
          onSalva={onMudou}
        />
      )}

      {removendo && (
        <Confirmar
          titulo={`Remover "${removendo.valor}"?`}
          textoConfirmar="Remover"
          onConfirmar={async () => {
            await removerOpcao(produto.id, removendo.id);
            onMudou();
          }}
          onClose={() => setRemovendo(null)}
        >
          Só dá para remover opções que nunca foram usadas em variantes ou
          pedidos. Se já foi usada, desative em vez de remover.
        </Confirmar>
      )}
    </Card>
  );
}
