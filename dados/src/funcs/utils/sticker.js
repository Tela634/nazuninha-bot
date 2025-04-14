// Sistema de Criação de Stickers
// Criado por Hiudy
// Mantenha os créditos, por favor! <3

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const webp = require('node-webpmux');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');

/**
 * Gera um nome de arquivo temporário com extensão
 * @param {string} extension - Extensão do arquivo
 * @returns {string} - Caminho do arquivo temporário
 */
function generateTempFileName(extension) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  const tmpDir = path.join(__dirname, '../../../database/tmp');

  if (!fsSync.existsSync(tmpDir)) {
    fsSync.mkdirSync(tmpDir, { recursive: true });
  }

  return path.join(tmpDir, `${timestamp}_${random}.${extension}`);
}

/**
 * Obtém buffer de uma URL
 * @param {string} url - URL da mídia
 * @returns {Promise<Buffer>} - Buffer da mídia
 */
async function getBuffer(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 10000
    });
    return Buffer.from(response.data);
  } catch (error) {
    throw new Error(`Erro ao baixar mídia: ${error.message}`);
  }
}

/**
 * Converte mídia para formato WebP
 * @param {Buffer} media - Buffer da mídia
 * @param {boolean} isVideo - Indica se é vídeo
 * @returns {Promise<Buffer>} - Buffer WebP
 */
async function convertToWebp(media, isVideo = false) {
  const tmpFileIn = generateTempFileName(isVideo ? 'mp4' : 'jpg');
  const tmpFileOut = generateTempFileName('webp');

  try {
    await fs.writeFile(tmpFileIn, media);

    await new Promise((resolve, reject) => {
      ffmpeg(tmpFileIn)
        .outputOptions([
          '-vcodec', 'libwebp',
          '-vf', 'scale=min(320,iw):min(320,ih):force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split [a][b];[a] palettegen=reserve_transparent=on:transparency_color=ffffff [p];[b][p] paletteuse',
          '-loop', '0',
          '-lossless', '0',
          '-compression_level', '6',
          '-qscale', '75',
          '-preset', 'default'
        ])
        .toFormat('webp')
        .on('error', (err) => {
          console.error('Erro ao converter para WebP:', err.message);
          reject(err);
        })
        .on('end', resolve)
        .save(tmpFileOut);
    });

    return await fs.readFile(tmpFileOut);
  } catch (error) {
    throw new Error(`Erro na conversão para WebP: ${error.message}`);
  } finally {
    await Promise.all([
      fs.unlink(tmpFileIn).catch(err => console.error('Erro ao excluir tmpIn:', err.message)),
      fs.unlink(tmpFileOut).catch(err => console.error('Erro ao excluir tmpOut:', err.message))
    ]);
  }
}

/**
 * Adiciona metadados EXIF ao sticker WebP
 * @param {Buffer} media - Buffer da mídia
 * @param {Object} metadata - Metadados (packname, author)
 * @param {boolean} isVideo - Indica se é vídeo
 * @param {boolean} rename - Indica se já é WebP
 * @returns {Promise<Buffer>} - Buffer com EXIF
 */
async function writeExif(media, metadata, isVideo = false, rename = false) {
  const wMedia = rename ? media : await convertToWebp(media, isVideo);
  const tmpFileIn = generateTempFileName('webp');
  const tmpFileOut = generateTempFileName('webp');

  try {
    await fs.writeFile(tmpFileIn, wMedia);

    if (!metadata.packname && !metadata.author) {
      return wMedia; // Retorna sem EXIF se não houver metadados
    }

    const img = new webp.Image();
    const json = {
      'sticker-pack-id': 'https://github.com/hiudyy',
      'sticker-pack-name': metadata.packname || 'NazuninhaBot',
      'sticker-pack-publisher': metadata.author || 'Hiudy',
      'emojis': metadata.emojis || ['😊']
    };

    const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
    const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8');
    const exif = Buffer.concat([exifAttr, jsonBuff]);
    exif.writeUIntLE(jsonBuff.length, 14, 4);

    await img.load(tmpFileIn);
    img.exif = exif;
    await img.save(tmpFileOut);

    return await fs.readFile(tmpFileOut);
  } catch (error) {
    console.error('Erro ao adicionar EXIF:', error.message);
    throw new Error('Erro ao processar metadados');
  } finally {
    await Promise.all([
      fs.unlink(tmpFileIn).catch(err => console.error('Erro ao excluir tmpIn:', err.message)),
      fs.unlink(tmpFileOut).catch(err => console.error('Erro ao excluir tmpOut:', err.message))
    ]);
  }
}

/**
 * Envia um sticker para um chat
 * @param {Object} nazu - Cliente do bot
 * @param {string} jid - ID do chat
 * @param {Object} options - Opções do sticker
 * @param {Object} context - Contexto adicional (ex.: quoted)
 * @returns {Promise<Buffer>} - Buffer do sticker enviado
 */
async function sendSticker(nazu, jid, { sticker: path, type = 'image', packname = '', author = '', rename = false }, { quoted } = {}) {
  try {
    // Validação de entrada
    if (!nazu || !jid) {
      throw new Error('Cliente ou ID do chat não fornecidos');
    }
    if (!['image', 'video'].includes(type)) {
      throw new Error('Tipo de mídia deve ser "image" ou "video"');
    }

    // Obtém buffer da mídia
    let buff;
    if (Buffer.isBuffer(path)) {
      buff = path;
    } else if (/^data:.*?\/.*?;base64,/i.test(path)) {
      buff = Buffer.from(path.split(',')[1], 'base64');
    } else if (fsSync.existsSync(path)) {
      buff = await fs.readFile(path);
    } else if (typeof path === 'object' && path.url) {
      buff = await getBuffer(path.url);
    } else {
      throw new Error('Mídia inválida fornecida');
    }

    // Processa o sticker
    const buffer = packname || author
      ? await writeExif(buff, { packname, author }, type === 'video', rename)
      : await convertToWebp(buff, type === 'video');

    // Envia o sticker
    await nazu.sendMessage(jid, {
      sticker: buffer,
      ...(packname || author ? { packname, author } : {})
    }, { quoted });

    return buffer;
  } catch (error) {
    console.error('Erro em sendSticker:', error.message);
    throw new Error(`Erro ao enviar sticker: ${error.message}`);
  }
}

module.exports = { sendSticker };