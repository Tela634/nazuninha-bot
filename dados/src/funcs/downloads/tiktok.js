// Sistema de Pesquisa e Download do TikTok
// Sistema único, diferente de qualquer outro bot
// Criador: Hiudy
// Caso for usar, deixe os créditos por favor! <3

const axios = require('axios');

/**
 * Configuração padrão para requisições
 */
const requestConfig = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cookie': 'current_language=pt-BR'
  },
  timeout: 10000
};

/**
 * Faz download de um vídeo ou imagens do TikTok
 * @param {string} url - URL do vídeo do TikTok
 * @returns {Promise<Object>} - Resultado com URLs de mídia ou erro
 */
async function tiktok(url) {
  try {
    if (!url || typeof url !== 'string' || !url.includes('tiktok.com')) {
      return { ok: false, msg: 'URL inválida. Use um link do TikTok' };
    }

    const response = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`, requestConfig);
    const data = response.data?.data;

    if (!data) {
      return { ok: false, msg: 'Nenhum conteúdo encontrado' };
    }

    const result = {
      ok: true,
      criador: 'Hiudy',
      title: data.title || 'Sem título'
    };

    if (data.music_info?.play) {
      result.audio = data.music_info.play;
    }

    if (data.images) {
      result.type = 'image';
      result.mime = 'image/jpeg';
      result.urls = data.images;
    } else {
      result.type = 'video';
      result.mime = 'video/mp4';
      result.urls = [data.play].filter(Boolean);
    }

    if (!result.urls?.length) {
      return { ok: false, msg: 'Nenhum conteúdo disponível para download' };
    }

    return result;
  } catch (error) {
    console.error('Erro em tiktok:', error.message);
    return {
      ok: false,
      msg: error.code === 'ECONNABORTED' ? 'Tempo de requisição excedido' :
           error.response?.status === 404 ? 'Vídeo não encontrado' :
           'Erro ao realizar o download'
    };
  }
}

/**
 * Pesquisa vídeos no TikTok com base em palavras-chave
 * @param {string} name - Termo de busca
 * @returns {Promise<Object>} - Resultado com um vídeo aleatório ou erro
 */
async function tiktokSearch(name) {
  try {
    if (!name || typeof name !== 'string') {
      return { ok: false, msg: 'Termo de busca inválido' };
    }

    const response = await axios.post('https://www.tikwm.com/api/feed/search', {
      keywords: name,
      count: 5,
      cursor: 0,
      HD: 1
    }, requestConfig);

    const videos = response.data?.data?.videos;
    if (!videos || !videos.length) {
      return { ok: false, msg: 'Nenhum vídeo encontrado' };
    }

    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    return {
      ok: true,
      criador: 'Hiudy',
      title: randomVideo.title || 'Sem título',
      urls: [randomVideo.play].filter(Boolean),
      type: 'video',
      mime: 'video/mp4',
      audio: randomVideo.music || null
    };
  } catch (error) {
    console.error('Erro em tiktokSearch:', error.message);
    return {
      ok: false,
      msg: error.code === 'ECONNABORTED' ? 'Tempo de requisição excedido' :
           error.response?.status === 404 ? 'Nenhum resultado encontrado' :
           'Erro ao realizar a pesquisa'
    };
  }
}

module.exports = { dl: tiktok, search: tiktokSearch };