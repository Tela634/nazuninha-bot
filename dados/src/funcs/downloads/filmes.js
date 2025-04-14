// Busca de Filmes
// Criador: Hiudy
// Versão: 0.0.1
// Esse arquivo contém direitos autorais. A remoção dos créditos pode resultar em medidas jurídicas.

const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Busca resultados usando a API do Google Custom Search
 * @param {string} query - Termo de busca
 * @returns {Promise<Array>} - Lista de resultados com título e link
 */
async function search(query) {
  const keys = [
    'AIzaSyD51LedjJnOulDkA6u8nfmt17cnIlJ7igc',
    'AIzaSyDbQwjgQforqkA-cHt0omRNX4OQsJ3ocvg',
    'AIzaSyA9wPFHMwnkaBLpnLTP9d8lgEoHAsISQN0',
    'AIzaSyB1wjSU3NfUmc32bus34j9BmSDBKTKaEYg',
    'AIzaSyBm0L9hwLyZ9jhV3HGVcNKQ6znG7_zbSoU',
    'AIzaSyAm_B1DHAK_kCVWHPACK1XAe8sVry1Fj0U'
  ];
  const cx = '32a7e8cb9ffc24cd5';
  
  for (const key of keys) {
    try {
      const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${key}&cx=${cx}`;
      const response = await axios.get(url, {
        timeout: 10000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });

      const items = response.data.items || [];
      return items.map(item => ({
        title: item.title || 'Sem título',
        link: item.link || null
      }));
    } catch (error) {
      console.error(`Erro com a chave ${key}:`, error.response?.data?.error?.message || error.message);
      continue;
    }
  }
  
  return [];
}

/**
 * Busca informações de um vídeo a partir de um termo
 * @param {string} query - Termo de busca para o filme
 * @returns {Promise<Object|null>} - Detalhes do vídeo ou null se não encontrado
 */
async function Filmes(query) {
  try {
    if (!query || typeof query !== 'string') {
      return { status: 'error', error: 'Termo de busca inválido' };
    }

    const results = await search(query);
    if (!results.length) {
      return { status: 'error', error: 'Nenhum resultado encontrado' };
    }

    for (const result of results) {
      if (!result.link?.includes('/video/')) continue;

      try {
        const response = await axios.get(result.link, {
          timeout: 10000,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        
        const $ = cheerio.load(response.data);
        const videoElement = $('#tokyvideo_player');
        
        const src = videoElement.find('source').attr('src');
        const poster = videoElement.attr('poster');
        const title = videoElement.attr('data-title');

        if (src && poster && title) {
          return {
            status: 'success',
            img: poster,
            name: title,
            url: src
          };
        }
      } catch (error) {
        console.error(`Erro ao acessar ${result.link}:`, error.message);
        continue;
      }
    }

    return { status: 'error', error: 'Nenhum vídeo válido encontrado' };
  } catch (error) {
    console.error('Erro geral em Filmes:', error.message);
    return {
      status: 'error',
      error: 'Erro ao processar a requisição'
    };
  }
}

module.exports = Filmes;