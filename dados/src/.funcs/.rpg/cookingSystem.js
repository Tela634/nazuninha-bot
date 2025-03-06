class CookingSystem {
    constructor() {
        this.recipes = {
            // Receitas Básicas
            'sopa_legumes': {
                name: 'Sopa de Legumes',
                ingredients: {
                    'cenoura': 2,
                    'batata': 1,
                    'agua': 1
                },
                difficulty: 'facil',
                time: 60000, // 1 minuto
                xp: 10,
                value: 20,
                restore: {
                    health: 20,
                    energy: 10
                }
            },
            'peixe_assado': {
                name: 'Peixe Assado',
                ingredients: {
                    'tilapia': 1,
                    'sal': 1
                },
                difficulty: 'facil',
                time: 120000, // 2 minutos
                xp: 15,
                value: 30,
                restore: {
                    health: 30,
                    energy: 15
                }
            },

            // Receitas Intermediárias
            'ensopado': {
                name: 'Ensopado',
                ingredients: {
                    'carne': 2,
                    'batata': 2,
                    'cenoura': 1,
                    'temperos': 1
                },
                difficulty: 'media',
                time: 300000, // 5 minutos
                xp: 50,
                value: 100,
                restore: {
                    health: 50,
                    energy: 25,
                    strength: 5
                }
            },
            'peixe_especial': {
                name: 'Peixe Especial',
                ingredients: {
                    'salmao': 1,
                    'temperos': 2,
                    'ervas': 1
                },
                difficulty: 'media',
                time: 240000, // 4 minutos
                xp: 60,
                value: 120,
                restore: {
                    health: 60,
                    energy: 30,
                    agility: 5
                }
            },

            // Receitas Avançadas
            'banquete_real': {
                name: 'Banquete Real',
                ingredients: {
                    'carne_premium': 2,
                    'peixe_dourado': 1,
                    'vegetais_frescos': 3,
                    'temperos_raros': 2
                },
                difficulty: 'dificil',
                time: 600000, // 10 minutos
                xp: 200,
                value: 500,
                restore: {
                    health: 100,
                    energy: 50,
                    strength: 10,
                    agility: 10,
                    intelligence: 10
                }
            },
            'elixir_vida': {
                name: 'Elixir da Vida',
                ingredients: {
                    'ervas_raras': 3,
                    'cogumelos_magicos': 2,
                    'essencia_vital': 1
                },
                difficulty: 'dificil',
                time: 900000, // 15 minutos
                xp: 300,
                value: 1000,
                restore: {
                    health: 200,
                    energy: 100,
                    mana: 50
                }
            }
        };

        this.equipment = {
            'fogao_basico': {
                name: 'Fogão Básico',
                efficiency: 1.0,
                maxDifficulty: 'facil',
                cost: 1000
            },
            'fogao_avancado': {
                name: 'Fogão Avançado',
                efficiency: 1.5,
                maxDifficulty: 'media',
                cost: 5000
            },
            'cozinha_completa': {
                name: 'Cozinha Completa',
                efficiency: 2.0,
                maxDifficulty: 'dificil',
                cost: 20000
            },
            'cozinha_magica': {
                name: 'Cozinha Mágica',
                efficiency: 3.0,
                maxDifficulty: 'qualquer',
                cost: 100000
            }
        };

        this.skills = {
            'eficiencia_culinaria': {
                name: 'Eficiência Culinária',
                description: 'Reduz tempo de preparo',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ time_reduction: 0.1 * level })
            },
            'economia': {
                name: 'Economia',
                description: 'Chance de não consumir ingredientes',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ ingredient_save: 0.1 * level })
            },
            'qualidade': {
                name: 'Qualidade',
                description: 'Aumenta efeitos da comida',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ effect_boost: 0.1 * level })
            },
            'criatividade': {
                name: 'Criatividade',
                description: 'Chance de criar pratos especiais',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ special_chance: 0.1 * level })
            }
        };
    }

    cook(player, recipeId) {
        const recipe = this.recipes[recipeId];
        if (!recipe) throw new Error('❌ Receita não encontrada!');

        // Verifica equipamento
        if (!player.cooking?.equipment) {
            throw new Error('❌ Você precisa de equipamento de cozinha!');
        }

        const equipment = this.equipment[player.cooking.equipment];
        if (recipe.difficulty !== 'facil' && equipment.maxDifficulty === 'facil') {
            throw new Error('❌ Seu equipamento não é adequado para esta receita!');
        }
        if (recipe.difficulty === 'dificil' && equipment.maxDifficulty === 'media') {
            throw new Error('❌ Seu equipamento não é adequado para esta receita!');
        }

        // Verifica ingredientes
        Object.entries(recipe.ingredients).forEach(([item, amount]) => {
            if (!player.inventory[item] || player.inventory[item] < amount) {
                throw new Error(`❌ Você precisa de ${amount}x ${item}!`);
            }
        });

        // Consome ingredientes (com chance de economia)
        Object.entries(recipe.ingredients).forEach(([item, amount]) => {
            let consumed = amount;
            if (player.skills?.cooking?.economia) {
                const saveChance = this.skills.economia.effect(
                    player.skills.cooking.economia
                ).ingredient_save;
                if (Math.random() < saveChance) {
                    consumed--;
                }
            }
            player.inventory[item] -= consumed;
            if (player.inventory[item] <= 0) {
                delete player.inventory[item];
            }
        });

        // Calcula tempo de preparo
        let time = recipe.time;
        if (player.skills?.cooking?.eficiencia_culinaria) {
            const reduction = this.skills.eficiencia_culinaria.effect(
                player.skills.cooking.eficiencia_culinaria
            ).time_reduction;
            time *= (1 - reduction);
        }
        time /= equipment.efficiency;

        // Inicia preparo
        player.cooking.preparing = {
            recipe: recipeId,
            startTime: Date.now(),
            endTime: Date.now() + time
        };

        return {
            success: true,
            time: time,
            message: `👨‍🍳 *COZINHANDO*\n\n` +
                    `${recipe.name}\n` +
                    `Tempo: ${Math.ceil(time / 1000)} segundos`
        };
    }

    finishCooking(player) {
        if (!player.cooking?.preparing) {
            throw new Error('❌ Você não está cozinhando nada!');
        }

        const preparing = player.cooking.preparing;
        const recipe = this.recipes[preparing.recipe];

        // Verifica tempo
        if (Date.now() < preparing.endTime) {
            const timeLeft = Math.ceil((preparing.endTime - Date.now()) / 1000);
            throw new Error(`❌ Aguarde ${timeLeft} segundos!`);
        }

        // Calcula qualidade
        let quality = 1.0;
        if (player.skills?.cooking?.qualidade) {
            quality += this.skills.qualidade.effect(
                player.skills.cooking.qualidade
            ).effect_boost;
        }

        // Verifica prato especial
        let isSpecial = false;
        if (player.skills?.cooking?.criatividade) {
            const chance = this.skills.criatividade.effect(
                player.skills.cooking.criatividade
            ).special_chance;
            isSpecial = Math.random() < chance;
        }

        // Cria item
        const itemId = isSpecial ? `${preparing.recipe}_especial` : preparing.recipe;
        if (!player.inventory[itemId]) player.inventory[itemId] = 0;
        player.inventory[itemId]++;

        // Calcula XP
        const xp = Math.floor(recipe.xp * quality * (isSpecial ? 2 : 1));

        // Limpa preparo
        delete player.cooking.preparing;

        return {
            success: true,
            xp: xp,
            special: isSpecial,
            message: `👨‍🍳 *PRATO PRONTO*\n\n` +
                    `${recipe.name}${isSpecial ? ' Especial' : ''}\n` +
                    `Qualidade: ${(quality * 100).toFixed(0)}%\n` +
                    `XP: +${xp}`
        };
    }

    formatRecipeList() {
        let text = `📖 *RECEITAS* 📖\n\n`;

        Object.entries(this.recipes).forEach(([id, recipe]) => {
            text += `*${recipe.name}*\n`;
            text += `├ Dificuldade: ${recipe.difficulty}\n`;
            text += `├ Tempo: ${recipe.time / 1000} segundos\n`;
            text += `├ Ingredientes:\n`;
            Object.entries(recipe.ingredients).forEach(([item, amount]) => {
                text += `│ └ ${amount}x ${item}\n`;
            });
            text += `├ Restaura:\n`;
            Object.entries(recipe.restore).forEach(([stat, value]) => {
                text += `│ └ ${stat}: +${value}\n`;
            });
            text += `└ Valor: R$ ${recipe.value}\n\n`;
        });

        return text;
    }

    formatEquipmentList() {
        let text = `🔧 *EQUIPAMENTOS* 🔧\n\n`;

        Object.entries(this.equipment).forEach(([id, equip]) => {
            text += `*${equip.name}*\n`;
            text += `├ Eficiência: ${(equip.efficiency * 100).toFixed(0)}%\n`;
            text += `├ Dificuldade máxima: ${equip.maxDifficulty}\n`;
            text += `└ Preço: R$ ${equip.cost}\n\n`;
        });

        return text;
    }

    formatSkillList(player) {
        let text = `⚡ *HABILIDADES DE CULINÁRIA* ⚡\n\n`;

        Object.entries(this.skills).forEach(([id, skill]) => {
            const currentLevel = player.skills?.cooking?.[id] || 0;
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

module.exports = new CookingSystem();
