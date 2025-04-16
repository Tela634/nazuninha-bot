/**
 * Sistema de Criação de Stickers Otimizado
 * Desenvolvido por Hiudy
 * Versão: 2.0.0
 */

const fs = require('fs').promises;
const fs2 = require('fs');
const path = require('path');
const webp = require('node-webpmux');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');

// Configurações
const CONFIG = {
  TMP_DIR: path.join(__dirname, '/../../../database/tmp'),
  MAX_SIZE: 2000000, // 2MB
  DEFAULT_QUALITY: 75,
  WEBP_OPTIONS: {
    preset: 'default',
    quality: 75,
    method: 4,
    exact: true
  },
  FFMPEG_OPTIONS: [
    '-vcodec', 'libwebp',
    '-vf', [
      "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15",
      "pad=320:320:-1:-1:color=white@0.0, split [a][b]",
      "[a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]",
      "[b][p] paletteuse"
    ].join(',')
  ]
};

// Cache para otimizar performance
const mediaCache = new Map();
const exifCache = new Map();

// Gerenciamento de arquivos temporários
class TempFileManager {
  static async init() {
    if (!fs2.existsSync(CONFIG.TMP_DIR)) {
      await fs.mkdir(CONFIG.TMP_DIR, { recursive: true });
    }
    // Limpa arquivos temporários antigos
    this.cleanup();
  }

  static async cleanup() {
    try {
      const files = await fs.readdir(CONFIG.TMP_DIR);
      const now = Date.now();
      for (const file of files) {
        const filePath = path.join(CONFIG.TMP_DIR, file);
        const stats = await fs.stat(filePath);
        // Remove arquivos mais antigos que 1 hora
        if (now - stats.mtimeMs > 3600000) {
          await fs.unlink(filePath);
        }
      }
    } catch (error) {
      console.error('Erro na limpeza de arquivos temporários:', error);
    }
  }

  static generateName(extension) {
    return path.join(
      CONFIG.TMP_DIR,
      `${Date.now()}_${Math.random().toString(36).substring(2)}.${extension}`
    );
  }
}

// Inicializa o sistema de arquivos temporários
TempFileManager.init();

// Utilitários
class MediaUtils {
  static async getBuffer(url) {
    if (mediaCache.has(url)) {
      return mediaCache.get(url);
    }
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        maxContentLength: CONFIG.MAX_SIZE
      });
      const buffer = Buffer.from(response.data, 'binary');
      mediaCache.set(url, buffer);
      return buffer;
    } catch (error) {
      throw new Error(`Erro ao baixar mídia: ${error.message}`);
    }
  }

  static async convertToWebp(media, isVideo = false) {
    const tmpFileOut = TempFileManager.generateName('webp');
    const tmpFileIn = TempFileManager.generateName(isVideo ? 'mp4' : 'jpg');

    try {
      await fs.writeFile(tmpFileIn, media);

      await new Promise((resolve, reject) => {
        ffmpeg(tmpFileIn)
          .outputOptions(CONFIG.FFMPEG_OPTIONS)
          .toFormat('webp')
          .on('error', reject)
          .on('end', resolve)
          .save(tmpFileOut);
      });

      const buffer = await fs.readFile(tmpFileOut);
      return buffer;
    } finally {
      // Limpa arquivos temporários
      await Promise.all([
        fs.unlink(tmpFileIn).catch(() => {}),
        fs.unlink(tmpFileOut).catch(() => {})
      ]);
    }
  }

  static async writeExif(media, metadata, isVideo = false, rename = false) {
    const exifKey = JSON.stringify(metadata);
    if (exifCache.has(exifKey)) {
      return exifCache.get(exifKey);
    }

    const wMedia = rename ? media : await this.convertToWebp(media, isVideo);
    const tmpFileIn = TempFileManager.generateName('webp');
    const tmpFileOut = TempFileManager.generateName('webp');

    try {
      await fs.writeFile(tmpFileIn, wMedia);

      if (metadata.packname || metadata.author) {
        const img = new webp.Image();
        const json = {
          'sticker-pack-id': 'https://github.com/hiudyy',
          'sticker-pack-name': metadata.packname,
          'sticker-pack-publisher': metadata.author,
          'emojis': ['NazuninhaBot']
        };

        const exifAttr = Buffer.from([
          0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00,
          0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x16, 0x00, 0x00, 0x00
        ]);
        const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8');
        const exif = Buffer.concat([exifAttr, jsonBuff]);
        exif.writeUIntLE(jsonBuff.length, 14, 4);

        await img.load(tmpFileIn);
        img.exif = exif;
        await img.save(tmpFileOut);

        const buffer = await fs.readFile(tmpFileOut);
        exifCache.set(exifKey, buffer);
        return buffer;
      }

      return wMedia;
    } catch (error) {
      throw new Error(`Erro ao processar EXIF: ${error.message}`);
    } finally {
      // Limpa arquivos temporários
      await Promise.all([
        fs.unlink(tmpFileIn).catch(() => {}),
        fs.unlink(tmpFileOut).catch(() => {})
      ]);
    }
  }
}

// Função principal de envio de sticker
async function sendSticker(nazu, jid, options, quoted = {}) {
  const { sticker: path, type = 'image', packname = '', author = '', rename = false } = options;

  if (!['image', 'video'].includes(type)) {
    throw new Error('Tipo de mídia inválido. Use "image" ou "video".');
  }

  try {
    // Obtém o buffer da mídia
    let buff;
    if (Buffer.isBuffer(path)) {
      buff = path;
    } else if (/^data:.*?\/.*?;base64,/i.test(path)) {
      buff = Buffer.from(path.split`,`[1], 'base64');
    } else if (fs2.existsSync(path)) {
      buff = await fs.readFile(path);
    } else if (path.url) {
      buff = await MediaUtils.getBuffer(path.url);
    } else {
      throw new Error('Formato de entrada inválido');
    }

    // Verifica tamanho
    if (buff.length > CONFIG.MAX_SIZE) {
      throw new Error('Arquivo muito grande. Máximo: 2MB');
    }

    // Processa o sticker
    const buffer = await MediaUtils.writeExif(
      buff,
      { packname, author },
      type === 'video',
      rename
    );

    // Envia o sticker
    await nazu.sendMessage(jid, {
      sticker: buffer,
      ...(packname || author ? { packname, author } : {})
    }, { quoted });

    return buffer;
  } catch (error) {
    console.error('Erro ao criar sticker:', error);
    throw error;
  }
}

// Limpa caches periodicamente
setInterval(() => {
  mediaCache.clear();
  exifCache.clear();
}, 3600000); // 1 hora

module.exports = { sendSticker };
