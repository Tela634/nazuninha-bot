class CraftSystem {
    constructor() {
        this.recipes = {
            // Equipamentos de Mineração
            'picareta_pedra': {
                name: 'Picareta de Pedra',
                type: 'tool',
                materials: {
                    'madeira': 2,
                    'pedra': 3
                },
                time: 30000, // 30 segundos
                level: 1,
                xp: 20
            },
            'picareta_ferro': {
                name: 'Picareta de Ferro',
                type: 'tool',
                materials: {
                    'madeira': 2,
                    'ferro': 3
                },
                time: 60000,
                level: 5,
                xp: 50
            },

            // Equipamentos de Pesca
            'vara_madeira': {
                name: 'Vara de Madeira',
                type: 'tool',
                materials: {
                    'madeira': 3,
                    'linha': 1
                },
                time: 30000,
                level: 1,
                xp: 20
            },
            'vara_bambu': {
                name: 'Vara de Bambu',
                type: 'tool',
                materials: {
                    'bambu': 3,
                    'linha': 2
                },
                time: 45000,
                level: 3,
                xp: 35
            },

            // Armaduras
            'armadura_couro': {
                name: 'Armadura de Couro',
                type: 'armor',
                materials: {
                    'couro': 5,
                    'linha': 2
                },
                time: 60000,
                level: 5,
                xp: 50,
                stats: {
                    defense: 10,
                    agility: 5
                }
            },
            'armadura_ferro': {
                name: 'Armadura de Ferro',
                type: 'armor',
                materials: {
                    'ferro': 5,
                    'couro': 2
                },
                time: 120000,
                level: 10,
                xp: 100,
                stats: {
                    defense: 20,
                    agility: -5
                }
            },

            // Armas
            'espada_ferro': {
                name: 'Espada de Ferro',
                type: 'weapon',
                materials: {
                    'ferro': 3,
                    'madeira': 1,
                    'couro': 1
                },
                time: 90000,
                level: 8,
                xp: 80,
                stats: {
                    attack: 15,
                    speed: 0
                }
            },
            'arco_curto': {
                name: 'Arco Curto',
                type: 'weapon',
                materials: {
                    'madeira': 3,
                    'linha': 2,
                    'couro': 1
                },
                time: 75000,
                level: 6,
                xp: 60,
                stats: {
                    attack: 10,
                    range: 3
                }
            },

            // Poções
            'pocao_vida': {
                name: 'Poção de Vida',
                type: 'consumable',
                materials: {
                    'ervas': 2,
                    'cogumelo': 1,
                    'agua': 1
                },
                time: 45000,
                level: 3,
                xp: 30,
                effect: {
                    type: 'heal',
                    value: 50
                }
            },
            'pocao_energia': {
                name: 'Poção de Energia',
                type: 'consumable',
                materials: {
                    'frutas': 2,
                    'mel': 1,
                    'agua': 1
                },
                time: 45000,
                level: 3,
                xp: 30,
                effect: {
                    type: 'energy',
                    value: 30
                }
            }
        };

        this.stations = {
            'bancada': {
                name: 'Bancada de Trabalho',
                level: 1,
                types: ['tool'],
                efficiency: 1.0,
                cost: 1000
            },
            'forja': {
                name: 'Forja',
                level: 5,
                types: ['weapon', 'armor'],
                efficiency: 1.0,
                cost: 5000
            },
            'alquimia': {
                name: 'Mesa de Alquimia',
                level: 3,
                types: ['consumable'],
                efficiency: 1.0,
                cost: 3000
            }
        };

        this.skills = {
            'artesao': {
                name: 'Artesão',
                description: 'Reduz materiais necessários',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ material_reduction: 0.1 * level })
            },
            'eficiencia': {
                name: 'Eficiência',
                description: 'Reduz tempo de crafting',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ time_reduction: 0.1 * level })
            },
            'qualidade': {
                name: 'Qualidade',
                description: 'Chance de item de qualidade superior',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ quality_chance: 0.1 * level })
            },
            'inovacao': {
                name: 'Inovação',
                description: 'Chance de criar item com bônus aleatório',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ bonus_chance: 0.1 * level })
            }
        };

        this.qualities = {
            'normal': {
                name: 'Normal',
                multiplier: 1.0
            },
            'superior': {
                name: 'Superior',
                multiplier: 1.5
            },
            'raro': {
                name: 'Raro',
                multiplier: 2.0
            },
            'epico': {
                name: 'Épico',
                multiplier: 3.0
            }
        };
    }

    craft(player, recipeId, stationId) {
        const recipe = this.recipes[recipeId];
        if (!recipe) throw new Error('❌ Receita não encontrada!');

        const station = this.stations[stationId];
        if (!station) throw new Error('❌ Estação não encontrada!');

        // Verifica nível
        if (player.level < recipe.level) {
            throw new Error(`❌ Você precisa ser nível ${recipe.level} para criar isto!`);
        }

        // Verifica estação
        if (!station.types.includes(recipe.type)) {
            throw new Error('❌ Esta estação não pode criar este item!');
        }

        // Verifica materiais
        Object.entries(recipe.materials).forEach(([item, amount]) => {
            let required = amount;
            
            // Aplica redução de materiais
            if (player.skills?.crafting?.artesao) {
                const reduction = this.skills.artesao.effect(
                    player.skills.crafting.artesao
                ).material_reduction;
                required = Math.ceil(required * (1 - reduction));
            }

            if (!player.inventory[item] || player.inventory[item] < required) {
                throw new Error(`❌ Você precisa de ${required}x ${item}!`);
            }
        });

        // Consome materiais
        Object.entries(recipe.materials).forEach(([item, amount]) => {
            let required = amount;
            if (player.skills?.crafting?.artesao) {
                const reduction = this.skills.artesao.effect(
                    player.skills.crafting.artesao
                ).material_reduction;
                required = Math.ceil(required * (1 - reduction));
            }
            player.inventory[item] -= required;
            if (player.inventory[item] <= 0) {
                delete player.inventory[item];
            }
        });

        // Calcula tempo
        let time = recipe.time;
        if (player.skills?.crafting?.eficiencia) {
            const reduction = this.skills.eficiencia.effect(
                player.skills.crafting.eficiencia
            ).time_reduction;
            time *= (1 - reduction);
        }
        time /= station.efficiency;

        // Inicia crafting
        player.crafting = {
            recipe: recipeId,
            station: stationId,
            startTime: Date.now(),
            endTime: Date.now() + time
        };

        return {
            success: true,
            time: time,
            message: `🛠️ *CRAFTANDO*\n\n` +
                    `${recipe.name}\n` +
                    `Tempo: ${Math.ceil(time / 1000)} segundos`
        };
    }

    finishCrafting(player) {
        if (!player.crafting) {
            throw new Error('❌ Você não está craftando nada!');
        }

        // Verifica tempo
        if (Date.now() < player.crafting.endTime) {
            const timeLeft = Math.ceil((player.crafting.endTime - Date.now()) / 1000);
            throw new Error(`❌ Aguarde ${timeLeft} segundos!`);
        }

        const recipe = this.recipes[player.crafting.recipe];

        // Determina qualidade
        let quality = 'normal';
        if (player.skills?.crafting?.qualidade) {
            const chance = this.skills.qualidade.effect(
                player.skills.crafting.qualidade
            ).quality_chance;
            if (Math.random() < chance) {
                if (Math.random() < 0.1) quality = 'epico';
                else if (Math.random() < 0.3) quality = 'raro';
                else quality = 'superior';
            }
        }

        // Cria item base
        const item = {
            id: player.crafting.recipe,
            name: recipe.name,
            type: recipe.type,
            quality: quality
        };

        // Adiciona stats para equipamentos
        if (recipe.stats) {
            item.stats = {};
            Object.entries(recipe.stats).forEach(([stat, value]) => {
                item.stats[stat] = Math.floor(value * this.qualities[quality].multiplier);
            });
        }

        // Adiciona efeitos para consumíveis
        if (recipe.effect) {
            item.effect = {
                type: recipe.effect.type,
                value: Math.floor(recipe.effect.value * this.qualities[quality].multiplier)
            };
        }

        // Chance de bônus aleatório
        if (player.skills?.crafting?.inovacao) {
            const chance = this.skills.inovacao.effect(
                player.skills.crafting.inovacao
            ).bonus_chance;
            if (Math.random() < chance) {
                if (!item.stats) item.stats = {};
                const stats = ['attack', 'defense', 'agility', 'vitality'];
                const stat = stats[Math.floor(Math.random() * stats.length)];
                item.stats[stat] = (item.stats[stat] || 0) + Math.floor(Math.random() * 10) + 1;
            }
        }

        // Adiciona ao inventário
        if (!player.inventory[item.id]) player.inventory[item.id] = [];
        player.inventory[item.id].push(item);

        // Limpa crafting
        delete player.crafting;

        return {
            success: true,
            item: item,
            message: `🛠️ *ITEM CRIADO*\n\n` +
                    `${item.name} (${this.qualities[quality].name})\n` +
                    (item.stats ? `Stats:\n${Object.entries(item.stats)
                        .map(([stat, value]) => `├ ${stat}: ${value}`)
                        .join('\n')}\n` : '') +
                    (item.effect ? `Efeito: ${item.effect.type} +${item.effect.value}\n` : '') +
                    `XP: +${recipe.xp}`
        };
    }

    formatRecipeList() {
        let text = `📖 *RECEITAS* 📖\n\n`;

        Object.entries(this.recipes).forEach(([id, recipe]) => {
            text += `*${recipe.name}*\n`;
            text += `├ Tipo: ${recipe.type}\n`;
            text += `├ Nível: ${recipe.level}\n`;
            text += `├ Tempo: ${recipe.time / 1000} segundos\n`;
            text += `├ Materiais:\n`;
            Object.entries(recipe.materials).forEach(([item, amount]) => {
                text += `│ └ ${amount}x ${item}\n`;
            });
            if (recipe.stats) {
                text += `├ Stats:\n`;
                Object.entries(recipe.stats).forEach(([stat, value]) => {
                    text += `│ └ ${stat}: ${value}\n`;
                });
            }
            if (recipe.effect) {
                text += `└ Efeito: ${recipe.effect.type} +${recipe.effect.value}\n`;
            }
            text += '\n';
        });

        return text;
    }

    formatStationList() {
        let text = `🔧 *ESTAÇÕES DE CRAFT* 🔧\n\n`;

        Object.entries(this.stations).forEach(([id, station]) => {
            text += `*${station.name}*\n`;
            text += `├ Nível: ${station.level}\n`;
            text += `├ Tipos: ${station.types.join(', ')}\n`;
            text += `├ Eficiência: ${(station.efficiency * 100).toFixed(0)}%\n`;
            text += `└ Preço: R$ ${station.cost}\n\n`;
        });

        return text;
    }

    formatSkillList(player) {
        let text = `⚡ *HABILIDADES DE CRAFT* ⚡\n\n`;

        Object.entries(this.skills).forEach(([id, skill]) => {
            const currentLevel = player.skills?.crafting?.[id] || 0;
            text += `*${skill.name}* (${currentLevel}/${skill.maxLevel})\n`;
            text += `├ ${skill.description}\n`;
            if (currentLevel < skill.maxLevel) {
                const nextCost = skill.cost(currentLevel + 1);
                const nextEffect = skill.effect(currentLevel + 1);
                text += `├ Próximo nível: R$ ${nextCost}\n`;
                text += `└ Efeito: ${Object.entries(nextEffect)
                    .map(([stat, value]) => `${stat} ${value > 0 ? '+' : ''}${value}`)
                    .join(', ')}\n`;
            }
            text += '\n';
        });

        return text;
    }
}

module.exports = new CraftSystem();
