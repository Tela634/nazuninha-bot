class PetSystem {
    constructor() {
        this.pets = {
            // Pets de Combate
            'lobo': {
                name: 'Lobo',
                type: 'combat',
                emoji: '🐺',
                baseStats: {
                    attack: 20,
                    defense: 15,
                    health: 100
                },
                abilities: ['mordida', 'uivo'],
                evolution: 'lobo_alfa',
                catchRate: 0.3,
                price: 5000
            },
            'lobo_alfa': {
                name: 'Lobo Alfa',
                type: 'combat',
                emoji: '🐺',
                baseStats: {
                    attack: 40,
                    defense: 30,
                    health: 200
                },
                abilities: ['mordida', 'uivo', 'liderança'],
                evolution: null,
                catchRate: 0.1,
                price: 15000
            },
            'aguia': {
                name: 'Águia',
                type: 'combat',
                emoji: '🦅',
                baseStats: {
                    attack: 25,
                    defense: 10,
                    health: 80
                },
                abilities: ['bicada', 'voo_rasante'],
                evolution: 'aguia_real',
                catchRate: 0.25,
                price: 6000
            },

            // Pets de Suporte
            'coelho': {
                name: 'Coelho',
                type: 'support',
                emoji: '🐰',
                baseStats: {
                    healing: 15,
                    speed: 20,
                    luck: 10
                },
                abilities: ['cura_natural', 'pé_da_sorte'],
                evolution: 'coelho_lunar',
                catchRate: 0.4,
                price: 3000
            },
            'coruja': {
                name: 'Coruja',
                type: 'support',
                emoji: '🦉',
                baseStats: {
                    wisdom: 20,
                    vision: 15,
                    magic: 10
                },
                abilities: ['sabedoria', 'visão_noturna'],
                evolution: 'coruja_mistica',
                catchRate: 0.35,
                price: 4000
            },

            // Pets de Coleta
            'porco': {
                name: 'Porco',
                type: 'gathering',
                emoji: '🐷',
                baseStats: {
                    gathering: 15,
                    capacity: 100,
                    luck: 5
                },
                abilities: ['farejar_tesouros', 'cavar'],
                evolution: 'porco_dourado',
                catchRate: 0.5,
                price: 2000
            },
            'abelha': {
                name: 'Abelha',
                type: 'gathering',
                emoji: '🐝',
                baseStats: {
                    gathering: 10,
                    speed: 15,
                    efficiency: 20
                },
                abilities: ['polinização', 'coleta_nectar'],
                evolution: 'abelha_rainha',
                catchRate: 0.45,
                price: 2500
            },

            // Montarias
            'cavalo': {
                name: 'Cavalo',
                type: 'mount',
                emoji: '🐎',
                baseStats: {
                    speed: 30,
                    stamina: 100,
                    jump: 10
                },
                abilities: ['galope', 'salto'],
                evolution: 'cavalo_alado',
                catchRate: 0.2,
                price: 10000
            },
            'cavalo_alado': {
                name: 'Cavalo Alado',
                type: 'mount',
                emoji: '🦄',
                baseStats: {
                    speed: 50,
                    stamina: 200,
                    jump: 30,
                    flight: 100
                },
                abilities: ['galope', 'salto', 'voo'],
                evolution: null,
                catchRate: 0.05,
                price: 50000
            }
        };

        // Habilidades dos pets
        this.abilities = {
            'mordida': {
                name: 'Mordida',
                type: 'attack',
                power: 30,
                description: 'Um ataque básico com os dentes'
            },
            'uivo': {
                name: 'Uivo',
                type: 'buff',
                effect: {
                    stat: 'attack',
                    value: 1.2
                },
                description: 'Aumenta o ataque do grupo'
            },
            'liderança': {
                name: 'Liderança',
                type: 'buff',
                effect: {
                    stat: 'all',
                    value: 1.15
                },
                description: 'Aumenta todos os status do grupo'
            },
            'bicada': {
                name: 'Bicada',
                type: 'attack',
                power: 25,
                description: 'Ataque rápido com o bico'
            },
            'voo_rasante': {
                name: 'Voo Rasante',
                type: 'attack',
                power: 40,
                description: 'Ataque aéreo poderoso'
            },
            'cura_natural': {
                name: 'Cura Natural',
                type: 'heal',
                power: 30,
                description: 'Cura o dono ou aliados'
            },
            'pé_da_sorte': {
                name: 'Pé da Sorte',
                type: 'buff',
                effect: {
                    stat: 'luck',
                    value: 1.3
                },
                description: 'Aumenta a sorte do grupo'
            },
            'sabedoria': {
                name: 'Sabedoria',
                type: 'buff',
                effect: {
                    stat: 'xp',
                    value: 1.2
                },
                description: 'Aumenta XP ganho'
            },
            'visão_noturna': {
                name: 'Visão Noturna',
                type: 'utility',
                effect: 'night_vision',
                description: 'Permite ver no escuro'
            },
            'farejar_tesouros': {
                name: 'Farejar Tesouros',
                type: 'gathering',
                effect: {
                    type: 'treasure',
                    chance: 0.2
                },
                description: 'Chance de encontrar tesouros'
            },
            'cavar': {
                name: 'Cavar',
                type: 'gathering',
                effect: {
                    type: 'resources',
                    efficiency: 1.5
                },
                description: 'Aumenta recursos coletados'
            },
            'polinização': {
                name: 'Polinização',
                type: 'gathering',
                effect: {
                    type: 'plants',
                    efficiency: 2
                },
                description: 'Dobra recursos de plantas'
            },
            'coleta_nectar': {
                name: 'Coleta de Néctar',
                type: 'gathering',
                effect: {
                    type: 'honey',
                    amount: 1
                },
                description: 'Coleta mel especial'
            },
            'galope': {
                name: 'Galope',
                type: 'mount',
                effect: {
                    speed: 2,
                    duration: 60
                },
                description: 'Aumenta velocidade de movimento'
            },
            'salto': {
                name: 'Salto',
                type: 'mount',
                effect: {
                    height: 3,
                    cooldown: 10
                },
                description: 'Permite pular obstáculos'
            },
            'voo': {
                name: 'Voo',
                type: 'mount',
                effect: {
                    height: 'unlimited',
                    duration: 300
                },
                description: 'Permite voar livremente'
            }
        };
    }

    catchPet(player, petId) {
        const pet = this.pets[petId];
        if (!pet) throw new Error('Pet não encontrado!');

        // Verifica se tem dinheiro para comprar
        if (player.money.wallet < pet.price) {
            throw new Error(`Você precisa de R$ ${pet.price} para comprar este pet!`);
        }

        // Chance de captura
        const success = Math.random() < pet.catchRate;
        if (!success) {
            return {
                success: false,
                message: '❌ O pet fugiu!'
            };
        }

        // Cria o pet para o jogador
        const newPet = {
            id: petId,
            name: pet.name,
            type: pet.type,
            emoji: pet.emoji,
            level: 1,
            xp: 0,
            stats: { ...pet.baseStats },
            abilities: pet.abilities.slice(0, 2), // Começa com 2 habilidades
            evolution: pet.evolution,
            affection: 0
        };

        // Adiciona ao inventário
        if (!player.pets) player.pets = [];
        player.pets.push(newPet);

        // Remove dinheiro
        player.money.wallet -= pet.price;

        return {
            success: true,
            pet: newPet,
            message: `🎉 *PET CAPTURADO!*\n\n` +
                    `${pet.emoji} ${pet.name}\n` +
                    `Tipo: ${pet.type}\n` +
                    `Level: 1\n\n` +
                    `_Use /pet treinar para evoluir!_`
        };
    }

    trainPet(player, petIndex) {
        const pet = player.pets[petIndex];
        if (!pet) throw new Error('Pet não encontrado!');

        // Ganha XP
        const xpGained = 10 + Math.floor(Math.random() * 20);
        pet.xp += xpGained;

        // Verifica level up
        const xpNeeded = pet.level * 100;
        if (pet.xp >= xpNeeded) {
            pet.level++;
            pet.xp -= xpNeeded;

            // Aumenta stats
            Object.keys(pet.stats).forEach(stat => {
                pet.stats[stat] = Math.floor(pet.stats[stat] * 1.1);
            });

            // Verifica evolução
            if (pet.evolution && pet.level >= 20) {
                const evolvedPet = this.pets[pet.evolution];
                pet.id = pet.evolution;
                pet.name = evolvedPet.name;
                pet.emoji = evolvedPet.emoji;
                pet.stats = { ...evolvedPet.baseStats };
                pet.abilities = evolvedPet.abilities;
                pet.evolution = evolvedPet.evolution;

                return {
                    levelUp: true,
                    evolved: true,
                    oldName: pet.name,
                    newName: evolvedPet.name,
                    message: `✨ *EVOLUÇÃO!*\n\n` +
                            `${pet.emoji} ${pet.name} evoluiu!\n` +
                            `Level: ${pet.level}\n` +
                            `_Novas habilidades desbloqueadas!_`
                };
            }

            return {
                levelUp: true,
                evolved: false,
                message: `📈 *LEVEL UP!*\n\n` +
                        `${pet.emoji} ${pet.name}\n` +
                        `Novo level: ${pet.level}`
            };
        }

        return {
            levelUp: false,
            xpGained: xpGained,
            message: `🎯 *TREINO*\n\n` +
                    `${pet.emoji} ${pet.name}\n` +
                    `XP: ${pet.xp}/${xpNeeded}\n` +
                    `(+${xpGained} XP)`
        };
    }

    usePetAbility(player, petIndex, abilityIndex) {
        const pet = player.pets[petIndex];
        if (!pet) throw new Error('Pet não encontrado!');

        const ability = this.abilities[pet.abilities[abilityIndex]];
        if (!ability) throw new Error('Habilidade não encontrada!');

        let effect;
        switch(ability.type) {
            case 'attack':
                effect = `Causou ${ability.power} de dano`;
                break;
            case 'buff':
                effect = `Aumentou ${ability.effect.stat} em ${Math.floor((ability.effect.value - 1) * 100)}%`;
                break;
            case 'heal':
                effect = `Curou ${ability.power} de vida`;
                break;
            case 'gathering':
                effect = ability.description;
                break;
            case 'mount':
                effect = ability.description;
                break;
        }

        return {
            success: true,
            message: `${pet.emoji} *${pet.name}* usou ${ability.name}!\n` +
                    `Efeito: ${effect}`
        };
    }

    formatPetList(player) {
        let text = `🐾 *SEUS PETS* 🐾\n\n`;

        if (!player.pets?.length) {
            text += `_Você não tem nenhum pet!_\n`;
            text += `Use /pet comprar para adquirir um!\n\n`;
        } else {
            player.pets.forEach((pet, index) => {
                text += `${pet.emoji} *${pet.name}*\n`;
                text += `├ Level: ${pet.level}\n`;
                text += `├ XP: ${pet.xp}/${pet.level * 100}\n`;
                text += `├ Tipo: ${pet.type}\n`;
                text += `├ Stats:\n`;
                Object.entries(pet.stats).forEach(([stat, value]) => {
                    text += `│ ├ ${stat}: ${value}\n`;
                });
                text += `├ Habilidades:\n`;
                pet.abilities.forEach(ability => {
                    const abilityInfo = this.abilities[ability];
                    text += `│ ├ ${abilityInfo.name}\n`;
                });
                if (pet.evolution) {
                    text += `└ Evolui para: ${this.pets[pet.evolution].name}\n`;
                }
                text += '\n';
            });
        }

        text += `\n💫 *PETS DISPONÍVEIS*\n\n`;
        Object.entries(this.pets).forEach(([id, pet]) => {
            if (!player.pets?.find(p => p.id === id)) {
                text += `${pet.emoji} *${pet.name}*\n`;
                text += `├ Tipo: ${pet.type}\n`;
                text += `├ Preço: R$ ${pet.price}\n`;
                text += `└ Chance: ${pet.catchRate * 100}%\n\n`;
            }
        });

        text += `\n💡 *COMANDOS*\n`;
        text += `├ ${prefix}pet comprar (nome)\n`;
        text += `├ ${prefix}pet treinar (número)\n`;
        text += `├ ${prefix}pet habilidade (número) (hab)\n`;
        text += `└ ${prefix}pet info (número)`;

        return text;
    }
}

module.exports = new PetSystem();
