const { ermp3, ermp4 } = require('@er-npm/scraper');
const yts = require('yt-search');
const axios = require('axios');

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

async function dl(url) {
    try {
        const response = await axios.post('https://api.safestytmp3.cc/2a605414919b15b07f9aa53b7e7f3352/init/73,108,56,66,121,56,74,95,67,45,78,70,101,69,120,116,61,105,115,63,103,104,103,100,113,80,79,74,54,45,101,47,101,98,46,117,116,117,111,121,47,47,58,115,112,116,116,104/d2d1383e9af154b4ea44e3ffb634c151/', {
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                url: url,
                data: 'iuuqr;..xntut/cd.d,7KNQpefif>rh<uyDdGO,B^K9xC9mH',
                format: '0',
                referer: 'https://ogmp3.com/',
                mp3Quality: '128',
                mp4Quality: '720',
                userTimeZone: '180',
            }
        });
        if (!response.data || !response.data.i) {
            return { ok: false, msg: 'Erro ao obter o link de download.' };
        }
        const downloadUrl = `https://api.safestytmp3.cc/${response.data.i}/download/6b71cbcg,d4b2,5973,8bdb,6e7g58b8d12c/14e25ccd7cdd4c1a6b16a8171aa56386/`;
        return { ok: true, criador: 'Hiudy', url: downloadUrl };
    } catch (e) {
        return { ok: false, msg: 'Ocorreu um erro ao realizar o download.' };
    }
};

module.exports = { search, mp3: dl };