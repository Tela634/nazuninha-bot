// Sistema de Upload
// Sistema único, diferente de qualquer outro bot
// Criador: Hiudy
// Caso for usar, deixe os créditos por favor! <3

const axios = require('axios');

/**
 * Detecta o tipo de arquivo a partir do buffer
 * @param {Buffer} buffer - Buffer do arquivo
 * @returns {Object} - Extensão e MIME type
 */
function getFileTypeFromBuffer(buffer) {
  const signatures = {
    // Imagens
    '89504e47': { ext: 'png', mime: 'image/png' },
    'ffd8ff': { ext: 'jpg', mime: 'image/jpeg' },
    '47494638': { ext: 'gif', mime: 'image/gif' },
    '52494646': (buffer) => {
      const riffType = buffer.toString('hex', 8, 12);
      return {
        '57454250': { ext: 'webp', mime: 'image/webp' },
        '41564920': { ext: 'avi', mime: 'video/x-msvideo' }
      }[riffType] || { ext: 'unknown', mime: 'application/octet-stream' };
    },
    // Vídeos
    '00000018': { ext: 'mp4', mime: 'video/mp4' },
    '00000020': { ext: 'mp4', mime: 'video/mp4' },
    '1a45dfa3': { ext: 'mkv', mime: 'video/x-matroska' },
    // Áudios
    '49443303': { ext: 'mp3', mime: 'audio/mpeg' },
    '4f676753': { ext: 'ogg', mime: 'audio/ogg' },
    '52494646': { ext: 'wav', mime: 'audio/wav' }, // Sobrescreve apenas se não for WebP/AVI
    // Documentos
    '25504446': { ext: 'pdf', mime: 'application/pdf' },
    '504b0304': (buffer) => {
      const zipType = buffer.toString('hex', 30, 34);
      return {
        '6d6c20': { ext: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
        '786c20': { ext: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        '707020': { ext: 'pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }
      }[zipType] || (buffer.toString('utf8', 0, 8).includes('META-INF/') ? { ext: 'apk', mime: 'application/vnd.android.package-archive' } : { ext: 'zip', mime: 'application/zip' });
    },
    // Outros
    '52617221': { ext: 'rar', mime: 'application/x-rar-compressed' },
    '377abcaf': { ext: '7z', mime: 'application/x-7z-compressed' }
  };

  const header = buffer.toString('hex', 0, 4);
  const signature = signatures[header.slice(0, 6)] || signatures[header];

  if (typeof signature === 'function') {
    return signature(buffer);
  }

  return signature || { ext: 'bin', mime: 'application/octet-stream' };
}

/**
 * Faz upload de um arquivo para o repositório GitHub
 * @param {Buffer} buffer - Buffer do arquivo
 * @param {boolean} [deleteAfter10Min=false] - Excluir após 10 minutos
 * @returns {Promise<Object>} - Resultado do upload
 */
async function upload(buffer, deleteAfter10Min = false) {
  try {
    // Validação de entrada
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
      return { ok: false, msg: 'Buffer inválido ou vazio' };
    }

    // Detecta tipo de arquivo
    const { ext, mime } = getFileTypeFromBuffer(buffer);
    const randomFileName = `${Date.now()}_${Math.floor(Math.random() * 1000000)}.${ext}`;

    // Define pasta com base no tipo
    const folders = {
      image: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
      video: ['mp4', 'avi', 'mkv'],
      audio: ['mp3', 'wav', 'ogg'],
      document: ['pdf', 'docx', 'xlsx', 'pptx', 'zip', 'rar', '7z', 'apk']
    };

    let folder = 'outros';
    if (folders.image.includes(ext)) folder = 'fotos';
    else if (folders.video.includes(ext)) folder = 'videos';
    else if (folders.audio.includes(ext)) folder = 'audios';
    else if (folders.document.includes(ext)) folder = 'documentos';

    const filePath = `${folder}/${randomFileName}`;

    // Configuração da requisição
    const githubToken = process.env.GITHUB_TOKEN || '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';
    const config = {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      timeout: 10000
    };

    // Faz upload
    const base64Content = buffer.toString('base64');
    const uploadResponse = await axios.put(
      `https://api.github.com/repos/nazuninha/uploads/contents/${filePath}`,
      {
        message: `Uploading ${randomFileName}`,
        content: base64Content
      },
      config
    );

    const downloadUrl = uploadResponse.data.content?.download_url;
    if (!downloadUrl) {
      return { ok: false, msg: 'Falha ao obter URL de download' };
    }

    // Agenda exclusão se solicitado
    if (deleteAfter10Min) {
      setTimeout(async () => {
        try {
          await axios.delete(
            `https://api.github.com/repos/nazuninha/uploads/contents/${filePath}`,
            {
              ...config,
              data: {
                message: `Deleting ${randomFileName} after 10 minutes`,
                sha: uploadResponse.data.content.sha
              }
            }
          );
          console.log(`Arquivo ${randomFileName} deletado após 10 minutos.`);
        } catch (error) {
          console.error('Erro ao excluir arquivo:', error.message);
        }
      }, 8 * 60 * 1000); // 8 minutos para margem de segurança
    }

    return {
      ok: true,
      criador: 'Hiudy',
      url: downloadUrl,
      type: mime,
      filename: randomFileName
    };
  } catch (error) {
    console.error('Erro em upload:', error.message);
    return {
      ok: false,
      msg: error.code === 'ECONNABORTED' ? 'Tempo de requisição excedido' :
           error.response?.status === 401 ? 'Autenticação inválida' :
           error.response?.status === 404 ? 'Repositório não encontrado' :
           'Erro ao fazer upload'
    };
  }
}

module.exports = upload;