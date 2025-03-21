const swiftly = require('swiftly');

async function apkMod(searchText) { // By Hiudy
    try {
        const searchResults = await swiftly.scrape(`https://apkmodct.com/?s=${searchText}`, {
            selector: 'div.post a',
            transform: (el) => ({
                postUrl: el.href,
                postTitle: el.title
            })
        });

        if (!searchResults.length) return { error: 'nenhum resultado encontrado' };

        const { postUrl, postTitle } = searchResults[0];

        const imageResults = await swiftly.scrape(`https://apkmodct.com/?s=${searchText}`, {
            selector: 'figure.home-icon img',
            transform: (el) => el.src
        });

        const imageUrl = imageResults[0] || 'não encontrada';

        const postDetails = await swiftly.scrape(postUrl, {
            selector: 'meta[name="description"]',
            transform: (el) => el.content || 'não disponível'
        });

        const description = postDetails[0];

        const details = await swiftly.scrape(postUrl, {
            selector: 'table.table-bordered tr',
            transform: (el) => ({
                key: el.querySelector('th')?.textContent.trim().toLowerCase(),
                value: el.querySelector('td')?.textContent.trim()
            })
        });

        const detailsMap = {};
        details.forEach(({ key, value }) => {
            if (key && value) detailsMap[key] = value;
        });

        const mainPicResults = await swiftly.scrape(postUrl, {
            selector: 'div.main-pic a',
            transform: (el) => el.href
        });

        const mainPicUrl = mainPicResults[0];

        if (!mainPicUrl) return { error: 'nenhum link principal encontrado' };

        const downloadResults = await swiftly.scrape(mainPicUrl, {
            selector: 'div.col-xs-12 a',
            transform: (el) => el.href
        });

        const downloadUrl = downloadResults[0];

        if (!downloadUrl) return { error: 'nenhum link de download encontrado' };

        return {
            title: postTitle || 'sem título',
            description,
            image: imageUrl,
            details: {
                name: detailsMap['name'] || 'não disponível',
                updated: detailsMap['updated'] || 'não disponível',
                version: detailsMap['version'] || 'não disponível',
                category: detailsMap['category'] || 'não disponível',
                modinfo: detailsMap['mod info'] || 'não disponível',
                size: detailsMap['size'] || 'não disponível',
                rate: detailsMap['rate'] || 'não disponível',
                requires: detailsMap['requires android'] || 'não disponível',
                developer: detailsMap['developer'] || 'não disponível',
                googleplay: detailsMap['google play'] || 'não disponível',
                downloads: detailsMap['downloads'] || 'não disponível',
            },
            download: downloadUrl,
        };
    } catch (error) {
        return { error: 'ocorreu um erro' };
    }
}

module.exports = apkMod;