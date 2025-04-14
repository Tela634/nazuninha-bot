// Sistema de Pesquisa de Plugins Minecraft
// Sistema único, diferente de qualquer outro bot
// Criador: Hiudy
// Caso for usar, deixe os créditos por favor! <3

const axios = require('axios');
const { parseHTML } = require('linkedom');

/**
 * Busca informações de um plugin do Minecraft no Modrinth
 * @param {string} nome - Nome do plugin a ser buscado
 * @returns {Promise<Object>} - Objeto com detalhes do plugin ou mensagem de erro
 */
async function buscarPlugin(nome) {
  try {
    // Validação de entrada
    if (!nome || typeof nome !== 'string') {
      return { ok: false, msg: 'Termo de busca inválido' };
    }

    // Configuração da requisição
    const url = `https://modrinth.com/plugins?q=${encodeURIComponent(nome)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    // Parsing do HTML
    const { document } = parseHTML(response.data);

    // Busca pelo primeiro projeto
    const projectCard = document.querySelector('.project-card.base-card.padding-bg');
    if (!projectCard) {
      return { ok: false, msg: 'Nenhum plugin encontrado' };
    }

    // Extração dos dados
    const title = projectCard.querySelector('.name')?.textContent.trim() || 'Sem título';
    const description = projectCard.querySelector('.description')?.textContent.trim() || 'Sem descrição';
    const link = projectCard.querySelector('a')?.href 
      ? `https://modrinth.com${projectCard.querySelector('a').href}`
      : 'https://modrinth.com';
    const icon = projectCard.querySelector('img')?.src 
      ? (projectCard.querySelector('img').src.startsWith('http') 
          ? projectCard.querySelector('img').src 
          : `https://modrinth.com${projectCard.querySelector('img').src}`)
      : null;
    const author = projectCard.querySelector('.author .title-link')?.textContent.trim() || 'Desconhecido';

    // Retorno formatado
    return {
      ok: true,
      name: title,
      desc: description,
      url: link,
      image: icon,
      creator: author
    };
  } catch (error) {
    console.error('Erro ao buscar plugin:', {
      message: error.message,
      status: error.response?.status
    });
    return {
      ok: false,
      msg: error.response?.status === 404 ? 'Página não encontrada' :
           error.code === 'ECONNABORTED' ? 'Tempo de requisição excedido' :
           'Erro ao processar a requisição'
    };
  }
}

module.exports = buscarPlugin;