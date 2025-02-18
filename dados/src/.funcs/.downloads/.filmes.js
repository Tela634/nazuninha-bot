//Criador: hiudy
//Versão: 0.0.1
//Esse arquivo contem direitos autorais, caso meus creditos sejam tirados poderei tomar medidas jurídicas.

const axios = require('axios');
const cheerio = require('cheerio');

async function search(query) {const keys = ["AIzaSyD51LedjJnOulDkA6u8nfmt17cnIlJ7igc", "AIzaSyDbQwjgQforqkA-cHt0omRNX4OQsJ3ocvg", "AIzaSyA9wPFHMwnkaBLpnLTP9d8lgEoHAsISQN0", "AIzaSyB1wjSU3NfUmc32bus34j9BmSDBKTKaEYg", "AIzaSyBm0L9hwLyZ9jhV3HGVcNKQ6znG7_zbSoU", "AIzaSyAm_B1DHAK_kCVWHPACK1XAe8sVry1Fj0U"];for (let key of keys) {const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${key}&cx=32a7e8cb9ffc24cd5`;try {const response = await axios.get(url);const results = response.data.items;return results.map(item => ({ title: item.title, link: item.link }));} catch (error) {console.error(`Erro com a chave ${key}:`, error.response?.data || error.message);}};return [];  };


async function Filmes(texto) {const results = await search(texto);if (results.length === 0) {console.log('Nenhum resultado encontrado.'); return null;};for (const result of results) {if (result.link.includes('/video/')) {const videoPageResponse = await axios.get(result.link);const $ = cheerio.load(videoPageResponse.data);const videoElement = $('#tokyvideo_player');const src = videoElement.find('source').attr('src');const poster = videoElement.attr('poster');const dataTitle = videoElement.attr('data-title');if(poster && dataTitle && src) {return {img: poster,name: dataTitle,url: src};};}};console.log('Nenhum vídeo encontrado.');return null;};

module.exports = Filmes;