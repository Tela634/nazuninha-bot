//Criador: hiudy
//Versão: 0.0.1
//Esse arquivo contem direitos autorais, caso meus creditos sejam tirados poderei tomar medidas jurídicas.

const axios = require('axios'); 

async function igdl(url) { try { const bkz = await axios.get(`https://nayan-video-downloader.vercel.app/ndown?url=${encodeURIComponent(url)}`); if (!bkz.data.data?.length) return { ok: false, msg: 'Não consegui encontrar a postagem' }; const results = [], uniqueUrls = new Set(); await Promise.all(bkz.data.data.map(async (result) => { if (!uniqueUrls.has(result.url)) { uniqueUrls.add(result.url); const { data, headers } = await axios.get(result.url, { responseType: 'arraybuffer' }); results.push({ type: headers['content-type'].startsWith('image/') ? 'image' : 'video', buff: data, url: result.url }); } })); return { ok: true, criador: 'Hiudy', data: results }; } catch (e) { console.error(e); return { ok: false, msg: 'Ocorreu um erro ao realizar o download' }; }; };

module.exports = { dl: igdl };