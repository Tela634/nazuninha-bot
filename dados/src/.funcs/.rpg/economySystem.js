class EconomySystem {
    constructor() {
        this.shops = {
            // Loja Geral
            'geral': {
                name: 'Loja Geral',
                description: 'Itens básicos e utilitários',
                items: {
                    'pocao_hp': {
                        name: 'Poção de Vida',
                        description: 'Recupera 100 HP',
                        price: 100,
                        effect: {
                            type: 'heal',
                            value: 100
                        }
                    },
                    'pocao_mp': {
                        name: 'Poção de Mana',
                        description: 'Recupera 50 MP',
                        price: 150,
                        effect: {
                            type: 'mana',
                            value: 50
                        }
                    },
                    'corda': {
                        name: 'Corda',
                        description: 'Útil para exploração',
                        price: 50,
                        type: 'tool'
                    },
                    'tocha': {
                        name: 'Tocha',
                        description: 'Ilumina áreas escuras',
                        price: 30,
                        type: 'tool'
                    }
                }
            },

            // Loja de Armas
            'armas': {
                name: 'Ferreiro',
                description: 'Armas e equipamentos de combate',
                items: {
                    'espada_ferro': {
                        name: 'Espada de Ferro',
                        description: 'Arma básica de combate',
                        price: 500,
                        stats: {
                            attack: 20
                        },
                        type: 'weapon'
                    },
                    'arco_curto': {
                        name: 'Arco Curto',
                        description: 'Arma básica à distância',
                        price: 400,
                        stats: {
                            attack: 15,
                            range: 3
                        },
                        type: 'weapon'
                    },
                    'escudo_madeira': {
                        name: 'Escudo de Madeira',
                        description: 'Proteção básica',
                        price: 300,
                        stats: {
                            defense: 10
                        },
                        type: 'shield'
                    }
                }
            },

            // Loja de Armaduras
            'armaduras': {
                name: 'Armeiro',
                description: 'Armaduras e proteções',
                items: {
                    'armadura_couro': {
                        name: 'Armadura de Couro',
                        description: 'Proteção leve básica',
                        price: 400,
                        stats: {
                            defense: 15,
                            speed: -5
                        },
                        type: 'armor'
                    },
                    'armadura_ferro': {
                        name: 'Armadura de Ferro',
                        description: 'Proteção média',
                        price: 800,
                        stats: {
                            defense: 30,
                            speed: -10
                        },
                        type: 'armor'
                    },
                    'botas_couro': {
                        name: 'Botas de Couro',
                        description: 'Proteção para os pés',
                        price: 200,
                        stats: {
                            defense: 5,
                            speed: 5
                        },
                        type: 'boots'
                    }
                }
            },

            // Loja de Magias
            'magias': {
                name: 'Loja de Magias',
                description: 'Pergaminhos e itens mágicos',
                items: {
                    'pergaminho_fogo': {
                        name: 'Pergaminho de Fogo',
                        description: 'Conjura uma bola de fogo',
                        price: 1000,
                        effect: {
                            type: 'spell',
                            element: 'fire',
                            damage: 50
                        }
                    },
                    'pergaminho_cura': {
                        name: 'Pergaminho de Cura',
                        description: 'Conjura uma magia de cura',
                        price: 800,
                        effect: {
                            type: 'spell',
                            element: 'holy',
                            heal: 100
                        }
                    },
                    'cristal_mana': {
                        name: 'Cristal de Mana',
                        description: 'Aumenta regeneração de mana',
                        price: 1500,
                        effect: {
                            type: 'passive',
                            manaRegen: 2
                        }
                    }
                }
            }
        };

        // Sistema de Mercado
        this.market = {
            // Lista de itens à venda por jogadores
            listings: new Map(),
            
            // Taxa de mercado (5%)
            fee: 0.05,

            // Limite de listagens por jogador
            maxListingsPerPlayer: 10,

            // Duração máxima de uma listagem (7 dias)
            maxListingDuration: 7 * 24 * 60 * 60 * 1000
        };

        // Sistema de Banco
        this.bank = {
            // Taxa de juros diária (0.1%)
            interestRate: 0.001,

            // Taxa de transferência (2%)
            transferFee: 0.02,

            // Limite de transferência diária
            dailyTransferLimit: 100000
        };
    }

    buyItem(player, shopId, itemId, quantity = 1) {
        const shop = this.shops[shopId];
        if (!shop) throw new Error('❌ Loja não encontrada!');

        const item = shop.items[itemId];
        if (!item) throw new Error('❌ Item não encontrado!');

        const totalCost = item.price * quantity;
        if (player.money.wallet < totalCost) {
            throw new Error(`❌ Você precisa de R$ ${totalCost} para comprar ${quantity}x ${item.name}!`);
        }

        // Remove dinheiro
        player.money.wallet -= totalCost;

        // Adiciona item ao inventário
        if (!player.inventory[itemId]) {
            player.inventory[itemId] = 0;
        }
        player.inventory[itemId] += quantity;

        return {
            success: true,
            message: `✅ Comprou ${quantity}x ${item.name} por R$ ${totalCost}!`
        };
    }

    sellItem(player, itemId, quantity = 1) {
        if (!player.inventory[itemId] || player.inventory[itemId] < quantity) {
            throw new Error('❌ Você não tem este item em quantidade suficiente!');
        }

        // Encontra o item em alguma loja
        let item;
        for (const shop of Object.values(this.shops)) {
            if (shop.items[itemId]) {
                item = shop.items[itemId];
                break;
            }
        }
        if (!item) throw new Error('❌ Item não pode ser vendido!');

        // Calcula valor de venda (50% do preço de compra)
        const value = Math.floor(item.price * 0.5) * quantity;

        // Remove item do inventário
        player.inventory[itemId] -= quantity;
        if (player.inventory[itemId] <= 0) {
            delete player.inventory[itemId];
        }

        // Adiciona dinheiro
        player.money.wallet += value;

        return {
            success: true,
            message: `✅ Vendeu ${quantity}x ${item.name} por R$ ${value}!`
        };
    }

    createMarketListing(player, itemId, quantity, price) {
        if (!player.inventory[itemId] || player.inventory[itemId] < quantity) {
            throw new Error('❌ Você não tem este item em quantidade suficiente!');
        }

        // Verifica limite de listagens
        const playerListings = Array.from(this.market.listings.values())
            .filter(l => l.sellerId === player.id);
        if (playerListings.length >= this.market.maxListingsPerPlayer) {
            throw new Error('❌ Você atingiu o limite de listagens!');
        }

        // Remove item do inventário
        player.inventory[itemId] -= quantity;
        if (player.inventory[itemId] <= 0) {
            delete player.inventory[itemId];
        }

        // Cria listagem
        const listing = {
            id: `listing_${Date.now()}`,
            sellerId: player.id,
            itemId: itemId,
            quantity: quantity,
            price: price,
            createdAt: Date.now(),
            expiresAt: Date.now() + this.market.maxListingDuration
        };

        this.market.listings.set(listing.id, listing);

        return {
            success: true,
            listing: listing,
            message: `✅ Item listado no mercado!\n` +
                    `${quantity}x ${itemId} por R$ ${price} cada`
        };
    }

    buyFromMarket(player, listingId) {
        const listing = this.market.listings.get(listingId);
        if (!listing) throw new Error('❌ Listagem não encontrada!');
        if (listing.expiresAt <= Date.now()) {
            this.market.listings.delete(listingId);
            throw new Error('❌ Esta listagem expirou!');
        }

        const totalCost = listing.price * listing.quantity;
        const fee = Math.floor(totalCost * this.market.fee);
        const finalCost = totalCost + fee;

        if (player.money.wallet < finalCost) {
            throw new Error(`❌ Você precisa de R$ ${finalCost} (inclui taxa de ${fee})!`);
        }

        // Remove dinheiro do comprador
        player.money.wallet -= finalCost;

        // Adiciona item ao inventário do comprador
        if (!player.inventory[listing.itemId]) {
            player.inventory[listing.itemId] = 0;
        }
        player.inventory[listing.itemId] += listing.quantity;

        // Remove listagem
        this.market.listings.delete(listingId);

        return {
            success: true,
            message: `✅ Comprou ${listing.quantity}x ${listing.itemId} por R$ ${finalCost} (taxa: R$ ${fee})!`
        };
    }

    deposit(player, amount) {
        if (amount <= 0) throw new Error('❌ Valor inválido!');
        if (player.money.wallet < amount) {
            throw new Error('❌ Você não tem dinheiro suficiente!');
        }

        // Transfere dinheiro
        player.money.wallet -= amount;
        if (!player.money.bank) player.money.bank = 0;
        player.money.bank += amount;

        return {
            success: true,
            message: `✅ Depositou R$ ${amount}!\n` +
                    `Saldo: R$ ${player.money.bank}`
        };
    }

    withdraw(player, amount) {
        if (amount <= 0) throw new Error('❌ Valor inválido!');
        if (!player.money.bank || player.money.bank < amount) {
            throw new Error('❌ Você não tem dinheiro suficiente no banco!');
        }

        // Transfere dinheiro
        player.money.bank -= amount;
        player.money.wallet += amount;

        return {
            success: true,
            message: `✅ Sacou R$ ${amount}!\n` +
                    `Saldo: R$ ${player.money.bank}`
        };
    }

    transfer(sender, receiverId, amount) {
        if (amount <= 0) throw new Error('❌ Valor inválido!');
        if (!sender.money.bank || sender.money.bank < amount) {
            throw new Error('❌ Você não tem dinheiro suficiente no banco!');
        }

        // Verifica limite diário
        const today = new Date().toDateString();
        if (!sender.transfers) sender.transfers = {};
        if (!sender.transfers[today]) sender.transfers[today] = 0;
        if (sender.transfers[today] + amount > this.bank.dailyTransferLimit) {
            throw new Error(`❌ Limite diário de transferência excedido!`);
        }

        // Calcula taxa
        const fee = Math.floor(amount * this.bank.transferFee);
        const totalAmount = amount + fee;

        if (sender.money.bank < totalAmount) {
            throw new Error(`❌ Você precisa de R$ ${totalAmount} (inclui taxa de ${fee})!`);
        }

        // Atualiza limite diário
        sender.transfers[today] += amount;

        // Remove dinheiro do remetente
        sender.money.bank -= totalAmount;

        return {
            success: true,
            fee: fee,
            message: `✅ Transferiu R$ ${amount} para ${receiverId}\n` +
                    `Taxa: R$ ${fee}\n` +
                    `Saldo: R$ ${sender.money.bank}`
        };
    }

    formatShopList(shopId) {
        const shop = this.shops[shopId];
        if (!shop) throw new Error('❌ Loja não encontrada!');

        let text = `🏪 *${shop.name}* 🏪\n`;
        text += `${shop.description}\n\n`;

        Object.entries(shop.items).forEach(([id, item]) => {
            text += `*${item.name}*\n`;
            text += `├ ${item.description}\n`;
            text += `├ Preço: R$ ${item.price}\n`;
            if (item.stats) {
                text += `├ Status:\n`;
                Object.entries(item.stats).forEach(([stat, value]) => {
                    text += `│ └ ${stat}: ${value > 0 ? '+' : ''}${value}\n`;
                });
            }
            if (item.effect) {
                text += `└ Efeito: ${item.effect.type}`;
                if (item.effect.value) text += ` (${item.effect.value})`;
                text += '\n';
            }
            text += '\n';
        });

        return text;
    }

    formatMarketList() {
        let text = `🏦 *MERCADO* 🏦\n\n`;

        if (this.market.listings.size === 0) {
            text += `_Nenhum item à venda_\n`;
            text += `Use /mercado vender para listar itens!\n`;
            return text;
        }

        Array.from(this.market.listings.values())
            .sort((a, b) => a.price - b.price)
            .forEach(listing => {
                text += `ID: ${listing.id}\n`;
                text += `├ Item: ${listing.itemId}\n`;
                text += `├ Quantidade: ${listing.quantity}\n`;
                text += `├ Preço: R$ ${listing.price}/un\n`;
                text += `└ Expira em: ${Math.ceil((listing.expiresAt - Date.now()) / (1000 * 60 * 60))}h\n\n`;
            });

        return text;
    }

    formatBankInfo(player) {
        let text = `🏦 *BANCO* 🏦\n\n`;

        text += `*Saldo*\n`;
        text += `├ Carteira: R$ ${player.money.wallet || 0}\n`;
        text += `└ Banco: R$ ${player.money.bank || 0}\n\n`;

        text += `*Informações*\n`;
        text += `├ Taxa de juros: ${(this.bank.interestRate * 100).toFixed(1)}% ao dia\n`;
        text += `├ Taxa de transferência: ${(this.bank.transferFee * 100).toFixed(1)}%\n`;
        text += `└ Limite diário: R$ ${this.bank.dailyTransferLimit}\n\n`;

        const today = new Date().toDateString();
        if (player.transfers && player.transfers[today]) {
            text += `*Transferências Hoje*\n`;
            text += `└ R$ ${player.transfers[today]} / R$ ${this.bank.dailyTransferLimit}`;
        }

        return text;
    }
}

module.exports = new EconomySystem();
