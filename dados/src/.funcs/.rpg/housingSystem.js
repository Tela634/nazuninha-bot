class HousingSystem {
    constructor() {
        this.houses = {
            // Casas Básicas
            'barraco': {
                name: 'Barraco',
                description: 'Uma moradia simples',
                price: 5000,
                storage: 10,
                furniture_slots: 3,
                garden_slots: 1,
                level: 1,
                emoji: '🏠'
            },
            'casa_pequena': {
                name: 'Casa Pequena',
                description: 'Uma casa modesta',
                price: 20000,
                storage: 20,
                furniture_slots: 5,
                garden_slots: 2,
                level: 5,
                emoji: '🏡'
            },
            'apartamento': {
                name: 'Apartamento',
                description: 'Um apartamento confortável',
                price: 50000,
                storage: 30,
                furniture_slots: 8,
                garden_slots: 0,
                level: 10,
                emoji: '🏢'
            },

            // Casas Intermediárias
            'sobrado': {
                name: 'Sobrado',
                description: 'Uma casa de dois andares',
                price: 100000,
                storage: 50,
                furniture_slots: 12,
                garden_slots: 4,
                level: 15,
                emoji: '🏘️'
            },
            'mansao': {
                name: 'Mansão',
                description: 'Uma casa luxuosa',
                price: 500000,
                storage: 100,
                furniture_slots: 20,
                garden_slots: 8,
                level: 25,
                emoji: '🏰'
            },

            // Casas Especiais
            'casa_na_arvore': {
                name: 'Casa na Árvore',
                description: 'Uma casa mágica em uma árvore gigante',
                price: 1000000,
                storage: 200,
                furniture_slots: 30,
                garden_slots: 15,
                level: 35,
                emoji: '🌳',
                special: 'nature_boost'
            },
            'castelo': {
                name: 'Castelo',
                description: 'Um castelo majestoso',
                price: 5000000,
                storage: 500,
                furniture_slots: 50,
                garden_slots: 20,
                level: 50,
                emoji: '🏰',
                special: 'royal_status'
            }
        };

        // Móveis
        this.furniture = {
            'cama_simples': {
                name: 'Cama Simples',
                description: 'Uma cama básica',
                price: 1000,
                slots: 1,
                bonus: {
                    type: 'energy_regen',
                    value: 0.1
                },
                emoji: '🛏️'
            },
            'cama_luxo': {
                name: 'Cama de Luxo',
                description: 'Uma cama confortável',
                price: 5000,
                slots: 2,
                bonus: {
                    type: 'energy_regen',
                    value: 0.3
                },
                emoji: '🛏️'
            },
            'sofa': {
                name: 'Sofá',
                description: 'Um sofá confortável',
                price: 2000,
                slots: 2,
                bonus: {
                    type: 'stress_reduction',
                    value: 0.2
                },
                emoji: '🛋️'
            },
            'mesa_jantar': {
                name: 'Mesa de Jantar',
                description: 'Uma mesa para refeições',
                price: 3000,
                slots: 3,
                bonus: {
                    type: 'food_boost',
                    value: 0.2
                },
                emoji: '🪑'
            },
            'estante': {
                name: 'Estante',
                description: 'Para guardar itens',
                price: 2500,
                slots: 2,
                bonus: {
                    type: 'storage',
                    value: 10
                },
                emoji: '📚'
            },
            'tv': {
                name: 'TV',
                description: 'Para entretenimento',
                price: 5000,
                slots: 1,
                bonus: {
                    type: 'happiness',
                    value: 0.3
                },
                emoji: '📺'
            },
            'computador': {
                name: 'Computador',
                description: 'Para trabalho e diversão',
                price: 8000,
                slots: 1,
                bonus: {
                    type: 'work_efficiency',
                    value: 0.25
                },
                emoji: '💻'
            },
            'jacuzzi': {
                name: 'Jacuzzi',
                description: 'Para relaxar',
                price: 15000,
                slots: 4,
                bonus: {
                    type: 'stress_reduction',
                    value: 0.5
                },
                emoji: '🛁'
            },
            'altar': {
                name: 'Altar Mágico',
                description: 'Para rituais mágicos',
                price: 50000,
                slots: 2,
                bonus: {
                    type: 'magic_power',
                    value: 0.4
                },
                emoji: '⚡'
            }
        };

        // Decorações de Jardim
        this.garden = {
            'flores': {
                name: 'Flores',
                description: 'Flores decorativas',
                price: 500,
                slots: 1,
                bonus: {
                    type: 'happiness',
                    value: 0.1
                },
                emoji: '🌸'
            },
            'arvore': {
                name: 'Árvore',
                description: 'Uma árvore bonita',
                price: 2000,
                slots: 2,
                bonus: {
                    type: 'nature_power',
                    value: 0.2
                },
                emoji: '🌳'
            },
            'fonte': {
                name: 'Fonte',
                description: 'Uma fonte decorativa',
                price: 5000,
                slots: 3,
                bonus: {
                    type: 'luck',
                    value: 0.15
                },
                emoji: '⛲'
            },
            'estatua': {
                name: 'Estátua',
                description: 'Uma estátua imponente',
                price: 10000,
                slots: 2,
                bonus: {
                    type: 'status',
                    value: 0.3
                },
                emoji: '🗿'
            },
            'piscina': {
                name: 'Piscina',
                description: 'Para nadar e relaxar',
                price: 20000,
                slots: 6,
                bonus: {
                    type: 'vitality',
                    value: 0.4
                },
                emoji: '🏊'
            }
        };
    }

    buyHouse(player, houseId) {
        const house = this.houses[houseId];
        if (!house) throw new Error('❌ Casa não encontrada!');

        // Verifica nível
        if (player.level < house.level) {
            throw new Error(`❌ Você precisa ser nível ${house.level} para comprar esta casa!`);
        }

        // Verifica dinheiro
        if (player.money.wallet < house.price) {
            throw new Error(`❌ Você precisa de R$ ${house.price} para comprar esta casa!`);
        }

        // Compra a casa
        player.money.wallet -= house.price;
        player.house = {
            id: houseId,
            furniture: [],
            garden: [],
            storage: [],
            visitors: []
        };

        return {
            success: true,
            message: `🏠 *CASA COMPRADA*\n\n` +
                    `${house.emoji} ${house.name}\n` +
                    `${house.description}\n\n` +
                    `📦 Armazenamento: ${house.storage}\n` +
                    `🪑 Espaços para móveis: ${house.furniture_slots}\n` +
                    `🌸 Espaços no jardim: ${house.garden_slots}\n` +
                    `💰 Custo: R$ ${house.price}`
        };
    }

    buyFurniture(player, furnitureId) {
        if (!player.house) {
            throw new Error('❌ Você precisa ter uma casa primeiro!');
        }

        const furniture = this.furniture[furnitureId];
        if (!furniture) throw new Error('❌ Móvel não encontrado!');

        const house = this.houses[player.house.id];

        // Verifica espaço
        const usedSlots = player.house.furniture.reduce((total, f) => total + this.furniture[f].slots, 0);
        if (usedSlots + furniture.slots > house.furniture_slots) {
            throw new Error('❌ Não há espaço suficiente na casa!');
        }

        // Verifica dinheiro
        if (player.money.wallet < furniture.price) {
            throw new Error(`❌ Você precisa de R$ ${furniture.price} para comprar este móvel!`);
        }

        // Compra o móvel
        player.money.wallet -= furniture.price;
        player.house.furniture.push(furnitureId);

        return {
            success: true,
            message: `🪑 *MÓVEL COMPRADO*\n\n` +
                    `${furniture.emoji} ${furniture.name}\n` +
                    `${furniture.description}\n\n` +
                    `🎯 Bônus: +${furniture.bonus.value * 100}% ${furniture.bonus.type}\n` +
                    `💰 Custo: R$ ${furniture.price}`
        };
    }

    buyGarden(player, gardenId) {
        if (!player.house) {
            throw new Error('❌ Você precisa ter uma casa primeiro!');
        }

        const garden = this.garden[gardenId];
        if (!garden) throw new Error('❌ Item de jardim não encontrado!');

        const house = this.houses[player.house.id];

        // Verifica espaço
        const usedSlots = player.house.garden.reduce((total, g) => total + this.garden[g].slots, 0);
        if (usedSlots + garden.slots > house.garden_slots) {
            throw new Error('❌ Não há espaço suficiente no jardim!');
        }

        // Verifica dinheiro
        if (player.money.wallet < garden.price) {
            throw new Error(`❌ Você precisa de R$ ${garden.price} para comprar este item!`);
        }

        // Compra o item
        player.money.wallet -= garden.price;
        player.house.garden.push(gardenId);

        return {
            success: true,
            message: `🌸 *ITEM DE JARDIM COMPRADO*\n\n` +
                    `${garden.emoji} ${garden.name}\n` +
                    `${garden.description}\n\n` +
                    `🎯 Bônus: +${garden.bonus.value * 100}% ${garden.bonus.type}\n` +
                    `💰 Custo: R$ ${garden.price}`
        };
    }

    storeItem(player, itemId) {
        if (!player.house) {
            throw new Error('❌ Você precisa ter uma casa primeiro!');
        }

        const house = this.houses[player.house.id];

        // Verifica espaço
        if (player.house.storage.length >= house.storage) {
            throw new Error('❌ Não há espaço suficiente no armazenamento!');
        }

        // Verifica se tem o item
        const itemIndex = player.inventory.findIndex(i => i.id === itemId);
        if (itemIndex === -1) {
            throw new Error('❌ Item não encontrado no inventário!');
        }

        // Move o item
        const item = player.inventory.splice(itemIndex, 1)[0];
        player.house.storage.push(item);

        return {
            success: true,
            message: `📦 *ITEM ARMAZENADO*\n\n` +
                    `${item.emoji} ${item.name}\n` +
                    `Espaço: ${player.house.storage.length}/${house.storage}`
        };
    }

    retrieveItem(player, itemIndex) {
        if (!player.house) {
            throw new Error('❌ Você precisa ter uma casa primeiro!');
        }

        // Verifica se tem o item
        if (!player.house.storage[itemIndex]) {
            throw new Error('❌ Item não encontrado no armazenamento!');
        }

        // Move o item
        const item = player.house.storage.splice(itemIndex, 1)[0];
        player.inventory.push(item);

        return {
            success: true,
            message: `📦 *ITEM RECUPERADO*\n\n` +
                    `${item.emoji} ${item.name}\n` +
                    `_Item movido para seu inventário_`
        };
    }

    formatHouseInfo(player) {
        if (!player.house) {
            return `🏠 *MORADIA* 🏠\n\n` +
                   `_Você não tem uma casa!_\n` +
                   `Use /casa comprar para adquirir uma.`;
        }

        const house = this.houses[player.house.id];
        let text = `${house.emoji} *${house.name}* ${house.emoji}\n\n`;
        
        text += `📊 *INFORMAÇÕES*\n`;
        text += `├ Armazenamento: ${player.house.storage.length}/${house.storage}\n`;
        text += `├ Móveis: ${player.house.furniture.length}/${house.furniture_slots}\n`;
        text += `└ Jardim: ${player.house.garden.length}/${house.garden_slots}\n\n`;
        
        if (player.house.furniture.length > 0) {
            text += `🪑 *MÓVEIS*\n`;
            player.house.furniture.forEach(furnitureId => {
                const furniture = this.furniture[furnitureId];
                text += `${furniture.emoji} ${furniture.name}\n`;
                text += `└ +${furniture.bonus.value * 100}% ${furniture.bonus.type}\n`;
            });
            text += '\n';
        }
        
        if (player.house.garden.length > 0) {
            text += `🌸 *JARDIM*\n`;
            player.house.garden.forEach(gardenId => {
                const garden = this.garden[gardenId];
                text += `${garden.emoji} ${garden.name}\n`;
                text += `└ +${garden.bonus.value * 100}% ${garden.bonus.type}\n`;
            });
            text += '\n';
        }
        
        if (player.house.storage.length > 0) {
            text += `📦 *ARMAZENAMENTO*\n`;
            player.house.storage.forEach((item, index) => {
                text += `${index + 1}. ${item.emoji} ${item.name}\n`;
            });
        }

        return text;
    }

    formatHouseList() {
        let text = `🏠 *CASAS DISPONÍVEIS* 🏠\n\n`;

        // Organiza por nível
        const categories = {
            'Casas Básicas': Object.entries(this.houses).filter(([_, h]) => h.level <= 10),
            'Casas Intermediárias': Object.entries(this.houses).filter(([_, h]) => h.level > 10 && h.level <= 30),
            'Casas Especiais': Object.entries(this.houses).filter(([_, h]) => h.level > 30)
        };

        for (const [category, houses] of Object.entries(categories)) {
            if (houses.length > 0) {
                text += `\n*${category}*\n`;
                houses.forEach(([id, house]) => {
                    text += `\n${house.emoji} *${house.name}*\n`;
                    text += `├ ${house.description}\n`;
                    text += `├ Nível: ${house.level}\n`;
                    text += `├ Preço: R$ ${house.price}\n`;
                    text += `├ Armazenamento: ${house.storage}\n`;
                    text += `├ Espaços para móveis: ${house.furniture_slots}\n`;
                    text += `└ Espaços no jardim: ${house.garden_slots}\n`;
                });
            }
        }

        text += `\n🪑 *MÓVEIS DISPONÍVEIS*\n\n`;
        Object.entries(this.furniture).forEach(([id, furniture]) => {
            text += `${furniture.emoji} *${furniture.name}*\n`;
            text += `├ ${furniture.description}\n`;
            text += `├ Preço: R$ ${furniture.price}\n`;
            text += `├ Espaços: ${furniture.slots}\n`;
            text += `└ Bônus: +${furniture.bonus.value * 100}% ${furniture.bonus.type}\n\n`;
        });

        text += `\n🌸 *ITENS DE JARDIM*\n\n`;
        Object.entries(this.garden).forEach(([id, garden]) => {
            text += `${garden.emoji} *${garden.name}*\n`;
            text += `├ ${garden.description}\n`;
            text += `├ Preço: R$ ${garden.price}\n`;
            text += `├ Espaços: ${garden.slots}\n`;
            text += `└ Bônus: +${garden.bonus.value * 100}% ${garden.bonus.type}\n\n`;
        });

        return text;
    }
}

module.exports = new HousingSystem();
