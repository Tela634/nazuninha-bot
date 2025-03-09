// Sistema de Gerar nick
// Sistema único, diferente de qualquer outro bot
// Criador: Hiudy
// Caso for usar deixe o caralho dos créditos 
// <3

const axios = require('axios');
const { parseHTML } = require('linkedom');

async function styleText(text) {
    return new Promise((resolve, reject) => {
        axios.get('http://qaz.wtf/u/convert.cgi?text=' + text)
            .then(({ data }) => {
                const { document } = parseHTML(data);
                let result = [];
                const rows = document.querySelectorAll('table > tbody > tr');

                rows.forEach(row => {
                    const styledText = row.querySelector('td:nth-child(2)').textContent.trim();
                    result.push(styledText);
                });

                resolve(result);
            })
            .catch(err => reject(err));
    });
}

module.exports = styleText;