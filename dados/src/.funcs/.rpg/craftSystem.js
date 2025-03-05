class CraftSystem {
    constructor() {
        // Categorias de Crafting
        this.categories = {
            'weapons': {
                name: 'Armas',
                skillRequired: 'blacksmith',
                workstation: 'forge'
            },
            'armor': {
                name: 'Armaduras',
                skillRequired: 'blacksmith',
                workstation: 'forge'
            },
            'potions': {
                name: 'Poções',
                skillRequired: 'alchemy',
                workstation: 'alchemy_table'
            },
            'food': {
                name: 'Comida',
                skillRequired: 'cooking',
                workstation: 'kitchen'
            },
            'tools': {
                name: 'Ferramentas',
                skillRequired: 'crafting',
                workstation: 'workbench'
            },
            'magic': {
                name: 'Itens Mágicos',
                skillRequired: 'enchanting',
                workstation: 'enchanting_table'
            }
        };

        // Estações de Trabalho
        this.workstations = {
            'forge': {
                name: 'Forja',
                description: 'Para criar armas e armaduras',
                price: 5000,
                level: 1,
                upgrades: [
                    {
                        name: 'Forja Aprimorada',
                        price: 20000,
                        level: 10,
                        bonus: 0.2 // 20% mais qualidade
                    },
                    {
                        name: 'Forja Mágica',
                        price: 100000,
                        level: 30,
                        bonus: 0.5
                    }
                ]
            },
            'alchemy_table': {
                name: 'Mesa de Alquimia',
                description: 'Para criar poções',
                price: 3000,
                level: 1,
                upgrades: [
                    {
                        name: 'Mesa de Alquimia Avançada',
                        price: 15000,
                        level: 10,
                        bonus: 0.2
                    },
                    {
                        name: 'Mesa de Alquimia Arcana',
                        price: 80000,
                        level: 30,
                        bonus: 0.5
                    }
                ]
            },
            'kitchen': {
                name: 'Cozinha',
                description: 'Para preparar comidas',
                price: 2000,
                level: 1,
                upgrades: [
                    {
                        name: 'Cozinha Profissional',
                        price: 10000,
                        level: 10,
                        bonus: 0.2
                    },
                    {
                        name: 'Cozinha Gourmet',
                        price: 50000,
                        level: 30,
                        bonus: 0.5
                    }
                ]
            },
            'workbench': {
                name: 'Bancada de Trabalho',
                description: 'Para criar ferramentas',
                price: 1000,
                level: 1,
                upgrades: [
                    {
                        name: 'Bancada Aprimorada',
                        price: 8000,
                        level: 10,
                        bonus: 0.2
                    },
                    {
                        name: 'Bancada de Mestre',
                        price: 40000,
                        level: 30,
                        bonus: 0.5
                    }
                ]
            },
            'enchanting_table': {
                name: 'Mesa de Encantamentos',
                description: 'Para criar itens mágicos',
                price: 10000,
                level: 1,
                upgrades: [
                    {
                        name: 'Mesa de Encantamentos Maior',
                        price: 50000,
                        level: 10,
                        bonus: 0.2
                    },
                    {
                        name: 'Mesa de Encantamentos Arcana',
                        price: 200000,
                        level: 30,
                        bonus: 0.5
                    }
                ]
            }
        };

        // Sistema de Qualidade
        this.quality = {
            'poor': {
                name: 'Baixa',
                multiplier: 0.8,
                chance: 0.1
            },
            'normal': {
                name: 'Normal',
                multiplier: 1.0,
                chance: 0.6
            },
            'good': {
                name: 'Boa',
                multiplier: 1.2,
                chance: 0.2
            },
            'excellent': {
                name: 'Excelente',
                multiplier: 1.5,
                chance: 0.08
            },
            'masterwork': {
                name: 'Obra-Prima',
                multiplier: 2.0,
                chance: 0.02
            }
        };

        // Habilidades de Crafting
        this.skills = {
            'blacksmith': {
                name: 'Ferraria',
                maxLevel: 100,
                xpPerCraft: 10,
                bonusPerLevel: 0.01 // 1% por nível
            },
            'alchemy': {
                name: 'Alquimia',
                maxLevel: 100,
                xpPerCraft: 8,
                bonusPerLevel: 0.01
            },
            'cooking': {
                name: 'Culinária',
                maxLevel: 100,
                xpPerCraft: 5,
                bonusPerLevel: 0.01
            },
            'crafting': {
                name: 'Artesanato',
                maxLevel: 100,
                xpPerCraft: 7,
                bonusPerLevel: 0.01
            },
            'enchanting': {
                name: 'Encantamento',
                maxLevel: 100,
                xpPerCraft: 15,
                bonusPerLevel: 0.01
            }
        };

        // Receitas
        this.recipes = {
            // Armas
            'espada_ferro': {
                name: 'Espada de Ferro',
                category: 'weapons',
                materials: {
                    'ferro': 5,
                    'madeira': 2,
                    'couro': 1
                },
                result: {
                    type: 'weapon',
                    damage: 20,
                    durability: 100
                },
                level: 1
            },
            'arco_composto': {
                name: 'Arco Composto',
                category: 'weapons',
                materials: {
                    'madeira': 5,
                    'corda': 2,
                    'couro': 1
                },
                result: {
                    type: 'weapon',
                    damage: 15,
                    durability: 80
                },
                level: 5
            },

            // Armaduras
            'armadura_ferro': {
                name: 'Armadura de Ferro',
                category: 'armor',
                materials: {
                    'ferro': 8,
                    'couro': 4
                },
                result: {
                    type: 'armor',
                    defense: 30,
                    durability: 150
                },
                level: 10
            },

            // Poções
            'pocao_cura': {
                name: 'Poção de Cura',
                category: 'potions',
                materials: {
                    'erva_vermelha': 3,
                    'agua': 1,
                    'cristal': 1
                },
                result: {
                    type: 'potion',
                    effect: 'heal',
                    power: 50
                },
                level: 1
            },

            // Comidas
            'pao_especial': {
                name: 'Pão Especial',
                category: 'food',
                materials: {
                    'trigo': 3,
                    'leite': 1,
                    'ovo': 1
                },
                result: {
                    type: 'food',
                    heal: 20,
                    energy: 30
                },
                level: 1
            },

            // Ferramentas
            'picareta_ferro': {
                name: 'Picareta de Ferro',
                category: 'tools',
                materials: {
                    'ferro': 5,
                    'madeira': 2
                },
                result: {
                    type: 'tool',
                    efficiency: 1.5,
                    durability: 100
                },
                level: 1
            },

            // Itens Mágicos
            'varinha_magica': {
                name: 'Varinha Mágica',
                category: 'magic',
                materials: {
                    'madeira_magica': 3,
                    'cristal_magico': 1,
                    'essencia_magica': 2
                },
                result: {
                    type: 'magic',
                    power: 30,
                    mana: 50
                },
                level: 10
            }
        };
    }

    craft(player, recipeId, amount = 1) {
        const recipe = this.recipes[recipeId];
        if (!recipe) throw new Error('❌ Receita não encontrada!');

        // Verifica nível
        if (player.level < recipe.level) {
            throw new Error(`❌ Requer nível ${recipe.level}!`);
        }

        // Verifica estação de trabalho
        const category = this.categories[recipe.category];
        const workstation = player.crafting?.workstations?.[category.workstation];
        if (!workstation) {
            throw new Error(`❌ Você precisa de ${this.workstations[category.workstation].name}!`);
        }

        // Verifica materiais
        for (const [material, required] of Object.entries(recipe.materials)) {
            const has = player.inventory.filter(i => i.id === material).length;
            if (has < required * amount) {
                throw new Error(`❌ Faltam ${required * amount - has}x ${material}!`);
            }
        }

        // Remove materiais
        for (const [material, required] of Object.entries(recipe.materials)) {
            for (let i = 0; i < required * amount; i++) {
                const index = player.inventory.findIndex(item => item.id === material);
                player.inventory.splice(index, 1);
            }
        }

        // Calcula qualidade base
        const quality = this.calculateQuality(player, recipe.category);

        // Cria itens
        const items = [];
        for (let i = 0; i < amount; i++) {
            const item = this.createItem(recipe, quality);
            player.inventory.push(item);
            items.push(item);
        }

        // Adiciona XP
        this.addCraftingXP(player, recipe.category);

        return {
            success: true,
            items: items,
            quality: quality,
            message: `🛠️ *ITEM CRIADO*\n\n` +
                    `${recipe.name} x${amount}\n` +
                    `Qualidade: ${quality.name}\n\n` +
                    `Stats:\n` +
                    this.formatItemStats(items[0])
        };
    }

    buyWorkstation(player, stationId) {
        const station = this.workstations[stationId];
        if (!station) throw new Error('❌ Estação não encontrada!');

        // Verifica nível
        if (player.level < station.level) {
            throw new Error(`❌ Requer nível ${station.level}!`);
        }

        // Verifica dinheiro
        if (player.money.wallet < station.price) {
            throw new Error(`❌ Custa R$ ${station.price}!`);
        }

        // Compra estação
        if (!player.crafting) player.crafting = {};
        if (!player.crafting.workstations) player.crafting.workstations = {};

        player.crafting.workstations[stationId] = {
            level: 1,
            bonus: 0
        };

        player.money.wallet -= station.price;

        return {
            success: true,
            message: `🛠️ *ESTAÇÃO COMPRADA*\n\n` +
                    `${station.name}\n` +
                    `${station.description}\n\n` +
                    `Custo: R$ ${station.price}`
        };
    }

    upgradeWorkstation(player, stationId) {
        const station = this.workstations[stationId];
        if (!station) throw new Error('❌ Estação não encontrada!');

        const currentStation = player.crafting?.workstations?.[stationId];
        if (!currentStation) {
            throw new Error('❌ Você não tem esta estação!');
        }

        const upgrade = station.upgrades[currentStation.level - 1];
        if (!upgrade) {
            throw new Error('❌ Nível máximo atingido!');
        }

        // Verifica nível
        if (player.level < upgrade.level) {
            throw new Error(`❌ Requer nível ${upgrade.level}!`);
        }

        // Verifica dinheiro
        if (player.money.wallet < upgrade.price) {
            throw new Error(`❌ Custa R$ ${upgrade.price}!`);
        }

        // Aplica upgrade
        currentStation.level++;
        currentStation.bonus = upgrade.bonus;
        player.money.wallet -= upgrade.price;

        return {
            success: true,
            message: `🛠️ *ESTAÇÃO MELHORADA*\n\n` +
                    `${station.name} → ${upgrade.name}\n` +
                    `Bônus: +${upgrade.bonus * 100}%\n\n` +
                    `Custo: R$ ${upgrade.price}`
        };
    }

    calculateQuality(player, category) {
        const skill = this.categories[category].skillRequired;
        const skillLevel = player.crafting?.skills?.[skill] || 0;
        const skillBonus = skillLevel * this.skills[skill].bonusPerLevel;

        // Rola qualidade base
        const roll = Math.random();
        let quality;
        let cumulative = 0;

        for (const [id, data] of Object.entries(this.quality)) {
            cumulative += data.chance;
            if (roll <= cumulative) {
                quality = {
                    id: id,
                    ...data
                };
                break;
            }
        }

        // Aplica bônus
        quality.multiplier *= (1 + skillBonus);

        return quality;
    }

    createItem(recipe, quality) {
        const item = {
            id: recipe.id,
            name: recipe.name,
            type: recipe.result.type,
            quality: quality.id
        };

        // Aplica multiplicador de qualidade aos stats
        Object.entries(recipe.result).forEach(([stat, value]) => {
            if (typeof value === 'number') {
                item[stat] = Math.floor(value * quality.multiplier);
            } else {
                item[stat] = value;
            }
        });

        return item;
    }

    addCraftingXP(player, category) {
        const skill = this.categories[category].skillRequired;
        if (!player.crafting) player.crafting = {};
        if (!player.crafting.skills) player.crafting.skills = {};
        if (!player.crafting.skills[skill]) {
            player.crafting.skills[skill] = {
                level: 1,
                xp: 0
            };
        }

        // Adiciona XP
        const skillData = this.skills[skill];
        player.crafting.skills[skill].xp += skillData.xpPerCraft;

        // Verifica level up
        while (player.crafting.skills[skill].xp >= 
               player.crafting.skills[skill].level * 100 &&
               player.crafting.skills[skill].level < skillData.maxLevel) {
            player.crafting.skills[skill].xp -= player.crafting.skills[skill].level * 100;
            player.crafting.skills[skill].level++;
        }
    }

    formatItemStats(item) {
        let text = '';
        Object.entries(item).forEach(([stat, value]) => {
            if (['id', 'name', 'type', 'quality'].includes(stat)) return;
            text += `└ ${stat}: ${value}\n`;
        });
        return text;
    }

    formatRecipeList() {
        let text = `🛠️ *RECEITAS* 🛠️\n\n`;

        Object.entries(this.categories).forEach(([id, category]) => {
            text += `*${category.name}*\n`;
            
            const recipes = Object.entries(this.recipes)
                .filter(([_, recipe]) => recipe.category === id);

            recipes.forEach(([recipeId, recipe]) => {
                text += `\n${recipe.name}\n`;
                text += `├ Nível: ${recipe.level}\n`;
                text += `├ Materiais:\n`;
                Object.entries(recipe.materials).forEach(([material, amount]) => {
                    text += `│ └ ${material} x${amount}\n`;
                });
                text += `└ Resultado:\n`;
                Object.entries(recipe.result).forEach(([stat, value]) => {
                    if (typeof value === 'number') {
                        text += `  └ ${stat}: ${value}\n`;
                    }
                });
            });
            text += '\n';
        });

        return text;
    }

    formatCraftingInfo(player) {
        if (!player.crafting) {
            return `🛠️ *CRAFTING* 🛠️\n\n` +
                   `_Você não tem nenhuma estação de trabalho!_\n` +
                   `Use /comprarestacao para começar.`;
        }

        let text = `🛠️ *CRAFTING* 🛠️\n\n`;

        // Estações
        text += `*ESTAÇÕES DE TRABALHO*\n`;
        if (player.crafting.workstations) {
            Object.entries(player.crafting.workstations).forEach(([id, station]) => {
                const stationData = this.workstations[id];
                text += `├ ${stationData.name}\n`;
                text += `│ ├ Nível: ${station.level}\n`;
                text += `│ └ Bônus: +${station.bonus * 100}%\n`;
            });
        }
        text += '\n';

        // Habilidades
        text += `*HABILIDADES*\n`;
        if (player.crafting.skills) {
            Object.entries(player.crafting.skills).forEach(([skill, data]) => {
                const skillData = this.skills[skill];
                text += `├ ${skillData.name}\n`;
                text += `│ ├ Nível: ${data.level}/${skillData.maxLevel}\n`;
                text += `│ └ XP: ${data.xp}/${data.level * 100}\n`;
            });
        }

        return text;
    }
}

module.exports = new CraftSystem();
