class FarmingSystem {
    constructor() {
        this.crops = {
            // Cultivos Básicos
            'cenoura': {
                name: 'Cenoura',
                growthTime: 300000, // 5 minutos
                waterNeeded: 2,
                minLevel: 1,
                xp: 10,
                value: 5,
                yield: { min: 1, max: 3 }
            },
            'batata': {
                name: 'Batata',
                growthTime: 600000, // 10 minutos
                waterNeeded: 3,
                minLevel: 1,
                xp: 15,
                value: 8,
                yield: { min: 2, max: 4 }
            },
            'tomate': {
                name: 'Tomate',
                growthTime: 900000, // 15 minutos
                waterNeeded: 4,
                minLevel: 5,
                xp: 20,
                value: 12,
                yield: { min: 2, max: 5 }
            },

            // Cultivos Intermediários
            'trigo': {
                name: 'Trigo',
                growthTime: 1800000, // 30 minutos
                waterNeeded: 5,
                minLevel: 10,
                xp: 30,
                value: 20,
                yield: { min: 3, max: 6 }
            },
            'milho': {
                name: 'Milho',
                growthTime: 2700000, // 45 minutos
                waterNeeded: 6,
                minLevel: 15,
                xp: 40,
                value: 25,
                yield: { min: 3, max: 7 }
            },
            'arroz': {
                name: 'Arroz',
                growthTime: 3600000, // 1 hora
                waterNeeded: 8,
                minLevel: 20,
                xp: 50,
                value: 30,
                yield: { min: 4, max: 8 }
            },

            // Cultivos Avançados
            'cafe': {
                name: 'Café',
                growthTime: 7200000, // 2 horas
                waterNeeded: 10,
                minLevel: 25,
                xp: 100,
                value: 100,
                yield: { min: 5, max: 10 }
            },
            'cacau': {
                name: 'Cacau',
                growthTime: 14400000, // 4 horas
                waterNeeded: 12,
                minLevel: 30,
                xp: 200,
                value: 200,
                yield: { min: 6, max: 12 }
            },
            'uva_dourada': {
                name: 'Uva Dourada',
                growthTime: 28800000, // 8 horas
                waterNeeded: 15,
                minLevel: 40,
                xp: 500,
                value: 1000,
                yield: { min: 1, max: 3 }
            }
        };

        this.tools = {
            'regador': {
                name: 'Regador',
                durability: 50,
                efficiency: 1.0,
                cost: 100
            },
            'regador_bronze': {
                name: 'Regador de Bronze',
                durability: 100,
                efficiency: 1.2,
                cost: 500
            },
            'regador_ferro': {
                name: 'Regador de Ferro',
                durability: 200,
                efficiency: 1.5,
                cost: 2000
            },
            'regador_prata': {
                name: 'Regador de Prata',
                durability: 500,
                efficiency: 2.0,
                cost: 5000
            },
            'regador_ouro': {
                name: 'Regador de Ouro',
                durability: 1000,
                efficiency: 2.5,
                cost: 20000
            }
        };

        this.diseases = {
            'fungo': {
                name: 'Fungo',
                chance: 0.1,
                damage: 0.5,
                cure: 'fungicida'
            },
            'praga': {
                name: 'Praga',
                chance: 0.15,
                damage: 0.3,
                cure: 'pesticida'
            },
            'murcha': {
                name: 'Murcha',
                chance: 0.2,
                damage: 0.2,
                cure: 'fertilizante'
            }
        };

        this.treatments = {
            'fungicida': {
                name: 'Fungicida',
                cost: 100,
                effectiveness: 1.0
            },
            'pesticida': {
                name: 'Pesticida',
                cost: 150,
                effectiveness: 1.0
            },
            'fertilizante': {
                name: 'Fertilizante',
                cost: 200,
                effectiveness: 1.0
            }
        };

        this.skills = {
            'irrigacao': {
                name: 'Irrigação',
                description: 'Reduz água necessária',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ water_reduction: 0.1 * level })
            },
            'cultivo': {
                name: 'Cultivo',
                description: 'Aumenta produção',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ yield_boost: 0.1 * level })
            },
            'resistencia': {
                name: 'Resistência',
                description: 'Reduz chance de doenças',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ disease_resistance: 0.1 * level })
            },
            'crescimento': {
                name: 'Crescimento',
                description: 'Acelera crescimento',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ growth_speed: 0.1 * level })
            }
        };
    }

    plant(player, cropId, plotId) {
        const crop = this.crops[cropId];
        if (!crop) throw new Error('❌ Cultivo não encontrado!');

        // Verifica nível
        if (player.level < crop.minLevel) {
            throw new Error(`❌ Você precisa ser nível ${crop.minLevel} para plantar ${crop.name}!`);
        }

        // Verifica se tem sementes
        if (!player.inventory[`semente_${cropId}`]) {
            throw new Error(`❌ Você não tem sementes de ${crop.name}!`);
        }

        // Verifica terreno
        if (!player.farm) player.farm = {};
        if (player.farm[plotId]) {
            throw new Error('❌ Este terreno já está ocupado!');
        }

        // Planta
        player.inventory[`semente_${cropId}`]--;
        if (player.inventory[`semente_${cropId}`] <= 0) {
            delete player.inventory[`semente_${cropId}`];
        }

        // Calcula tempo de crescimento
        let growthTime = crop.growthTime;
        if (player.skills?.farming?.crescimento) {
            const reduction = this.skills.crescimento.effect(
                player.skills.farming.crescimento
            ).growth_speed;
            growthTime *= (1 - reduction);
        }

        player.farm[plotId] = {
            crop: cropId,
            plantedAt: Date.now(),
            harvestAt: Date.now() + growthTime,
            watered: 0,
            health: 100
        };

        return {
            success: true,
            message: `🌱 *PLANTAÇÃO*\n\n` +
                    `Plantou: ${crop.name}\n` +
                    `Terreno: ${plotId}\n` +
                    `Tempo: ${Math.ceil(growthTime / 60000)} minutos`
        };
    }

    water(player, plotId) {
        if (!player.farm?.[plotId]) {
            throw new Error('❌ Nenhum cultivo neste terreno!');
        }

        const plot = player.farm[plotId];
        const crop = this.crops[plot.crop];

        // Verifica regador
        if (!player.tools?.regador) {
            throw new Error('❌ Você precisa de um regador!');
        }

        const tool = this.tools[player.tools.regador.id];
        if (player.tools.regador.durability <= 0) {
            throw new Error('❌ Seu regador está quebrado!');
        }

        // Calcula água necessária
        let waterNeeded = crop.waterNeeded;
        if (player.skills?.farming?.irrigacao) {
            const reduction = this.skills.irrigacao.effect(
                player.skills.farming.irrigacao
            ).water_reduction;
            waterNeeded *= (1 - reduction);
        }

        if (plot.watered >= waterNeeded) {
            throw new Error('❌ Este cultivo já está bem regado!');
        }

        // Rega
        plot.watered++;
        player.tools.regador.durability--;

        // Chance de doença
        this.checkDisease(player, plotId);

        return {
            success: true,
            message: `💧 Regou ${crop.name}\n` +
                    `Água: ${plot.watered}/${waterNeeded}\n` +
                    `Saúde: ${plot.health}%\n` +
                    `Regador: ${player.tools.regador.durability}/${tool.durability}`
        };
    }

    checkDisease(player, plotId) {
        const plot = player.farm[plotId];

        // Calcula resistência
        let resistance = 0;
        if (player.skills?.farming?.resistencia) {
            resistance = this.skills.resistencia.effect(
                player.skills.farming.resistencia
            ).disease_resistance;
        }

        // Verifica cada doença
        Object.entries(this.diseases).forEach(([id, disease]) => {
            if (Math.random() < disease.chance * (1 - resistance)) {
                plot.disease = id;
                plot.health -= disease.damage * 100;
            }
        });

        if (plot.health <= 0) {
            delete player.farm[plotId];
            return false;
        }

        return true;
    }

    treat(player, plotId, treatmentId) {
        if (!player.farm?.[plotId]) {
            throw new Error('❌ Nenhum cultivo neste terreno!');
        }

        const plot = player.farm[plotId];
        if (!plot.disease) {
            throw new Error('❌ Este cultivo está saudável!');
        }

        const treatment = this.treatments[treatmentId];
        if (!treatment) throw new Error('❌ Tratamento não encontrado!');

        const disease = this.diseases[plot.disease];
        if (disease.cure !== treatmentId) {
            throw new Error('❌ Este tratamento não é eficaz contra esta doença!');
        }

        // Aplica tratamento
        delete plot.disease;
        plot.health = Math.min(100, plot.health + 50);

        return {
            success: true,
            message: `💊 Tratou ${this.crops[plot.crop].name}\n` +
                    `Saúde: ${plot.health}%`
        };
    }

    harvest(player, plotId) {
        if (!player.farm?.[plotId]) {
            throw new Error('❌ Nenhum cultivo neste terreno!');
        }

        const plot = player.farm[plotId];
        const crop = this.crops[plot.crop];

        // Verifica se está pronto
        if (Date.now() < plot.harvestAt) {
            const timeLeft = Math.ceil((plot.harvestAt - Date.now()) / 60000);
            throw new Error(`❌ Ainda faltam ${timeLeft} minutos para colher!`);
        }

        // Verifica água
        let waterNeeded = crop.waterNeeded;
        if (player.skills?.farming?.irrigacao) {
            const reduction = this.skills.irrigacao.effect(
                player.skills.farming.irrigacao
            ).water_reduction;
            waterNeeded *= (1 - reduction);
        }

        if (plot.watered < waterNeeded) {
            throw new Error('❌ Este cultivo precisa de mais água!');
        }

        // Calcula produção
        let amount = Math.floor(
            Math.random() * (crop.yield.max - crop.yield.min + 1) + crop.yield.min
        );

        // Aplica bônus de cultivo
        if (player.skills?.farming?.cultivo) {
            const boost = this.skills.cultivo.effect(
                player.skills.farming.cultivo
            ).yield_boost;
            amount = Math.floor(amount * (1 + boost));
        }

        // Aplica penalidade de saúde
        amount = Math.floor(amount * (plot.health / 100));

        // Adiciona ao inventário
        if (!player.inventory[plot.crop]) player.inventory[plot.crop] = 0;
        player.inventory[plot.crop] += amount;

        // Calcula XP
        const xp = Math.floor(crop.xp * (plot.health / 100));

        // Limpa terreno
        delete player.farm[plotId];

        return {
            success: true,
            amount: amount,
            xp: xp,
            message: `🌾 *COLHEITA*\n\n` +
                    `Colheu: ${amount}x ${crop.name}\n` +
                    `XP: +${xp}\n` +
                    `Qualidade: ${plot.health}%`
        };
    }

    formatFarmStatus(player) {
        if (!player.farm || Object.keys(player.farm).length === 0) {
            return `🌱 *FAZENDA* 🌱\n\n` +
                   `_Nenhum cultivo ativo_\n` +
                   `Use /plantar para começar!`;
        }

        let text = `🌱 *FAZENDA* 🌱\n\n`;

        Object.entries(player.farm).forEach(([plotId, plot]) => {
            const crop = this.crops[plot.crop];
            const waterNeeded = Math.floor(crop.waterNeeded * (
                1 - (player.skills?.farming?.irrigacao ? 
                    this.skills.irrigacao.effect(
                        player.skills.farming.irrigacao
                    ).water_reduction : 0)
            ));

            text += `*Terreno ${plotId}*\n`;
            text += `├ Cultivo: ${crop.name}\n`;
            text += `├ Água: ${plot.watered}/${waterNeeded}\n`;
            text += `├ Saúde: ${plot.health}%\n`;
            if (plot.disease) {
                text += `├ Doença: ${this.diseases[plot.disease].name}\n`;
            }
            const timeLeft = Math.ceil((plot.harvestAt - Date.now()) / 60000);
            text += `└ Tempo: ${timeLeft} minutos\n\n`;
        });

        return text;
    }

    formatCropList() {
        let text = `🌱 *CULTIVOS* 🌱\n\n`;

        Object.entries(this.crops).forEach(([id, crop]) => {
            text += `*${crop.name}*\n`;
            text += `├ Nível: ${crop.minLevel}\n`;
            text += `├ Tempo: ${crop.growthTime / 60000} minutos\n`;
            text += `├ Água: ${crop.waterNeeded}\n`;
            text += `├ Produção: ${crop.yield.min}-${crop.yield.max}\n`;
            text += `└ Valor: R$ ${crop.value}\n\n`;
        });

        return text;
    }

    formatToolList() {
        let text = `🔧 *FERRAMENTAS* 🔧\n\n`;

        Object.entries(this.tools).forEach(([id, tool]) => {
            text += `*${tool.name}*\n`;
            text += `├ Durabilidade: ${tool.durability}\n`;
            text += `├ Eficiência: ${(tool.efficiency * 100).toFixed(0)}%\n`;
            text += `└ Preço: R$ ${tool.cost}\n\n`;
        });

        return text;
    }

    formatSkillList(player) {
        let text = `⚡ *HABILIDADES DE AGRICULTURA* ⚡\n\n`;

        Object.entries(this.skills).forEach(([id, skill]) => {
            const currentLevel = player.skills?.farming?.[id] || 0;
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

module.exports = new FarmingSystem();
