// lib/imagens.js
// Reduz as fotos no navegador antes do envio: a API recebe arquivos pequenos (sem pesar no
// Render nem no limite de tamanho de requisição da Vercel) e a loja já mostra no tamanho certo.

export const TIPOS_ACEITOS = ["image/jpeg", "image/png", "image/webp"];

// Mesmos limites da API (EnviarImagemUseCase)
export const MAXIMO_FOTOS = 8;
const LIMITE_FOTO = 3 * 1024 * 1024;
const LIMITE_MINIATURA = 1 * 1024 * 1024;

// Lado maior de cada versão, em pixels
const LADO_FOTO = 1600;
const LADO_MINIATURA = 480;

// Gera { imagem, miniatura } em WebP (ou JPEG, se o navegador não gerar WebP).
// Lança Error com mensagem para o usuário quando o arquivo não serve.
export async function prepararFoto(arquivo) {
  if (!TIPOS_ACEITOS.includes(arquivo.type))
    throw new Error(
      `"${arquivo.name}" não é JPEG, PNG ou WebP. Fotos do iPhone (HEIC) precisam ser convertidas antes.`,
    );

  let bitmap;
  try {
    // respeita a orientação da câmera (EXIF): a foto não sai deitada
    bitmap = await createImageBitmap(arquivo, {
      imageOrientation: "from-image",
    });
  } catch {
    throw new Error(`Não foi possível abrir "${arquivo.name}" como imagem.`);
  }

  try {
    const imagem = await reduzir(bitmap, LADO_FOTO, LIMITE_FOTO);
    const miniatura = await reduzir(bitmap, LADO_MINIATURA, LIMITE_MINIATURA);
    return { imagem, miniatura };
  } finally {
    bitmap.close();
  }
}

// Redesenha num canvas com o lado maior em `lado` (nunca aumenta a foto) e baixa a qualidade
// até caber no limite
async function reduzir(bitmap, lado, limite) {
  const escala = Math.min(1, lado / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);

  const contexto = canvas.getContext("2d");
  contexto.fillStyle = "#ffffff"; // PNG com fundo transparente fica branco, como na loja
  contexto.fillRect(0, 0, canvas.width, canvas.height);
  contexto.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  for (const qualidade of [0.85, 0.75, 0.6, 0.45]) {
    const blob = await paraBlob(canvas, qualidade);
    if (blob.size <= limite) return blob;
  }
  throw new Error("A foto continua grande demais mesmo reduzida. Tente outra.");
}

async function paraBlob(canvas, qualidade) {
  const webp = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/webp", qualidade),
  );
  // navegador sem WebP devolve PNG: aí vai JPEG, que é bem menor
  if (webp?.type === "image/webp") return webp;
  return new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", qualidade),
  );
}
