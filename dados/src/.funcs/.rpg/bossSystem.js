class BossSystem {
    constructor() {
        this.bosses = {
            // Bosses Mundiais
            'dragao_anciao': {
                name: 'Dragão Ancião',
                description: 'Um dragão milenar com poderes devastadores',
                level: 50,
                stats: {
                    health: 100000,
                    attack: 1000,
                    defense: 800,
                    speed: 300
                },
                abilities: [
                    {
                        name: 'Sopro de Fogo',
                        damage: 2000,
                        effect: 'burn',
                        cooldown: 3
                    },
                    {
                        name: 'Terremoto',
                        damage: 1500,
                        effect: 'stun',
                        cooldown: 4
                    },
                    {
                        name: 'Rugido Devastador',
                        damage: 1000,
                        effect: 'fear',
                        cooldown: 5
                    }
                ],
                phases: [
                    {
                        threshold: 0.7, // 70% HP
                        buff: {
                            attack: 1.5,
                            speed: 1.3
                        }
                    },
                    {
                        threshold: 0.3, // 30% HP
                        buff: {
                            attack: 2.0,
                            speed: 1.5,
                            abilities: ['furia_dragao']
                        }
                    }
                ],
                rewards: {
                    money: 1000000,
                    xp: 500000,
                    items: ['escama_dragao', 'coracao_dragao', 'espada_dragao'],
                    title: 'Matador de Dragões'
                }
            },

            // Bosses de Evento
            'rei_abissal': {
                name: 'Rei Abissal',
                description: 'O governante das profundezas do oceano',
                level: 60,
                stats: {
                    health: 150000,
                    attack: 1200,
                    defense: 1000,
                    speed: 250
                },
                abilities: [
                    {
                        name: 'Tsunami',
                        damage: 2500,
                        effect: 'knockback',
                        cooldown: 4
                    },
                    {
                        name: 'Prisão Aquática',
                        damage: 1000,
                        effect: 'immobilize',
                        cooldown: 5
                    },
                    {
                        name: 'Invocação das Profundezas',
                        effect: 'summon',
                        cooldown: 6
                    }
                ],
                phases: [
                    {
                        threshold: 0.5, // 50% HP
                        buff: {
                            defense: 2.0,
                            abilities: ['escudo_coral']
                        }
                    },
                    {
                        threshold: 0.2, // 20% HP
                        buff: {
                            attack: 2.5,
                            abilities: ['furia_oceano']
                        }
                    }
                ],
                rewards: {
                    money: 2000000,
                    xp: 1000000,
                    items: ['coroa_abissal', 'tridente_rei', 'armadura_abissal'],
                    title: 'Conquistador dos Mares'
                },
                event: true
            },

            // Bosses de Facção
            'lorde_demonio': {
                name: 'Lorde Demônio',
                description: 'O líder supremo das forças demoníacas',
                level: 70,
                stats: {
                    health: 200000,
                    attack: 1500,
                    defense: 1200,
                    speed: 400
                },
                abilities: [
                    {
                        name: 'Chamas do Inferno',
                        damage: 3000,
                        effect: 'burn',
                        cooldown: 3
                    },
                    {
                        name: 'Maldição Demoníaca',
                        damage: 1500,
                        effect: 'curse',
                        cooldown: 4
                    },
                    {
                        name: 'Portal Infernal',
                        effect: 'summon',
                        cooldown: 5
                    }
                ],
                phases: [
                    {
                        threshold: 0.6, // 60% HP
                        buff: {
                            attack: 2.0,
                            abilities: ['forma_demoniaca']
                        }
                    },
                    {
                        threshold: 0.3, // 30% HP
                        buff: {
                            attack: 3.0,
                            speed: 2.0,
                            abilities: ['apocalipse']
                        }
                    }
                ],
                rewards: {
                    money: 5000000,
                    xp: 2000000,
                    items: ['espada_demoniaca', 'armadura_demoniaca', 'alma_demonio'],
                    title: 'Caçador de Demônios'
                },
                faction: 'demonios'
            }
        };

        // Habilidades Especiais
        this.specialAbilities = {
            'furia_dragao': {
                name: 'Fúria do Dragão',
                damage: 5000,
                effect: {
                    type: 'dot',
                    damage: 1000,
                    duration: 3
                }
            },
            'escudo_coral': {
                name: 'Escudo de Coral',
                effect: {
                    type: 'shield',
                    value: 10000,
                    duration: 3
                }
            },
            'furia_oceano': {
                name: 'Fúria do Oceano',
                damage: 4000,
                effect: {
                    type: 'aoe',
                    range: 'all'
                }
            },
            'forma_demoniaca': {
                name: 'Forma Demoníaca',
                effect: {
                    type: 'transform',
                    stats: {
                        attack: 2.0,
                        defense: 2.0,
                        speed: 2.0
                    }
                }
            },
            'apocalipse': {
                name: 'Apocalipse',
                damage: 10000,
                effect: {
                    type: 'ultimate',
                    instant_kill_chance: 0.1
                }
            }
        };

        // Sistema de Spawn
        this.spawnRules = {
            'dragao_anciao': {
                interval: 604800000, // 7 dias
                announcement: true,
                preparation: 3600000 // 1 hora
            },
            'rei_abissal': {
                interval: 259200000, // 3 dias
                announcement: true,
                preparation: 1800000 // 30 minutos
            },
            'lorde_demonio': {
                interval: 432000000, // 5 dias
                announcement: true,
                preparation: 7200000 // 2 horas
            }
        };
    }

    spawnBoss(bossId) {
        const boss = this.bosses[bossId];
        if (!boss) throw new Error('❌ Boss não encontrado!');

        return {
            id: `${bossId}_${Date.now()}`,
            boss: bossId,
            stats: { ...boss.stats },
            currentPhase: 0,
            activeBuffs: [],
            abilityCooldowns: {},
            participants: [],
            damageDealt: {},
            startTime: null,
            endTime: null,
            status: 'spawning' // spawning, active, defeated
        };
    }

    joinBossFight(instance, player) {
        // Verifica nível
        if (player.level < this.bosses[instance.boss].level) {
            throw new Error(`❌ Você precisa ser nível ${this.bosses[instance.boss].level}!`);
        }

        // Adiciona participante
        instance.participants.push(player.id);
        instance.damageDealt[player.id] = 0;

        return {
            success: true,
            message: `⚔️ Você entrou na luta contra ${this.bosses[instance.boss].name}!`
        };
    }

    processTurn(instance, actions) {
        const boss = this.bosses[instance.boss];
        const results = [];

        // Processa ações dos jogadores
        actions.forEach(action => {
            const damage = this.calculateDamage(action.player, action.skill, instance);
            instance.stats.health -= damage;
            instance.damageDealt[action.player.id] += damage;

            results.push({
                player: action.player.id,
                damage: damage,
                skill: action.skill
            });
        });

        // Verifica fases
        this.checkPhases(instance);

        // Boss ataca
        const bossAction = this.chooseBossAction(instance);
        results.push(bossAction);

        // Verifica derrota
        if (instance.stats.health <= 0) {
            return this.defeatBoss(instance);
        }

        return {
            turn: results,
            bossHealth: instance.stats.health,
            message: this.formatTurnResults(results, instance)
        };
    }

    calculateDamage(player, skill, instance) {
        // Implementação do cálculo de dano
        let damage = player.stats.attack;
        
        // Aplica modificadores de skill
        if (skill) {
            damage *= skill.multiplier || 1;
        }

        // Aplica defesa do boss
        damage = Math.max(1, damage - instance.stats.defense);

        return Math.floor(damage);
    }

    checkPhases(instance) {
        const boss = this.bosses[instance.boss];
        const currentHpPercent = instance.stats.health / boss.stats.health;

        // Verifica se deve ativar nova fase
        boss.phases.forEach((phase, index) => {
            if (index > instance.currentPhase && currentHpPercent <= phase.threshold) {
                instance.currentPhase = index;
                
                // Aplica buffs
                if (phase.buff) {
                    Object.entries(phase.buff).forEach(([stat, value]) => {
                        if (stat === 'abilities') {
                            value.forEach(ability => {
                                instance.activeBuffs.push(ability);
                            });
                        } else {
                            instance.stats[stat] *= value;
                        }
                    });
                }
            }
        });
    }

    chooseBossAction(instance) {
        const boss = this.bosses[instance.boss];
        const availableAbilities = boss.abilities.filter(ability => 
            !instance.abilityCooldowns[ability.name]);

        // Usa habilidade especial se disponível
        for (const specialAbility of instance.activeBuffs) {
            if (!instance.abilityCooldowns[specialAbility]) {
                const ability = this.specialAbilities[specialAbility];
                instance.abilityCooldowns[specialAbility] = ability.cooldown;
                return {
                    type: 'special',
                    ability: ability
                };
            }
        }

        // Usa habilidade normal
        if (availableAbilities.length > 0) {
            const ability = availableAbilities[Math.floor(Math.random() * availableAbilities.length)];
            instance.abilityCooldowns[ability.name] = ability.cooldown;
            return {
                type: 'ability',
                ability: ability
            };
        }

        // Ataque básico
        return {
            type: 'attack',
            damage: instance.stats.attack
        };
    }

    defeatBoss(instance) {
        const boss = this.bosses[instance.boss];
        instance.status = 'defeated';
        instance.endTime = Date.now();

        // Calcula recompensas
        const rewards = Object.entries(instance.damageDealt)
            .sort(([_, a], [__, b]) => b - a)
            .map(([playerId, damage], index) => {
                const multiplier = index === 0 ? 1 : 
                                 index < 3 ? 0.7 :
                                 index < 10 ? 0.5 : 0.3;

                return {
                    player: playerId,
                    damage: damage,
                    rewards: {
                        money: Math.floor(boss.rewards.money * multiplier),
                        xp: Math.floor(boss.rewards.xp * multiplier),
                        items: index < 3 ? boss.rewards.items : 
                               index < 10 ? boss.rewards.items.slice(0, 1) : []
                    }
                };
            });

        return {
            success: true,
            rewards: rewards,
            message: `🎉 *BOSS DERROTADO*\n\n` +
                    `${boss.name} foi derrotado!\n\n` +
                    `🏆 *RANKING DE DANO*\n` +
                    rewards.map((r, i) => 
                        `${i + 1}. @${r.player.split('@')[0]}\n` +
                        `├ Dano: ${r.damage}\n` +
                        `├ R$ ${r.rewards.money}\n` +
                        `├ ${r.rewards.xp} XP\n` +
                        `└ Itens: ${r.rewards.items.join(', ')}`
                    ).join('\n\n')
        };
    }

    formatTurnResults(results, instance) {
        const boss = this.bosses[instance.boss];
        let text = `⚔️ *TURNO DE COMBATE*\n\n`;

        // Ações dos jogadores
        results.filter(r => r.player).forEach(result => {
            text += `@${result.player.split('@')[0]}\n`;
            text += `├ Skill: ${result.skill?.name || 'Ataque Básico'}\n`;
            text += `└ Dano: ${result.damage}\n\n`;
        });

        // Ação do boss
        const bossAction = results.find(r => !r.player);
        text += `👑 *${boss.name}*\n`;
        if (bossAction.type === 'special') {
            text += `└ Usou ${bossAction.ability.name}!\n`;
        } else if (bossAction.type === 'ability') {
            text += `└ Usou ${bossAction.ability.name}!\n`;
        } else {
            text += `└ Causou ${bossAction.damage} de dano!\n`;
        }

        // Status
        text += `\n❤️ HP: ${instance.stats.health}/${boss.stats.health}`;

        return text;
    }

    formatBossList() {
        let text = `👑 *WORLD BOSSES* 👑\n\n`;

        Object.entries(this.bosses).forEach(([id, boss]) => {
            text += `*${boss.name}*\n`;
            text += `├ ${boss.description}\n`;
            text += `├ Nível: ${boss.level}\n`;
            text += `├ HP: ${boss.stats.health}\n`;
            text += `├ Ataque: ${boss.stats.attack}\n`;
            text += `├ Defesa: ${boss.stats.defense}\n`;
            text += `├ Velocidade: ${boss.stats.speed}\n`;
            text += `├ Habilidades:\n`;
            boss.abilities.forEach(ability => {
                text += `│ └ ${ability.name}\n`;
            });
            text += `├ Recompensas:\n`;
            text += `│ ├ R$ ${boss.rewards.money}\n`;
            text += `│ ├ ${boss.rewards.xp} XP\n`;
            text += `│ ├ Itens: ${boss.rewards.items.join(', ')}\n`;
            text += `│ └ Título: ${boss.rewards.title}\n`;
            if (boss.event) text += `└ 🎉 Boss de Evento\n`;
            if (boss.faction) text += `└ ⚔️ Boss de Facção: ${boss.faction}\n`;
            text += '\n';
        });

        return text;
    }
}

module.exports = new BossSystem();
