/**
 * Upload com verificação de tipo + File.io (sem token)
 * Desenvolvido por Hiudy
 * Versão: simplificada
 */

const axios = require('axios');
const FormData = require('form-data');

// Configuração de tipos
const FILE_TYPES = {
  IMAGES: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
  VIDEOS: ['mp4', 'avi', 'mkv', 'mov', 'webm'],
  AUDIO: ['mp3', 'wav', 'ogg', 'm4a'],
  DOCUMENTS: ['pdf', 'doc', 'docx', 'xlsx', 'pptx', 'zip', 'rar', '7z', 'iso', 'apk']
};

// Máximo: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const mimeCache = new Map();

class FileTypeDetector {
  static SIGNATURES = {
    'ffd8ff': { ext: 'jpg', mime: 'image/jpeg' },
    '89504e47': { ext: 'png', mime: 'image/png' },
    '47494638': { ext: 'gif', mime: 'image/gif' },
    '52494646': buffer => {
      const riffType = buffer.toString('hex', 8, 12);
      const types = {
        '57415645': { ext: 'wav', mime: 'audio/wav' },
        '41564920': { ext: 'avi', mime: 'video/x-msvideo' },
        '57454250': { ext: 'webp', mime: 'image/webp' }
      };
      return types[riffType] || { ext: 'unknown', mime: 'application/octet-stream' };
    },
    '00000018': { ext: 'mp4', mime: 'video/mp4' },
    '1a45dfa3': { ext: 'mkv', mime: 'video/x-matroska' },
    '49443303': { ext: 'mp3', mime: 'audio/mpeg' },
    '4f676753': { ext: 'ogg', mime: 'audio/ogg' },
    '25504446': { ext: 'pdf', mime: 'application/pdf' },
    '504b0304': buffer => {
      const zipType = buffer.toString('hex', 30, 34);
      if (zipType === '6d6c20') return { ext: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
      if (zipType === '786c20') return { ext: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
      if (zipType === '707020') return { ext: 'pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' };
      if (buffer.toString('utf8', 0, 8).includes('META-INF/')) return { ext: 'apk', mime: 'application/vnd.android.package-archive' };
      return { ext: 'zip', mime: 'application/zip' };
    }
  };

  static detect(buffer) {
    const sig = buffer.toString('hex', 0, 4);
    const entry = this.SIGNATURES[sig];
    if (!entry) return { ext: 'bin', mime: 'application/octet-stream' };

    if (typeof entry === 'function') return entry(buffer);
    return entry;
  }
}

async function upload(buffer, deleteAfter10Min = false) {
  if (!Buffer.isBuffer(buffer)) throw new Error('Arquivo inválido.');
  if (buffer.length > MAX_FILE_SIZE) throw new Error('Arquivo excede 50MB.');

  const { ext, mime } = FileTypeDetector.detect(buffer);

  // Gera nome aleatório sem usar crypto
  const fileName = `arquivo_${Date.now()}.${ext}`;

  const form = new FormData();
  form.append('file', buffer, fileName);

  const response = await axios.post(`https://file.io?expires=${deleteAfter10Min ? '10m' : '14d'}`, form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  });

 console.log(response);
  if (!response.data.success) throw new Error('Falha no upload');

  return {
    url: response.data.link,
    name: fileName,
    sizeMB: (buffer.length / 1024 / 1024).toFixed(2),
    mime,
    ext
  };
}

module.exports = upload;