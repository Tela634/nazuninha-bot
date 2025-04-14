// Sistema de Estilização de Texto
// Criado por Hiudy
// Mantenha os créditos, por favor! <3

const axios = require('axios');
const { DOMParser } = require('linkedom');

/**
 * Gera variações estilizadas de um texto
 * @param {string} text - Texto a ser estilizado
 * @returns {Promise<Object>} - Resultado com lista de estilos ou erro
 */
async function styleText(text) {
  try {
    // Validação de entrada
    if (!text || typeof text !== 'string') {
      return { ok: false, msg: 'Texto inválido. Forneça um texto válido' };
    }

    // Configuração da requisição
    const url = `http://qaz.wtf/u/convert.cgi?text=${encodeURIComponent(text.trim())}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 5000
    });

    // Parsing do HTML
    const document = new DOMParser().parseFromString(response.data, 'text/html');

    // Extração dos estilos
    const styles = Array.from(document.querySelectorAll('table tr'))
      .map(row => row.querySelector('td:nth-child(2)')?.textContent.trim())
      .filter(Boolean);

    if (!styles.length) {
      return { ok: false, msg: 'Nenhum estilo de texto encontrado' };
    }

    return {
      ok: true,
      criador: 'Hiudy',
      styles
    };
  } catch (error) {
    console.error('Erro em styleText:', error.message);
    return {
      ok: false,
      msg: error.code === 'ECONNABORTED' ? 'Tempo de requisição excedido' :
           error.response?.status === 404 ? 'Página não encontrada' :
           'Erro ao estilizar o texto'
    };
  }
}

module.exports = styleText;