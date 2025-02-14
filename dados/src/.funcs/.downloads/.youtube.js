const axios = require('axios');

async function search(name) {
    try {
        const searchRes = await axios.get(`https://api.paxsenix.biz.id/yt/search?q=${encodeURIComponent(name)}`);
        if (!searchRes.data.results?.length) return { ok: false, msg: 'Não encontrei nenhuma música.' };
        return { ok: true, criador: 'Hiudy', data: searchRes.data.results[0] };
    } catch (e) {
        return { ok: false, msg: 'Ocorreu um erro ao realizar a pesquisa.' };
    }
}

async function mp3(url) {
    try {/*
        const downloadRes = await axios.get(`https://p.oceansaver.in/ajax/download.php?api=dfcb6d76f2f6a9894gjkege8a4ab232222&url=${encodeURIComponent(url)}&format=m4a`);
        if (!downloadRes.data.id) return { ok: false, msg: 'Erro ao iniciar o download.' };
        
        let attempts = 0;
        while (attempts < 35) {
            try {
                await new Promise(res => setTimeout(res, 3000));
                const taskStatus = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${downloadRes.data.id}`);
                if (taskStatus.data.success === 1) {
                    return { ok: true, criador: 'Hiudy', url: taskStatus.data.download_url };
                }
                attempts++;
            } catch (e) {}
        }
   
        return { ok: false, msg: 'O download demorou muito e foi cancelado.' };
        */
        datinha = await axios.get(`https://nayan-video-downloader.vercel.app/ytdown?url=${encodeURIComponent(url)}`)
        return { ok: true, criador: 'Hiudy', url: datinha.data.data.audio };
    } catch (e) {
        return { ok: false, msg: 'Ocorreu um erro ao realizar o download.' };
    }
}

module.exports = { search, mp3 };