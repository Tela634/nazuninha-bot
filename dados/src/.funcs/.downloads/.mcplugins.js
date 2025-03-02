const axios = require("axios");
const cheerio = require("cheerio");

async function buscarPlugin(nome) {
try {
const url = `https://modrinth.com/plugins?q=${encodeURIComponent(nome)}`;
const { data } = await axios.get(url);
const $ = cheerio.load(data);
const primeiroProjeto = $(".project-card.base-card.padding-bg").first();
if (!primeiroProjeto.length) return {ok:false,msg:"Nenhum plugin foi encontrado."};
const titulo = primeiroProjeto.find(".name").text().trim();
const descricao = primeiroProjeto.find(".description").text().trim();
const link = "https://modrinth.com" + primeiroProjeto.find("a").attr("href");
let icone = primeiroProjeto.find("img").attr("src");
if (icone && !icone.startsWith("http")) icone = "https://modrinth.com" + icone;
const autor = primeiroProjeto.find(".author .title-link").text().trim() || "Desconhecido";
return {ok:true,name:titulo,desc:descricao,url:link,image:icone,creator:autor};
} catch (erro) {
console.error("Erro ao buscar plugin:", erro);
return {ok:false,msg:'Ocorreu um erro.'};
}};

module.exports = buscarPlugin;