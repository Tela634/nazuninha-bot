class FishingSystem {
    constructor() {
        // Mantém os peixes e locais anteriores, mas adiciona:

        // Sistema de Clima para Pesca
        this.weather = {
            'ensolarado': {
                name: 'Ensolarado',
                effect: {
                    type: 'fish_activity',
                    value: 0.8 // 20% menos ativo
                },
                chance: 0.4
            },
            'nublado': {
                name: 'Nublado',
                effect: {
                    type: 'fish_activity',
                    value: 1.2 // 20% mais ativo
                },
                chance: 0.3
            },
            'chuvoso': {
                name: 'Chuvoso',
                effect: {
                    type: 'rare_chance',
                    value: 1.3 // 30% mais chance de raros
                },
                chance: 0.2
            },
            'tempestade': {
                name: 'Tempestade',
                effect: {
                    type: 'danger',
                    value: 0.3 // 30% chance de perder isca/equipamento
                },
                chance: 0.1
            }
        };

        // Iscas necessárias
        this.baits = {
            'minhoca': {
                name: 'Minhoca',
                description: 'Isca básica',
                price: 50,
                effectiveness: 1,
                targetFish: ['sardinha', 'tilapia', 'carpa']
            },
            'camarao': {
                name: 'Camarão',
                description: 'Isca intermediária',
                price: 200,
                effectiveness: 1.5,
                targetFish: ['atum', 'robalo', 'salmao']
            },
            'peixe_pequeno': {
                name: 'Peixe Pequeno',
                description: 'Para peixes grandes',
                price: 500,
                effectiveness: 2,
                targetFish: ['tubarao', 'peixe_espada']
            },
            'isca_magica': {
                name: 'Isca Mágica',
                description: 'Para peixes lendários',
                price: 2000,
                effectiveness: 3,
                targetFish: ['peixe_dourado', 'sereia']
            }
        };

        // Equipamentos Adicionais
        this.equipment = {
            'linha': {
                name: 'Linha de Pesca',
                description: 'Necessária para pescar',
                price: 100,
                durability: 20
            },
            'anzol': {
                name: 'Anzol',
                description: 'Necessário para pescar',
                price: 50,
                durability: 10
            },
            'rede': {
                name: 'Rede de Pesca',
                description: 'Pesca múltiplos peixes',
                price: 5000,
                durability: 50,
                multiCatch: true
            },
            'sonar': {
                name: 'Sonar',
                description: 'Localiza cardumes',
                price: 10000,
                durability: 100,
                effect: {
                    type: 'fish_finder',
                    value: 1.5 // 50% mais chance
                }
            }
        };

        // Eventos de Pesca
        this.events = {
            'cardume': {
                name: 'Cardume Encontrado',
                effect: {
                    type: 'multi_catch',
                    value: { min: 2, max: 5 }
                },
                chance: 0.1
            },
            'peixe_grande': {
                name: 'Peixe Grande',
                effect: {
                    type: 'size_boost',
                    value: 2 // 2x tamanho normal
                },
                chance: 0.05
            },
            'linha_presa': {
                name: 'Linha Presa',
                effect: {
                    type: 'line_break',
                    value: 0.5 // 50% chance de perder linha
                },
                chance: 0.15
            },
            'tesouro': {
                name: 'Tesouro Encontrado',
                effect: {
                    type: 'treasure',
                    value: { min: 1000, max: 10000 }
                },
                chance: 0.02
            }
        };

        // Habilidades de Pescador
        this.skills = {
            'paciencia': {
                name: 'Paciência de Pescador',
                description: 'Aumenta chance de peixes grandes',
                maxLevel: 5,
                costPerLevel: 2000,
                effect: {
                    type: 'size_chance',
                    valuePerLevel: 0.05 // +5% por nível
                }
            },
            'conhecimento_maritimo': {
                name: 'Conhecimento Marítimo',
                description: 'Aumenta chance de peixes raros',
                maxLevel: 5,
                costPerLevel: 2500,
                effect: {
                    type: 'rare_chance',
                    valuePerLevel: 0.06 // +6% por nível
                }
            },
            'pescador_sortudo': {
                name: 'Pescador Sortudo',
                description: 'Aumenta chance de eventos bons',
                maxLevel: 5,
                costPerLevel: 3000,
                effect: {
                    type: 'luck',
                    valuePerLevel: 0.04 // +4% por nível
                }
            },
            'mestre_pescador': {
                name: 'Mestre Pescador',
                description: 'Reduz tempo entre pescarias',
                maxLevel: 5,
                costPerLevel: 3500,
                effect: {
                    type: 'cooldown_reduction',
                    valuePerLevel: 0.1 // -10% por nível
                }
            }
        };

        // Sistema de Tamanho dos Peixes
        this.sizes = {
            'minusculo': {
                name: 'Minúsculo',
                multiplier: 0.5,
                chance: 0.1
            },
            'pequeno': {
                name: 'Pequeno',
                multiplier: 0.8,
                chance: 0.2
            },
            'medio': {
                name: 'Médio',
                multiplier: 1.0,
                chance: 0.4
            },
            'grande': {
                name: 'Grande',
                multiplier: 1.5,
                chance: 0.2
            },
            'enorme': {
                name: 'Enorme',
                multiplier: 2.0,
                chance: 0.1
            }
        };
    }

    fish(player, location) {
        const loc = this.locations[location];
        if (!loc) throw new Error('❌ Local de pesca não encontrado!');

        // Verifica nível
        if (player.level < loc.level) {
            throw new Error(`❌ Você precisa ser nível ${loc.level} para pescar aqui!`);
        }

        // Verifica equipamento
        if (!player.fishing?.rod) {
            throw new Error('❌ Você precisa de uma vara de pesca! Use /loja para comprar.');
        }

        // Verifica linha e anzol
        if (!this.hasEquipment(player, 'linha') || !this.hasEquipment(player, 'anzol')) {
            throw new Error('❌ Você precisa de linha e anzol para pescar!');
        }

        // Verifica isca
        if (!player.fishing.bait) {
            throw new Error('❌ Você precisa de uma isca! Use /loja para comprar.');
        }

        const rod = this.rods[player.fishing.rod];
        const bait = this.baits[player.fishing.bait];

        // Verifica durabilidade
        if (player.fishing.durability <= 0) {
            throw new Error('❌ Sua vara está quebrada! Compre uma nova na loja.');
        }

        // Gera clima se não existir
        if (!player.fishing.weather || Date.now() - player.fishing.weatherTime > 3600000) {
            player.fishing.weather = this.generateWeather();
            player.fishing.weatherTime = Date.now();
        }

        // Processa eventos
        const event = this.processEvent(player);

        // Tenta pescar
        const result = this.attemptFishing(player, loc, rod, bait, event);

        // Reduz durabilidade
        this.reduceEquipmentDurability(player, event);

        // Aplica resultado
        if (result.success) {
            return {
                success: true,
                fish: result.fish,
                size: result.size,
                event: event,
                weather: player.fishing.weather,
                durability: {
                    rod: player.fishing.durability,
                    line: player.fishing.equipment.linha,
                    hook: player.fishing.equipment.anzol
                },
                message: this.formatFishingResult(result, event, player.fishing.weather)
            };
        }

        return {
            success: false,
            weather: player.fishing.weather,
            durability: {
                rod: player.fishing.durability,
                line: player.fishing.equipment.linha,
                hook: player.fishing.equipment.anzol
            },
            message: '🎣 O peixe escapou!'
        };
    }

    hasEquipment(player, type) {
        return player.fishing?.equipment?.[type] > 0;
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

    processEvent(player) {
        for (const [id, event] of Object.entries(this.events)) {
            let chance = event.chance;

            // Aumenta chance de eventos bons com sorte
            if (player.fishing?.skills?.pescador_sortudo && 
                (id === 'cardume' || id === 'peixe_grande' || id === 'tesouro')) {
                const level = player.fishing.skills.pescador_sortudo;
                chance += (this.skills.pescador_sortudo.effect.valuePerLevel * level);
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

    attemptFishing(player, location, rod, bait, event) {
        // Calcula chance base de sucesso
        let chance = 0.5 * rod.multiplier * bait.effectiveness;

        // Aplica modificadores do clima
        if (player.fishing.weather.effect.type === 'fish_activity') {
            chance *= player.fishing.weather.effect.value;
        }

        // Aplica bônus do sonar
        if (this.hasEquipment(player, 'sonar')) {
            chance *= this.equipment.sonar.effect.value;
        }

        // Tenta pescar
        if (Math.random() < chance) {
            const fish = this.selectFish(location, bait, player);
            const size = this.calculateSize(player, event);

            return {
                success: true,
                fish: fish,
                size: size
            };
        }

        return { success: false };
    }

    calculateSize(player, event) {
        let chances = { ...this.sizes };

        // Aplica bônus de habilidade
        if (player.fishing?.skills?.paciencia) {
            const level = player.fishing.skills.paciencia;
            const bonus = this.skills.paciencia.effect.valuePerLevel * level;
            
            chances.grande.chance += bonus * 0.6;
            chances.enorme.chance += bonus * 0.4;
        }

        // Aplica efeito de evento
        if (event?.effect.type === 'size_boost') {
            return {
                id: 'enorme',
                name: this.sizes.enorme.name,
                multiplier: event.effect.value
            };
        }

        const roll = Math.random();
        let cumulative = 0;
        for (const [id, size] of Object.entries(chances)) {
            cumulative += size.chance;
            if (roll <= cumulative) {
                return {
                    id: id,
                    name: size.name,
                    multiplier: size.multiplier
                };
            }
        }

        return {
            id: 'medio',
            name: this.sizes.medio.name,
            multiplier: this.sizes.medio.multiplier
        };
    }

    reduceEquipmentDurability(player, event) {
        // Reduz durabilidade da vara
        player.fishing.durability--;

        // Reduz durabilidade da linha
        if (event?.effect.type === 'line_break' && Math.random() < event.effect.value) {
            player.fishing.equipment.linha = 0;
        } else {
            player.fishing.equipment.linha--;
        }

        // Reduz durabilidade do anzol
        player.fishing.equipment.anzol--;

        // Remove equipamentos quebrados
        if (player.fishing.equipment.linha <= 0) delete player.fishing.equipment.linha;
        if (player.fishing.equipment.anzol <= 0) delete player.fishing.equipment.anzol;
        if (player.fishing.durability <= 0) delete player.fishing.rod;
    }

    formatFishingResult(result, event, weather) {
        let text = `🎣 *PESCARIA*\n\n`;
        
        text += `🌤️ Clima: ${weather.name}\n\n`;
        
        if (result.success) {
            text += `${result.fish.emoji} Pescou: ${result.fish.name}\n`;
            text += `📏 Tamanho: ${result.size.name}\n`;
            text += `💰 Valor: R$ ${Math.floor(result.fish.price * result.size.multiplier)}\n\n`;
        }

        if (event) {
            text += `✨ *EVENTO*\n`;
            text += `${event.name}\n\n`;
        }

        text += `⚙️ *DURABILIDADE*\n`;
        text += `├ Vara: ${result.durability.rod}\n`;
        text += `├ Linha: ${result.durability.line}\n`;
        text += `└ Anzol: ${result.durability.hook}`;

        return text;
    }

    // ... outros métodos anteriores ...
}

module.exports = new FishingSystem();
