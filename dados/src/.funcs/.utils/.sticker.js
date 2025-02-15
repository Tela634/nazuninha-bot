const fs = require('fs').promises;
const fs2 = require('fs');
const path = require("path");
const webp = require("node-webpmux");
const axios = require('axios'); // Para substituir a função getBuffer

// Função para gerar um nome de arquivo temporário único
const generateTempFileName = (extension) => {
    const timestamp = Date.now(); // Usa o timestamp atual
    const random = Math.floor(Math.random() * 1000000); // Número aleatório
    if (!fs2.existsSync(__dirname+'/../../../database/tmp')) fs2.mkdirSync(__dirname+'/../../../database/tmp', { recursive: true });
    return path.join(__dirname, '/../../../database/tmp', `${timestamp}_${random}.${extension}`);
};

// Função para obter buffer de uma URL
async function getBuffer(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
}

// Função genérica para converter mídia para WebP
async function convertToWebp(media, isVideo = false) {
    const tmpFileOut = generateTempFileName('webp');
    const tmpFileIn = generateTempFileName(isVideo ? 'mp4' : 'jpg');

    await fs.writeFile(tmpFileIn, media);

    await new Promise((resolve, reject) => {
        const ff = require('fluent-ffmpeg')(tmpFileIn)
            .on("error", reject)
            .on("end", () => resolve(true))
            .addOutputOptions([
                "-vcodec", "libwebp",
                "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
                ...(isVideo ? ["-loop", "0", "-ss", "00:00:00", "-t", "00:00:05", "-preset", "default", "-an", "-vsync", "0"] : [])
            ])
            .toFormat("webp")
            .save(tmpFileOut);
    });

    const buff = await fs.readFile(tmpFileOut);
    await fs.unlink(tmpFileOut);
    await fs.unlink(tmpFileIn);
    return buff;
}

// Função para adicionar metadados EXIF
async function writeExif(media, metadata, isVideo = false) {
    const wMedia = await convertToWebp(media, isVideo);
    const tmpFileIn = generateTempFileName('webp');
    const tmpFileOut = generateTempFileName('webp');

    await fs.writeFile(tmpFileIn, wMedia);

    if (metadata.packname || metadata.author) {
        const img = new webp.Image();
        const json = {
            "sticker-pack-id": `https://github.com/DikaArdnt/Hisoka-Morou`,
            "sticker-pack-name": metadata.packname,
            "sticker-pack-publisher": metadata.author,
            "emojis": metadata.categories ? metadata.categories : [""]
        };
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
        const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
        const exif = Buffer.concat([exifAttr, jsonBuff]);
        exif.writeUIntLE(jsonBuff.length, 14, 4);

        await img.load(tmpFileIn);
        await fs.unlink(tmpFileIn);
        img.exif = exif;
        await img.save(tmpFileOut);
        return tmpFileOut;
    }
}

// Função principal para enviar sticker
const sendSticker = async (jid, { sticker: path, type = 'image', packname = '', author = '' }, { quoted } = {}) => {
    if (!type || !['image', 'video'].includes(type)) {
        throw new Error('O tipo de mídia deve ser "image" ou "video".');
    }

    let buff = Buffer.isBuffer(path) ? path :
        /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') :
        path.url ? await getBuffer(path.url) :
        fs.existsSync(path) ? await fs.readFile(path) : Buffer.alloc(0);

    let buffer;
    if (packname || author) {
        buffer = await writeExif(buff, { packname, author }, type === 'video');
    } else {
        buffer = await convertToWebp(buff, type === 'video');
    }

    await nazu.sendMessage(nazu, jid, { sticker: { url: buffer }, ...(packname || author ? { packname, author } : {}) }, { quoted });
    return buffer;
};

module.exports = {
    sendSticker
};