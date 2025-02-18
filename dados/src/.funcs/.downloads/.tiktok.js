//Criador: hiudy
//Versão: 0.0.1
//Esse arquivo contem direitos autorais, caso meus creditos sejam tirados poderei tomar medidas jurídicas.

const axios = require('axios');

async function tiktok(url) { try { res = await axios.get(`https://www.tikwm.com/api/?url=${url}?hd=1`); obj = { ok: true, criador: 'Hiudy' }; if (res.data?.data?.music_info?.play) obj.audio = res.data.data.music_info.play; if (res.data?.data?.images) { obj.type = 'image'; obj.mime = ""; obj.urls = res.data.data.images; } else { obj.type = 'video'; obj.mime = 'video/mp4'; obj.urls = [res.data.data.play]; } if (res.data?.data?.title) obj.title = res.data.data.title; return obj; } catch (e) { return { ok: false, msg: 'Ocorreu um erro ao realizar o download' }; } }

async function tiktokSearch(name) { return new Promise(async (resolve, reject) => { try { const response = await axios({ method: 'POST', url: 'https://tikwm.com/api/feed/search', headers: { 'Content-Type': 'application/x-www-form-urlencoded charset=UTF-8', 'Cookie': 'current_language=pt-BR', 'User-Agent': 'Mozilla/5.0 (Linux Android 10 K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36' }, data: { keywords: name, count: 5, cursor: 0, HD: 1 } }); const videos = response.data.data.videos; if (!videos || videos.length <= 0) { resolve({ ok: false, msg: 'Não encontrei nenhum vídeo' }); } else { const randomIndex = Math.floor(Math.random() * videos.length); const randomVideo = videos[randomIndex]; resolve({ ok: true, criador: 'Hiudy', title: randomVideo.title, urls: [randomVideo.play], type: 'video', mime: 'video/mp4', audio: randomVideo.music }); } } catch (error) { resolve({ ok: false, msg: 'Ocorreu um erro.' }); } }); }

module.exports = { dl: tiktok, search: tiktokSearch };