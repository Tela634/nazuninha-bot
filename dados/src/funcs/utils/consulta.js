const axios = require('axios');

async function consulta(dados, base, type) {
tar = await axios.get(`https://scraper.mdzapis.com/consultar/mdz?type=${type}&data=${dados}&base=${base}&apikey=sonygozadinhas`);
return tar.data;
};

module.exports = consulta;