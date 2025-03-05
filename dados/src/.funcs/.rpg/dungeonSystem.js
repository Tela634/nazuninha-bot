class DungeonSystem {
    constructor() {
        this.dungeons = {
            // Dungeons Básicas
            'caverna_abandonada': {
                name: 'Caverna Abandonada',
                description: 'Uma caverna escura e perigosa',
                level: 1,
                rooms: 5,
                enemies: ['rato', 'morcego', 'aranha'],
                boss: 'rei_rato',
                loot: {
                    common: ['pocao_hp', 'pocao_mp', 'ferro'],
                    rare: ['espada_ferro', 'armadura_couro'],
                    epic: ['anel_forca']
                },
                rewards: {
                    money: 1000,
                    xp: 500
                }
            },
            'floresta_sombria': {
                name: 'Floresta Sombria',
                description: 'Uma floresta envolta em trevas',
                level: 5,
                rooms: 7,
                enemies: ['lobo', 'cobra', 'bandido'],
                boss: 'druida_corrompido',
                loot: {
                    common: ['ervas', 'couro', 'madeira'],
                    rare: ['arco_composto', 'botas_rapidas'],
                    epic: ['colar_natureza']
                },
                rewards: {
                    money: 2000,
                    xp: 1000
                }
            },

            // Dungeons Intermediárias
            'ruinas_antigas': {
                name: 'Ruínas Antigas',
                description: 'Ruínas de uma civilização perdida',
                level: 15,
                rooms: 10,
                enemies: ['esqueleto', 'zumbi', 'cultista'],
                boss: 'lich',
                loot: {
                    common: ['ossos', 'pergaminhos', 'cristais'],
                    rare: ['cajado_necromante', 'armadura_ossea'],
                    epic: ['grimorio_proibido']
                },
                rewards: {
                    money: 5000,
                    xp: 2500
                }
            },
            'mina_profunda': {
                name: 'Mina Profunda',
                description: 'Uma mina infestada de criaturas',
                level: 20,
                rooms: 12,
                enemies: ['golem', 'mineiro_zumbi', 'slime'],
                boss: 'golem_anciao',
                loot: {
                    common: ['minerios', 'gemas', 'carvao'],
                    rare: ['picareta_encantada', 'capacete_minerador'],
                    epic: ['nucleo_golem']
                },
                rewards: {
                    money: 8000,
                    xp: 4000
                }
            },

            // Dungeons Avançadas
            'templo_dragao': {
                name: 'Templo do Dragão',
                description: 'Lar de dragões ancestrais',
                level: 30,
                rooms: 15,
                enemies: ['dragonete', 'cultista_dragao', 'wyvern'],
                boss: 'dragao_anciao',
                loot: {
                    common: ['escamas', 'garras', 'cristais_dragao'],
                    rare: ['espada_dragao', 'armadura_dragao'],
                    epic: ['ovo_dragao']
                },
                rewards: {
                    money: 15000,
                    xp: 7500
                }
            },
            'cidade_submarina': {
                name: 'Cidade Submarina',
                description: 'Uma cidade afundada misteriosa',
                level: 35,
                rooms: 15,
                enemies: ['sereia_corrompida', 'pirata_afogado', 'kraken_jovem'],
                boss: 'rei_mar',
                loot: {
                    common: ['perolas', 'coral', 'algas_magicas'],
                    rare: ['tridente_mar', 'armadura_abissal'],
                    epic: ['coroa_oceano']
                },
                rewards: {
                    money: 20000,
                    xp: 10000
                }
            },

            // Dungeons Lendárias
            'castelo_celestial': {
                name: 'Castelo Celestial',
                description: 'Um castelo flutuante nas nuvens',
                level: 50,
                rooms: 20,
                enemies: ['anjo_caido', 'guerreiro_celestial', 'elemental_luz'],
                boss: 'serafim_corrompido',
                loot: {
                    common: ['essencia_luz', 'penas_celestiais', 'cristais_divinos'],
                    rare: ['espada_celestial', 'armadura_divina'],
                    epic: ['asas_anjo']
                },
                rewards: {
                    money: 50000,
                    xp: 25000
                }
            },
            'portal_abissal': {
                name: 'Portal Abissal',
                description: 'Um portal para o reino das trevas',
                level: 60,
                rooms: 25,
                enemies: ['demonio_menor', 'cavaleiro_negro', 'bruxa_sombria'],
                boss: 'lorde_abissal',
                loot: {
                    common: ['essencia_trevas', 'cristais_sombrios', 'almas'],
                    rare: ['espada_amaldicoada', 'armadura_sombria'],
                    epic: ['coroa_abissal']
                },
                rewards: {
                    money: 100000,
                    xp: 50000
                }
            }
        };

        // Eventos de Dungeon
        this.events = {
            'armadilha': {
                name: 'Armadilha',
                description: 'Uma armadilha mortal!',
                effect: (player) => {
                    const damage = Math.floor(player.stats.maxHealth * 0.2);
                    player.stats.health -= damage;
                    return `☠️ Armadilha causou ${damage} de dano!`;
                },
                chance: 0.2
            },
            'tesouro': {
                name: 'Tesouro Escondido',
                description: 'Você encontrou um tesouro!',
                effect: (player) => {
                    const gold = Math.floor(1000 + Math.random() * 9000);
                    player.money.wallet += gold;
                    return `💰 Encontrou ${gold} de ouro!`;
                },
                chance: 0.1
            },
            'altar': {
                name: 'Altar de Cura',
                description: 'Um altar mágico que cura ferimentos',
                effect: (player) => {
                    const heal = Math.floor(player.stats.maxHealth * 0.5);
                    player.stats.health = Math.min(player.stats.maxHealth, player.stats.health + heal);
                    return `💚 Curou ${heal} de vida!`;
                },
                chance: 0.15
            },
            'portal': {
                name: 'Portal Misterioso',
                description: 'Um portal que leva a uma sala aleatória',
                effect: (player, dungeon) => {
                    const skip = Math.floor(Math.random() * 3) + 1;
                    return `🌀 Pulou ${skip} salas!`;
                },
                chance: 0.05
            }
        };

        // Sistema de Loot
        this.lootChances = {
            common: 0.7,
            rare: 0.25,
            epic: 0.05
        };
    }

    createInstance(dungeonId, player) {
        const dungeon = this.dungeons[dungeonId];
        if (!dungeon) throw new Error('❌ Dungeon não encontrada!');

        // Verifica nível
        if (player.level < dungeon.level) {
            throw new Error(`❌ Você precisa ser nível ${dungeon.level} para entrar nesta dungeon!`);
        }

        // Cria instância
        return {
            id: `${dungeonId}_${Date.now()}`,
            dungeon: dungeonId,
            currentRoom: 0,
            maxRooms: dungeon.rooms,
            enemies: [],
            loot: [],
            events: [],
            completed: false,
            startTime: Date.now()
        };
    }

    processRoom(instance, player) {
        const dungeon = this.dungeons[instance.dungeon];
        instance.currentRoom++;

        // Última sala (boss)
        if (instance.currentRoom === dungeon.rooms) {
            return this.processBossRoom(instance, player);
        }

        // Processa eventos
        const event = this.rollEvent();
        if (event) {
            const result = event.effect(player, dungeon);
            instance.events.push({
                name: event.name,
                result: result
            });
            return {
                type: 'event',
                event: event,
                result: result
            };
        }

        // Gera inimigos
        const enemies = this.generateEnemies(dungeon);
        instance.enemies = enemies;

        return {
            type: 'combat',
            enemies: enemies,
            message: `⚔️ *SALA ${instance.currentRoom}/${dungeon.rooms}*\n\n` +
                    `Você encontrou ${enemies.length} inimigos!`
        };
    }

    processBossRoom(instance, player) {
        const dungeon = this.dungeons[instance.dungeon];
        
        return {
            type: 'boss',
            boss: dungeon.boss,
            message: `👑 *SALA DO CHEFE*\n\n` +
                    `Você encontrou ${dungeon.boss}!\n` +
                    `Prepare-se para a batalha final!`
        };
    }

    completeDungeon(instance, player) {
        const dungeon = this.dungeons[instance.dungeon];
        
        // Gera loot
        const loot = this.generateLoot(dungeon);
        instance.loot = loot;

        // Adiciona recompensas
        player.money.wallet += dungeon.rewards.money;
        player.xp += dungeon.rewards.xp;

        // Marca como completa
        instance.completed = true;
        instance.endTime = Date.now();

        return {
            success: true,
            loot: loot,
            rewards: dungeon.rewards,
            message: `🎉 *DUNGEON COMPLETA!*\n\n` +
                    `${dungeon.name}\n\n` +
                    `💰 Recompensas:\n` +
                    `├ Dinheiro: R$ ${dungeon.rewards.money}\n` +
                    `└ XP: ${dungeon.rewards.xp}\n\n` +
                    `📦 Itens encontrados:\n` +
                    loot.map(item => `└ ${item.name}`).join('\n')
        };
    }

    rollEvent() {
        for (const [id, event] of Object.entries(this.events)) {
            if (Math.random() < event.chance) {
                return event;
            }
        }
        return null;
    }

    generateEnemies(dungeon) {
        const amount = Math.floor(Math.random() * 3) + 1;
        const enemies = [];

        for (let i = 0; i < amount; i++) {
            const enemy = dungeon.enemies[Math.floor(Math.random() * dungeon.enemies.length)];
            enemies.push(enemy);
        }

        return enemies;
    }

    generateLoot(dungeon) {
        const loot = [];
        
        // Rola para cada tipo de loot
        Object.entries(this.lootChances).forEach(([rarity, chance]) => {
            if (Math.random() < chance) {
                const possibleLoot = dungeon.loot[rarity];
                const item = possibleLoot[Math.floor(Math.random() * possibleLoot.length)];
                loot.push({
                    name: item,
                    rarity: rarity
                });
            }
        });

        return loot;
    }

    formatDungeonList() {
        let text = `🏰 *DUNGEONS DISPONÍVEIS* 🏰\n\n`;

        Object.entries(this.dungeons).forEach(([id, dungeon]) => {
            text += `*${dungeon.name}*\n`;
            text += `├ ${dungeon.description}\n`;
            text += `├ Nível: ${dungeon.level}\n`;
            text += `├ Salas: ${dungeon.rooms}\n`;
            text += `├ Boss: ${dungeon.boss}\n`;
            text += `├ Recompensas:\n`;
            text += `│ ├ R$ ${dungeon.rewards.money}\n`;
            text += `│ └ ${dungeon.rewards.xp} XP\n`;
            text += `└ Possíveis drops:\n`;
            Object.entries(dungeon.loot).forEach(([rarity, items]) => {
                text += `  └ ${rarity}: ${items.join(', ')}\n`;
            });
            text += '\n';
        });

        return text;
    }
}

module.exports = new DungeonSystem();
