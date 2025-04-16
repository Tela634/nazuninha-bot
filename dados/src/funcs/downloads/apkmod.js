/**
 * Sistema de Busca e Download de Filmes Otimizado
 * Desenvolvido por Hiudy
 * Versão: 2.0.0
 * Modificado para usar Axios e LinkedOM
 */

const axios = require('axios');
const { parseHTML } = require('linkedom');

// Configurações
const CONFIG = {
  API: {
    GOOGLE: {
      BASE_URL: 'https://www.googleapis.com/customsearch/v1',
      CX: '32a7e8cb9ffc24cd5',
      KEYS: [
        "AIzaSyD51LedjJnOulDkA6u8nfmt17cnIlJ7igc",
        "AIzaSyDbQwjgQforqkA-cHt0omRNX4OQsJ3ocvg",
        "AIzaSyA9wPFHMwnkaBLpnLTP9d8lgEoHAsISQN0",
        "AIzaSyB1wjSU3NfUmc32bus34j9BmSDBKTKaEYg",
        "AIzaSyBm0L9hwLyZ9jhV3HGVcNKQ6znG7_zbSoU",
        "AIzaSyAm_B1DHAK_kCVWHPACK1XAe8sVry1Fj0U"
      ]
    },
    TIMEOUT: 30000
  },
  CACHE: {
    MAX_SIZE: 100,
    EXPIRE_TIME: 60 * 60 * 1000 // 1 hora
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000
  },
  SCRAPE: {
    SELECTORS: {
      VIDEO_URL: '#tokyvideo_player',
      IMAGE: '#tokyvideo_player',
      NAME: '#tokyvideo_player'
    }
  }
};

// Cache para resultados
class MovieCache {
  constructor() {
    this.cache = new Map();
  }

  getKey(query) {
    return query.toLowerCase().trim();
  }

  get(query) {
    const key = this.getKey(query);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > CONFIG.CACHE.EXPIRE_TIME) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  set(query, data) {
    if (this.cache.size >= CONFIG.CACHE.MAX_SIZE) {
      const oldestKey = Array.from(this.cache.keys())[0];
      this.cache.delete(oldestKey);
    }

    const key = this.getKey(query);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

// Gerenciador de API Keys
class APIKeyManager {
  constructor(keys) {
    this.keys = keys;
    this.currentIndex = 0;
    this.failedKeys = new Set();
  }

  getCurrentKey() {
    return this.keys[this.currentIndex];
  }

  markKeyAsFailed(key) {
    this.failedKeys.add(key);
  }

  getNextKey() {
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    return this.getCurrentKey();
  }

  hasAvailableKeys() {
    return this.failedKeys.size < this.keys.length;
  }

  resetFailedKeys() {
    this.failedKeys.clear();
    this.currentIndex = 0;
  }
}

// Cliente de Busca
class SearchClient {
  constructor() {
    if (!CONFIG.API.GOOGLE.KEYS.length) {
      throw new Error('Nenhuma chave de API configurada');
    }
    
    this.keyManager = new APIKeyManager(CONFIG.API.GOOGLE.KEYS);
    this.axiosInstance = axios.create({
      timeout: CONFIG.API.TIMEOUT
    });
  }

  async search(query, attempt = 1) {
    try {
      if (!this.keyManager.hasAvailableKeys()) {
        throw new Error('Todas as chaves de API foram esgotadas');
      }

      const currentKey = this.keyManager.getCurrentKey();
      
      const response = await this.axiosInstance.get(CONFIG.API.GOOGLE.BASE_URL, {
        params: {
          q: query,
          key: currentKey,
          cx: CONFIG.API.GOOGLE.CX
        }
      });

      if (response.data.items) {
        return response.data.items.map(item => ({
          title: item.title,
          link: item.link
        }));
      }

      return [];
    } catch (error) {
      console.error(`Erro com a chave de API:`, error.message);
      
      this.keyManager.markKeyAsFailed(this.keyManager.getCurrentKey());
      
      if (attempt < CONFIG.RETRY.MAX_ATTEMPTS && this.keyManager.hasAvailableKeys()) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY.DELAY * attempt));
        this.keyManager.getNextKey();
        return this.search(query, attempt + 1);
      }
      
      throw error;
    }
  }

  async scrapeVideo(url) {
    try {
      const response = await this.axiosInstance.get(url);
      const { document } = parseHTML(response.data);
      
      const videoElement = document.querySelector(CONFIG.SCRAPE.SELECTORS.VIDEO_URL);
      if (!videoElement) return null;

      const videoData = {
        img: videoElement.getAttribute('poster'),
        name: videoElement.getAttribute('data-title'),
        url: videoElement.getAttribute('src')
      };

      if (!videoData.url || !videoData.img || !videoData.name) {
        return null;
      }

      return videoData;
    } catch (error) {
      console.error('Erro ao extrair dados do vídeo:', error);
      return null;
    }
  }
}

// Cache e cliente instanciados uma única vez
const cache = new MovieCache();
const client = new SearchClient();

/**
 * Busca filmes e séries
 * @param {string} texto - Termo de busca
 * @returns {Promise<Object|null>} Informações do vídeo
 */
async function Filmes(texto) {
  try {
    if (!texto || typeof texto !== 'string') {
      console.log('Termo de busca inválido');
      return null;
    }

    // Verifica cache
    const cached = cache.get(texto);
    if (cached) return cached;

    // Busca resultados
    const results = await client.search(texto);
    if (results.length === 0) {
      console.log('Nenhum resultado encontrado');
      return null;
    }

    // Procura vídeos nos resultados
    for (const result of results) {
      if (result.link.includes('/video/')) {
        const videoData = await client.scrapeVideo(result.link);
        if (videoData) {
          // Salva no cache
          cache.set(texto, videoData);
          return videoData;
        }
      }
    }

    console.log('Nenhum vídeo encontrado');
    return null;
  } catch (error) {
    console.error('Erro ao buscar filme:', error);
    return null;
  } finally {
    // Reseta as chaves falhadas para a próxima busca
    client.keyManager.resetFailedKeys();
  }
}

module.exports = Filmes;