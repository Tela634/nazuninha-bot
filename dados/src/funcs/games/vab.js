const fs = require('fs');
const axios = require('axios');

function userAgent() {
  const oos = [
    'Macintosh; Intel Mac OS X 10_15_7', 'Macintosh; Intel Mac OS X 10_15_5',
    'Macintosh; Intel Mac OS X 10_11_6', 'Macintosh; Intel Mac OS X 10_6_6',
    'Windows NT 10.0; Win64; x64', 'Windows NT 10.0; WOW64', 'Windows NT 10.0'
  ];
  return `Mozilla/5.0 (${oos[Math.floor(Math.random() * oos.length)]}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${Math.floor(Math.random() * 3) + 87}.0.${Math.floor(Math.random() * 190) + 4100}.${Math.floor(Math.random() * 50) + 140} Safari/537.36`;
}

class ScrapperData {

  static async getJS(url, config = {}) {
    try {
      const response = await axios.get(url, config);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao buscar arquivo JS: ${error.message}`);
    }
  }

  static async vab(idUrl, reload) {
    const user = userAgent();
    const psycatgamesPath = __dirname + '/../json/vab.json';

    if (fs.existsSync(psycatgamesPath) && !reload) {
      try {
        return JSON.parse(fs.readFileSync(psycatgamesPath, 'utf-8'));
      } catch (error) {
        throw new Error("Erro ao ler arquivo JSON armazenado.");
      }
    }

    try {
      // Faz o download do arquivo .js
      const jsContent = await this.getJS(`https://psycatgames.com/pt/app/would-you-rather/${idUrl}`, {
        headers: {
          referer: 'https://psycatgames.com/pt/app/would-you-rather/',
          'User-Agent': user
        }
      });

      // Extrai o objeto `data` do conteúdo do arquivo .js
      const dataMatch = jsContent.match(/const data = (\[.*?\];)/s);
      if (!dataMatch) throw new Error("Não foi possível encontrar os dados no arquivo JS.");

      // Converte a string do objeto `data` em um objeto JavaScript
      const data = eval(dataMatch[1]);

      // Salva os dados em um arquivo JSON
      fs.writeFileSync(psycatgamesPath, JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      throw new Error(`Erro ao processar os dados: ${error.message}`);
    }
  }
}

module.exports = {
  vab: (reload, url = 't.8627388fc85dd6bb72683bd2fa08e575.js') => ScrapperData.vab(url, reload)
};