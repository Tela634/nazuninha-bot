class BattleSystem {
    constructor() {
        // Status Effects
        this.statusEffects = {
            'poison': {
                name: 'Envenenado',
                emoji: '☠️',
                duration: 3,
                effect: (stats) => {
                    stats.health -= Math.floor(stats.maxHealth * 0.1);
                    return '☠️ Dano de veneno: -10% HP';
                }
            },
            'burn': {
                name: 'Queimando',
                emoji: '🔥',
                duration: 3,
                effect: (stats) => {
                    stats.health -= 30;
                    stats.attack *= 0.8;
                    return '🔥 Queimadura: -30 HP, -20% ATK';
                }
            },
            'stun': {
                name: 'Atordoado',
                emoji: '💫',
                duration: 1,
                effect: (stats) => {
                    stats.canAct = false;
                    return '💫 Atordoado: Perde o turno';
                }
            },
            'bleed': {
                name: 'Sangrando',
                emoji: '🩸',
                duration: 4,
                effect: (stats) => {
                    const damage = Math.floor(stats.maxHealth * 0.05);
                    stats.health -= damage;
                    return `🩸 Sangramento: -${damage} HP`;
                }
            },
            'regen': {
                name: 'Regenerando',
                emoji: '💚',
                duration: 3,
                effect: (stats) => {
                    const heal = Math.floor(stats.maxHealth * 0.1);
                    stats.health = Math.min(stats.maxHealth, stats.health + heal);
                    return `💚 Regeneração: +${heal} HP`;
                }
            }
        };

        // Combat Skills
        this.skills = {
            // Warrior Skills
            'golpe_pesado': {
                name: 'Golpe Pesado',
                type: 'warrior',
                damage: 1.5,
                energyCost: 30,
                cooldown: 3,
                effect: {
                    type: 'stun',
                    chance: 0.3
                }
            },
            'provocar': {
                name: 'Provocar',
                type: 'warrior',
                energyCost: 20,
                cooldown: 4,
                effect: {
                    type: 'taunt',
                    duration: 2
                }
            },
            'berserk': {
                name: 'Berserk',
                type: 'warrior',
                energyCost: 50,
                cooldown: 5,
                effect: {
                    type: 'buff',
                    stats: {
                        attack: 2.0,
                        defense: 0.5
                    },
                    duration: 3
                }
            },

            // Mage Skills
            'bola_fogo': {
                name: 'Bola de Fogo',
                type: 'mage',
                damage: 2.0,
                energyCost: 40,
                cooldown: 3,
                effect: {
                    type: 'burn',
                    chance: 0.5
                }
            },
            'raio': {
                name: 'Raio',
                type: 'mage',
                damage: 1.8,
                energyCost: 35,
                cooldown: 2,
                effect: {
                    type: 'stun',
                    chance: 0.4
                }
            },
            'cura': {
                name: 'Cura',
                type: 'mage',
                energyCost: 45,
                cooldown: 4,
                effect: {
                    type: 'heal',
                    value: 0.4 // 40% do HP máximo
                }
            },

            // Rogue Skills
            'ataque_furtivo': {
                name: 'Ataque Furtivo',
                type: 'rogue',
                damage: 2.5,
                energyCost: 35,
                cooldown: 4,
                effect: {
                    type: 'bleed',
                    chance: 0.6
                }
            },
            'evasao': {
                name: 'Evasão',
                type: 'rogue',
                energyCost: 25,
                cooldown: 5,
                effect: {
                    type: 'dodge',
                    value: 0.8, // 80% chance de esquiva
                    duration: 2
                }
            },
            'veneno': {
                name: 'Veneno',
                type: 'rogue',
                energyCost: 30,
                cooldown: 4,
                effect: {
                    type: 'poison',
                    chance: 0.7
                }
            }
        };

        // Combat Items
        this.items = {
            'pocao_vida': {
                name: 'Poção de Vida',
                effect: {
                    type: 'heal',
                    value: 0.5 // 50% do HP máximo
                }
            },
            'pocao_energia': {
                name: 'Poção de Energia',
                effect: {
                    type: 'energy',
                    value: 50
                }
            },
            'antidoto': {
                name: 'Antídoto',
                effect: {
                    type: 'cure',
                    status: ['poison']
                }
            },
            'bandagem': {
                name: 'Bandagem',
                effect: {
                    type: 'cure',
                    status: ['bleed'],
                    heal: 30
                }
            }
        };
    }

    initializeBattle(player, enemy) {
        // Copia stats base
        const playerStats = {
            ...player.stats,
            maxHealth: player.stats.health,
            maxEnergy: player.stats.energy,
            health: player.stats.health,
            energy: player.stats.energy,
            canAct: true,
            statusEffects: [],
            skillCooldowns: {},
            buffs: {}
        };

        const enemyStats = {
            ...enemy.stats,
            maxHealth: enemy.stats.health,
            maxEnergy: enemy.stats.energy,
            health: enemy.stats.health,
            energy: enemy.stats.energy,
            canAct: true,
            statusEffects: [],
            skillCooldowns: {},
            buffs: {}
        };

        return {
            player: playerStats,
            enemy: enemyStats,
            turn: 1,
            log: []
        };
    }

    processStatusEffects(stats) {
        const effects = [];
        
        // Remove efeitos expirados
        stats.statusEffects = stats.statusEffects.filter(status => {
            if (status.duration <= 0) return false;
            
            // Aplica efeito
            const effect = this.statusEffects[status.type];
            effects.push(effect.effect(stats));
            status.duration--;
            
            return status.duration > 0;
        });

        return effects;
    }

    processCooldowns(stats) {
        // Reduz cooldowns
        Object.keys(stats.skillCooldowns).forEach(skill => {
            if (stats.skillCooldowns[skill] > 0) {
                stats.skillCooldowns[skill]--;
            }
        });
    }

    processBuffs(stats) {
        // Remove buffs expirados
        Object.keys(stats.buffs).forEach(stat => {
            stats.buffs[stat].forEach(buff => {
                if (buff.duration <= 0) {
                    // Remove efeito
                    stats[stat] /= buff.value;
                } else {
                    buff.duration--;
                }
            });
            stats.buffs[stat] = stats.buffs[stat].filter(buff => buff.duration > 0);
        });
    }

    useSkill(attacker, defender, skillId) {
        const skill = this.skills[skillId];
        if (!skill) throw new Error('❌ Habilidade não encontrada!');

        // Verifica energia
        if (attacker.energy < skill.energyCost) {
            throw new Error('❌ Energia insuficiente!');
        }

        // Verifica cooldown
        if (attacker.skillCooldowns[skillId] > 0) {
            throw new Error(`❌ Habilidade em cooldown: ${attacker.skillCooldowns[skillId]} turnos`);
        }

        // Consome energia e aplica cooldown
        attacker.energy -= skill.energyCost;
        attacker.skillCooldowns[skillId] = skill.cooldown;

        const effects = [];

        // Calcula dano
        if (skill.damage) {
            const damage = Math.floor(attacker.attack * skill.damage);
            defender.health -= damage;
            effects.push(`💥 Dano: ${damage}`);
        }

        // Aplica efeitos
        if (skill.effect) {
            switch(skill.effect.type) {
                case 'heal':
                    const heal = Math.floor(attacker.maxHealth * skill.effect.value);
                    attacker.health = Math.min(attacker.maxHealth, attacker.health + heal);
                    effects.push(`💚 Cura: ${heal}`);
                    break;

                case 'buff':
                    Object.entries(skill.effect.stats).forEach(([stat, value]) => {
                        if (!attacker.buffs[stat]) attacker.buffs[stat] = [];
                        attacker.buffs[stat].push({
                            value: value,
                            duration: skill.effect.duration
                        });
                        attacker[stat] *= value;
                        effects.push(`⬆️ ${stat}: ${(value > 1 ? '+' : '')
                            }${Math.floor((value - 1) * 100)}%`);
                    });
                    break;

                case 'dodge':
                    if (!attacker.buffs.dodge) attacker.buffs.dodge = [];
                    attacker.buffs.dodge.push({
                        value: skill.effect.value,
                        duration: skill.effect.duration
                    });
                    effects.push(`🌟 Chance de esquiva: ${skill.effect.value * 100}%`);
                    break;

                default:
                    if (Math.random() < skill.effect.chance) {
                        defender.statusEffects.push({
                            type: skill.effect.type,
                            duration: this.statusEffects[skill.effect.type].duration
                        });
                        effects.push(`${this.statusEffects[skill.effect.type].emoji} ${
                            this.statusEffects[skill.effect.type].name}`);
                    }
            }
        }

        return {
            skill: skill,
            effects: effects
        };
    }

    useItem(user, itemId) {
        const item = this.items[itemId];
        if (!item) throw new Error('❌ Item não encontrado!');

        const effects = [];

        switch(item.effect.type) {
            case 'heal':
                const heal = Math.floor(user.maxHealth * item.effect.value);
                user.health = Math.min(user.maxHealth, user.health + heal);
                effects.push(`💚 Cura: ${heal}`);
                break;

            case 'energy':
                user.energy = Math.min(user.maxEnergy, user.energy + item.effect.value);
                effects.push(`⚡ Energia: +${item.effect.value}`);
                break;

            case 'cure':
                user.statusEffects = user.statusEffects.filter(
                    status => !item.effect.status.includes(status.type)
                );
                effects.push(`✨ Curou: ${item.effect.status.join(', ')}`);
                if (item.effect.heal) {
                    user.health = Math.min(user.maxHealth, user.health + item.effect.heal);
                    effects.push(`💚 Cura: ${item.effect.heal}`);
                }
                break;
        }

        return {
            item: item,
            effects: effects
        };
    }

    processTurn(battle, action) {
        const log = [];

        // Processa efeitos do jogador
        if (battle.player.canAct) {
            const playerStatus = this.processStatusEffects(battle.player);
            if (playerStatus.length > 0) {
                log.push(`👤 *JOGADOR*\n${playerStatus.join('\n')}`);
            }
        }

        // Processa efeitos do inimigo
        if (battle.enemy.canAct) {
            const enemyStatus = this.processStatusEffects(battle.enemy);
            if (enemyStatus.length > 0) {
                log.push(`👾 *INIMIGO*\n${enemyStatus.join('\n')}`);
            }
        }

        // Processa ação do jogador
        if (battle.player.canAct && action) {
            try {
                let result;
                if (action.type === 'skill') {
                    result = this.useSkill(battle.player, battle.enemy, action.id);
                    log.push(`👤 *JOGADOR* usa ${result.skill.name}!\n${result.effects.join('\n')}`);
                } else if (action.type === 'item') {
                    result = this.useItem(battle.player, action.id);
                    log.push(`👤 *JOGADOR* usa ${result.item.name}!\n${result.effects.join('\n')}`);
                }
            } catch (e) {
                log.push(`❌ ${e.message}`);
            }
        }

        // IA do inimigo
        if (battle.enemy.canAct && battle.enemy.health > 0) {
            // Lógica simples: usa skill se possível, senão ataque básico
            const availableSkills = Object.entries(this.skills)
                .filter(([id, skill]) => 
                    battle.enemy.energy >= skill.energyCost && 
                    (!battle.enemy.skillCooldowns[id] || battle.enemy.skillCooldowns[id] <= 0)
                );

            if (availableSkills.length > 0) {
                const [skillId, skill] = availableSkills[
                    Math.floor(Math.random() * availableSkills.length)
                ];
                const result = this.useSkill(battle.enemy, battle.player, skillId);
                log.push(`👾 *INIMIGO* usa ${result.skill.name}!\n${result.effects.join('\n')}`);
            } else {
                // Ataque básico
                const damage = Math.floor(battle.enemy.attack * 
                    (0.8 + Math.random() * 0.4)); // 80-120% do ataque
                battle.player.health -= damage;
                log.push(`👾 *INIMIGO* ataca!\n💥 Dano: ${damage}`);
            }
        }

        // Processa cooldowns
        this.processCooldowns(battle.player);
        this.processCooldowns(battle.enemy);

        // Processa buffs
        this.processBuffs(battle.player);
        this.processBuffs(battle.enemy);

        // Regenera energia
        battle.player.energy = Math.min(battle.player.maxEnergy, 
            battle.player.energy + Math.floor(battle.player.maxEnergy * 0.1));
        battle.enemy.energy = Math.min(battle.enemy.maxEnergy, 
            battle.enemy.energy + Math.floor(battle.enemy.maxEnergy * 0.1));

        // Verifica fim de batalha
        if (battle.player.health <= 0) {
            log.push('💀 *DERROTA*\nVocê foi derrotado!');
            return { ended: true, victory: false, log };
        } else if (battle.enemy.health <= 0) {
            log.push('🎉 *VITÓRIA*\nVocê venceu a batalha!');
            return { ended: true, victory: true, log };
        }

        battle.turn++;
        battle.log = battle.log.concat(log);

        return { ended: false, log };
    }

    formatBattleStatus(battle) {
        let text = `⚔️ *BATALHA - TURNO ${battle.turn}* ⚔️\n\n`;

        // Status do Jogador
        text += `👤 *JOGADOR*\n`;
        text += `├ HP: ${battle.player.health}/${battle.player.maxHealth}\n`;
        text += `├ Energia: ${battle.player.energy}/${battle.player.maxEnergy}\n`;
        if (battle.player.statusEffects.length > 0) {
            text += `├ Status: ${battle.player.statusEffects.map(s => 
                this.statusEffects[s.type].emoji).join(' ')}\n`;
        }
        if (Object.keys(battle.player.buffs).length > 0) {
            text += `└ Buffs: ${Object.keys(battle.player.buffs)
                .map(buff => `${buff} (${battle.player.buffs[buff]
                    .map(b => b.duration).join(', ')})`).join(', ')}\n`;
        }
        text += '\n';

        // Status do Inimigo
        text += `👾 *INIMIGO*\n`;
        text += `├ HP: ${battle.enemy.health}/${battle.enemy.maxHealth}\n`;
        text += `├ Energia: ${battle.enemy.energy}/${battle.enemy.maxEnergy}\n`;
        if (battle.enemy.statusEffects.length > 0) {
            text += `├ Status: ${battle.enemy.statusEffects.map(s => 
                this.statusEffects[s.type].emoji).join(' ')}\n`;
        }
        if (Object.keys(battle.enemy.buffs).length > 0) {
            text += `└ Buffs: ${Object.keys(battle.enemy.buffs)
                .map(buff => `${buff} (${battle.enemy.buffs[buff]
                    .map(b => b.duration).join(', ')})`).join(', ')}\n`;
        }

        // Habilidades disponíveis
        text += `\n⚔️ *HABILIDADES*\n`;
        Object.entries(this.skills)
            .filter(([id, skill]) => skill.type === player.class)
            .forEach(([id, skill]) => {
                const cooldown = battle.player.skillCooldowns[id] || 0;
                const available = cooldown === 0 && battle.player.energy >= skill.energyCost;
                text += `${available ? '✅' : '❌'} ${skill.name}\n`;
                text += `├ Energia: ${skill.energyCost}\n`;
                if (cooldown > 0) text += `└ Cooldown: ${cooldown} turnos\n`;
                text += '\n';
            });

        return text;
    }
}

module.exports = new BattleSystem();
