class FishingSystem {
    constructor() {
        this.fish = {
            // Peixes Comuns
            'sardinha': {
                name: 'Sardinha',
                rarity: 'comum',
                minLevel: 1,
                xp: 10,
                value: 5,
                weight: { min: 0.1, max: 0.3 },
                time: { min: 10000, max: 30000 } // 10-30 segundos
            },
            'tilapia': {
                name: 'Tilápia',
                rarity: 'comum',
                minLevel: 1,
                xp: 15,
                value: 8,
                weight: { min: 0.3, max: 0.8 },
                time: { min: 15000, max: 40000 }
            },
            'carpa': {
                name: 'Carpa',
                rarity: 'comum',
                minLevel: 5,
                xp: 20,
                value: 12,
                weight: { min: 1, max: 3 },
                time: { min: 20000, max: 50000 }
            },

            // Peixes Incomuns
            'robalo': {
                name: 'Robalo',
                rarity: 'incomum',
                minLevel: 10,
                xp: 30,
                value: 25,
                weight: { min: 2, max: 5 },
                time: { min: 30000, max: 60000 }
            },
            'dourado': {
                name: 'Dourado',
                rarity: 'incomum',
                minLevel: 15,
                xp: 40,
                value: 35,
                weight: { min: 3, max: 8 },
                time: { min: 40000, max: 80000 }
            },
            'salmao': {
                name: 'Salmão',
                rarity: 'incomum',
                minLevel: 20,
                xp: 50,
                value: 50,
                weight: { min: 4, max: 10 },
                time: { min: 50000, max: 100000 }
            },

            // Peixes Raros
            'atum': {
                name: 'Atum',
                rarity: 'raro',
                minLevel: 25,
                xp: 100,
                value: 100,
                weight: { min: 20, max: 50 },
                time: { min: 60000, max: 120000 }
            },
            'marlim': {
                name: 'Marlim',
                rarity: 'raro',
                minLevel: 30,
                xp: 150,
                value: 200,
                weight: { min: 40, max: 100 },
                time: { min: 90000, max: 180000 }
            },
            'tubarao': {
                name: 'Tubarão',
                rarity: 'raro',
                minLevel: 35,
                xp: 200,
                value: 500,
                weight: { min: 100, max: 300 },
                time: { min: 120000, max: 240000 }
            },

            // Peixes Lendários
            'peixe_dourado': {
                name: 'Peixe Dourado',
                rarity: 'lendario',
                minLevel: 40,
                xp: 500,
                value: 1000,
                weight: { min: 5, max: 10 },
                time: { min: 300000, max: 600000 }
            },
            'kraken': {
                name: 'Kraken',
                rarity: 'lendario',
                minLevel: 50,
                xp: 1000,
                value: 5000,
                weight: { min: 1000, max: 2000 },
                time: { min: 600000, max: 1200000 }
            }
        };

        this.locations = {
            'lago': {
                name: 'Lago',
                minLevel: 1,
                fish: ['sardinha', 'tilapia', 'carpa'],
                weather: ['ensolarado', 'nublado'],
                depth: 'raso'
            },
            'rio': {
                name: 'Rio',
                minLevel: 10,
                fish: ['robalo', 'dourado', 'salmao'],
                weather: ['ensolarado', 'nublado', 'chuvoso'],
                depth: 'medio'
            },
            'mar': {
                name: 'Mar',
                minLevel: 25,
                fish: ['atum', 'marlim', 'tubarao'],
                weather: ['ensolarado', 'nublado', 'chuvoso', 'tempestade'],
                depth: 'profundo'
            },
            'abismo': {
                name: 'Abismo',
                minLevel: 40,
                fish: ['peixe_dourado', 'kraken'],
                weather: ['tempestade'],
                depth: 'abissal'
            }
        };

        this.rods = {
            'vara_bambu': {
                name: 'Vara de Bambu',
                durability: 50,
                power: 1.0,
                luck: 1.0,
                cost: 100
            },
            'vara_madeira': {
                name: 'Vara de Madeira',
                durability: 100,
                power: 1.2,
                luck: 1.1,
                cost: 500
            },
            'vara_fibra': {
                name: 'Vara de Fibra',
                durability: 200,
                power: 1.5,
                luck: 1.2,
                cost: 2000
            },
            'vara_carbono': {
                name: 'Vara de Carbono',
                durability: 500,
                power: 2.0,
                luck: 1.5,
                cost: 10000
            },
            'vara_titanio': {
                name: 'Vara de Titânio',
                durability: 1000,
                power: 3.0,
                luck: 2.0,
                cost: 50000
            }
        };

        this.baits = {
            'minhoca': {
                name: 'Minhoca',
                effect: {
                    type: 'comum',
                    multiplier: 1.2
                },
                cost: 5
            },
            'camarao': {
                name: 'Camarão',
                effect: {
                    type: 'incomum',
                    multiplier: 1.5
                },
                cost: 20
            },
            'peixe_pequeno': {
                name: 'Peixe Pequeno',
                effect: {
                    type: 'raro',
                    multiplier: 2.0
                },
                cost: 100
            },
            'isca_magica': {
                name: 'Isca Mágica',
                effect: {
                    type: 'lendario',
                    multiplier: 3.0
                },
                cost: 500
            }
        };

        this.skills = {
            'paciencia': {
                name: 'Paciência',
                description: 'Reduz tempo de pesca',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ time_reduction: 0.1 * level })
            },
            'precisao': {
                name: 'Precisão',
                description: 'Aumenta chance de sucesso',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ success_rate: 0.1 * level })
            },
            'sorte_pescador': {
                name: 'Sorte do Pescador',
                description: 'Aumenta chance de peixes raros',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ rare_chance: 0.1 * level })
            },
            'forca': {
                name: 'Força',
                description: 'Aumenta peso máximo do peixe',
                maxLevel: 5,
                cost: level => level * 1000,
                effect: level => ({ weight_boost: 0.2 * level })
            }
        };
    }

    startFishing(player, locationId, baitId) {
        const location = this.locations[locationId];
        if (!location) throw new Error('❌ Local não encontrado!');

        // Verifica nível
        if (player.level < location.minLevel) {
            throw new Error(`❌ Você precisa ser nível ${location.minLevel} para pescar aqui!`);
        }

        // Verifica vara
        if (!player.fishing?.rod) {
            throw new Error('❌ Você precisa de uma vara de pesca!');
        }

        const rod = this.rods[player.fishing.rod.id];
        if (player.fishing.rod.durability <= 0) {
            throw new Error('❌ Sua vara está quebrada!');
        }

        // Verifica isca
        if (!player.inventory[baitId]) {
            throw new Error('❌ Você não tem esta isca!');
        }

        // Inicia pescaria
        const bait = this.baits[baitId];
        player.inventory[baitId]--;
        if (player.inventory[baitId] <= 0) {
            delete player.inventory[baitId];
        }

        // Escolhe peixe
        const fish = this.chooseFish(location, bait, player);
        if (!fish) {
            return {
                success: false,
                message: '❌ Nenhum peixe mordeu a isca...'
            };
        }

        // Calcula tempo
        let time = Math.floor(
            Math.random() * (fish.time.max - fish.time.min + 1) + fish.time.min
        );

        // Aplica redução de tempo
        if (player.skills?.fishing?.paciencia) {
            const reduction = this.skills.paciencia.effect(
                player.skills.fishing.paciencia
            ).time_reduction;
            time *= (1 - reduction);
        }

        // Inicia sessão de pesca
        player.fishing.session = {
            fish: fish.id,
            startTime: Date.now(),
            endTime: Date.now() + time,
            location: locationId,
            bait: baitId
        };

        return {
            success: true,
            time: time,
            message: `🎣 *PESCARIA INICIADA*\n\n` +
                    `Local: ${location.name}\n` +
                    `Isca: ${bait.name}\n` +
                    `Tempo: ${Math.ceil(time / 1000)} segundos`
        };
    }

    catchFish(player) {
        if (!player.fishing?.session) {
            throw new Error('❌ Você não está pescando!');
        }

        const session = player.fishing.session;
        const fish = this.fish[session.fish];
        const rod = this.rods[player.fishing.rod.id];

        // Verifica tempo
        if (Date.now() < session.endTime) {
            const timeLeft = Math.ceil((session.endTime - Date.now()) / 1000);
            throw new Error(`❌ Aguarde ${timeLeft} segundos!`);
        }

        // Calcula chance de sucesso
        let chance = 0.5 * rod.power;

        // Aplica bônus de precisão
        if (player.skills?.fishing?.precisao) {
            chance += this.skills.precisao.effect(
                player.skills.fishing.precisao
            ).success_rate;
        }

        // Tenta pegar o peixe
        if (Math.random() > chance) {
            delete player.fishing.session;
            return {
                success: false,
                message: '💨 O peixe escapou!'
            };
        }

        // Calcula peso
        let weight = Math.random() * (fish.weight.max - fish.weight.min) + fish.weight.min;

        // Aplica bônus de força
        if (player.skills?.fishing?.forca) {
            const boost = this.skills.forca.effect(
                player.skills.fishing.forca
            ).weight_boost;
            weight *= (1 + boost);
        }

        weight = Math.round(weight * 100) / 100;

        // Reduz durabilidade da vara
        player.fishing.rod.durability--;

        // Adiciona ao inventário
        if (!player.inventory[session.fish]) {
            player.inventory[session.fish] = 0;
        }
        player.inventory[session.fish]++;

        // Limpa sessão
        delete player.fishing.session;

        return {
            success: true,
            fish: fish,
            weight: weight,
            message: `🎣 *PEIXE FISGADO*\n\n` +
                    `${fish.name}\n` +
                    `Peso: ${weight}kg\n` +
                    `XP: +${fish.xp}\n` +
                    `Vara: ${player.fishing.rod.durability}/${rod.durability}`
        };
    }

    chooseFish(location, bait, player) {
        const possibleFish = location.fish
            .map(id => this.fish[id])
            .filter(fish => player.level >= fish.minLevel);

        if (possibleFish.length === 0) return null;

        const weights = possibleFish.map(fish => {
            let weight = 1;
            switch(fish.rarity) {
                case 'comum': weight = 100; break;
                case 'incomum': weight = 50; break;
                case 'raro': weight = 10; break;
                case 'lendario': weight = 1; break;
            }

            // Aplica bônus da isca
            if (fish.rarity === bait.effect.type) {
                weight *= bait.effect.multiplier;
            }

            // Aplica bônus de sorte
            if (player.skills?.fishing?.sorte_pescador) {
                const boost = this.skills.sorte_pescador.effect(
                    player.skills.fishing.sorte_pescador
                ).rare_chance;
                if (fish.rarity !== 'comum') {
                    weight *= (1 + boost);
                }
            }

            return weight;
        });

        const total = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * total;

        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random <= 0) return possibleFish[i];
        }

        return possibleFish[0];
    }

    formatLocationList() {
        let text = `🎣 *LOCAIS DE PESCA* 🎣\n\n`;

        Object.entries(this.locations).forEach(([id, loc]) => {
            text += `*${loc.name}*\n`;
            text += `├ Nível mínimo: ${loc.minLevel}\n`;
            text += `├ Peixes: ${loc.fish.map(id => this.fish[id].name).join(', ')}\n`;
            text += `├ Clima: ${loc.weather.join(', ')}\n`;
            text += `└ Profundidade: ${loc.depth}\n\n`;
        });

        return text;
    }

    formatRodList() {
        let text = `🎣 *VARAS DE PESCA* 🎣\n\n`;

        Object.entries(this.rods).forEach(([id, rod]) => {
            text += `*${rod.name}*\n`;
            text += `├ Durabilidade: ${rod.durability}\n`;
            text += `├ Poder: ${(rod.power * 100).toFixed(0)}%\n`;
            text += `├ Sorte: ${(rod.luck * 100).toFixed(0)}%\n`;
            text += `└ Preço: R$ ${rod.cost}\n\n`;
        });

        return text;
    }

    formatBaitList() {
        let text = `🪱 *ISCAS* 🪱\n\n`;

        Object.entries(this.baits).forEach(([id, bait]) => {
            text += `*${bait.name}*\n`;
            text += `├ Tipo: ${bait.effect.type}\n`;
            text += `├ Bônus: +${((bait.effect.multiplier - 1) * 100).toFixed(0)}%\n`;
            text += `└ Preço: R$ ${bait.cost}\n\n`;
        });

        return text;
    }

    formatSkillList(player) {
        let text = `⚡ *HABILIDADES DE PESCA* ⚡\n\n`;

        Object.entries(this.skills).forEach(([id, skill]) => {
            const currentLevel = player.skills?.fishing?.[id] || 0;
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

module.exports = new FishingSystem();
