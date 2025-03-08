const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

function userAgent() {
    const oos = [
        'Macintosh; Intel Mac OS X 10_15_7', 'Macintosh; Intel Mac OS X 10_15_5',
        'Macintosh; Intel Mac OS X 10_11_6', 'Macintosh; Intel Mac OS X 10_6_6',
        'Windows NT 10.0; Win64; x64', 'Windows NT 10.0; WOW64', 'Windows NT 10.0'
    ];
    return `Mozilla/5.0 (${oos[Math.floor(Math.random() * oos.length)]}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${Math.floor(Math.random() * 3) + 87}.0.${Math.floor(Math.random() * 190) + 4100}.${Math.floor(Math.random() * 50) + 140} Safari/537.36`;
}

class ScrapperData {
    
    static async getHTML(url, config = {}) {
        try {
            const response = await axios.get(url, config);
            return response.data;
        } catch (error) {
            throw new Error(`Erro ao buscar HTML: ${error.message}`);
        }
    }

    static async vab(idUrl, reload) {
        const user = userAgent();
        const psycatgamesPath = __dirname+'/../json/vab.json';

        if (fs.existsSync(psycatgamesPath) && !reload) {
            try {
                return JSON.parse(fs.readFileSync(psycatgamesPath, 'utf-8'));
            } catch (error) {
                throw new Error("Erro ao ler arquivo JSON armazenado.");
            }
        }

        try {
            const html = await this.getHTML(`https://psycatgames.com/pt/app/would-you-rather/${idUrl}`, {
                headers: {
                    referer: 'https://psycatgames.com/pt/app/would-you-rather/',
                    'User-Agent': user
                }
            });

            const $ = cheerio.load(html);
            const scriptContent = $('script').map((i, el) => $(el).html()).get().find(text => text.includes('const TK='));

            if (!scriptContent) throw new Error("Não foi possível encontrar os dados na página.");

            const rawData = scriptContent.split('const TK=')[0].split(/{id:/g).filter(v => !/data=/.test(v)).map(i => {
                const array = i.split(/nsfw:(true|false),questions:/g);
                const nsfw = array[1] !== 'false';
                const id = array[0]?.replace(/"/g, '').replace(',', '');
                const questions = JSON.parse(array[2]?.replace(/},/g, '').replace(/}]/g, ''));
                
                return {
                    id,
                    nsfw,
                    questions: questions.map(v => {
                        const g = v.replace('Você prefere ', '').split(' ou ').map(y => y.replace(' / ', '/').replace('?', ''));
                        return { pergunta1: g[0], pergunta2: g[1] };
                    })
                };
            });

            fs.writeFileSync(psycatgamesPath, JSON.stringify(rawData, null, 2));
            return rawData;
        } catch (error) {
            throw new Error(`Erro ao processar os dados: ${error.message}`);
        }
    }
}

module.exports = {
    vab: (reload, url = 't.8627388fc85dd6bb72683bd2fa08e575.js') => ScrapperData.vab(url, reload)
};