class MiningSystem {
    constructor() {
        this.ores = {
            // Minérios Básicos
            'carvao': {
                name: 'Carvão',
                rarity: 'comum',
                minLevel: 1,
                xp: 10,
                value: 5,
                respawnTime: 60000 // 1 minuto
            },
            'ferro': {
                name: 'Ferro',
                rarity: 'comum',
                minLevel: 5,
                xp: 20,
                value: 15,
                respawnTime: 120000 // 2 minutos
            },
            'prata': {
                name: 'Prata',
                rarity: 'incomum',
                minLevel: 10,
                xp: 30,
                value: 25,
                respawnTime: 180000 // 3 minutos
            },

            // Minérios Intermediários
            'ouro': {
                name: 'Ouro',
                rarity: 'incomum',
                minLevel: 15,
                xp: 50,
                value: 50,
                respawnTime: 300000 // 5 minutos
            },
            'platina': {
                name: 'Platina',
                rarity: 'raro',
                minLevel: 20,
                xp: 75,
                value: 100,
                respawnTime: 600000 // 10 minutos
            },
            'titanio': {
                name: 'Titânio',
                rarity: 'raro',
                minLevel: 25,
                xp: 100,
                value: 200,
                respawnTime: 900000 // 15 minutos
            },

            // Minérios Avançados
            'adamantio': {
                name: 'Adamantio',
                rarity: 'epico',
                minLevel: 30,
                xp: 150,
                value: 500,
                respawnTime: 1800000 // 30 minutos
            },
            'mithril': {
                name: 'Mithril',
                rarity: 'epico',
                minLevel: 35,
                xp: 200,
                value: 1000,
                respawnTime: 3600000 // 1 hora
            },
            'draconita': {
                name: 'Draconita',
                rarity: 'lendario',
                minLevel: 40,
                xp: 500,
                value: 5000,
                respawnTime: 7200000 // 2 horas
            }
        };

        this.locations = {
            'mina_carvao': {
                name: 'Mina de Carvão',
                minLevel: 1,
                ores: ['carvao', 'ferro'],
                dangerLevel: 'baixo',
                monsters: ['rato', 'morcego']
            },
            'caverna_ferro': {
                name: 'Caverna de Ferro',
                minLevel: 5,
                ores: ['ferro', 'prata'],
                dangerLevel: 'baixo',
                monsters: ['slime', 'goblin']
            },
            'mina_prata': {
                name: 'Mina de Prata',
                minLevel: 10,
                ores: ['prata', 'ouro'],
                dangerLevel: 'medio',
                monsters: ['goblin', 'kobold']
            },
            'caverna_ouro': {
                name: 'Caverna de Ouro',
                minLevel: 15,
                ores: ['ouro', 'platina'],
                dangerLevel: 'medio',
                monsters: ['kobold', 'orc']
            },
            'mina_platina': {
                name: 'Mina de Platina',
                minLevel: 20,
                ores: ['platina', 'titanio'],
                dangerLevel: 'alto',
                monsters: ['orc', 'troll']
            },
            'caverna_titanio': {
                name: 'Caverna de Titânio',
                minLevel: 25,
                ores: ['titanio', 'adamantio'],
                dangerLevel: 'alto',
                monsters: ['troll', 'ogro']
            },
            'mina_adamantio': {
                name: 'Mina de Adamantio',
                minLevel: 30,
                ores: ['adamantio', 'mithril'],
                dangerLevel: 'muito_alto',
                monsters: ['ogro', 'golem']
            },
            'caverna_mithril': {
                name: 'Caverna de Mithril',
                minLevel: 35,
                ores: ['mithril', 'draconita'],
                dangerLevel: 'extremo',
                monsters: ['golem', 'dragao']
            }
        };

        this.pickaxes = {
            'picareta_madeira': {
                name: 'Picareta de Madeira',
                durability: 50,
                efficiency: 1.0,
                luck: 1.0,
                cost: 100
            },
            'picareta_pedra': {
                name: 'Picareta de Pedra',
                durability: 100,
                efficiency: 1.2,
                luck: 1.0,
                cost: 500
            },
            'picareta_ferro': {
                name: 'Picareta de Ferro',
                durability: 200,
                efficiency: 1.5,
                luck: 1.1,
                cost: 2000
            },
            'picareta_aco': {
                name: 'Picareta de Aço',
                durability: 500,
                efficiency: 2.0,
                luck: 1.2,
                cost: 5000
            },
            'picareta_titanio': {
                name: 'Picareta de Titânio',
                durability: 1000,
                efficiency: 2.5,
                luck: 1.3,
                cost: 20000
            },
            'picareta_adamantio': {
                name: 'Picareta de Adamantio',
                durability: 2000,
                efficiency: 3.0,
                luck: 1.4,
                cost: 50000
            },
            'picareta_mithril': {
                name: 'Picareta de Mithril',
                durability: 5000,
                efficiency: 4.0,
                luck: 1.5,
                cost: 100000
            }
        };

        // Sistema de Durabilidade
        this.durabilityLoss = {
            'comum': 1,
            'incomum': 2,
            'raro': 3,
            'epico': 4,
            'lendario': 5
        };

        // Sistema de Skills
        this.skills = {
            'veia_mineral': {
                name: 'Veia Mineral',
                description: 'Aumenta chance de minérios raros',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ luck: 0.1 * level })
            },
            'eficiencia': {
                name: 'Eficiência',
                description: 'Aumenta velocidade de mineração',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ efficiency: 0.1 * level })
            },
            'preservacao': {
                name: 'Preservação',
                description: 'Reduz perda de durabilidade',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ durability: -0.1 * level })
            },
            'prospeccao': {
                name: 'Prospecção',
                description: 'Chance de minérios extras',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ extraOre: 0.1 * level })
            }
        };
    }

    mine(player, locationId) {
        const location = this.locations[locationId];
        if (!location) throw new Error('❌ Local não encontrado!');

        // Verifica nível
        if (player.level < location.minLevel) {
            throw new Error(`❌ Você precisa ser nível ${location.minLevel} para minerar aqui!`);
        }

        // Verifica picareta
        if (!player.pickaxe) {
            throw new Error('❌ Você precisa de uma picareta para minerar!');
        }

        const pickaxe = this.pickaxes[player.pickaxe.id];
        if (player.pickaxe.durability <= 0) {
            throw new Error('❌ Sua picareta está quebrada!');
        }

        // Calcula bônus
        let efficiency = pickaxe.efficiency;
        let luck = pickaxe.luck;
        let durabilityLoss = 1;

        if (player.skills?.mining) {
            Object.entries(player.skills.mining).forEach(([skillId, level]) => {
                const skill = this.skills[skillId];
                const effect = skill.effect(level);
                if (effect.efficiency) efficiency += effect.efficiency;
                if (effect.luck) luck += effect.luck;
                if (effect.durability) durabilityLoss += effect.durability;
            });
        }

        // Escolhe minério
        const possibleOres = location.ores.filter(oreId => {
            const ore = this.ores[oreId];
            return player.level >= ore.minLevel;
        });

        if (possibleOres.length === 0) {
            throw new Error('❌ Nenhum minério disponível para seu nível!');
        }

        const ore = this.ores[this.chooseOre(possibleOres, luck)];

        // Aplica perda de durabilidade
        const loss = Math.max(1, Math.floor(this.durabilityLoss[ore.rarity] * durabilityLoss));
        player.pickaxe.durability -= loss;

        // Calcula quantidade
        let amount = 1;
        if (player.skills?.mining?.prospeccao) {
            const chance = this.skills.prospeccao.effect(player.skills.mining.prospeccao).extraOre;
            if (Math.random() < chance) amount++;
        }

        // Adiciona ao inventário
        if (!player.inventory[ore.id]) player.inventory[ore.id] = 0;
        player.inventory[ore.id] += amount;

        // Calcula XP
        const xp = Math.floor(ore.xp * efficiency);

        return {
            success: true,
            ore: ore,
            amount: amount,
            xp: xp,
            durabilityLoss: loss,
            message: `⛏️ *MINERAÇÃO*\n\n` +
                    `Encontrou: ${amount}x ${ore.name}\n` +
                    `XP: +${xp}\n` +
                    `Durabilidade: -${loss}\n` +
                    `Picareta: ${player.pickaxe.durability}/${pickaxe.durability}`
        };
    }

    chooseOre(ores, luck) {
        const weights = ores.map(oreId => {
            const ore = this.ores[oreId];
            let weight = 1;
            switch(ore.rarity) {
                case 'comum': weight = 100; break;
                case 'incomum': weight = 50; break;
                case 'raro': weight = 20; break;
                case 'epico': weight = 5; break;
                case 'lendario': weight = 1; break;
            }
            return weight * luck;
        });

        const total = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * total;

        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random <= 0) return ores[i];
        }

        return ores[0];
    }

    buyPickaxe(player, pickaxeId) {
        const pickaxe = this.pickaxes[pickaxeId];
        if (!pickaxe) throw new Error('❌ Picareta não encontrada!');

        if (player.money.wallet < pickaxe.cost) {
            throw new Error(`❌ Você precisa de R$ ${pickaxe.cost} para comprar esta picareta!`);
        }

        player.money.wallet -= pickaxe.cost;
        player.pickaxe = {
            id: pickaxeId,
            durability: pickaxe.durability
        };

        return {
            success: true,
            message: `✅ Comprou ${pickaxe.name} por R$ ${pickaxe.cost}!`
        };
    }

    repairPickaxe(player) {
        if (!player.pickaxe) throw new Error('❌ Você não tem uma picareta!');

        const pickaxe = this.pickaxes[player.pickaxe.id];
        const maxDurability = pickaxe.durability;
        const currentDurability = player.pickaxe.durability;

        if (currentDurability >= maxDurability) {
            throw new Error('❌ Sua picareta já está com durabilidade máxima!');
        }

        const missingDurability = maxDurability - currentDurability;
        const cost = Math.ceil(missingDurability * (pickaxe.cost / maxDurability));

        if (player.money.wallet < cost) {
            throw new Error(`❌ Você precisa de R$ ${cost} para reparar sua picareta!`);
        }

        player.money.wallet -= cost;
        player.pickaxe.durability = maxDurability;

        return {
            success: true,
            message: `🔨 Picareta reparada por R$ ${cost}!`
        };
    }

    learnSkill(player, skillId) {
        if (!this.skills[skillId]) throw new Error('❌ Habilidade não encontrada!');

        if (!player.skills) player.skills = {};
        if (!player.skills.mining) player.skills.mining = {};

        const currentLevel = player.skills.mining[skillId] || 0;
        const skill = this.skills[skillId];

        if (currentLevel >= skill.maxLevel) {
            throw new Error('❌ Esta habilidade já está no nível máximo!');
        }

        const cost = skill.cost(currentLevel + 1);
        if (player.money.wallet < cost) {
            throw new Error(`❌ Você precisa de R$ ${cost} para aprender esta habilidade!`);
        }

        player.money.wallet -= cost;
        player.skills.mining[skillId] = currentLevel + 1;

        const effect = skill.effect(currentLevel + 1);
        return {
            success: true,
            message: `✨ *HABILIDADE APRENDIDA*\n\n` +
                    `${skill.name} ➡️ Nível ${currentLevel + 1}\n` +
                    `Efeito: ${Object.entries(effect)
                        .map(([stat, value]) => `${stat} ${value > 0 ? '+' : ''}${value}`)
                        .join(', ')}`
        };
    }

    formatLocationList() {
        let text = `⛏️ *LOCAIS DE MINERAÇÃO* ⛏️\n\n`;

        Object.entries(this.locations).forEach(([id, loc]) => {
            text += `*${loc.name}*\n`;
            text += `├ Nível mínimo: ${loc.minLevel}\n`;
            text += `├ Minérios: ${loc.ores.map(id => this.ores[id].name).join(', ')}\n`;
            text += `├ Perigo: ${loc.dangerLevel}\n`;
            text += `└ Monstros: ${loc.monsters.join(', ')}\n\n`;
        });

        return text;
    }

    formatPickaxeList() {
        let text = `⛏️ *PICARETAS* ⛏️\n\n`;

        Object.entries(this.pickaxes).forEach(([id, pick]) => {
            text += `*${pick.name}*\n`;
            text += `├ Durabilidade: ${pick.durability}\n`;
            text += `├ Eficiência: ${(pick.efficiency * 100).toFixed(0)}%\n`;
            text += `├ Sorte: ${(pick.luck * 100).toFixed(0)}%\n`;
            text += `└ Preço: R$ ${pick.cost}\n\n`;
        });

        return text;
    }

    formatSkillList(player) {
        let text = `⚡ *HABILIDADES DE MINERAÇÃO* ⚡\n\n`;

        Object.entries(this.skills).forEach(([id, skill]) => {
            const currentLevel = player.skills?.mining?.[id] || 0;
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

module.exports = new MiningSystem();
