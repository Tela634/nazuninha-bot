// Sistema de Pesquisa de plugin Minecraft
// Sistema único, diferente de qualquer outro bot
// Criador: Hiudy
// Caso for usar deixe o caralho dos créditos 
// <3

const axios = require("axios");
const { parseHTML } = require("linkedom");

async function buscarPlugin(nome) {
    try {
        const url = `https://modrinth.com/plugins?q=${encodeURIComponent(nome)}`;
        const { data } = await axios.get(url);
        const { document } = parseHTML(data);

        const primeiroProjeto = document.querySelector(".project-card.base-card.padding-bg");
        if (!primeiroProjeto) return { ok: false, msg: "Nenhum plugin foi encontrado." };

        const titulo = primeiroProjeto.querySelector(".name")?.textContent.trim() || "Sem título";
        const descricao = primeiroProjeto.querySelector(".description")?.textContent.trim() || "Sem descrição";
        const link = "https://modrinth.com" + (primeiroProjeto.querySelector("a")?.getAttribute("href") || "#");
        let icone = primeiroProjeto.querySelector("img")?.getAttribute("src") || "";
        
        if (icone && !icone.startsWith("http")) icone = "https://modrinth.com" + icone;
        
        const autor = primeiroProjeto.querySelector(".author .title-link")?.textContent.trim() || "Desconhecido";

        return { ok: true, name: titulo, desc: descricao, url: link, image: icone, creator: autor };
    } catch (erro) {
        console.error("Erro ao buscar plugin:", erro);
        return { ok: false, msg: "Ocorreu um erro." };
    }
}

module.exports = buscarPlugin;