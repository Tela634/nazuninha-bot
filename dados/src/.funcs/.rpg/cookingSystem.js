class CookingSystem {
    constructor() {
        // Mantém as receitas anteriores, mas adiciona:

        // Qualidade dos Ingredientes
        this.ingredients = {
            'fresco': {
                name: 'Fresco',
                multiplier: 1.5,
                chance: 0.2,
                price_multiplier: 2
            },
            'normal': {
                name: 'Normal',
                multiplier: 1.0,
                chance: 0.5,
                price_multiplier: 1
            },
            'velho': {
                name: 'Velho',
                multiplier: 0.7,
                chance: 0.2,
                price_multiplier: 0.5
            },
            'estragado': {
                name: 'Estragado',
                multiplier: 0,
                chance: 0.1,
                price_multiplier: 0.1
            }
        };

        // Equipamentos Necessários
        this.equipment = {
            'faca': {
                name: 'Faca',
                description: 'Para cortar ingredientes',
                price: 500,
                durability: 50,
                required: ['carne', 'peixe', 'legumes']
            },
            'panela': {
                name: 'Panela',
                description: 'Para cozinhar',
                price: 1000,
                durability: 100,
                required: ['sopa', 'feijoada', 'ensopado']
            },
            'frigideira': {
                name: 'Frigideira',
                description: 'Para fritar',
                price: 800,
                durability: 80,
                required: ['bife', 'ovo', 'peixe_frito']
            },
            'forno': {
                name: 'Forno',
                description: 'Para assar',
                price: 2000,
                durability: 200,
                required: ['pao', 'bolo', 'torta']
            }
        };

        // Eventos de Cozinha
        this.events = {
            'fogo_alto': {
                name: 'Fogo Alto',
                effect: {
                    type: 'burn_chance',
                    value: 0.3 // 30% chance de queimar
                },
                chance: 0.2
            },
            'tempero_especial': {
                name: 'Tempero Especial',
                effect: {
                    type: 'quality_boost',
                    value: 1.5 // +50% qualidade
                },
                chance: 0.1
            },
            'acidente': {
                name: 'Acidente de Cozinha',
                effect: {
                    type: 'ingredient_loss',
                    value: 0.5 // Perde 50% dos ingredientes
                },
                chance: 0.15
            },
            'inspiracao': {
                name: 'Inspiração Culinária',
                effect: {
                    type: 'double_portion',
                    value: 2 // Dobra a quantidade
                },
                chance: 0.05
            }
        };

        // Habilidades de Cozinheiro
        this.skills = {
            'controle_fogo': {
                name: 'Controle do Fogo',
                description: 'Reduz chance de queimar',
                maxLevel: 5,
                costPerLevel: 2000,
                effect: {
                    type: 'burn_reduction',
                    valuePerLevel: 0.1 // -10% por nível
                }
            },
            'tempero_perfeito': {
                name: 'Tempero Perfeito',
                description: 'Aumenta qualidade',
                maxLevel: 5,
                costPerLevel: 2500,
                effect: {
                    type: 'quality_boost',
                    valuePerLevel: 0.1 // +10% por nível
                }
            },
            'economia_ingredientes': {
                name: 'Economia de Ingredientes',
                description: 'Chance de não gastar',
                maxLevel: 5,
                costPerLevel: 1500,
                effect: {
                    type: 'ingredient_save',
                    valuePerLevel: 0.05 // +5% por nível
                }
            },
            'porcao_extra': {
                name: 'Porção Extra',
                description: 'Chance de porção extra',
                maxLevel: 5,
                costPerLevel: 3000,
                effect: {
                    type: 'extra_portion',
                    valuePerLevel: 0.05 // +5% por nível
                }
            }
        };

        // Sistema de Crítico
        this.criticals = {
            'perfeito': {
                name: 'Perfeito',
                multiplier: 2.0,
                effects: ['double_duration', 'double_stats'],
                chance: 0.05
            },
            'obra_prima': {
                name: 'Obra-Prima',
                multiplier: 1.5,
                effects: ['bonus_stats'],
                chance: 0.15
            },
            'desastre': {
                name: 'Desastre',
                multiplier: 0,
                effects: ['food_poisoning'],
                chance: 0.1
            }
        };
    }

    cook(player, recipeId) {
        const recipe = this.recipes[recipeId];
        if (!recipe) throw new Error('❌ Receita não encontrada!');

        // Verifica nível
        if (player.level < recipe.level) {
            throw new Error(`❌ Você precisa ser nível ${recipe.level} para fazer esta receita!`);
        }

        // Verifica equipamentos necessários
        for (const [equip, data] of Object.entries(this.equipment)) {
            if (data.required.some(type => recipe.type.includes(type))) {
                if (!player.cooking?.equipment?.[equip] || player.cooking.equipment[equip] <= 0) {
                    throw new Error(`❌ Você precisa de ${data.name} para fazer esta receita!`);
                }
            }
        }

        // Verifica e remove ingredientes
        for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
            const playerHas = player.inventory.filter(i => i.id === ingredient).length;
            if (playerHas < amount) {
                throw new Error(`❌ Você precisa de ${amount}x ${ingredient} (tem ${playerHas})`);
            }
        }

        // Processa eventos
        const event = this.processEvent(player);
        if (event?.effect.type === 'ingredient_loss') {
            throw new Error('❌ Você perdeu alguns ingredientes em um acidente!');
        }

        // Remove ingredientes
        if (!this.tryIngredientSave(player)) {
            for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
                for (let i = 0; i < amount; i++) {
                    const index = player.inventory.findIndex(item => item.id === ingredient);
                    player.inventory.splice(index, 1);
                }
            }
        }

        // Reduz durabilidade dos equipamentos
        this.reduceEquipmentDurability(player, recipe);

        // Calcula resultado
        const result = this.calculateCookingResult(player, recipe, event);

        // Cria o item
        const cookedItem = {
            id: recipeId,
            name: recipe.name,
            emoji: recipe.emoji,
            type: recipe.result.type,
            quality: result.quality,
            effect: this.calculateFoodEffect(recipe.result, result),
            madeBy: player.name
        };

        // Aplica multiplicador de quantidade
        let quantity = 1;
        if (event?.effect.type === 'double_portion') quantity = 2;
        if (result.critical?.effects?.includes('double_portion')) quantity = 2;

        // Adiciona ao inventário
        for (let i = 0; i < quantity; i++) {
            player.inventory.push({...cookedItem});
        }

        // Adiciona XP de culinária
        const xpGained = Math.floor(recipe.xp * (result.quality?.multiplier || 1));
        player.cooking.xp = (player.cooking.xp || 0) + xpGained;

        // Verifica level up
        let levelUp = false;
        if (!player.cooking.level) player.cooking.level = 1;
        while (player.cooking.xp >= player.cooking.level * 100) {
            player.cooking.xp -= player.cooking.level * 100;
            player.cooking.level++;
            levelUp = true;
        }

        return {
            success: true,
            item: cookedItem,
            quantity: quantity,
            quality: result.quality,
            critical: result.critical,
            event: event,
            xpGained: xpGained,
            levelUp: levelUp,
            message: this.formatCookingResult(cookedItem, quantity, result, event, xpGained, levelUp)
        };
    }

    processEvent(player) {
        for (const [id, event] of Object.entries(this.events)) {
            let chance = event.chance;

            // Reduz chance de queimar
            if (id === 'fogo_alto' && player.cooking?.skills?.controle_fogo) {
                const level = player.cooking.skills.controle_fogo;
                chance *= (1 - (this.skills.controle_fogo.effect.valuePerLevel * level));
            }

            if (Math.random() < chance) {
                return {
                    id: id,
                    name: event.name,
                    effect: event.effect
                };
            }
        }
        return null;
    }

    tryIngredientSave(player) {
        if (player.cooking?.skills?.economia_ingredientes) {
            const level = player.cooking.skills.economia_ingredientes;
            const chance = this.skills.economia_ingredientes.effect.valuePerLevel * level;
            return Math.random() < chance;
        }
        return false;
    }

    reduceEquipmentDurability(player, recipe) {
        for (const [equip, data] of Object.entries(this.equipment)) {
            if (data.required.some(type => recipe.type.includes(type))) {
                player.cooking.equipment[equip]--;
                if (player.cooking.equipment[equip] <= 0) {
                    delete player.cooking.equipment[equip];
                }
            }
        }
    }

    calculateCookingResult(player, recipe, event) {
        // Calcula qualidade
        let quality = this.calculateQuality(player);
        
        // Aplica efeito de evento
        if (event?.effect.type === 'quality_boost') {
            quality.multiplier *= event.effect.value;
        }

        // Tenta crítico
        const critical = this.rollCritical(player);
        if (critical) {
            quality.multiplier *= critical.multiplier;
        }

        return {
            quality: quality,
            critical: critical
        };
    }

    calculateQuality(player) {
        let baseMultiplier = 1;

        // Aplica bônus de habilidade
        if (player.cooking?.skills?.tempero_perfeito) {
            const level = player.cooking.skills.tempero_perfeito;
            baseMultiplier += (this.skills.tempero_perfeito.effect.valuePerLevel * level);
        }

        const roll = Math.random();
        let cumulative = 0;
        for (const [id, quality] of Object.entries(this.ingredients)) {
            cumulative += quality.chance;
            if (roll <= cumulative) {
                return {
                    id: id,
                    name: quality.name,
                    multiplier: quality.multiplier * baseMultiplier
                };
            }
        }

        return {
            id: 'normal',
            name: this.ingredients.normal.name,
            multiplier: this.ingredients.normal.multiplier * baseMultiplier
        };
    }

    rollCritical(player) {
        for (const [id, critical] of Object.entries(this.criticals)) {
            if (Math.random() < critical.chance) {
                return {
                    id: id,
                    name: critical.name,
                    multiplier: critical.multiplier,
                    effects: critical.effects
                };
            }
        }
        return null;
    }

    calculateFoodEffect(baseEffect, result) {
        let effect = {...baseEffect};

        // Aplica multiplicador de qualidade
        if (typeof effect.value === 'number') {
            effect.value *= (result.quality?.multiplier || 1);
        }

        // Aplica efeitos críticos
        if (result.critical?.effects?.includes('double_stats')) {
            effect.value *= 2;
        }
        if (result.critical?.effects?.includes('double_duration')) {
            effect.duration *= 2;
        }
        if (result.critical?.effects?.includes('food_poisoning')) {
            effect.type = 'poison';
            effect.value = -effect.value;
        }

        return effect;
    }

    formatCookingResult(item, quantity, result, event, xp, levelUp) {
        let text = `👨‍🍳 *COZINHA* 👨‍🍳\n\n`;
        
        text += `${item.emoji} Preparou: ${quantity}x ${item.name}\n`;
        text += `📊 Qualidade: ${result.quality.name}\n`;
        
        if (result.critical) {
            text += `✨ Crítico: ${result.critical.name}!\n`;
        }

        if (event) {
            text += `\n📢 Evento: ${event.name}!\n`;
        }

        text += `\n✨ XP ganho: ${xp}`;
        
        if (levelUp) {
            text += `\n🎊 Nível de culinária subiu para ${player.cooking.level}!`;
        }

        return text;
    }

    // ... outros métodos anteriores ...
}

module.exports = new CookingSystem();
