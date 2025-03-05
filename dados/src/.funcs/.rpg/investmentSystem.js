class InvestmentSystem {
    constructor() {
        // Tipos de Investimentos
        this.investments = {
            // Mercado de Ações
            'stocks': {
                name: 'Mercado de Ações',
                description: 'Compra e venda de ações',
                minInvestment: 1000,
                volatility: 0.2, // 20% variação
                updateInterval: 3600000, // 1 hora
                companies: {
                    'tech_corp': {
                        name: 'Tech Corp',
                        basePrice: 100,
                        volatility: 0.3,
                        dividend: 0.05 // 5% ao dia
                    },
                    'mining_inc': {
                        name: 'Mining Inc',
                        basePrice: 200,
                        volatility: 0.2,
                        dividend: 0.03
                    },
                    'food_co': {
                        name: 'Food Co',
                        basePrice: 150,
                        volatility: 0.1,
                        dividend: 0.04
                    }
                }
            },

            // Imóveis
            'real_estate': {
                name: 'Imóveis',
                description: 'Investimento em propriedades',
                minInvestment: 10000,
                properties: {
                    'small_house': {
                        name: 'Casa Pequena',
                        price: 50000,
                        rent: 500,
                        appreciation: 0.1 // 10% ao mês
                    },
                    'apartment': {
                        name: 'Apartamento',
                        price: 100000,
                        rent: 1000,
                        appreciation: 0.15
                    },
                    'commercial': {
                        name: 'Sala Comercial',
                        price: 200000,
                        rent: 2500,
                        appreciation: 0.2
                    }
                }
            },

            // Negócios
            'business': {
                name: 'Negócios',
                description: 'Investimento em empresas',
                minInvestment: 5000,
                businesses: {
                    'shop': {
                        name: 'Loja',
                        price: 20000,
                        dailyIncome: 1000,
                        upkeep: 200,
                        employees: 2
                    },
                    'restaurant': {
                        name: 'Restaurante',
                        price: 50000,
                        dailyIncome: 3000,
                        upkeep: 500,
                        employees: 5
                    },
                    'factory': {
                        name: 'Fábrica',
                        price: 100000,
                        dailyIncome: 7000,
                        upkeep: 1000,
                        employees: 10
                    }
                }
            },

            // Criptomoedas
            'crypto': {
                name: 'Criptomoedas',
                description: 'Investimento em moedas digitais',
                minInvestment: 500,
                volatility: 0.5,
                updateInterval: 1800000, // 30 minutos
                coins: {
                    'btc': {
                        name: 'Bitcoin',
                        basePrice: 1000,
                        volatility: 0.6
                    },
                    'eth': {
                        name: 'Ethereum',
                        basePrice: 500,
                        volatility: 0.5
                    },
                    'doge': {
                        name: 'Dogecoin',
                        basePrice: 10,
                        volatility: 0.8
                    }
                }
            }
        };

        // Eventos de Mercado
        this.marketEvents = {
            'market_crash': {
                name: 'Crash do Mercado',
                effect: {
                    type: 'price_multiplier',
                    value: 0.5
                },
                duration: 86400000, // 24 horas
                chance: 0.01
            },
            'bull_market': {
                name: 'Mercado em Alta',
                effect: {
                    type: 'price_multiplier',
                    value: 1.5
                },
                duration: 86400000,
                chance: 0.01
            },
            'company_scandal': {
                name: 'Escândalo Corporativo',
                effect: {
                    type: 'company_crash',
                    value: 0.3
                },
                duration: 172800000, // 48 horas
                chance: 0.02
            },
            'tech_breakthrough': {
                name: 'Avanço Tecnológico',
                effect: {
                    type: 'tech_boost',
                    value: 2.0
                },
                duration: 86400000,
                chance: 0.01
            }
        };

        // Sistema de Análise
        this.analysis = {
            'technical': {
                name: 'Análise Técnica',
                cost: 1000,
                accuracy: 0.7
            },
            'fundamental': {
                name: 'Análise Fundamental',
                cost: 2000,
                accuracy: 0.8
            },
            'market_research': {
                name: 'Pesquisa de Mercado',
                cost: 5000,
                accuracy: 0.9
            }
        };
    }

    invest(player, type, asset, amount) {
        const investment = this.investments[type];
        if (!investment) throw new Error('❌ Tipo de investimento inválido!');

        // Verifica valor mínimo
        if (amount < investment.minInvestment) {
            throw new Error(`❌ Investimento mínimo: R$ ${investment.minInvestment}`);
        }

        // Verifica dinheiro
        if (player.money.wallet < amount) {
            throw new Error('❌ Dinheiro insuficiente!');
        }

        // Processa investimento
        switch(type) {
            case 'stocks':
                return this.buyStocks(player, asset, amount);
            case 'real_estate':
                return this.buyProperty(player, asset, amount);
            case 'business':
                return this.buyBusiness(player, asset, amount);
            case 'crypto':
                return this.buyCrypto(player, asset, amount);
        }
    }

    buyStocks(player, company, amount) {
        const stock = this.investments.stocks.companies[company];
        if (!stock) throw new Error('❌ Empresa não encontrada!');

        // Calcula preço atual
        const currentPrice = this.calculateStockPrice(stock);
        const shares = Math.floor(amount / currentPrice);

        if (shares === 0) throw new Error('❌ Valor insuficiente para comprar ações!');

        // Compra ações
        if (!player.investments) player.investments = {};
        if (!player.investments.stocks) player.investments.stocks = {};
        if (!player.investments.stocks[company]) {
            player.investments.stocks[company] = {
                shares: 0,
                averagePrice: 0
            };
        }

        // Atualiza média de preço
        const totalShares = player.investments.stocks[company].shares + shares;
        const totalCost = (player.investments.stocks[company].shares * 
                          player.investments.stocks[company].averagePrice) +
                         (shares * currentPrice);
        player.investments.stocks[company].averagePrice = totalCost / totalShares;
        player.investments.stocks[company].shares = totalShares;

        // Remove dinheiro
        player.money.wallet -= shares * currentPrice;

        return {
            success: true,
            shares: shares,
            price: currentPrice,
            total: shares * currentPrice,
            message: `📈 *AÇÕES COMPRADAS*\n\n` +
                    `${stock.name}\n` +
                    `Ações: ${shares}\n` +
                    `Preço: R$ ${currentPrice}\n` +
                    `Total: R$ ${shares * currentPrice}\n\n` +
                    `Média: R$ ${player.investments.stocks[company].averagePrice}`
        };
    }

    buyProperty(player, propertyType, amount) {
        const property = this.investments.real_estate.properties[propertyType];
        if (!property) throw new Error('❌ Propriedade não encontrada!');

        // Verifica se pode comprar
        if (amount < property.price) {
            throw new Error(`❌ Esta propriedade custa R$ ${property.price}!`);
        }

        // Compra propriedade
        if (!player.investments) player.investments = {};
        if (!player.investments.properties) player.investments.properties = {};
        if (!player.investments.properties[propertyType]) {
            player.investments.properties[propertyType] = [];
        }

        player.investments.properties[propertyType].push({
            purchasePrice: property.price,
            purchaseDate: Date.now(),
            lastRent: Date.now()
        });

        // Remove dinheiro
        player.money.wallet -= property.price;

        return {
            success: true,
            price: property.price,
            rent: property.rent,
            message: `🏠 *PROPRIEDADE COMPRADA*\n\n` +
                    `${property.name}\n` +
                    `Preço: R$ ${property.price}\n` +
                    `Aluguel: R$ ${property.rent}/dia\n` +
                    `Valorização: ${property.appreciation * 100}% ao mês`
        };
    }

    buyBusiness(player, businessType, amount) {
        const business = this.investments.business.businesses[businessType];
        if (!business) throw new Error('❌ Negócio não encontrado!');

        // Verifica se pode comprar
        if (amount < business.price) {
            throw new Error(`❌ Este negócio custa R$ ${business.price}!`);
        }

        // Compra negócio
        if (!player.investments) player.investments = {};
        if (!player.investments.businesses) player.investments.businesses = {};
        if (!player.investments.businesses[businessType]) {
            player.investments.businesses[businessType] = [];
        }

        player.investments.businesses[businessType].push({
            purchasePrice: business.price,
            purchaseDate: Date.now(),
            lastIncome: Date.now(),
            employees: business.employees
        });

        // Remove dinheiro
        player.money.wallet -= business.price;

        return {
            success: true,
            price: business.price,
            income: business.dailyIncome,
            message: `💼 *NEGÓCIO COMPRADO*\n\n` +
                    `${business.name}\n` +
                    `Preço: R$ ${business.price}\n` +
                    `Renda: R$ ${business.dailyIncome}/dia\n` +
                    `Manutenção: R$ ${business.upkeep}/dia\n` +
                    `Funcionários: ${business.employees}`
        };
    }

    buyCrypto(player, coin, amount) {
        const crypto = this.investments.crypto.coins[coin];
        if (!crypto) throw new Error('❌ Criptomoeda não encontrada!');

        // Calcula preço atual
        const currentPrice = this.calculateCryptoPrice(crypto);
        const coins = Math.floor(amount / currentPrice);

        if (coins === 0) throw new Error('❌ Valor insuficiente para comprar moedas!');

        // Compra moedas
        if (!player.investments) player.investments = {};
        if (!player.investments.crypto) player.investments.crypto = {};
        if (!player.investments.crypto[coin]) {
            player.investments.crypto[coin] = {
                amount: 0,
                averagePrice: 0
            };
        }

        // Atualiza média de preço
        const totalCoins = player.investments.crypto[coin].amount + coins;
        const totalCost = (player.investments.crypto[coin].amount * 
                          player.investments.crypto[coin].averagePrice) +
                         (coins * currentPrice);
        player.investments.crypto[coin].averagePrice = totalCost / totalCoins;
        player.investments.crypto[coin].amount = totalCoins;

        // Remove dinheiro
        player.money.wallet -= coins * currentPrice;

        return {
            success: true,
            coins: coins,
            price: currentPrice,
            total: coins * currentPrice,
            message: `🪙 *CRIPTOMOEDAS COMPRADAS*\n\n` +
                    `${crypto.name}\n` +
                    `Quantidade: ${coins}\n` +
                    `Preço: R$ ${currentPrice}\n` +
                    `Total: R$ ${coins * currentPrice}\n\n` +
                    `Média: R$ ${player.investments.crypto[coin].averagePrice}`
        };
    }

    calculateStockPrice(stock) {
        const variation = (Math.random() - 0.5) * 2 * stock.volatility;
        return Math.floor(stock.basePrice * (1 + variation));
    }

    calculateCryptoPrice(crypto) {
        const variation = (Math.random() - 0.5) * 2 * crypto.volatility;
        return Math.floor(crypto.basePrice * (1 + variation));
    }

    collectIncome(player) {
        let totalIncome = 0;
        let report = [];

        // Coleta dividendos
        if (player.investments?.stocks) {
            Object.entries(player.investments.stocks).forEach(([company, investment]) => {
                const stock = this.investments.stocks.companies[company];
                const dividend = Math.floor(investment.shares * stock.basePrice * stock.dividend);
                totalIncome += dividend;
                report.push(`${stock.name}: R$ ${dividend} (dividendos)`);
            });
        }

        // Coleta aluguéis
        if (player.investments?.properties) {
            Object.entries(player.investments.properties).forEach(([type, properties]) => {
                const property = this.investments.real_estate.properties[type];
                const rent = properties.length * property.rent;
                totalIncome += rent;
                report.push(`${property.name}: R$ ${rent} (aluguel)`);
            });
        }

        // Coleta renda dos negócios
        if (player.investments?.businesses) {
            Object.entries(player.investments.businesses).forEach(([type, businesses]) => {
                const business = this.investments.business.businesses[type];
                const income = businesses.length * (business.dailyIncome - business.upkeep);
                totalIncome += income;
                report.push(`${business.name}: R$ ${income} (lucro)`);
            });
        }

        // Adiciona dinheiro
        player.money.wallet += totalIncome;

        return {
            success: true,
            income: totalIncome,
            report: report,
            message: `💰 *RENDIMENTOS COLETADOS*\n\n` +
                    report.join('\n') +
                    `\n\nTotal: R$ ${totalIncome}`
        };
    }

    analyzeMarket(player, type, asset) {
        const analysis = this.analysis[type];
        if (!analysis) throw new Error('❌ Tipo de análise inválido!');

        // Verifica dinheiro
        if (player.money.wallet < analysis.cost) {
            throw new Error(`❌ Uma ${analysis.name} custa R$ ${analysis.cost}!`);
        }

        // Remove dinheiro
        player.money.wallet -= analysis.cost;

        // Gera previsão
        const prediction = Math.random() < analysis.accuracy;
        const trend = Math.random() < 0.5 ? 'alta' : 'baixa';

        return {
            success: true,
            cost: analysis.cost,
            prediction: prediction,
            trend: trend,
            message: `📊 *ANÁLISE DE MERCADO*\n\n` +
                    `${analysis.name}\n` +
                    `Previsão: ${trend}\n` +
                    `Confiança: ${analysis.accuracy * 100}%\n\n` +
                    `Custo: R$ ${analysis.cost}`
        };
    }

    formatInvestmentList() {
        let text = `💰 *INVESTIMENTOS* 💰\n\n`;

        Object.entries(this.investments).forEach(([type, investment]) => {
            text += `*${investment.name}*\n`;
            text += `├ ${investment.description}\n`;
            text += `└ Mínimo: R$ ${investment.minInvestment}\n\n`;

            if (type === 'stocks') {
                text += `📈 *AÇÕES*\n`;
                Object.entries(investment.companies).forEach(([_, company]) => {
                    text += `├ ${company.name}\n`;
                    text += `│ ├ Preço Base: R$ ${company.basePrice}\n`;
                    text += `│ └ Dividendo: ${company.dividend * 100}%\n`;
                });
                text += '\n';
            }

            if (type === 'real_estate') {
                text += `🏠 *IMÓVEIS*\n`;
                Object.entries(investment.properties).forEach(([_, property]) => {
                    text += `├ ${property.name}\n`;
                    text += `│ ├ Preço: R$ ${property.price}\n`;
                    text += `│ ├ Aluguel: R$ ${property.rent}\n`;
                    text += `│ └ Valorização: ${property.appreciation * 100}%\n`;
                });
                text += '\n';
            }

            if (type === 'business') {
                text += `💼 *NEGÓCIOS*\n`;
                Object.entries(investment.businesses).forEach(([_, business]) => {
                    text += `├ ${business.name}\n`;
                    text += `│ ├ Preço: R$ ${business.price}\n`;
                    text += `│ ├ Renda: R$ ${business.dailyIncome}\n`;
                    text += `│ ├ Manutenção: R$ ${business.upkeep}\n`;
                    text += `│ └ Funcionários: ${business.employees}\n`;
                });
                text += '\n';
            }

            if (type === 'crypto') {
                text += `🪙 *CRIPTOMOEDAS*\n`;
                Object.entries(investment.coins).forEach(([_, coin]) => {
                    text += `├ ${coin.name}\n`;
                    text += `│ ├ Preço Base: R$ ${coin.basePrice}\n`;
                    text += `│ └ Volatilidade: ${coin.volatility * 100}%\n`;
                });
                text += '\n';
            }
        });

        return text;
    }

    formatPortfolio(player) {
        if (!player.investments) {
            return `💼 *SEU PORTFÓLIO* 💼\n\n` +
                   `_Você não tem investimentos!_\n` +
                   `Use /investir para começar.`;
        }

        let text = `💼 *SEU PORTFÓLIO* 💼\n\n`;
        let totalValue = 0;

        // Ações
        if (player.investments.stocks) {
            text += `📈 *AÇÕES*\n`;
            Object.entries(player.investments.stocks).forEach(([company, investment]) => {
                const stock = this.investments.stocks.companies[company];
                const currentPrice = this.calculateStockPrice(stock);
                const value = investment.shares * currentPrice;
                totalValue += value;

                text += `├ ${stock.name}\n`;
                text += `│ ├ Ações: ${investment.shares}\n`;
                text += `│ ├ Média: R$ ${investment.averagePrice}\n`;
                text += `│ ├ Atual: R$ ${currentPrice}\n`;
                text += `│ └ Total: R$ ${value}\n`;
            });
            text += '\n';
        }

        // Imóveis
        if (player.investments.properties) {
            text += `🏠 *IMÓVEIS*\n`;
            Object.entries(player.investments.properties).forEach(([type, properties]) => {
                const property = this.investments.real_estate.properties[type];
                const value = properties.length * property.price;
                totalValue += value;

                text += `├ ${property.name}\n`;
                text += `│ ├ Quantidade: ${properties.length}\n`;
                text += `│ ├ Aluguel: R$ ${properties.length * property.rent}/dia\n`;
                text += `│ └ Valor: R$ ${value}\n`;
            });
            text += '\n';
        }

        // Negócios
        if (player.investments.businesses) {
            text += `💼 *NEGÓCIOS*\n`;
            Object.entries(player.investments.businesses).forEach(([type, businesses]) => {
                const business = this.investments.business.businesses[type];
                const value = businesses.length * business.price;
                totalValue += value;

                text += `├ ${business.name}\n`;
                text += `│ ├ Quantidade: ${businesses.length}\n`;
                text += `│ ├ Renda: R$ ${businesses.length * 
                    (business.dailyIncome - business.upkeep)}/dia\n`;
                text += `│ └ Valor: R$ ${value}\n`;
            });
            text += '\n';
        }

        // Criptomoedas
        if (player.investments.crypto) {
            text += `🪙 *CRIPTOMOEDAS*\n`;
            Object.entries(player.investments.crypto).forEach(([coin, investment]) => {
                const crypto = this.investments.crypto.coins[coin];
                const currentPrice = this.calculateCryptoPrice(crypto);
                const value = investment.amount * currentPrice;
                totalValue += value;

                text += `├ ${crypto.name}\n`;
                text += `│ ├ Quantidade: ${investment.amount}\n`;
                text += `│ ├ Média: R$ ${investment.averagePrice}\n`;
                text += `│ ├ Atual: R$ ${currentPrice}\n`;
                text += `│ └ Total: R$ ${value}\n`;
            });
        }

        text += `\n💰 *VALOR TOTAL: R$ ${totalValue}*`;

        return text;
    }
}

module.exports = new InvestmentSystem();
