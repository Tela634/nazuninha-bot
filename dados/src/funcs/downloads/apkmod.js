const swiftly = require('swiftly');
const { DOMParser } = require('linkedom');

async function apkMod(searchText) { // By Hiudy
    try {
        // Busca a página de pesquisa
        const searchResponse = await swiftly.get(`https://apkmodct.com/?s=${searchText}`);
        const searchDoc = new DOMParser().parseFromString(searchResponse.data, 'text/html');

        // Pega o primeiro post da busca
        const postElement = searchDoc.querySelector('div.post a');
        if (!postElement) return { error: 'nenhum resultado encontrado' };

        const postUrl = postElement.href;
        const postTitle = postElement.title;
        const imageUrl = searchDoc.querySelector('figure.home-icon img')?.src || 'não encontrada';

        // Acessa a página do post
        const postResponse = await swiftly.get(postUrl);
        const postDoc = new DOMParser().parseFromString(postResponse.data, 'text/html');

        // Pega a descrição
        const description = postDoc.querySelector('meta[name="description"]')?.content || 'não disponível';

        // Extrai detalhes da tabela
        const details = {};
        postDoc.querySelectorAll('table.table-bordered tr').forEach(row => {
            const key = row.querySelector('th')?.textContent.trim().toLowerCase();
            const value = row.querySelector('td')?.textContent.trim();
            if (key && value) details[key] = value;
        });

        // Pega o link principal
        const mainPicUrl = postDoc.querySelector('div.main-pic a')?.href;
        if (!mainPicUrl) return { error: 'nenhum link principal encontrado' };

        // Acessa a página de download
        const downloadResponse = await swiftly.get(mainPicUrl);
        const downloadDoc = new DOMParser().parseFromString(downloadResponse.data, 'text/html');

        // Pega o link de download
        const downloadUrl = downloadDoc.querySelector('div.col-xs-12 a')?.href;
        if (!downloadUrl) return { error: 'nenhum link de download encontrado' };

        return {
            title: postTitle || 'sem título',
            description,
            image: imageUrl,
            details: {
                name: details['name'] || 'não disponível',
                updated: details['updated'] || 'não disponível',
                version: details['version'] || 'não disponível',
                category: details['category'] || 'não disponível',
                modinfo: details['mod info'] || 'não disponível',
                size: details['size'] || 'não disponível',
                rate: details['rate'] || 'não disponível',
                requires: details['requires android'] || 'não disponível',
                developer: details['developer'] || 'não disponível',
                googleplay: details['google play'] || 'não disponível',
                downloads: details['downloads'] || 'não disponível',
            },
            download: downloadUrl,
        };
    } catch (error) {
        return { error: 'ocorreu um erro' };
    }
}

module.exports = apkMod;