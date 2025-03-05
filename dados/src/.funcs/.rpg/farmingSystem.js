class FarmingSystem {
    constructor() {
        // Mantém as plantações anteriores, mas adiciona:

        // Sistema de Clima
        this.weather = {
            'ensolarado': {
                name: 'Ensolarado',
                effect: {
                    type: 'growth_speed',
                    value: 1.2 // 20% mais rápido
                },
                chance: 0.4
            },
            'chuvoso': {
                name: 'Chuvoso',
                effect: {
                    type: 'water_save',
                    value: 1 // Não precisa regar
                },
                chance: 0.3
            },
            'seca': {
                name: 'Seca',
                effect: {
                    type: 'water_need',
                    value: 2 // Precisa 2x mais água
                },
                chance: 0.15
            },
            'tempestade': {
                name: 'Tempestade',
                effect: {
                    type: 'damage',
                    value: 0.3 // 30% chance de perder plantação
                },
                chance: 0.1
            },
            'geada': {
                name: 'Geada',
                effect: {
                    type: 'freeze',
                    value: 0.5 // Crescimento 50% mais lento
                },
                chance: 0.05
            }
        };

        // Ferramentas necessárias
        this.tools = {
            'regador': {
                name: 'Regador',
                description: 'Para regar as plantas',
                price: 500,
                durability: 50,
                efficiency: 1
            },
            'regador_pro': {
                name: 'Regador Profissional',
                description: 'Rega múltiplas plantas',
                price: 2000,
                durability: 100,
                efficiency: 2
            },
            'pa': {
                name: 'Pá',
                description: 'Para preparar a terra',
                price: 800,
                durability: 50,
                efficiency: 1
            },
            'pa_ferro': {
                name: 'Pá de Ferro',
                description: 'Prepara terra mais rápido',
                price: 3000,
                durability: 100,
                efficiency: 2
            },
            'fertilizante': {
                name: 'Fertilizante',
                description: 'Acelera crescimento',
                price: 1000,
                uses: 5,
                boost: 1.5
            }
        };

        // Pragas e Doenças
        this.diseases = {
            'fungos': {
                name: 'Fungos',
                effect: {
                    type: 'quality_reduction',
                    value: 0.3 // -30% qualidade
                },
                chance: 0.2,
                cure: 'fungicida'
            },
            'insetos': {
                name: 'Insetos',
                effect: {
                    type: 'growth_reduction',
                    value: 0.4 // -40% velocidade
                },
                chance: 0.15,
                cure: 'inseticida'
            },
            'virus': {
                name: 'Vírus Vegetal',
                effect: {
                    type: 'death',
                    value: 0.5 // 50% chance de morte
                },
                chance: 0.1,
                cure: 'antiviral'
            }
        };

        // Tratamentos
        this.treatments = {
            'fungicida': {
                name: 'Fungicida',
                price: 1500,
                uses: 3
            },
            'inseticida': {
                name: 'Inseticida',
                price: 2000,
                uses: 3
            },
            'antiviral': {
                name: 'Antiviral',
                price: 3000,
                uses: 3
            }
        };

        // Sistema de Qualidade
        this.quality = {
            'perfeito': {
                name: 'Perfeito',
                multiplier: 2.0,
                chance: 0.1
            },
            'excelente': {
                name: 'Excelente',
                multiplier: 1.5,
                chance: 0.2
            },
            'bom': {
                name: 'Bom',
                multiplier: 1.2,
                chance: 0.3
            },
            'normal': {
                name: 'Normal',
                multiplier: 1.0,
                chance: 0.3
            },
            'ruim': {
                name: 'Ruim',
                multiplier: 0.5,
                chance: 0.1
            }
        };

        // Habilidades de Fazendeiro
        this.skills = {
            'mao_verde': {
                name: 'Mão Verde',
                description: 'Aumenta chance de qualidade alta',
                maxLevel: 5,
                costPerLevel: 2000,
                effect: {
                    type: 'quality_chance',
                    valuePerLevel: 0.05 // +5% por nível
                }
            },
            'agronomia': {
                name: 'Agronomia',
                description: 'Reduz chance de doenças',
                maxLevel: 5,
                costPerLevel: 2500,
                effect: {
                    type: 'disease_resistance',
                    valuePerLevel: 0.1 // -10% por nível
                }
            },
            'irrigacao': {
                name: 'Irrigação',
                description: 'Reduz consumo de água',
                maxLevel: 5,
                costPerLevel: 1500,
                effect: {
                    type: 'water_save',
                    valuePerLevel: 0.1 // -10% por nível
                }
            },
            'colheita': {
                name: 'Colheita Eficiente',
                description: 'Chance de colheita dupla',
                maxLevel: 5,
                costPerLevel: 3000,
                effect: {
                    type: 'double_harvest',
                    valuePerLevel: 0.05 // +5% por nível
                }
            }
        };
    }

    plant(player, cropId, quantity = 1) {
        const crop = this.crops[cropId];
        if (!crop) throw new Error('❌ Plantação não encontrada!');

        // Verifica nível
        if (player.level < crop.level) {
            throw new Error(`❌ Você precisa ser nível ${crop.level} para plantar ${crop.name}!`);
        }

        // Verifica ferramentas
        if (!player.farming?.tools?.includes('pa') && !player.farming?.tools?.includes('pa_ferro')) {
            throw new Error('❌ Você precisa de uma pá para preparar a terra!');
        }

        if (!player.farming?.tools?.includes('regador') && !player.farming?.tools?.includes('regador_pro')) {
            throw new Error('❌ Você precisa de um regador para cuidar das plantas!');
        }

        // Verifica espaço
        if (!player.farm) {
            player.farm = {
                plots: [],
                level: 1,
                xp: 0,
                tools: [],
                weather: this.generateWeather()
            };
        }

        const maxPlots = player.farm.level * 5;
        if (player.farm.plots.length + quantity > maxPlots) {
            throw new Error(`❌ Sua fazenda só tem espaço para ${maxPlots} plantações!`);
        }

        // Verifica dinheiro
        const totalCost = crop.price * quantity;
        if (player.money.wallet < totalCost) {
            throw new Error(`❌ Você precisa de R$ ${totalCost} para plantar ${quantity}x ${crop.name}!`);
        }

        // Reduz durabilidade das ferramentas
        this.reduceDurability(player, 'pa');
        this.reduceDurability(player, 'regador');

        // Planta
        for (let i = 0; i < quantity; i++) {
            const plot = {
                crop: cropId,
                plantedAt: Date.now(),
                quality: this.calculateQuality(player),
                health: 100,
                watered: true,
                disease: this.checkDisease(player),
                readyAt: this.calculateGrowthTime(crop, player)
            };

            player.farm.plots.push(plot);
        }

        // Remove dinheiro
        player.money.wallet -= totalCost;

        return {
            success: true,
            message: `🌱 *PLANTAÇÃO*\n\n` +
                    `${crop.emoji} Plantou ${quantity}x ${crop.name}\n` +
                    `⏰ Tempo estimado: ${Math.ceil((plot.readyAt - Date.now()) / (60 * 1000))} minutos\n` +
                    `💰 Custo: R$ ${totalCost}\n\n` +
                    `🌤️ Clima: ${player.farm.weather.name}\n` +
                    (plot.disease ? `⚠️ Doença detectada: ${plot.disease.name}!` : '')
        };
    }

    generateWeather() {
        const roll = Math.random();
        let cumulative = 0;
        for (const [id, weather] of Object.entries(this.weather)) {
            cumulative += weather.chance;
            if (roll <= cumulative) {
                return {
                    id: id,
                    name: weather.name,
                    effect: weather.effect
                };
            }
        }
        return {
            id: 'ensolarado',
            name: this.weather.ensolarado.name,
            effect: this.weather.ensolarado.effect
        };
    }

    calculateQuality(player) {
        let chances = { ...this.quality };

        // Aplica bônus de habilidade
        if (player.farming?.skills?.mao_verde) {
            const level = player.farming.skills.mao_verde;
            const bonus = this.skills.mao_verde.effect.valuePerLevel * level;
            
            chances.perfeito.chance += bonus * 0.5;
            chances.excelente.chance += bonus * 0.3;
            chances.bom.chance += bonus * 0.2;
        }

        const roll = Math.random();
        let cumulative = 0;
        for (const [id, quality] of Object.entries(chances)) {
            cumulative += quality.chance;
            if (roll <= cumulative) {
                return {
                    id: id,
                    name: quality.name,
                    multiplier: quality.multiplier
                };
            }
        }
        return {
            id: 'normal',
            name: this.quality.normal.name,
            multiplier: this.quality.normal.multiplier
        };
    }

    checkDisease(player) {
        for (const [id, disease] of Object.entries(this.diseases)) {
            let chance = disease.chance;

            // Reduz chance com habilidade
            if (player.farming?.skills?.agronomia) {
                const level = player.farming.skills.agronomia;
                chance *= (1 - (this.skills.agronomia.effect.valuePerLevel * level));
            }

            if (Math.random() < chance) {
                return {
                    id: id,
                    name: disease.name,
                    effect: disease.effect,
                    cure: disease.cure
                };
            }
        }
        return null;
    }

    calculateGrowthTime(crop, player) {
        let time = crop.growthTime * 60 * 1000; // Converte minutos para ms

        // Aplica efeito do clima
        if (player.farm.weather.effect.type === 'growth_speed') {
            time /= player.farm.weather.effect.value;
        } else if (player.farm.weather.effect.type === 'freeze') {
            time *= (1 + player.farm.weather.effect.value);
        }

        // Aplica efeito de fertilizante
        if (player.farming?.fertilizer) {
            time /= this.tools.fertilizante.boost;
        }

        return Date.now() + time;
    }

    reduceDurability(player, toolType) {
        const tool = player.farming.tools.find(t => t.startsWith(toolType));
        if (!tool) return;

        player.farming.durability[tool]--;
        if (player.farming.durability[tool] <= 0) {
            player.farming.tools = player.farming.tools.filter(t => t !== tool);
            delete player.farming.durability[tool];
        }
    }

    // ... outros métodos anteriores ...
}

module.exports = new FarmingSystem();
