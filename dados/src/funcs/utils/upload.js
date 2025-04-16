/**
 * Sistema de Upload Otimizado (GoFile)
 * Desenvolvido por Hiudy
 * Versão: 2.1.0
 */

const axios = require('axios');
const FormData = require('form-data');

// Configurações
const CONFIG = {
  FILE_TYPES: {
    IMAGES: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
    VIDEOS: ['mp4', 'avi', 'mkv', 'mov', 'webm'],
    AUDIO: ['mp3', 'wav', 'ogg', 'm4a'],
    DOCUMENTS: ['pdf', 'doc', 'docx', 'xlsx', 'pptx', 'zip', 'rar', '7z', 'iso', 'apk']
  },
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  DEFAULT_TIMEOUT: 30000
};

const mimeCache = new Map();

class FileTypeDetector {
  static SIGNATURES = {
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
    '00000018': { ext: 'mp4', mime: 'video/mp4' },
    '1a45dfa3': { ext: 'mkv', mime: 'video/x-matroska' },
    '49443303': { ext: 'mp3', mime: 'audio/mpeg' },
    '4f676753': { ext: 'ogg', mime: 'audio/ogg' },
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
    const hash = buffer.toString('hex', 0, 16);
    if (mimeCache.has(hash)) return mimeCache.get(hash);

    const sig = buffer.toString('hex', 0, 4);
    let result = this.SIGNATURES[sig] || { ext: '.', mime: 'application/octet-stream' };
    if (typeof result.handler === 'function') result = result.handler(buffer);

    mimeCache.set(hash, result);
    return result;
  }
}

/**
 * Upload principal via GoFile
 * @param {Buffer} buffer
 * @param {boolean} deleteAfter10Min
 * @returns {Promise<string>}
 */
async function upload(buffer, deleteAfter10Min = false) {
  if (!Buffer.isBuffer(buffer)) throw new Error('Input deve ser um Buffer');
  if (buffer.length > CONFIG.MAX_FILE_SIZE) throw new Error('Arquivo excede o tamanho máximo permitido.');

  const { ext, mime } = FileTypeDetector.detect(buffer);
  const timestamp = Date.now();
  const rand = Math.random().toString(36).slice(2, 7);
  const filename = `${timestamp}_${rand}.${ext}`;

  let folder = 'outros';
  if (CONFIG.FILE_TYPES.IMAGES.includes(ext)) folder = 'fotos';
  else if (CONFIG.FILE_TYPES.VIDEOS.includes(ext)) folder = 'videos';
  else if (CONFIG.FILE_TYPES.AUDIO.includes(ext)) folder = 'audios';
  else if (CONFIG.FILE_TYPES.DOCUMENTS.includes(ext)) folder = 'documentos';

  try {
    const serverRes = await axios.get('https://api.gofile.io/getServer');
    const server = serverRes.data.data.server;

    const form = new FormData();
    form.append('file', buffer, filename);
    if (deleteAfter10Min) form.append('expire', '600');

    const uploadRes = await axios.post(`https://${server}.gofile.io/uploadFile`, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: CONFIG.DEFAULT_TIMEOUT
    });

    if (uploadRes.data.status !== 'ok') throw new Error('Falha no upload');

    return uploadRes.data.data.downloadPage;
  } catch (err) {
    console.error('Erro no upload:', err.message);
    throw err;
  }
}

module.exports = upload;