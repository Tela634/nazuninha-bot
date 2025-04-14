// Sistema de Pesquisa e Download do Pinterest
// Sistema único, diferente de qualquer outro bot
// Criador: Hiudy
// Caso for usar, deixe os créditos por favor! <3

const axios = require('axios');
const { parseHTML } = require('linkedom');

/**
 * Configuração padrão para requisições
 */
const requestConfig = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  },
  timeout: 10000
};

/**
 * Busca imagens no Pinterest com base em um termo
 * @param {string} texto - Termo de busca
 * @returns {Promise<Object>} - Resultado com URLs de imagens ou erro
 */
async function pinterestSearch(texto) {
  try {
    if (!texto || typeof texto !== 'string') {
      return { ok: false, msg: 'Termo de busca inválido' };
    }

    const url = `https://br.pinterest.com/search/pins/?q=${encodeURIComponent(texto)}`;
    const response = await axios.get(url, requestConfig);
    const { document } = parseHTML(response.data);

    const imagens = Array.from(document.querySelectorAll('.hCL'))
      .map(el => el.getAttribute('src'))
      .filter(src => src)
      .map(src => src.replace(/236x|60x60/g, '736x'));

    if (!imagens.length) {
      return { ok: false, msg: 'Nenhuma imagem encontrada' };
    }

    const randomImage = imagens[Math.floor(Math.random() * imagens.length)];
    return {
      ok: true,
      criador: 'Hiudy',
      type: 'image',
      mime: 'image/jpeg',
      urls: [randomImage]
    };
  } catch (error) {
    console.error('Erro em pinterestSearch:', error.message);
    return {
      ok: false,
      msg: error.code === 'ECONNABORTED' ? 'Tempo de requisição excedido' : 'Erro ao buscar imagens'
    };
  }
}

/**
 * Faz download de conteúdo (imagem ou vídeo) de um pin do Pinterest
 * @param {string} url - URL do pin
 * @returns {Promise<Object>} - Resultado com URL do conteúdo ou erro
 */
async function pinterestDL(url) {
  try {
    if (!url || typeof url !== 'string') {
      return { ok: false, msg: 'URL inválida' };
    }

    // Validação de URL do Pinterest
    const pinRegex = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)?pinterest\.\w{2,6}(?:\.\w{2})?\/pin\/\d+|https?:\/\/pin\.it\/[a-zA-Z0-9]+/;
    if (!pinRegex.test(url)) {
      return { ok: false, msg: 'URL inválida. Use um link de pin do Pinterest' };
    }

    // Extração do ID do pin
    const pinIdMatch = url.match(/(?:\/pin\/(\d+)|pin\.it\/([a-zA-Z0-9]+))/);
    const pinId = pinIdMatch ? pinIdMatch[1] || pinIdMatch[2] : null;
    if (!pinId) {
      return { ok: false, msg: 'Não foi possível extrair o ID do pin' };
    }

    // Montagem da requisição à API
    const apiUrl = `https://br.pinterest.com/resource/PinResource/get/?source_url=${encodeURIComponent(`/pin/${pinId}/`)}&data=${encodeURIComponent(JSON.stringify({
      options: {
        id: pinId,
        field_set_key: 'auth_web_main_pin',
        noCache: true,
        fetch_visual_search_objects: true
      },
      context: {}
    }))}`;

    const response = await axios.get(apiUrl, requestConfig);
    const data = response.data?.resource_response?.data;

    if (!data) {
      return { ok: false, msg: 'Nenhum conteúdo encontrado' };
    }

    const videos = data.videos?.video_list;
    const images = data.images;
    const results = [];

    if (videos) {
      Object.values(videos).forEach(video => results.push({ url: video.url, type: 'video', mime: 'video/mp4' }));
    }
    if (images) {
      Object.values(images).forEach(image => results.push({ url: image.url, type: 'image', mime: 'image/jpeg' }));
    }

    if (!results.length) {
      return { ok: false, msg: 'Nenhum conteúdo disponível para download' };
    }

    // Retorna o primeiro item disponível
    const selected = results[0];
    return {
      ok: true,
      criador: 'Hiudy',
      type: selected.type,
      mime: selected.mime,
      urls: [selected.url]
    };
  } catch (error) {
    console.error('Erro em pinterestDL:', error.message);
    return {
      ok: false,
      msg: error.code === 'ECONNABORTED' ? 'Tempo de requisição excedido' :
           error.response?.status === 404 ? 'Pin não encontrado' :
           'Erro ao baixar o conteúdo'
    };
  }
}

module.exports = { search: pinterestSearch, dl: pinterestDL };