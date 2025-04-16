/**
 * Sistema de Download Instagram Otimizado
 * Desenvolvido por Hiudy
 * Versão: 2.0.0
 */

const axios = require('axios');
const { igdl: igdl2 } = require('ruhend-scraper');

// Configurações
const CONFIG = {
  API: {
    TIMEOUT: 30000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    CONCURRENT_DOWNLOADS: 3
  },
  MEDIA: {
    MAX_SIZE: 50 * 1024 * 1024, // 50MB
    SUPPORTED_TYPES: {
      IMAGE: ['image/jpeg', 'image/png', 'image/gif'],
      VIDEO: ['video/mp4', 'video/quicktime']
    }
  },
  CACHE: {
    MAX_SIZE: 100,
    EXPIRE_TIME: 15 * 60 * 1000 // 15 minutos
  }
};

// Cache para downloads
class InstagramCache {
  constructor() {
    this.cache = new Map();
  }

  getKey(url) {
    return url.split('?')[0].toLowerCase();
  }

  get(url) {
    const key = this.getKey(url);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > CONFIG.CACHE.EXPIRE_TIME) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  set(url, data) {
    if (this.cache.size >= CONFIG.CACHE.MAX_SIZE) {
      const oldestKey = Array.from(this.cache.keys())[0];
      this.cache.delete(oldestKey);
    }

    const key = this.getKey(url);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

// Gerenciador de Downloads
class DownloadManager {
  constructor() {
    this.axios = axios.create({
      timeout: CONFIG.API.TIMEOUT,
      responseType: 'arraybuffer',
      maxContentLength: CONFIG.MEDIA.MAX_SIZE
    });
  }

  async downloadMedia(url, attempt = 1) {
    try {
      const response = await this.axios.get(url);
      const contentType = response.headers['content-type'];

      // Valida tipo de mídia
      if (!this.isValidMediaType(contentType)) {
        throw new Error(`Tipo de mídia não suportado: ${contentType}`);
      }

      return {
        type: this.getMediaType(contentType),
        buff: response.data,
        url: url,
        mime: contentType
      };
    } catch (error) {
      if (attempt < CONFIG.API.MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.API.RETRY_DELAY * attempt));
        return this.downloadMedia(url, attempt + 1);
      }
      throw error;
    }
  }

  isValidMediaType(contentType) {
    return [
      ...CONFIG.MEDIA.SUPPORTED_TYPES.IMAGE,
      ...CONFIG.MEDIA.SUPPORTED_TYPES.VIDEO
    ].includes(contentType);
  }

  getMediaType(contentType) {
    return CONFIG.MEDIA.SUPPORTED_TYPES.IMAGE.includes(contentType) ? 'image' : 'video';
  }

  async downloadBatch(urls) {
    const uniqueUrls = [...new Set(urls)];
    const results = [];
    
    // Download em lotes para controlar concorrência
    for (let i = 0; i < uniqueUrls.length; i += CONFIG.API.CONCURRENT_DOWNLOADS) {
      const batch = uniqueUrls.slice(i, i + CONFIG.API.CONCURRENT_DOWNLOADS);
      const batchResults = await Promise.allSettled(
        batch.map(url => this.downloadMedia(url))
      );

      // Filtra resultados bem-sucedidos
      results.push(...batchResults
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value)
      );
    }

    return results;
  }
}

// Validador de URL
class URLValidator {
  static isValidInstagramURL(url) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname.includes('instagram.com');
    } catch {
      return false;
    }
  }
}

// Cache e gerenciador instanciados uma única vez
const cache = new InstagramCache();
const downloadManager = new DownloadManager();

/**
 * Download de conteúdo do Instagram
 * @param {string} url - URL do post do Instagram
 * @returns {Promise<Object>} Resultado do download
 */
async function igdl(url) {
  try {
    // Valida URL
    if (!url || !URLValidator.isValidInstagramURL(url)) {
      return { ok: false, msg: 'URL do Instagram inválida' };
    }

    // Verifica cache
    const cached = cache.get(url);
    if (cached) return cached;

    // Obtém URLs de mídia
    const scrapeResult = await igdl2(url);
    if (!scrapeResult?.data?.length) {
      return { ok: false, msg: 'Não consegui encontrar a postagem' };
    }

    // Download das mídias
    const mediaUrls = scrapeResult.data.map(item => item.url);
    const downloadResults = await downloadManager.downloadBatch(mediaUrls);

    if (!downloadResults.length) {
      return { ok: false, msg: 'Não foi possível baixar as mídias' };
    }

    const result = {
      ok: true,
      criador: 'Hiudy',
      data: downloadResults
    };

    // Salva no cache
    cache.set(url, result);

    return result;
  } catch (error) {
    console.error('Erro no download Instagram:', error);
    return {
      ok: false,
      msg: 'Ocorreu um erro ao realizar o download'
    };
  }
}

module.exports = { dl: igdl };
