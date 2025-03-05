class ShopSystem {
    constructor() {
        this.categories = {
            // Equipamentos de Mineração
            'mining': {
                name: 'Equipamentos de Mineração',
                emoji: '⛏️',
                items: {
                    'picareta_madeira': {
                        name: 'Picareta de Madeira',
                        price: 1000,
                        level: 1,
                        durability: 50
                    },
                    'picareta_pedra': {
                        name: 'Picareta de Pedra',
                        price: 5000,
                        level: 5,
                        durability: 100
                    },
                    'capacete_minerador': {
                        name: 'Capacete de Minerador',
                        price: 5000,
                        level: 5,
                        effect: 'proteção contra desmoronamentos'
                    },
                    'mascara_gas': {
                        name: 'Máscara de Gás',
                        price: 8000,
                        level: 8,
                        effect: 'proteção contra gases'
                    }
                }
            },

            // Equipamentos de Pesca
            'fishing': {
                name: 'Equipamentos de Pesca',
                emoji: '🎣',
                items: {
                    'vara_bambu': {
                        name: 'Vara de Bambu',
                        price: 1000,
                        level: 1,
                        durability: 50
                    },
                    'linha_pesca': {
                        name: 'Linha de Pesca',
                        price: 100,
                        level: 1,
                        quantity: 5
                    },
                    'anzol': {
                        name: 'Anzol',
                        price: 50,
                        level: 1,
                        quantity: 10
                    },
                    'rede_pesca': {
                        name: 'Rede de Pesca',
                        price: 5000,
                        level: 10,
                        durability: 50
                    }
                }
            },

            // Ferramentas de Fazenda
            'farming': {
                name: 'Ferramentas de Fazenda',
                emoji: '🌾',
                items: {
                    'regador': {
                        name: 'Regador',
                        price: 500,
                        level: 1,
                        durability: 50
                    },
                    'pa': {
                        name: 'Pá',
                        price: 800,
                        level: 1,
                        durability: 50
                    },
                    'fertilizante': {
                        name: 'Fertilizante',
                        price: 1000,
                        level: 1,
                        quantity: 5
                    },
                    'espantalho': {
                        name: 'Espantalho',
                        price: 2000,
                        level: 5,
                        effect: 'proteção contra pragas'
                    }
                }
            },

            // Utensílios de Cozinha
            'cooking': {
                name: 'Utensílios de Cozinha',
                emoji: '👨‍🍳',
                items: {
                    'faca': {
                        name: 'Faca',
                        price: 500,
                        level: 1,
                        durability: 50
                    },
                    'panela': {
                        name: 'Panela',
                        price: 1000,
                        level: 1,
                        durability: 100
                    },
                    'frigideira': {
                        name: 'Frigideira',
                        price: 800,
                        level: 1,
                        durability: 80
                    },
                    'forno': {
                        name: 'Forno',
                        price: 2000,
                        level: 5,
                        durability: 200
                    }
                }
            },

            // Armas
            'weapons': {
                name: 'Armas',
                emoji: '⚔️',
                items: {
                    'faca_combate': {
                        name: 'Faca de Combate',
                        price: 1000,
                        level: 1,
                        damage: 10
                    },
                    'espada_ferro': {
                        name: 'Espada de Ferro',
                        price: 5000,
                        level: 5,
                        damage: 25
                    },
                    'arco': {
                        name: 'Arco',
                        price: 3000,
                        level: 3,
                        damage: 15
                    },
                    'revolver': {
                        name: 'Revólver',
                        price: 10000,
                        level: 10,
                        damage: 40
                    }
                }
            },

            // Armaduras
            'armor': {
                name: 'Armaduras',
                emoji: '🛡️',
                items: {
                    'armadura_couro': {
                        name: 'Armadura de Couro',
                        price: 2000,
                        level: 1,
                        defense: 10
                    },
                    'armadura_ferro': {
                        name: 'Armadura de Ferro',
                        price: 8000,
                        level: 5,
                        defense: 25
                    },
                    'escudo': {
                        name: 'Escudo',
                        price: 5000,
                        level: 3,
                        defense: 15
                    },
                    'capacete': {
                        name: 'Capacete',
                        price: 3000,
                        level: 2,
                        defense: 8
                    }
                }
            },

            // Itens de Cura
            'healing': {
                name: 'Itens de Cura',
                emoji: '💊',
                items: {
                    'pocao_vida': {
                        name: 'Poção de Vida',
                        price: 500,
                        heal: 50,
                        quantity: 1
                    },
                    'pocao_vida_grande': {
                        name: 'Poção de Vida Grande',
                        price: 1000,
                        heal: 150,
                        quantity: 1
                    },
                    'bandagem': {
                        name: 'Bandagem',
                        price: 100,
                        heal: 20,
                        quantity: 5
                    },
                    'kit_medico': {
                        name: 'Kit Médico',
                        price: 2000,
                        heal: 300,
                        quantity: 1
                    }
                }
            },

            // Itens de Pet
            'pet': {
                name: 'Itens de Pet',
                emoji: '🐾',
                items: {
                    'racao': {
                        name: 'Ração',
                        price: 100,
                        energy: 20,
                        quantity: 5
                    },
                    'brinquedo': {
                        name: 'Brinquedo',
                        price: 500,
                        happiness: 30,
                        quantity: 1
                    },
                    'coleira': {
                        name: 'Coleira',
                        price: 1000,
                        effect: 'previne fuga',
                        quantity: 1
                    },
                    'remedios': {
                        name: 'Remédios',
                        price: 800,
                        heal: 100,
                        quantity: 1
                    }
                }
            },

            // Decorações de Casa
            'house': {
                name: 'Decorações de Casa',
                emoji: '🏠',
                items: {
                    'cama': {
                        name: 'Cama',
                        price: 5000,
                        comfort: 50,
                        slots: 2
                    },
                    'sofa': {
                        name: 'Sofá',
                        price: 3000,
                        comfort: 30,
                        slots: 3
                    },
                    'mesa': {
                        name: 'Mesa',
                        price: 2000,
                        slots: 4
                    },
                    'quadro': {
                        name: 'Quadro',
                        price: 1000,
                        decoration: 20,
                        slots: 1
                    }
                }
            },

            // Itens Especiais
            'special': {
                name: 'Itens Especiais',
                emoji: '✨',
                items: {
                    'amuleto_sorte': {
                        name: 'Amuleto da Sorte',
                        price: 50000,
                        effect: 'aumenta sorte em 20%',
                        level: 20
                    },
                    'anel_poder': {
                        name: 'Anel do Poder',
                        price: 100000,
                        effect: 'aumenta todos atributos em 10%',
                        level: 30
                    },
                    'pergaminho_tp': {
                        name: 'Pergaminho de Teleporte',
                        price: 25000,
                        effect: 'teleporte instantâneo',
                        quantity: 1
                    },
                    'pedra_encantada': {
                        name: 'Pedra Encantada',
                        price: 75000,
                        effect: 'revive após morte',
                        quantity: 1
                    }
                }
            }
        };

        // Sistema de Descontos
        this.discounts = {
            'member': 0.1,     // 10% para membros
            'vip': 0.2,       // 20% para VIPs
            'premium': 0.3    // 30% para Premium
        };

        // Sistema de Estoque
        this.stock = {};
        this.lastRestock = Date.now();
    }

    formatShop(player) {
        let text = `🏪 *LOJA* 🏪\n\n`;

        Object.entries(this.categories).forEach(([catId, category]) => {
            text += `${category.emoji} *${category.name}*\n\n`;

            Object.entries(category.items).forEach(([itemId, item]) => {
                const stock = this.getStock(itemId);
                const canBuy = (!item.level || player.level >= item.level) && stock > 0;
                const price = this.calculatePrice(item.price, player);

                text += `${itemId}\n`;
                text += `├ ${item.name}\n`;
                text += `├ Preço: R$ ${price}\n`;
                if (item.level) text += `├ Nível: ${item.level}\n`;
                if (item.durability) text += `├ Durabilidade: ${item.durability}\n`;
                if (item.damage) text += `├ Dano: ${item.damage}\n`;
                if (item.defense) text += `├ Defesa: ${item.defense}\n`;
                if (item.heal) text += `├ Cura: ${item.heal}\n`;
                if (item.effect) text += `├ Efeito: ${item.effect}\n`;
                if (item.quantity) text += `├ Quantidade: ${item.quantity}\n`;
                text += `├ Estoque: ${stock}\n`;
                text += `└ ${canBuy ? '✅ Disponível' : '❌ Indisponível'}\n\n`;
            });
        });

        return text;
    }

    calculatePrice(basePrice, player) {
        let price = basePrice;

        // Aplica desconto do rank
        if (player.rank && this.discounts[player.rank]) {
            price *= (1 - this.discounts[player.rank]);
        }

        // Aplica modificadores de evento
        if (player.activeEffects?.buy_price) {
            price *= player.activeEffects.buy_price;
        }

        return Math.floor(price);
    }

    getStock(itemId) {
        // Reabastece a cada hora
        if (Date.now() - this.lastRestock > 3600000) {
            this.restockItems();
        }

        return this.stock[itemId] || 0;
    }

    restockItems() {
        this.lastRestock = Date.now();

        Object.entries(this.categories).forEach(([catId, category]) => {
            Object.entries(category.items).forEach(([itemId, item]) => {
                // Quantidade base de estoque
                let amount = 50;

                // Itens especiais têm estoque limitado
                if (catId === 'special') amount = 5;
                // Itens comuns têm mais estoque
                else if (item.price < 1000) amount = 100;
                // Itens raros têm menos estoque
                else if (item.price > 10000) amount = 10;

                this.stock[itemId] = amount;
            });
        });
    }

    buyItem(player, itemId, quantity = 1) {
        // Encontra o item
        let foundItem = null;
        let foundCategory = null;
        
        for (const [catId, category] of Object.entries(this.categories)) {
            if (category.items[itemId]) {
                foundItem = category.items[itemId];
                foundCategory = catId;
                break;
            }
        }

        if (!foundItem) {
            throw new Error('❌ Item não encontrado!');
        }

        // Verifica nível
        if (foundItem.level && player.level < foundItem.level) {
            throw new Error(`❌ Você precisa ser nível ${foundItem.level} para comprar este item!`);
        }

        // Verifica estoque
        const stock = this.getStock(itemId);
        if (stock < quantity) {
            throw new Error(`❌ Estoque insuficiente! Disponível: ${stock}`);
        }

        // Calcula preço total
        const price = this.calculatePrice(foundItem.price, player) * quantity;

        // Verifica dinheiro
        if (player.money.wallet < price) {
            throw new Error(`❌ Você precisa de R$ ${price} para comprar ${quantity}x ${foundItem.name}!`);
        }

        // Processa a compra
        player.money.wallet -= price;
        this.stock[itemId] -= quantity;

        // Adiciona ao inventário apropriado
        switch(foundCategory) {
            case 'mining':
                if (!player.mining) player.mining = {};
                if (itemId.startsWith('picareta')) {
                    player.mining.pickaxe = itemId;
                    player.mining.durability = foundItem.durability;
                } else {
                    if (!player.mining.upgrades) player.mining.upgrades = [];
                    player.mining.upgrades.push(itemId);
                }
                break;

            case 'fishing':
                if (!player.fishing) player.fishing = {};
                if (itemId.startsWith('vara')) {
                    player.fishing.rod = itemId;
                    player.fishing.durability = foundItem.durability;
                } else {
                    if (!player.fishing.equipment) player.fishing.equipment = {};
                    player.fishing.equipment[itemId] = foundItem.quantity || foundItem.durability;
                }
                break;

            case 'farming':
                if (!player.farming) player.farming = {};
                if (!player.farming.tools) player.farming.tools = [];
                player.farming.tools.push(itemId);
                if (!player.farming.durability) player.farming.durability = {};
                player.farming.durability[itemId] = foundItem.durability;
                break;

            case 'cooking':
                if (!player.cooking) player.cooking = {};
                if (!player.cooking.equipment) player.cooking.equipment = {};
                player.cooking.equipment[itemId] = foundItem.durability;
                break;

            default:
                // Adiciona ao inventário geral
                for (let i = 0; i < quantity; i++) {
                    player.inventory.push({
                        id: itemId,
                        name: foundItem.name,
                        type: foundCategory,
                        ...foundItem
                    });
                }
        }

        return {
            success: true,
            price: price,
            message: `💰 *COMPRA REALIZADA*\n\n` +
                    `Comprou: ${quantity}x ${foundItem.name}\n` +
                    `Preço: R$ ${price}`
        };
    }
}

module.exports = new ShopSystem();
