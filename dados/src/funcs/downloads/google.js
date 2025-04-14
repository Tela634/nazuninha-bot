// Sistema de Pesquisa Google (Texto e Imagens)
// Criado por Hiudy (adaptado)
// Mantenha os créditos, por favor! <3

const { googleIt, googleImage } = require('@bochilteam/scraper');

/**
 * Pesquisa texto no Google
 * @param {string} text - Termo de busca
 * @returns {Promise<Object>} - Resultado da pesquisa formatado
 */
async function searchText(text) {
  try {
    if (!text || typeof text !== 'string') {
      return { ok: false, msg: 'Termo de busca inválido' };
    }

    const search = await googleIt(text);
    if (!search.articles?.length) {
      return { ok: false, msg: 'Nenhum resultado encontrado' };
    }

    const result = search.articles
      .map(({ title, url, description }) => {
        if (!title || !url) return null;
        return `*${title.trim()}*\n_${url.trim()}_\n_${description?.trim() || 'Sem descrição'}_`;
      })
      .filter(Boolean)
      .join('\n\n');

    if (!result) {
      return { ok: false, msg: 'Nenhum resultado válido formatado' };
    }

    return {
      ok: true,
      image: `https://image.thum.io/get/fullpage/https://google.com/search?q=${encodeURIComponent(text)}`,
      text: result,
      array: search.articles.map(({ title, url, description }) => ({
        title: title?.trim() || 'Sem título',
        url: url?.trim() || '',
        description: description?.trim() || 'Sem descrição'
      }))
    };
  } catch (error) {
    console.error('Erro em searchText:', error.message);
    return {
      ok: false,
      msg: error.message.includes('network') ? 'Erro de conexão com a API' : 'Erro ao realizar a pesquisa'
    };
  }
}

/**
 * Pesquisa imagens no Google
 * @param {string} text - Termo de busca
 * @returns {Promise<Object>} - Resultado da pesquisa de imagens
 */
async function searchImage(text) {
  try {
    if (!text || typeof text !== 'string') {
      return { ok: false, msg: 'Termo de busca inválido' };
    }

    const res = await googleImage(text);
    if (!res?.length) {
      return { ok: false, msg: 'Nenhuma imagem encontrada' };
    }

    return {
      ok: true,
      result: res.map(url => url.trim()).filter(url => url.startsWith('http'))
    };
  } catch (error) {
    console.error('Erro em searchImage:', error.message);
    return {
      ok: false,
      msg: error.message.includes('network') ? 'Erro de conexão com a API' : 'Erro ao buscar imagens'
    };
  }
}

module.exports = { search: searchText, image: searchImage };