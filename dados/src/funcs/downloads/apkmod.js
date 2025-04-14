// Busca de APKs Modificados
// Criado por Hiudy
// Mantenha os créditos, por favor! <3

const axios = require('axios');
const { DOMParser } = require('linkedom');

/**
 * Busca informações de um APK modificado no apkmodct.com
 * @param {string} searchText - Termo de busca
 * @returns {Promise<Object>} - Objeto com detalhes do APK ou erro
 */
async function apkMod(searchText) {
  try {
    if (!searchText || typeof searchText !== 'string') {
      return { error: 'Termo de busca inválido' };
    }

    // Configuração base para requisições
    const baseConfig = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    };

    // 1. Busca inicial
    const searchUrl = `https://apkmodct.com/?s=${encodeURIComponent(searchText)}`;
    const searchResponse = await axios.get(searchUrl, baseConfig);
    const searchDoc = new DOMParser().parseFromString(searchResponse.data, 'text/html');

    // Encontra o primeiro resultado
    const postLink = searchDoc.querySelector('div.post a');
    if (!postLink) {
      return { error: 'Nenhum resultado encontrado' };
    }

    const postUrl = postLink.href;
    const postTitle = postLink.title || 'Sem título';
    const imageUrl = searchDoc.querySelector('figure.home-icon img')?.src || null;

    // 2. Acessa página do post
    const postResponse = await axios.get(postUrl, baseConfig);
    const postDoc = new DOMParser().parseFromString(postResponse.data, 'text/html');

    // Extrai descrição
    const description = postDoc.querySelector('meta[name="description"]')?.content || 'Não disponível';

    // Extrai detalhes da tabela
    const details = {
      name: 'Não disponível',
      updated: 'Não disponível',
      version: 'Não disponível',
      category: 'Não disponível',
      modinfo: 'Não disponível',
      size: 'Não disponível',
      rate: 'Não disponível',
      requires: 'Não disponível',
      developer: 'Não disponível',
      googleplay: 'Não disponível',
      downloads: 'Não disponível'
    };

    postDoc.querySelectorAll('table.table-bordered tr').forEach(row => {
      const key = row.querySelector('th')?.textContent.trim().toLowerCase();
      const value = row.querySelector('td')?.textContent.trim() || 'Não disponível';
      
      if (key) {
        const mappedKey = {
          'name': 'name',
          'updated': 'updated',
          'version': 'version',
          'category': 'category',
          'mod info': 'modinfo',
          'size': 'size',
          'rate': 'rate',
          'requires android': 'requires',
          'developer': 'developer',
          'google play': 'googleplay',
          'downloads': 'downloads'
        }[key];

        if (mappedKey) {
          details[mappedKey] = value;
        }
      }
    });

    // 3. Acessa página de download
    const mainPicLink = postDoc.querySelector('div.main-pic a')?.href;
    if (!mainPicLink) {
      return { error: 'Link principal não encontrado' };
    }

    const downloadResponse = await axios.get(mainPicLink, baseConfig);
    const downloadDoc = new DOMParser().parseFromString(downloadResponse.data, 'text/html');

    // Extrai link de download
    const downloadUrl = downloadDoc.querySelector('div.col-xs-12 a')?.href;
    if (!downloadUrl) {
      return { error: 'Link de download não encontrado' };
    }

    // Retorna resultado formatado
    return {
      status: 'success',
      title: postTitle,
      description,
      image: imageUrl,
      details,
      download: downloadUrl
    };

  } catch (error) {
    console.error('Erro em apkMod:', error.message);
    return {
      status: 'error',
      error: error.response?.status === 404 ? 'Página não encontrada' :
             error.code === 'ECONNABORTED' ? 'Tempo de requisição excedido' :
             'Erro ao processar a requisição'
    };
  }
}

module.exports = apkMod;