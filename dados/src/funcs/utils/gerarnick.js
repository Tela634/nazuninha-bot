const axios = require('axios');
const { DOMParser } = require('linkedom');

async function styleText(text) {
    try {
        const { data } = await axios.get(`http://qaz.wtf/u/convert.cgi?text=${encodeURIComponent(text)}`);

        const document = new DOMParser().parseFromString(data, 'text/html');

        let result = [];
        
        document.querySelectorAll('table tr').forEach(row => {
            const secondTd = row.querySelector('td:nth-child(2)');
            if (secondTd) {
                result.push(secondTd.textContent.trim());
            }
        });

        return result;
    } catch (err) {
        console.error("Erro ao gerar nick:", err.message);
        return [];
    }
}

module.exports = styleText;