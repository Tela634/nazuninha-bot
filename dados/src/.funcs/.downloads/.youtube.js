const yts = require('yt-search');
const axios = require('axios');

async function search(name) {
    try {
        const searchRes = await yts(name);
        if (!searchRes.videos || searchRes.videos.length === 0) {
            return { ok: false, msg: 'Não encontrei nenhuma música.' };
        }
        return { ok: true, criador: 'Hiudy', data: searchRes.videos[0] };
    } catch (e) {
        return { ok: false, msg: 'Ocorreu um erro ao realizar a pesquisa.' };
    }
}

function getYouTubeID(input) {
    if (!input) return null;
    try {
        const url = new URL(input);
        const validDomains = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'youtube.co'];
        if (!validDomains.some(domain => url.hostname.endsWith(domain))) return input;
        if (url.hostname === 'youtu.be') return url.pathname.substring(1);

        if (url.hostname.includes('youtube.com')) {
            if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/')[2];
            if (url.searchParams.has('v')) return url.searchParams.get('v');
            if (url.pathname === '/watch') return null;
            if (url.pathname.startsWith('/channel/')) return null;
            if (url.pathname.startsWith('/user/')) return null;
            if (url.pathname.startsWith('/playlist') && url.searchParams.has('list')) return url.searchParams.get('list');
        }
    } catch (e) {
        return input;
    }
    return input;
}

function getVideoUrl(ajsjj) {
    const idzz = getYouTubeID(ajsjj);
    return `https://www.youtube.com/watch?v=${idzz}`;
}

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
const formatVideo = ['360', '480', '720', '1080', '1440', '4k'];

async function cekProgress(id) {
    const config = {
        method: 'GET',
        url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Connection': 'keep-alive',
            'X-Requested-With': 'XMLHttpRequest'
        }
    };

    while (true) {
        const response = await axios.request(config);
        if (response.data && response.data.success && response.data.progress === 1000) {
            return response.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

async function ytdlv2(url, format) {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
        return { ok: false, msg: 'Formato inválido.' };
    }

    const config = {
        method: 'GET',
        url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Connection': 'keep-alive',
            'X-Requested-With': 'XMLHttpRequest'
        }
    };

    try {
        const response = await axios.request(config);

        if (response.data && response.data.success) {
            const { id, title, info } = response.data;
            const { image } = info;

            const downloadUrl = await cekProgress(id);

            return {
                ok: true,
                id: id,
                image: image,
                title: title,
                downloadUrl: downloadUrl
            };
        } else {
            return { ok: false, msg: 'Falha ao buscar detalhes do vídeo.' };
        }
    } catch (error) {
        return { ok: false, msg: 'Erro ao processar a requisição.' };
    }
}

async function mp3(input) {
    const url = getVideoUrl(input);
    const format = 'm4a';

    try {
        const ytdlResponse = await ytdlv2(url, format);
        if (ytdlResponse.ok && ytdlResponse.downloadUrl) {
            return { ok: true, url: ytdlResponse.downloadUrl };
        } else {
            return { ok: false, msg: ytdlResponse.msg || 'Falha ao obter o link de download.' };
        }
    } catch (error) {
        return { ok: false, msg: 'Erro ao processar o vídeo.' };
    }
}

async function mp4(input, quality = '360') {
    const url = getVideoUrl(input);

    try {
        const ytdlResponse = await ytdlv2(url, quality);
        if (ytdlResponse.ok && ytdlResponse.downloadUrl) {
            return { ok: true, url: ytdlResponse.downloadUrl };
        } else {
            return { ok: false, msg: ytdlResponse.msg || 'Falha ao obter o link de download.' };
        }
    } catch (error) {
        return { ok: false, msg: 'Erro ao processar o vídeo.' };
    }
}

module.exports = { search, mp3, mp4 };