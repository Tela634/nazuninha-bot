// Sistema de Emojimix
// Sistema único, diferente de qualquer outro bot
// Criador: Hiudy
// Caso for usar, deixe os créditos por favor! <3

const axios = require('axios');

/**
 * Combina dois emojis usando a API do Tenor Emoji Kitchen
 * @param {string} emoji1 - Primeiro emoji (ex.: 😊)
 * @param {string} emoji2 - Segundo emoji (ex.: ❤️)
 * @returns {Promise<Object>} - Resultado com URL da imagem ou erro
 */
async function emojiMix(emoji1, emoji2) {
  try {
    // Validação de entrada
    if (!emoji1 || !emoji2 || typeof emoji1 !== 'string' || typeof emoji2 !== 'string') {
      return { ok: false, msg: 'Emojis inválidos. Forneça dois emojis válidos' };
    }

    // Normaliza emojis removendo variações (ex.: tom de pele)
    const normalizeEmoji = (emoji) => emoji.replace(/[\ufe00-\ufe0f]/g, '');
    const cleanEmoji1 = encodeURIComponent(normalizeEmoji(emoji1));
    const cleanEmoji2 = encodeURIComponent(normalizeEmoji(emoji2));

    // Configuração da requisição
    const url = `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${cleanEmoji1}_${cleanEmoji2}`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 5000
    });

    const results = response.data?.results;
    if (!results?.length) {
      return { ok: false, msg: 'Nenhuma combinação de emojis encontrada' };
    }

    // Seleciona um resultado aleatório
    const selected = results[Math.floor(Math.random() * results.length)];
    if (!selected?.url) {
      return { ok: false, msg: 'URL da imagem não encontrada' };
    }

    return {
      ok: true,
      criador: 'Hiudy',
      url: selected.url
    };
  } catch (error) {
    console.error('Erro em emojiMix:', error.message);
    return {
      ok: false,
      msg: error.code === 'ECONNABORTED' ? 'Tempo de requisição excedido' :
           error.response?.status === 404 ? 'Combinação não encontrada' :
           'Erro ao processar a combinação de emojis'
    };
  }
}

module.exports = emojiMix;