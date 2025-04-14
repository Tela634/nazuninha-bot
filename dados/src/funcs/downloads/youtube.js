// Sistema de Pesquisa e Download do YouTube
// Sistema único, diferente de qualquer outro bot
// Criador: Hiudy
// Caso for usar, deixe os créditos por favor! <3

const yts = require('yt-search');
const axios = require('axios');

/**
 * Configuração padrão para requisições
 */
const requestConfig = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Connection': 'keep-alive',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 10000
};

/**
 * Formatos suportados
 */
const SUPPORTED_FORMATS = {
  audio: ['mp3', 'm4a', 'webm', 'aac', 'flac', 'opus', 'ogg', 'wav'],
  video: ['360', '480', '720', '1080', '1440', '4k']
};

/**
 * Pesquisa vídeos no YouTube
 * @param {string} name - Termo de busca
 * @returns {Promise<Object>} - Resultado da pesquisa
 */
async function search(name) {
  try {
    if (!name || typeof name !== 'string') {
      return { ok: false, msg: 'Termo de busca inválido' };
    }

    const searchRes = await yts(name);
    if (!searchRes.videos?.length) {
      return { ok: false, msg: 'Nenhum vídeo encontrado' };
    }

    return {
      ok: true,
      criador: 'Hiudy',
      data: {
        videoId: searchRes.videos[0].videoId,
        title: searchRes.videos[0].title,
        url: searchRes.videos[0].url,
        thumbnail: searchRes.videos[0].thumbnail,
        duration: searchRes.videos[0].duration
      }
    };
  } catch (error) {
    console.error('Erro em search:', error.message);
    return { ok: false, msg: 'Erro ao realizar a pesquisa' };
  }
}

/**
 * Extrai ID do YouTube de uma URL
 * @param {string} input - URL ou ID do vídeo
 * @returns {string|null} - ID do vídeo ou null
 */
function getYouTubeID(input) {
  if (!input || typeof input !== 'string') return null;

  try {
    const url = new URL(input);
    const validDomains = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'];

    if (!validDomains.some(domain => url.hostname.endsWith(domain))) {
      return input; // Pode ser um ID direto
    }

    if (url.hostname === 'youtu.be') {
      return url.pathname.substring(1);
    }

    if (url.pathname.startsWith('/shorts/')) {
      return url.pathname.split('/')[2];
    }

    if (url.searchParams.has('v')) {
      return url.searchParams.get('v');
    }

    return null; // Outros casos (canais, playlists, etc.)
  } catch (error) {
    return input; // Trata como ID se não for URL válida
  }
}

/**
 * Gera URL completa do YouTube
 * @param {string} input - URL ou ID do vídeo
 * @returns {string} - URL completa
 */
function getVideoUrl(input) {
  const id = getYouTubeID(input);
  if (!id) {
    throw new Error('ID de vídeo inválido');
  }
  return `https://www.youtube.com/watch?v=${id}`;
}

/**
 * Verifica progresso do download
 * @param {string} id - ID do download
 * @returns {Promise<string>} - URL de download
 */
async function checkProgress(id) {
  try {
    while (true) {
      const response = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${id}`, requestConfig);
      if (response.data?.success && response.data.progress === 1000) {
        return response.data.download_url;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    throw new Error('Erro ao verificar progresso do download');
  }
}

/**
 * Baixa vídeo ou áudio do YouTube (API v2)
 * @param {string} url - URL do vídeo
 * @param {string} format - Formato desejado
 * @returns {Promise<Object>} - Resultado do download
 */
async function ytdl(url, format) {
  try {
    if (!SUPPORTED_FORMATS.audio.includes(format) && !SUPPORTED_FORMATS.video.includes(format)) {
      return { ok: false, msg: 'Formato inválido' };
    }

    const response = await axios.get(
      `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      requestConfig
    );

    if (!response.data?.success) {
      return { ok: false, msg: 'Falha ao buscar detalhes do vídeo' };
    }

    const { id, title, info } = response.data;
    const downloadUrl = await checkProgress(id);

    return {
      ok: true,
      criador: 'Hiudy',
      id,
      image: info.image,
      title,
      url: downloadUrl
    };
  } catch (error) {
    console.error('Erro em ytdl:', error.message);
    return {
      ok: false,
      msg: error.code === 'ECONNABORTED' ? 'Tempo de requisição excedido' :
           error.response?.status === 404 ? 'Vídeo não encontrado' :
           'Erro ao processar o download'
    };
  }
}

/**
 * Baixa áudio do YouTube
 * @param {string} input - URL ou ID do vídeo
 * @param {string} [version='1'] - Versão da API (1 ou 2)
 * @returns {Promise<Object>} - Resultado do download
 */
async function mp3(input, version = '1') {
  try {
    const url = getVideoUrl(input);

    if (version === '2') {
      return await ytdl(url, 'm4a');
    }

    return {
      ok: true,
      criador: 'Hiudy',
      url: `https://nodz-apis.com.br/api/downloads/youtube/audio?url=${encodeURIComponent(url)}&apiKey=nazu`
    };
  } catch (error) {
    console.error('Erro em mp3:', error.message);
    return { ok: false, msg: 'Erro ao processar o áudio' };
  }
}

/**
 * Baixa vídeo do YouTube
 * @param {string} input - URL ou ID do vídeo
 * @param {string} [quality='360'] - Qualidade do vídeo
 * @param {string} [version='1'] - Versão da API (1 ou 2)
 * @returns {Promise<Object>} - Resultado do download
 */
async function mp4(input, quality = '360', version = '1') {
  try {
    const url = getVideoUrl(input);

    if (version === '2') {
      if (!SUPPORTED_FORMATS.video.includes(quality)) {
        return { ok: false, msg: 'Qualidade inválida' };
      }
      return await ytdl(url, quality);
    }

    return {
      ok: true,
      criador: 'Hiudy',
      url: `https://nodz-apis.com.br/api/downloads/youtube/video?url=${encodeURIComponent(url)}&apiKey=nazu`
    };
  } catch (error) {
    console.error('Erro em mp4:', error.message);
    return { ok: false, msg: 'Erro ao processar o vídeo' };
  }
}

module.exports = {
  search,
  mp3,
  mp4,
  mp3v2: url => mp3(url, '2'),
  mp4v2: (url, quality = '360') => mp4(url, quality, '2')
};