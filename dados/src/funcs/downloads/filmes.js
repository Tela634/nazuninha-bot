// Sistema de Assistir filmes
// Sistema único, diferente de qualquer outro bot
// Criador: Hiudy
// Caso for usar deixe o caralho dos créditos 
// <3

const swiftly = require('swiftly');

// Função para buscar filmes
async function Filmes(texto) {
    const results = await search(texto);
    if (results.length === 0) {
        console.log('Nenhum resultado encontrado.');
        return null;
    }

    for (const result of results) {
        if (result.link.includes('/video/')) {
            try {
                // Extrair dados do vídeo usando o swiftly.scrape
                const videoData = await swiftly.scrape(result.link, {
                    videoUrl: 'source@src', // Seleciona a URL do vídeo na tag <source>
                    img: 'video@poster',    // Seleciona o poster do vídeo na tag <video>
                    name: 'meta[property="og:title"]@content' // Seleciona o título do vídeo na meta tag
                });

                // Verificar se os dados foram extraídos corretamente
                if (videoData.videoUrl && videoData.img && videoData.name) {
                    return {
                        img: videoData.img,
                        name: videoData.name,
                        url: videoData.videoUrl
                    };
                } else {
                    console.log('Dados do vídeo incompletos no link:', result.link);
                }
            } catch (error) {
                console.error(`Erro ao buscar vídeo em ${result.link}:`, error.message);
            }
        }
    }

    console.log('Nenhum vídeo encontrado.');
    return null;
}

// Função de busca no Google Custom Search
async function search(query) {
    const keys = [
        "AIzaSyD51LedjJnOulDkA6u8nfmt17cnIlJ7igc",
        "AIzaSyDbQwjgQforqkA-cHt0omRNX4OQsJ3ocvg",
        "AIzaSyA9wPFHMwnkaBLpnLTP9d8lgEoHAsISQN0",
        "AIzaSyB1wjSU3NfUmc32bus34j9BmSDBKTKaEYg",
        "AIzaSyBm0L9hwLyZ9jhV3HGVcNKQ6znG7_zbSoU",
        "AIzaSyAm_B1DHAK_kCVWHPACK1XAe8sVry1Fj0U"
    ];

    for (let key of keys) {
        try {
            const response = await swiftly.get('https://www.googleapis.com/customsearch/v1', {
                params: {
                    q: query,
                    key: key,
                    cx: '32a7e8cb9ffc24cd5'
                }
            });

            if (response.items) {
                return response.items.map(item => ({
                    title: item.title,
                    link: item.link
                }));
            }
        } catch (error) {
            console.error(`Erro com a chave ${key}:`, error.message);
        }
    }
    return [];
}

module.exports = Filmes;