const axios = require('axios');

async function consulta(dados, base) {
tar = await axios.get(`https://scraper.mdzapis.com/consultar/mdz?type=nome&data=${dados}&base=${base}&apikey=sonygozadinhas`);
return tar.data;
};

module.exports = consulta;