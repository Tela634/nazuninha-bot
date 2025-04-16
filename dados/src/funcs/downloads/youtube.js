/**
 * Sistema de Download e Pesquisa YouTube Otimizado
 * Desenvolvido por Hiudy
 * Versão: 2.0.0
 */

const yts = require('yt-search');
const axios = require('axios');

// Configurações
const CONFIG = {
  API: {
    OCEAN: {
      BASE_URL: 'https://p.oceansaver.in/ajax',
      API_KEY: "dfcb6d76f2f6a9894gjkege8a4ab232222",
      TIMEOUT: 30000
    },
    NODZ: {
      BASE_URL: 'https://nodz-apis.com.br/api/downloads/youtube',
      API_KEY: "nazu",
      TIMEOUT: 30000
    }
  },
  FORMATS: {
    AUDIO: ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'],
    VIDEO: ['360', '480', '720', '1080', '1440', '4k']
  },
  CACHE: {
    MAX_SIZE: 1000,
    EXPIRE_TIME: 6 * 60 * 60 * 1000 // 6 horas
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000
  }
};

// Cache para resultados
class YouTubeCache {
  constructor() {
    this.cache = new Map();
  }

  getKey(type, input) {
    return `${type}:${input}`;
  }

  get(type, input) {
    const key = this.getKey(type, input);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > CONFIG.CACHE.EXPIRE_TIME) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  set(type, input, data) {
    if (this.cache.size >= CONFIG.CACHE.MAX_SIZE) {
      const oldestKey = Array.from(this.cache.keys())[0];
      this.cache.delete(oldestKey);
    }

    const key = this.getKey(type, input);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

// Gerenciador de URLs do YouTube
class YouTubeURLManager {
  static VALID_DOMAINS = [
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'youtu.be',
    'youtube.co'
  ];

  static getVideoId(input) {
    if (!input) return null;
    
    try {
      const url = new URL(input);
      
      if (!this.VALID_DOMAINS.some(domain => url.hostname.endsWith(domain))) {
        return input;
      }

      if (url.hostname === 'youtu.be') {
        return url.pathname.substring(1);
      }

      if (url.hostname.includes('youtube.com')) {
        if (url.pathname.startsWith('/shorts/')) {
          return url.pathname.split('/')[2];
        }
        if (url.searchParams.has('v')) {
          return url.searchParams.get('v');
        }
      }
    } catch (e) {
      return input;
    }
    
    return input;
  }

  static getVideoUrl(input) {
    const id = this.getVideoId(input);
    return `https://www.youtube.com/watch?v=${id}`;
  }
}

// Cliente de API
class APIClient {
  constructor(baseURL, apiKey, timeout) {
    this.axios = axios.create({
      baseURL,
      timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Connection': 'keep-alive',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    this.apiKey = apiKey;
  }

  async request(config, attempt = 1) {
    try {
      const response = await this.axios.request(config);
      return response.data;
    } catch (error) {
      if (attempt < CONFIG.RETRY.MAX_ATTEMPTS) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY.DELAY * attempt));
        return this.request(config, attempt + 1);
      }
      throw error;
    }
  }
}

// Gerenciador de Download
class DownloadManager {
  constructor() {
    this.oceanClient = new APIClient(
      CONFIG.API.OCEAN.BASE_URL,
      CONFIG.API.OCEAN.API_KEY,
      CONFIG.API.OCEAN.TIMEOUT
    );
    this.nodzClient = new APIClient(
      CONFIG.API.NODZ.BASE_URL,
      CONFIG.API.NODZ.API_KEY,
      CONFIG.API.NODZ.TIMEOUT
    );
  }

  async checkProgress(id) {
    let attempts = 0;
    const maxAttempts = 30; // 30 segundos máximo

    while (attempts < maxAttempts) {
      const data = await this.oceanClient.request({
        method: 'GET',
        url: `/progress.php?id=${id}`
      });

      if (data?.success && data?.progress === 1000) {
        return data.download_url;
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    throw new Error('Tempo limite excedido');
  }

  async downloadV2(url, format) {
    if (!CONFIG.FORMATS.AUDIO.includes(format) && !CONFIG.FORMATS.VIDEO.includes(format)) {
      throw new Error('Formato inválido');
    }

    const data = await this.oceanClient.request({
      method: 'GET',
      url: `/download.php?format=${format}&url=${encodeURIComponent(url)}&api=${CONFIG.API.OCEAN.API_KEY}`
    });

    if (!data?.success) {
      throw new Error('Falha ao iniciar download');
    }

    const downloadUrl = await this.checkProgress(data.id);
    return {
      ok: true,
      id: data.id,
      image: data.info.image,
      title: data.title,
      downloadUrl
    };
  }
}

// Cache e gerenciadores instanciados uma única vez
const cache = new YouTubeCache();
const downloadManager = new DownloadManager();

/**
 * Pesquisa vídeos no YouTube
 * @param {string} name - Termo de pesquisa
 * @returns {Promise<Object>} Resultado da pesquisa
 */
async function search(name) {
  try {
    const cached = cache.get('search', name);
    if (cached) return cached;

    const searchRes = await yts(name);
    if (!searchRes.videos?.length) {
      return { ok: false, msg: 'Não encontrei nenhuma música.' };
    }

    const result = { ok: true, criador: 'Hiudy', data: searchRes.videos[0] };
    cache.set('search', name, result);
    return result;
  } catch (error) {
    console.error('Erro na pesquisa:', error);
    return { ok: false, msg: 'Ocorreu um erro ao realizar a pesquisa.' };
  }
}

/**
 * Download de áudio
 * @param {string} input - URL ou ID do vídeo
 * @param {string} v - Versão da API
 * @returns {Promise<Object>} URL de download
 */
async function mp3(input, v = '1') {
  try {
    const url = YouTubeURLManager.getVideoUrl(input);
    const cached = cache.get('mp3', url + v);
    if (cached) return cached;

    let result;
    if (v === '2') {
      result = await downloadManager.downloadV2(url, 'm4a');
    } else {
      result = { 
        ok: true, 
        url: `${CONFIG.API.NODZ.BASE_URL}/audio?url=${url}&apiKey=${CONFIG.API.NODZ.API_KEY}` 
      };
    }

    cache.set('mp3', url + v, result);
    return result;
  } catch (error) {
    console.error('Erro no download MP3:', error);
    return { ok: false, msg: 'Erro ao processar o vídeo.' };
  }
}

/**
 * Download de vídeo
 * @param {string} input - URL ou ID do vídeo
 * @param {string} quality - Qualidade do vídeo
 * @param {string} v - Versão da API
 * @returns {Promise<Object>} URL de download
 */
async function mp4(input, quality = '360', v = '1') {
  try {
    const url = YouTubeURLManager.getVideoUrl(input);
    const cached = cache.get('mp4', url + quality + v);
    if (cached) return cached;

    let result;
    if (v === '2') {
      result = await downloadManager.downloadV2(url, quality);
    } else {
      result = { 
        ok: true, 
        url: `${CONFIG.API.NODZ.BASE_URL}/video?url=${url}&apiKey=${CONFIG.API.NODZ.API_KEY}` 
      };
    }

    cache.set('mp4', url + quality + v, result);
    return result;
  } catch (error) {
    console.error('Erro no download MP4:', error);
    return { ok: false, msg: 'Erro ao processar o vídeo.' };
  }
}

// Exporta funções com versões alternativas
module.exports = {
  search,
  mp3,
  mp4,
  mp3v2: (url) => mp3(url, '2'),
  mp4v2: (url) => mp4(url, '360', '2')
};
