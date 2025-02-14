const { search: ytSearch, ytmp3 } = require('@vreden/youtube_scraper');
const yts = require('yt-search');

async function search(name) {
    try {
        const searchRes = await yts(name);
        if (!searchRes.videos || searchRes.videos.length === 0) {
            return { ok: false, msg: 'Não encontrei nenhuma música.' };
        };
        return { ok: true, criador: 'Hiudy', data: searchRes.videos[0] };
    } catch (e) {
        return { ok: false, msg: 'Ocorreu um erro ao realizar a pesquisa.' };
    };
};

async function mp3(url) {
    try {
        const downloadRes = await ytmp3(url);
        if (!downloadRes) return { ok: false, msg: 'Erro ao iniciar o download.' };
        return { ok: true, criador: 'Hiudy', url: downloadRes.download.url };
    } catch (e) {
        return { ok: false, msg: 'Ocorreu um erro ao realizar o download.' };
    };
};

module.exports = { search, mp3 };