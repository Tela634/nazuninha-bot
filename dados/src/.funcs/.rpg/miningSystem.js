class MiningSystem {
    constructor() {
        // Mantém os minérios e locais anteriores, mas adiciona:
        
        // Sistema de Durabilidade de Picaretas
        this.durabilityLoss = {
            'carvao': 1,
            'ferro': 2,
            'cobre': 1,
            'prata': 3,
            'ouro': 4,
            'platina': 5,
            'diamante': 6,
            'esmeralda': 5,
            'rubi': 6,
            'cristal_magico': 8,
            'meteorito': 10
        };

        // Chance de quebrar a picareta ao minerar (além da durabilidade)
        this.breakChance = {
            'picareta_madeira': 0.05,  // 5% por uso
            'picareta_pedra': 0.03,
            'picareta_ferro': 0.02,
            'picareta_diamante': 0.01,
            'picareta_magica': 0.005
        };

        // Energia necessária para minerar
        this.energyCost = {
            'mina_carvao': 5,
            'mina_ferro': 10,
            'mina_ouro': 15,
            'mina_diamante': 20,
            'mina_magica': 30
        };

        // Requisitos de ferramentas para cada minério
        this.toolRequirements = {
            'carvao': ['picareta_madeira', 'picareta_pedra', 'picareta_ferro', 'picareta_diamante', 'picareta_magica'],
            'ferro': ['picareta_pedra', 'picareta_ferro', 'picareta_diamante', 'picareta_magica'],
            'cobre': ['picareta_pedra', 'picareta_ferro', 'picareta_diamante', 'picareta_magica'],
            'prata': ['picareta_ferro', 'picareta_diamante', 'picareta_magica'],
            'ouro': ['picareta_ferro', 'picareta_diamante', 'picareta_magica'],
            'platina': ['picareta_diamante', 'picareta_magica'],
            'diamante': ['picareta_diamante', 'picareta_magica'],
            'esmeralda': ['picareta_diamante', 'picareta_magica'],
            'rubi': ['picareta_diamante', 'picareta_magica'],
            'cristal_magico': ['picareta_magica'],
            'meteorito': ['picareta_magica']
        };

        // Eventos aleatórios durante mineração
        this.events = {
            'cave_in': {
                name: 'Desmoronamento',
                chance: 0.05,
                effect: {
                    type: 'damage',
                    value: 20,
                    message: '⚠️ Um desmoronamento ocorreu! Você perdeu 20 de vida.'
                }
            },
            'gas_leak': {
                name: 'Vazamento de Gás',
                chance: 0.03,
                effect: {
                    type: 'energy_drain',
                    value: 30,
                    message: '☠️ Vazamento de gás tóxico! Você perdeu 30 de energia.'
                }
            },
            'treasure': {
                name: 'Tesouro Escondido',
                chance: 0.02,
                effect: {
                    type: 'reward',
                    value: { min: 1000, max: 5000 },
                    message: '💎 Você encontrou um tesouro escondido!'
                }
            },
            'rare_vein': {
                name: 'Veio Raro',
                chance: 0.01,
                effect: {
                    type: 'double_drops',
                    message: '✨ Você encontrou um veio raro! Drops duplicados!'
                }
            }
        };

        // Sistema de Upgrades de Mineração
        this.upgrades = {
            'capacete_minerador': {
                name: 'Capacete de Minerador',
                description: 'Proteção contra desmoronamentos',
                price: 5000,
                effect: {
                    type: 'damage_reduction',
                    value: 0.5 // 50% menos dano
                }
            },
            'mascara_gas': {
                name: 'Máscara de Gás',
                description: 'Proteção contra gases tóxicos',
                price: 8000,
                effect: {
                    type: 'gas_immunity',
                    value: 1
                }
            },
            'detector_minerais': {
                name: 'Detector de Minerais',
                description: 'Aumenta chance de minérios raros',
                price: 15000,
                effect: {
                    type: 'rare_boost',
                    value: 0.2 // +20% chance
                }
            },
            'mochila_minerador': {
                name: 'Mochila de Minerador',
                description: 'Reduz consumo de energia',
                price: 10000,
                effect: {
                    type: 'energy_reduction',
                    value: 0.3 // 30% menos energia
                }
            }
        };

        // Sistema de Habilidades de Mineração
        this.skills = {
            'olho_minerador': {
                name: 'Olho de Minerador',
                description: 'Chance de minerais extras',
                maxLevel: 5,
                costPerLevel: 1000,
                effect: {
                    type: 'extra_mineral',
                    valuePerLevel: 0.05 // +5% por nível
                }
            },
            'resistencia_minerador': {
                name: 'Resistência de Minerador',
                description: 'Reduz perda de energia',
                maxLevel: 5,
                costPerLevel: 1500,
                effect: {
                    type: 'energy_save',
                    valuePerLevel: 0.06 // +6% por nível
                }
            },
            'sorte_minerador': {
                name: 'Sorte de Minerador',
                description: 'Aumenta chance de eventos bons',
                maxLevel: 5,
                costPerLevel: 2000,
                effect: {
                    type: 'luck',
                    valuePerLevel: 0.04 // +4% por nível
                }
            },
            'expertise_minerador': {
                name: 'Expertise de Minerador',
                description: 'Reduz chance de quebrar ferramentas',
                maxLevel: 5,
                costPerLevel: 2500,
                effect: {
                    type: 'break_reduction',
                    valuePerLevel: 0.1 // -10% por nível
                }
            }
        };
    }

    mine(player, location) {
        const loc = this.locations[location];
        if (!loc) throw new Error('❌ Local de mineração não encontrado!');

        // Verifica nível
        if (player.level < loc.level) {
            throw new Error(`❌ Você precisa ser nível ${loc.level} para minerar aqui!`);
        }

        // Verifica energia
        const energyNeeded = this.calculateEnergyCost(player, location);
        if (player.energy < energyNeeded) {
            throw new Error(`❌ Você precisa de ${energyNeeded} de energia para minerar aqui!`);
        }

        // Verifica picareta
        if (!player.mining?.pickaxe) {
            throw new Error('❌ Você precisa de uma picareta! Use /loja para comprar.');
        }

        const pickaxe = this.pickaxes[player.mining.pickaxe];

        // Verifica durabilidade
        if (player.mining.durability <= 0) {
            throw new Error('❌ Sua picareta está quebrada! Compre uma nova na loja.');
        }

        // Processa eventos aleatórios
        const event = this.processRandomEvent(player);
        if (event?.effect.type === 'damage' && player.health <= event.effect.value) {
            throw new Error('❌ Você está muito ferido para minerar! Use /curar primeiro.');
        }

        // Tenta minerar
        const result = this.attemptMining(player, loc, pickaxe);

        // Aplica custos e efeitos
        player.energy -= energyNeeded;
        if (event?.effect.type === 'damage') player.health -= event.effect.value;
        if (event?.effect.type === 'energy_drain') player.energy = Math.max(0, player.energy - event.effect.value);

        // Reduz durabilidade e verifica quebra
        const durabilityLoss = this.calculateDurabilityLoss(result.mineral, player);
        player.mining.durability -= durabilityLoss;

        if (this.checkToolBreak(player)) {
            delete player.mining.pickaxe;
            player.mining.durability = 0;
            return {
                success: false,
                message: '💔 Sua picareta quebrou completamente!'
            };
        }

        // Aplica resultado
        if (result.success) {
            this.addMineral(player, result.mineral, result.amount);
            return {
                success: true,
                mineral: result.mineral,
                amount: result.amount,
                durability: player.mining.durability,
                event: event,
                message: this.formatMiningResult(result, event)
            };
        }

        return {
            success: false,
            durability: player.mining.durability,
            event: event,
            message: '❌ Você não encontrou nada...'
        };
    }

    calculateEnergyCost(player, location) {
        let cost = this.energyCost[location];
        
        // Aplica redução da mochila
        if (player.mining?.upgrades?.includes('mochila_minerador')) {
            cost *= (1 - this.upgrades.mochila_minerador.effect.value);
        }

        // Aplica redução da habilidade
        if (player.mining?.skills?.resistencia_minerador) {
            const level = player.mining.skills.resistencia_minerador;
            cost *= (1 - (this.skills.resistencia_minerador.effect.valuePerLevel * level));
        }

        return Math.max(1, Math.floor(cost));
    }

    calculateDurabilityLoss(mineral, player) {
        let loss = this.durabilityLoss[mineral.id];

        // Aplica redução da expertise
        if (player.mining?.skills?.expertise_minerador) {
            const level = player.mining.skills.expertise_minerador;
            loss *= (1 - (this.skills.expertise_minerador.effect.valuePerLevel * level));
        }

        return Math.max(1, Math.floor(loss));
    }

    checkToolBreak(player) {
        let chance = this.breakChance[player.mining.pickaxe];

        // Aplica redução da expertise
        if (player.mining?.skills?.expertise_minerador) {
            const level = player.mining.skills.expertise_minerador;
            chance *= (1 - (this.skills.expertise_minerador.effect.valuePerLevel * level));
        }

        return Math.random() < chance;
    }

    processRandomEvent(player) {
        for (const [id, event] of Object.entries(this.events)) {
            let chance = event.chance;

            // Aumenta chance de eventos bons com sorte
            if (player.mining?.skills?.sorte_minerador && 
                (id === 'treasure' || id === 'rare_vein')) {
                const level = player.mining.skills.sorte_minerador;
                chance += (this.skills.sorte_minerador.effect.valuePerLevel * level);
            }

            if (Math.random() < chance) {
                // Processa proteções
                if (event.effect.type === 'damage' && 
                    player.mining?.upgrades?.includes('capacete_minerador')) {
                    event.effect.value *= (1 - this.upgrades.capacete_minerador.effect.value);
                }

                if (event.effect.type === 'energy_drain' && 
                    player.mining?.upgrades?.includes('mascara_gas')) {
                    return null; // Imune ao gás
                }

                return {
                    name: event.name,
                    effect: event.effect
                };
            }
        }
        return null;
    }

    attemptMining(player, location, pickaxe) {
        // Calcula chance base de sucesso
        let chance = 0.5 * pickaxe.multiplier;

        // Aplica bônus do detector
        if (player.mining?.upgrades?.includes('detector_minerais')) {
            chance *= (1 + this.upgrades.detector_minerais.effect.value);
        }

        // Tenta minerar
        if (Math.random() < chance) {
            const mineral = this.selectMineral(location, player);
            let amount = 1;

            // Chance de mineral extra
            if (player.mining?.skills?.olho_minerador) {
                const level = player.mining.skills.olho_minerador;
                const extraChance = this.skills.olho_minerador.effect.valuePerLevel * level;
                if (Math.random() < extraChance) {
                    amount++;
                }
            }

            return {
                success: true,
                mineral: mineral,
                amount: amount
            };
        }

        return { success: false };
    }

    selectMineral(location, player) {
        // Implementação anterior...
    }

    addMineral(player, mineral, amount) {
        // Implementação anterior...
    }

    formatMiningResult(result, event) {
        let text = `⛏️ *MINERAÇÃO*\n\n`;
        
        if (result.success) {
            text += `${result.mineral.emoji} Encontrou: ${result.amount}x ${result.mineral.name}\n`;
        }

        if (event) {
            text += `\n${event.effect.message}\n`;
        }

        text += `\n⛏️ Durabilidade: ${result.durability}`;
        return text;
    }

    // ... outros métodos anteriores ...
}

module.exports = new MiningSystem();
