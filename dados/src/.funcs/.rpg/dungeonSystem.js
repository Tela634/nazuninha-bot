class DungeonSystem {
    constructor() {
        this.dungeons = {
            // Dungeons Iniciantes
            'caverna_goblin': {
                name: 'Caverna dos Goblins',
                description: 'Uma caverna infestada de goblins',
                minLevel: 5,
                difficulty: 'facil',
                rooms: 5,
                monsters: ['goblin', 'goblin_arqueiro', 'goblin_xamã'],
                boss: 'goblin_chefe',
                rewards: {
                    xp: { min: 100, max: 200 },
                    gold: { min: 50, max: 100 },
                    items: {
                        'pocao_cura': { chance: 0.8, amount: { min: 1, max: 3 } },
                        'equipamento_goblin': { chance: 0.3, amount: { min: 1, max: 1 } }
                    }
                }
            },
            'mina_abandonada': {
                name: 'Mina Abandonada',
                description: 'Uma antiga mina tomada por monstros',
                minLevel: 10,
                difficulty: 'facil',
                rooms: 6,
                monsters: ['slime_pedra', 'kobold_minerador', 'golem_pedra'],
                boss: 'golem_cristal',
                rewards: {
                    xp: { min: 200, max: 400 },
                    gold: { min: 100, max: 200 },
                    items: {
                        'minerio_raro': { chance: 0.5, amount: { min: 1, max: 3 } },
                        'cristal_poder': { chance: 0.2, amount: { min: 1, max: 1 } }
                    }
                }
            },

            // Dungeons Intermediárias
            'forte_orc': {
                name: 'Forte dos Orcs',
                description: 'Uma fortaleza controlada por orcs ferozes',
                minLevel: 20,
                difficulty: 'media',
                rooms: 8,
                monsters: ['orc_guerreiro', 'orc_xamã', 'orc_berserker'],
                boss: 'orc_lorde',
                rewards: {
                    xp: { min: 500, max: 1000 },
                    gold: { min: 300, max: 600 },
                    items: {
                        'equipamento_orc': { chance: 0.4, amount: { min: 1, max: 1 } },
                        'amuleto_forca': { chance: 0.2, amount: { min: 1, max: 1 } }
                    }
                }
            },
            'templo_antigo': {
                name: 'Templo Antigo',
                description: 'Um templo misterioso cheio de armadilhas',
                minLevel: 25,
                difficulty: 'media',
                rooms: 10,
                monsters: ['mumia', 'esqueleto_guerreiro', 'sacerdote_morto_vivo'],
                boss: 'lich',
                rewards: {
                    xp: { min: 800, max: 1500 },
                    gold: { min: 500, max: 1000 },
                    items: {
                        'reliquia_antiga': { chance: 0.3, amount: { min: 1, max: 1 } },
                        'grimorio_proibido': { chance: 0.1, amount: { min: 1, max: 1 } }
                    }
                }
            },

            // Dungeons Avançadas
            'castelo_demonio': {
                name: 'Castelo do Demônio',
                description: 'Um castelo dominado por forças demoníacas',
                minLevel: 40,
                difficulty: 'dificil',
                rooms: 12,
                monsters: ['demonio_menor', 'cavaleiro_negro', 'feiticeiro_sombrio'],
                boss: 'lorde_demonio',
                rewards: {
                    xp: { min: 2000, max: 4000 },
                    gold: { min: 1000, max: 2000 },
                    items: {
                        'arma_demoniaca': { chance: 0.2, amount: { min: 1, max: 1 } },
                        'pedra_alma': { chance: 0.1, amount: { min: 1, max: 1 } }
                    }
                }
            }
        };

        this.events = {
            'armadilha': {
                name: 'Armadilha',
                description: 'Uma armadilha foi ativada!',
                chance: 0.2,
                effect: {
                    type: 'damage',
                    value: 20
                }
            },
            'tesouro': {
                name: 'Tesouro Escondido',
                description: 'Você encontrou um tesouro!',
                chance: 0.1,
                rewards: {
                    gold: { min: 50, max: 200 },
                    items: {
                        'pocao_cura': { chance: 0.5, amount: { min: 1, max: 2 } }
                    }
                }
            },
            'altar': {
                name: 'Altar Misterioso',
                description: 'Um altar que emana energia mágica',
                chance: 0.05,
                effect: {
                    type: 'buff',
                    stats: {
                        attack: 10,
                        defense: 10
                    },
                    duration: 3
                }
            }
        };

        this.roomTypes = {
            'normal': {
                name: 'Sala Normal',
                description: 'Uma sala comum da dungeon',
                monsterCount: { min: 1, max: 3 },
                eventChance: 0.2
            },
            'elite': {
                name: 'Sala Elite',
                description: 'Uma sala com inimigos mais fortes',
                monsterCount: { min: 1, max: 2 },
                monsterBonus: 1.5,
                eventChance: 0.3,
                rewardBonus: 1.5
            },
            'tesouro': {
                name: 'Sala do Tesouro',
                description: 'Uma sala cheia de tesouros',
                monsterCount: { min: 0, max: 1 },
                eventChance: 0.8,
                rewardBonus: 2.0
            },
            'boss': {
                name: 'Sala do Chefe',
                description: 'A sala final com o chefe da dungeon',
                monsterCount: { min: 1, max: 1 },
                isBoss: true,
                eventChance: 0,
                rewardBonus: 3.0
            }
        };
    }

    enterDungeon(player, dungeonId) {
        const dungeon = this.dungeons[dungeonId];
        if (!dungeon) throw new Error('❌ Dungeon não encontrada!');

        // Verifica nível
        if (player.level < dungeon.minLevel) {
            throw new Error(`❌ Você precisa ser nível ${dungeon.minLevel} para entrar aqui!`);
        }

        // Cria instância da dungeon
        const instance = {
            id: dungeonId,
            name: dungeon.name,
            currentRoom: 0,
            totalRooms: dungeon.rooms,
            rooms: [],
            rewards: {
                xp: 0,
                gold: 0,
                items: {}
            }
        };

        // Gera salas
        for (let i = 0; i < dungeon.rooms; i++) {
            let type = 'normal';
            if (i === dungeon.rooms - 1) type = 'boss';
            else if (i === Math.floor(dungeon.rooms / 2)) type = 'elite';
            else if (Math.random() < 0.2) type = 'tesouro';

            instance.rooms.push(this.generateRoom(dungeon, type));
        }

        return instance;
    }

    generateRoom(dungeon, type) {
        const roomType = this.roomTypes[type];
        const room = {
            type: type,
            name: roomType.name,
            description: roomType.description,
            cleared: false,
            monsters: [],
            events: []
        };

        // Gera monstros
        const monsterCount = Math.floor(
            Math.random() * 
            (roomType.monsterCount.max - roomType.monsterCount.min + 1) + 
            roomType.monsterCount.min
        );

        for (let i = 0; i < monsterCount; i++) {
            if (roomType.isBoss) {
                room.monsters.push(dungeon.boss);
            } else {
                const monster = dungeon.monsters[
                    Math.floor(Math.random() * dungeon.monsters.length)
                ];
                room.monsters.push(monster);
            }
        }

        // Gera eventos
        if (Math.random() < roomType.eventChance) {
            const possibleEvents = Object.entries(this.events)
                .filter(([_, event]) => Math.random() < event.chance);
            
            if (possibleEvents.length > 0) {
                const [eventId, event] = possibleEvents[
                    Math.floor(Math.random() * possibleEvents.length)
                ];
                room.events.push({
                    id: eventId,
                    ...event
                });
            }
        }

        return room;
    }

    enterRoom(player, instance) {
        if (instance.currentRoom >= instance.totalRooms) {
            throw new Error('❌ Você já completou esta dungeon!');
        }

        const room = instance.rooms[instance.currentRoom];
        if (room.cleared) {
            throw new Error('❌ Esta sala já foi limpa!');
        }

        return {
            room: room,
            message: `🏰 *SALA ${instance.currentRoom + 1}/${instance.totalRooms}*\n\n` +
                    `${room.description}\n\n` +
                    `Monstros: ${room.monsters.length}\n` +
                    `Eventos: ${room.events.length}`
        };
    }

    processEvents(player, instance, room) {
        let text = '';

        for (const event of room.events) {
            text += `📜 *EVENTO: ${event.name}*\n`;
            text += `${event.description}\n\n`;

            if (event.effect) {
                switch(event.effect.type) {
                    case 'damage':
                        player.hp -= event.effect.value;
                        text += `💢 Você perdeu ${event.effect.value} de vida!\n`;
                        break;
                    case 'buff':
                        Object.entries(event.effect.stats).forEach(([stat, value]) => {
                            player.stats[stat] += value;
                        });
                        text += `✨ Você recebeu um bônus de status!\n`;
                        break;
                }
            }

            if (event.rewards) {
                // Ouro
                if (event.rewards.gold) {
                    const gold = Math.floor(
                        Math.random() * 
                        (event.rewards.gold.max - event.rewards.gold.min + 1) + 
                        event.rewards.gold.min
                    );
                    instance.rewards.gold += gold;
                    text += `💰 Encontrou ${gold} de ouro!\n`;
                }

                // Itens
                if (event.rewards.items) {
                    Object.entries(event.rewards.items).forEach(([itemId, info]) => {
                        if (Math.random() < info.chance) {
                            const amount = Math.floor(
                                Math.random() * 
                                (info.amount.max - info.amount.min + 1) + 
                                info.amount.min
                            );
                            if (!instance.rewards.items[itemId]) {
                                instance.rewards.items[itemId] = 0;
                            }
                            instance.rewards.items[itemId] += amount;
                            text += `📦 Encontrou ${amount}x ${itemId}!\n`;
                        }
                    });
                }
            }
        }

        return text;
    }

    completeRoom(player, instance) {
        const room = instance.rooms[instance.currentRoom];
        room.cleared = true;
        instance.currentRoom++;

        // Calcula recompensas
        const dungeon = this.dungeons[instance.id];
        const roomType = this.roomTypes[room.type];

        // XP base
        let xp = Math.floor(
            Math.random() * 
            (dungeon.rewards.xp.max - dungeon.rewards.xp.min + 1) + 
            dungeon.rewards.xp.min
        );
        xp *= roomType.rewardBonus || 1;
        instance.rewards.xp += xp;

        // Ouro base
        let gold = Math.floor(
            Math.random() * 
            (dungeon.rewards.gold.max - dungeon.rewards.gold.min + 1) + 
            dungeon.rewards.gold.min
        );
        gold *= roomType.rewardBonus || 1;
        instance.rewards.gold += gold;

        // Itens
        Object.entries(dungeon.rewards.items).forEach(([itemId, info]) => {
            if (Math.random() < info.chance * (roomType.rewardBonus || 1)) {
                const amount = Math.floor(
                    Math.random() * 
                    (info.amount.max - info.amount.min + 1) + 
                    info.amount.min
                );
                if (!instance.rewards.items[itemId]) {
                    instance.rewards.items[itemId] = 0;
                }
                instance.rewards.items[itemId] += amount;
            }
        });

        return {
            completed: instance.currentRoom >= instance.totalRooms,
            rewards: {
                xp: xp,
                gold: gold,
                items: instance.rewards.items
            }
        };
    }

    formatDungeonList() {
        let text = `🏰 *DUNGEONS* 🏰\n\n`;

        Object.entries(this.dungeons).forEach(([id, dungeon]) => {
            text += `*${dungeon.name}*\n`;
            text += `├ ${dungeon.description}\n`;
            text += `├ Nível mínimo: ${dungeon.minLevel}\n`;
            text += `├ Dificuldade: ${dungeon.difficulty}\n`;
            text += `└ Salas: ${dungeon.rooms}\n\n`;
        });

        return text;
    }

    formatRoomInfo(room) {
        let text = `🏰 *${room.name}* 🏰\n\n`;
        text += `${room.description}\n\n`;

        if (room.monsters.length > 0) {
            text += `*Monstros:*\n`;
            room.monsters.forEach(monster => {
                text += `├ ${monster}\n`;
            });
            text += '\n';
        }

        if (room.events.length > 0) {
            text += `*Eventos:*\n`;
            room.events.forEach(event => {
                text += `├ ${event.name}\n`;
                text += `└ ${event.description}\n`;
            });
        }

        return text;
    }
}

module.exports = new DungeonSystem();
