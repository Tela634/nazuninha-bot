/**
 * Sistema de Upload Otimizado
 * Desenvolvido por Hiudy
 * Versão: 2.0.0
 */

const axios = require('axios');
const crypto = require('crypto');

// Configurações
const CONFIG = {
  GITHUB: {
    REPO: 'nazuninha/uploads',
    API_URL: 'https://api.github.com/repos',
    TOKEN: `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`,
    HEADERS: {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    }
  },
  FILE_TYPES: {
    IMAGES: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
    VIDEOS: ['mp4', 'avi', 'mkv', 'mov', 'webm'],
    AUDIO: ['mp3', 'wav', 'ogg', 'm4a'],
    DOCUMENTS: ['pdf', 'doc', 'docx', 'xlsx', 'pptx', 'zip', 'rar', '7z', 'iso', 'apk']
  },
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  DEFAULT_TIMEOUT: 30000 // 30 segundos
};

// Cache para otimizar performance
const uploadCache = new Map();
const mimeCache = new Map();

/**
 * Sistema de detecção de tipo de arquivo otimizado
 */
class FileTypeDetector {
  static SIGNATURES = {
    // Imagens
    'ffd8ff': { ext: 'jpg', mime: 'image/jpeg' },
    '89504e47': { ext: 'png', mime: 'image/png' },
    '47494638': { ext: 'gif', mime: 'image/gif' },
    '52494646': {
      handler: (buffer) => {
        const riffType = buffer.toString('hex', 8, 12);
        const types = {
          '57415645': { ext: 'wav', mime: 'audio/wav' },
          '41564920': { ext: 'avi', mime: 'video/x-msvideo' },
          '57454250': { ext: 'webp', mime: 'image/webp' }
        };
        return types[riffType] || { ext: 'unknown', mime: 'application/octet-stream' };
      }
    },
    // Vídeos
    '000001ba': { ext: 'mpg', mime: 'video/mpeg' },
    '000001b3': { ext: 'mpg', mime: 'video/mpeg' },
    '00000018': { ext: 'mp4', mime: 'video/mp4' },
    '00000020': { ext: 'mp4', mime: 'video/mp4' },
    '1a45dfa3': { ext: 'mkv', mime: 'video/x-matroska' },
    // Áudio
    '49443303': { ext: 'mp3', mime: 'audio/mpeg' },
    '4f676753': { ext: 'ogg', mime: 'audio/ogg' },
    // Documentos
    '504b0304': {
      handler: (buffer) => {
        const zipType = buffer.toString('hex', 30, 34);
        const types = {
          '6d6c20': { ext: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
          '786c20': { ext: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
          '707020': { ext: 'pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }
        };
        if (types[zipType]) return types[zipType];
        return buffer.toString('utf8', 0, 8).includes('META-INF/') 
          ? { ext: 'apk', mime: 'application/vnd.android.package-archive' }
          : { ext: 'zip', mime: 'application/zip' };
      }
    },
    '25504446': { ext: 'pdf', mime: 'application/pdf' }
  };

  static detect(buffer) {
    const hash = crypto.createHash('md5').update(buffer.slice(0, 100)).digest('hex');
    if (mimeCache.has(hash)) {
      return mimeCache.get(hash);
    }

    const hex = buffer.toString('hex', 0, 4);
    let result = this.SIGNATURES[hex] || { ext: '.', mime: 'application/octet-stream' };

    if (typeof result.handler === 'function') {
      result = result.handler(buffer);
    }

    mimeCache.set(hash, result);
    return result;
  }
}

/**
 * Gerenciador de upload para GitHub
 */
class GitHubUploader {
  constructor() {
    if (!CONFIG.GITHUB.TOKEN) {
      throw new Error('GitHub token não configurado nas variáveis de ambiente');
    }
    this.headers = {
      ...CONFIG.GITHUB.HEADERS,
      'Authorization': `Bearer ${CONFIG.GITHUB.TOKEN}`
    };
  }

  async upload(buffer, filePath) {
    try {
      const base64Content = buffer.toString('base64');
      const response = await axios.put(
        `${CONFIG.GITHUB.API_URL}/${CONFIG.GITHUB.REPO}/contents/${filePath}`,
        {
          message: `Upload: ${filePath}`,
          content: base64Content
        },
        {
          headers: this.headers,
          timeout: CONFIG.DEFAULT_TIMEOUT
        }
      );
      return response.data.content;
    } catch (error) {
      throw new Error(`Erro no upload: ${error.message}`);
    }
  }

  async delete(filePath, sha) {
    try {
      await axios.delete(
        `${CONFIG.GITHUB.API_URL}/${CONFIG.GITHUB.REPO}/contents/${filePath}`,
        {
          headers: this.headers,
          data: {
            message: `Delete: ${filePath}`,
            sha
          }
        }
      );
    } catch (error) {
      console.error(`Erro ao deletar arquivo ${filePath}:`, error.message);
    }
  }
}

/**
 * Função principal de upload
 * @param {Buffer} buffer - Buffer do arquivo
 * @param {boolean} deleteAfter10Min - Se deve deletar após 10 minutos
 * @returns {Promise<string>} URL do arquivo
 */
async function upload(buffer, deleteAfter10Min = false) {
  try {
    // Validações
    if (!Buffer.isBuffer(buffer)) {
      throw new Error('Input deve ser um Buffer');
    }

    if (buffer.length > CONFIG.MAX_FILE_SIZE) {
      throw new Error(`Arquivo muito grande. Máximo: ${CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Detecta tipo do arquivo
    const { ext, mime } = FileTypeDetector.detect(buffer);

    // Gera nome único
    const timestamp = Date.now();
    const hash = crypto.createHash('md5').update(buffer).digest('hex').slice(0, 6);
    const fileName = `${timestamp}_${hash}.${ext}`;

    // Determina pasta
    let folder = 'outros';
    if (CONFIG.FILE_TYPES.IMAGES.includes(ext)) folder = 'fotos';
    else if (CONFIG.FILE_TYPES.VIDEOS.includes(ext)) folder = 'videos';
    else if (CONFIG.FILE_TYPES.AUDIO.includes(ext)) folder = 'audios';
    else if (CONFIG.FILE_TYPES.DOCUMENTS.includes(ext)) folder = 'documentos';

    const filePath = `${folder}/${fileName}`;

    // Upload
    const uploader = new GitHubUploader();
    const { download_url, sha } = await uploader.upload(buffer, filePath);

    // Configura deleção automática se necessário
    if (deleteAfter10Min) {
      setTimeout(() => {
        uploader.delete(filePath, sha);
      }, 10 * 60 * 1000);
    }

    return download_url;
  } catch (error) {
    console.error('Erro no upload:', error);
    throw error;
  }
}

module.exports = upload;
