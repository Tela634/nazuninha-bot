const { ermp3, ermp4 } = require('@er-npm/scraper');
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
        const downloadRes = await ermp3(url);
        if (!downloadRes) return { ok: false, msg: 'Erro ao iniciar o download.' };
        return { ok: true, criador: 'Hiudy', url: downloadRes.url };
    } catch (e) {
        return { ok: false, msg: 'Ocorreu um erro ao realizar o download.' };
    };
};

module.exports = { search, mp3 };