// Sistema de Download Instagram
// Sistema único, diferente de qualquer outro bot
// Criador: Hiudy
// Mantenha os créditos, por favor! <3

const axios = require('axios');
const { igdl: igdlScraper } = require('ruhend-scraper');

/**
 * Realiza o download de mídia do Instagram
 * @param {string} url - URL da postagem do Instagram
 * @returns {Promise<Object>} - Resultado com status, dados da mídia ou erro
 */
async function igdl(url) {
  try {
    // Valida entrada
    if (!url || typeof url !== 'string' || !url.includes('instagram.com')) {
      return {
        ok: false,
        msg: 'URL inválida. Forneça uma URL válida do Instagram'
      };
    }

    // Configuração do axios
    const axiosConfig = {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      responseType: 'arraybuffer'
    };

    // Faz scrape da postagem
    const scrapeResult = await igdlScraper(url);
    if (!scrapeResult.data?.length) {
      return {
        ok: false,
        msg: 'Nenhuma mídia encontrada na postagem'
      };
    }

    // Processa os resultados
    const results = [];
    const uniqueUrls = new Set();

    await Promise.all(scrapeResult.data.map(async (item) => {
      if (!item.url || uniqueUrls.has(item.url)) return;
      uniqueUrls.add(item.url);

      try {
        const { data, headers } = await axios.get(item.url, axiosConfig);
        const contentType = headers['content-type'] || 'application/octet-stream';
        
        results.push({
          type: contentType.startsWith('image/') ? 'image' : 'video',
          buffer: Buffer.from(data),
          url: item.url
        });
      } catch (error) {
        console.error(`Erro ao baixar ${item.url}:`, error.message);
        // Continua com outros itens em caso de erro
      }
    }));

    if (!results.length) {
      return {
        ok: false,
        msg: 'Nenhuma mídia válida pôde ser baixada'
      };
    }

    return {
      ok: true,
      criador: 'Hiudy',
      data: results
    };

  } catch (error) {
    console.error('Erro geral em igdl:', error.message);
    return {
      ok: false,
      msg: error.code === 'ECONNABORTED' ? 'Tempo de requisição excedido' :
           error.response?.status === 404 ? 'Postagem não encontrada' :
           'Erro ao processar o download'
    };
  }
}

module.exports = { dl: igdl };