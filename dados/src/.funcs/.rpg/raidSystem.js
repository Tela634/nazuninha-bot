class RaidSystem {
    constructor() {
        this.raids = {
            // Raids Básicas (5 jogadores)
            'fortaleza_bandidos': {
                name: 'Fortaleza dos Bandidos',
                description: 'Uma fortaleza cheia de bandidos perigosos',
                minPlayers: 5,
                maxPlayers: 10,
                level: 20,
                phases: [
                    {
                        name: 'Portão Principal',
                        enemies: ['bandido', 'arqueiro', 'guarda'],
                        amount: 10,
                        boss: 'capitao_bandidos'
                    },
                    {
                        name: 'Pátio Interno',
                        enemies: ['assassino', 'mago_negro', 'berserker'],
                        amount: 15,
                        boss: 'mestre_assassino'
                    },
                    {
                        name: 'Sala do Tesouro',
                        enemies: ['elite_bandido', 'mago_elite', 'guarda_real'],
                        amount: 20,
                        boss: 'rei_bandidos'
                    }
                ],
                rewards: {
                    money: 50000,
                    xp: 25000,
                    items: ['espada_bandido', 'armadura_bandido', 'anel_ladrao']
                }
            },

            // Raids Intermediárias (10 jogadores)
            'templo_dragao': {
                name: 'Templo do Dragão',
                description: 'Um templo antigo guardado por dragões',
                minPlayers: 10,
                maxPlayers: 15,
                level: 40,
                phases: [
                    {
                        name: 'Entrada do Templo',
                        enemies: ['dragonete', 'cultista_dragao', 'guarda_dragao'],
                        amount: 15,
                        boss: 'dragao_jovem'
                    },
                    {
                        name: 'Salão das Chamas',
                        enemies: ['dragao_fogo', 'dragao_gelo', 'dragao_trovao'],
                        amount: 10,
                        boss: 'dragao_elemental'
                    },
                    {
                        name: 'Ninho do Dragão',
                        enemies: ['dragao_elite', 'dragao_anciao', 'dragao_corrompido'],
                        amount: 5,
                        boss: 'rei_dragao'
                    }
                ],
                rewards: {
                    money: 100000,
                    xp: 50000,
                    items: ['espada_dragao', 'armadura_dragao', 'amuleto_dragao']
                }
            },

            // Raids Avançadas (15 jogadores)
            'castelo_demonio': {
                name: 'Castelo do Demônio',
                description: 'O castelo do temível Rei Demônio',
                minPlayers: 15,
                maxPlayers: 20,
                level: 60,
                phases: [
                    {
                        name: 'Portões do Inferno',
                        enemies: ['demonio_menor', 'cavaleiro_negro', 'mago_sombrio'],
                        amount: 20,
                        boss: 'general_demonio'
                    },
                    {
                        name: 'Salão das Torturas',
                        enemies: ['demonio_elite', 'carrasco', 'necromante'],
                        amount: 15,
                        boss: 'lorde_tortura'
                    },
                    {
                        name: 'Sala do Trono',
                        enemies: ['demonio_maior', 'guarda_real_demonio', 'arquimago_sombrio'],
                        amount: 10,
                        boss: 'rei_demonio'
                    }
                ],
                rewards: {
                    money: 200000,
                    xp: 100000,
                    items: ['espada_demoniaca', 'armadura_demoniaca', 'coroa_demonio']
                }
            }
        };

        // Eventos de Raid
        this.events = {
            'armadilha_mortal': {
                name: 'Armadilha Mortal',
                description: 'Uma armadilha que afeta todo o grupo!',
                effect: (players) => {
                    players.forEach(player => {
                        const damage = Math.floor(player.stats.maxHealth * 0.3);
                        player.stats.health -= damage;
                    });
                    return '☠️ Armadilha causou 30% de dano em todos!';
                },
                chance: 0.2
            },
            'bencao_divina': {
                name: 'Benção Divina',
                description: 'Uma luz divina cura o grupo!',
                effect: (players) => {
                    players.forEach(player => {
                        const heal = Math.floor(player.stats.maxHealth * 0.5);
                        player.stats.health = Math.min(player.stats.maxHealth, 
                            player.stats.health + heal);
                    });
                    return '💚 Todos foram curados em 50%!';
                },
                chance: 0.1
            },
            'furia_ancestral': {
                name: 'Fúria Ancestral',
                description: 'Um poder ancestral fortalece o grupo!',
                effect: (players) => {
                    players.forEach(player => {
                        player.stats.attack *= 1.5;
                        player.stats.defense *= 1.5;
                    });
                    return '⚔️ Ataque e defesa aumentados em 50%!';
                },
                chance: 0.1
            }
        };

        // Sistema de Loot
        this.lootChances = {
            common: 0.6,
            rare: 0.3,
            epic: 0.08,
            legendary: 0.02
        };
    }

    createRaid(raidId, leader) {
        const raid = this.raids[raidId];
        if (!raid) throw new Error('❌ Raid não encontrada!');

        // Verifica nível do líder
        if (leader.level < raid.level) {
            throw new Error(`❌ Você precisa ser nível ${raid.level} para liderar esta raid!`);
        }

        // Cria instância
        return {
            id: `${raidId}_${Date.now()}`,
            raid: raidId,
            leader: leader.id,
            players: [leader],
            currentPhase: 0,
            status: 'recruiting', // recruiting, in_progress, completed, failed
            startTime: null,
            endTime: null
        };
    }

    joinRaid(instance, player) {
        const raid = this.raids[instance.raid];

        // Verifica status
        if (instance.status !== 'recruiting') {
            throw new Error('❌ Esta raid já começou ou terminou!');
        }

        // Verifica nível
        if (player.level < raid.level) {
            throw new Error(`❌ Você precisa ser nível ${raid.level} para entrar nesta raid!`);
        }

        // Verifica limite de jogadores
        if (instance.players.length >= raid.maxPlayers) {
            throw new Error('❌ Raid está cheia!');
        }

        // Adiciona jogador
        instance.players.push(player);

        return {
            success: true,
            message: `✅ Você entrou na raid ${raid.name}!\n` +
                    `Jogadores: ${instance.players.length}/${raid.maxPlayers}`
        };
    }

    startRaid(instance) {
        const raid = this.raids[instance.raid];

        // Verifica mínimo de jogadores
        if (instance.players.length < raid.minPlayers) {
            throw new Error(`❌ Mínimo de ${raid.minPlayers} jogadores necessário!`);
        }

        // Inicia raid
        instance.status = 'in_progress';
        instance.startTime = Date.now();

        return {
            success: true,
            message: `🏰 *RAID INICIADA*\n\n` +
                    `${raid.name}\n` +
                    `Jogadores: ${instance.players.length}\n\n` +
                    `Primeira fase: ${raid.phases[0].name}`
        };
    }

    processPhase(instance) {
        const raid = this.raids[instance.raid];
        const phase = raid.phases[instance.currentPhase];

        // Gera inimigos
        const enemies = this.generateEnemies(phase);

        // Processa eventos
        const event = this.rollEvent();
        const eventResult = event ? event.effect(instance.players) : null;

        return {
            phase: phase,
            enemies: enemies,
            event: event,
            eventResult: eventResult,
            message: `⚔️ *FASE ${instance.currentPhase + 1}*\n\n` +
                    `${phase.name}\n\n` +
                    `Inimigos: ${enemies.length}\n` +
                    `Boss: ${phase.boss}\n` +
                    (eventResult ? `\n${eventResult}` : '')
        };
    }

    completePhase(instance) {
        const raid = this.raids[instance.raid];
        instance.currentPhase++;

        // Verifica se completou a raid
        if (instance.currentPhase >= raid.phases.length) {
            return this.completeRaid(instance);
        }

        return {
            success: true,
            message: `✨ *FASE CONCLUÍDA*\n\n` +
                    `Próxima fase: ${raid.phases[instance.currentPhase].name}`
        };
    }

    completeRaid(instance) {
        const raid = this.raids[instance.raid];
        
        // Gera loot para cada jogador
        const rewards = instance.players.map(player => {
            const loot = this.generateLoot(raid);
            
            // Adiciona recompensas
            player.money.wallet += raid.rewards.money;
            player.xp += raid.rewards.xp;

            return {
                player: player.id,
                loot: loot
            };
        });

        // Marca como completa
        instance.status = 'completed';
        instance.endTime = Date.now();

        return {
            success: true,
            rewards: rewards,
            message: `🎉 *RAID CONCLUÍDA*\n\n` +
                    `${raid.name}\n\n` +
                    `💰 Recompensas por jogador:\n` +
                    `├ Dinheiro: R$ ${raid.rewards.money}\n` +
                    `└ XP: ${raid.rewards.xp}\n\n` +
                    `📦 *LOOT*\n` +
                    rewards.map(r => 
                        `@${r.player.split('@')[0]}:\n` +
                        r.loot.map(item => `└ ${item.name} (${item.rarity})`).join('\n')
                    ).join('\n\n')
        };
    }

    failRaid(instance, reason) {
        instance.status = 'failed';
        instance.endTime = Date.now();

        return {
            success: false,
            message: `❌ *RAID FRACASSADA*\n\n` +
                    `${this.raids[instance.raid].name}\n\n` +
                    `Motivo: ${reason}\n` +
                    `Fase: ${instance.currentPhase + 1}/${this.raids[instance.raid].phases.length}`
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

    generateEnemies(phase) {
        const enemies = [];
        for (let i = 0; i < phase.amount; i++) {
            const enemy = phase.enemies[Math.floor(Math.random() * phase.enemies.length)];
            enemies.push(enemy);
        }
        return enemies;
    }

    generateLoot(raid) {
        const loot = [];
        
        // Rola para cada tipo de loot
        Object.entries(this.lootChances).forEach(([rarity, chance]) => {
            if (Math.random() < chance) {
                const item = raid.rewards.items[Math.floor(Math.random() * raid.rewards.items.length)];
                loot.push({
                    name: item,
                    rarity: rarity
                });
            }
        });

        return loot;
    }

    formatRaidList() {
        let text = `🏰 *RAIDS DISPONÍVEIS* 🏰\n\n`;

        Object.entries(this.raids).forEach(([id, raid]) => {
            text += `*${raid.name}*\n`;
            text += `├ ${raid.description}\n`;
            text += `├ Nível: ${raid.level}\n`;
            text += `├ Jogadores: ${raid.minPlayers}-${raid.maxPlayers}\n`;
            text += `├ Fases: ${raid.phases.length}\n`;
            text += `├ Recompensas:\n`;
            text += `│ ├ R$ ${raid.rewards.money}\n`;
            text += `│ ├ ${raid.rewards.xp} XP\n`;
            text += `│ └ Itens: ${raid.rewards.items.join(', ')}\n`;
            text += `└ Bosses:\n`;
            raid.phases.forEach(phase => {
                text += `  └ ${phase.name}: ${phase.boss}\n`;
            });
            text += '\n';
        });

        return text;
    }
}

module.exports = new RaidSystem();
