class SkillSystem {
    constructor() {
        this.skills = {
            // Warrior Skills
            'golpe_pesado': {
                name: 'Golpe Pesado',
                description: 'Um poderoso golpe que pode atordoar',
                type: 'warrior',
                damage: 1.5,
                energyCost: 30,
                cooldown: 3,
                effect: {
                    type: 'stun',
                    chance: 0.3
                },
                level: 1
            },
            'provocar': {
                name: 'Provocar',
                description: 'Força o inimigo a te atacar',
                type: 'warrior',
                energyCost: 20,
                cooldown: 4,
                effect: {
                    type: 'taunt',
                    duration: 2
                },
                level: 3
            },
            'berserk': {
                name: 'Berserk',
                description: 'Aumenta ataque mas reduz defesa',
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
                },
                level: 5
            },
            'proteger_aliado': {
                name: 'Proteger Aliado',
                description: 'Protege um aliado de dano',
                type: 'knight',
                energyCost: 40,
                cooldown: 4,
                effect: {
                    type: 'protect',
                    value: 0.5, // Reduz 50% do dano
                    duration: 2
                },
                level: 20
            },
            'investida': {
                name: 'Investida',
                description: 'Avança contra o inimigo',
                type: 'knight',
                damage: 1.8,
                energyCost: 35,
                cooldown: 3,
                effect: {
                    type: 'knockback',
                    chance: 0.4
                },
                level: 20
            },
            'furia_selvagem': {
                name: 'Fúria Selvagem',
                description: 'Entra em estado de fúria',
                type: 'berserker',
                energyCost: 60,
                cooldown: 6,
                effect: {
                    type: 'buff',
                    stats: {
                        attack: 2.5,
                        speed: 1.5,
                        defense: 0.3
                    },
                    duration: 4
                },
                level: 20
            },
            'execucao': {
                name: 'Execução',
                description: 'Dano extra em inimigos fracos',
                type: 'berserker',
                damage: 2.0,
                energyCost: 45,
                cooldown: 5,
                effect: {
                    type: 'execute',
                    threshold: 0.3 // 30% HP
                },
                level: 20
            },

            // Mage Skills
            'bola_fogo': {
                name: 'Bola de Fogo',
                description: 'Lança uma bola de fogo',
                type: 'mage',
                damage: 2.0,
                energyCost: 40,
                cooldown: 3,
                effect: {
                    type: 'burn',
                    chance: 0.5
                },
                level: 1
            },
            'raio': {
                name: 'Raio',
                description: 'Dispara um raio',
                type: 'mage',
                damage: 1.8,
                energyCost: 35,
                cooldown: 2,
                effect: {
                    type: 'stun',
                    chance: 0.4
                },
                level: 3
            },
            'cura': {
                name: 'Cura',
                description: 'Restaura HP',
                type: 'mage',
                energyCost: 45,
                cooldown: 4,
                effect: {
                    type: 'heal',
                    value: 0.4 // 40% do HP máximo
                },
                level: 5
            },
            'meteoro': {
                name: 'Meteoro',
                description: 'Invoca um meteoro',
                type: 'archmage',
                damage: 3.0,
                energyCost: 80,
                cooldown: 8,
                effect: {
                    type: 'aoe',
                    value: 0.8 // 80% do dano em área
                },
                level: 20
            },
            'time_stop': {
                name: 'Parar o Tempo',
                description: 'Para o tempo brevemente',
                type: 'archmage',
                energyCost: 100,
                cooldown: 10,
                effect: {
                    type: 'timestop',
                    duration: 2
                },
                level: 20
            },
            'invocar_mortos': {
                name: 'Invocar Mortos',
                description: 'Invoca guerreiros mortos',
                type: 'necromancer',
                energyCost: 70,
                cooldown: 7,
                effect: {
                    type: 'summon',
                    amount: 2,
                    duration: 3
                },
                level: 20
            },
            'drenar_vida': {
                name: 'Drenar Vida',
                description: 'Drena vida do inimigo',
                type: 'necromancer',
                damage: 1.5,
                energyCost: 50,
                cooldown: 5,
                effect: {
                    type: 'lifesteal',
                    value: 0.8 // 80% do dano convertido em cura
                },
                level: 20
            },

            // Rogue Skills
            'ataque_furtivo': {
                name: 'Ataque Furtivo',
                description: 'Ataque surpresa com dano alto',
                type: 'rogue',
                damage: 2.5,
                energyCost: 35,
                cooldown: 4,
                effect: {
                    type: 'bleed',
                    chance: 0.6
                },
                level: 1
            },
            'evasao': {
                name: 'Evasão',
                description: 'Aumenta chance de esquiva',
                type: 'rogue',
                energyCost: 25,
                cooldown: 5,
                effect: {
                    type: 'dodge',
                    value: 0.8, // 80% chance de esquiva
                    duration: 2
                },
                level: 3
            },
            'veneno': {
                name: 'Veneno',
                description: 'Envenena o inimigo',
                type: 'rogue',
                energyCost: 30,
                cooldown: 4,
                effect: {
                    type: 'poison',
                    chance: 0.7
                },
                level: 5
            },
            'assassinato': {
                name: 'Assassinato',
                description: 'Ataque mortal',
                type: 'assassin',
                damage: 3.0,
                energyCost: 60,
                cooldown: 6,
                effect: {
                    type: 'critical',
                    value: 2.0 // 2x dano crítico
                },
                level: 20
            },
            'invisibilidade': {
                name: 'Invisibilidade',
                description: 'Fica invisível',
                type: 'assassin',
                energyCost: 50,
                cooldown: 8,
                effect: {
                    type: 'stealth',
                    duration: 3
                },
                level: 20
            },
            'jutsu_sombra': {
                name: 'Jutsu da Sombra',
                description: 'Cria clones das sombras',
                type: 'ninja',
                energyCost: 55,
                cooldown: 7,
                effect: {
                    type: 'clone',
                    amount: 2,
                    duration: 3
                },
                level: 20
            },
            'shuriken': {
                name: 'Shuriken',
                description: 'Lança shurikens',
                type: 'ninja',
                damage: 1.6,
                energyCost: 40,
                cooldown: 3,
                effect: {
                    type: 'multi_hit',
                    hits: 3
                },
                level: 20
            }
        };
    }

    learnSkill(player, skillId) {
        const skill = this.skills[skillId];
        if (!skill) throw new Error('❌ Habilidade não encontrada!');

        // Verifica se já tem a habilidade
        if (player.skills?.includes(skillId)) {
            throw new Error('❌ Você já conhece esta habilidade!');
        }

        // Verifica classe
        if (skill.type !== player.class) {
            throw new Error(`❌ Apenas ${skill.type} pode aprender esta habilidade!`);
        }

        // Verifica nível
        if (player.level < skill.level) {
            throw new Error(`❌ Requer nível ${skill.level}!`);
        }

        // Aprende habilidade
        if (!player.skills) player.skills = [];
        player.skills.push(skillId);

        return {
            success: true,
            message: `✨ *NOVA HABILIDADE*\n\n` +
                    `Aprendeu: ${skill.name}\n` +
                    `${skill.description}\n\n` +
                    `Energia: ${skill.energyCost}\n` +
                    `Recarga: ${skill.cooldown} turnos`
        };
    }

    getAvailableSkills(player) {
        return Object.entries(this.skills)
            .filter(([id, skill]) => 
                skill.type === player.class && 
                player.level >= skill.level &&
                !player.skills?.includes(id)
            )
            .map(([id, skill]) => ({
                id: id,
                ...skill
            }));
    }

    formatSkillList(player) {
        let text = `📚 *SUAS HABILIDADES* 📚\n\n`;

        if (!player.skills?.length) {
            text += `_Você não conhece nenhuma habilidade_\n`;
            text += `Use /aprendersk para aprender habilidades\n\n`;
        } else {
            player.skills.forEach(skillId => {
                const skill = this.skills[skillId];
                text += `*${skill.name}*\n`;
                text += `├ ${skill.description}\n`;
                if (skill.damage) text += `├ Dano: ${skill.damage}x\n`;
                text += `├ Energia: ${skill.energyCost}\n`;
                text += `├ Recarga: ${skill.cooldown} turnos\n`;
                if (skill.effect) {
                    text += `└ Efeito: `;
                    switch(skill.effect.type) {
                        case 'stun':
                            text += `${skill.effect.chance * 100}% chance de atordoar\n`;
                            break;
                        case 'burn':
                        case 'poison':
                        case 'bleed':
                            text += `${skill.effect.chance * 100}% chance de causar ${skill.effect.type}\n`;
                            break;
                        case 'heal':
                            text += `Cura ${skill.effect.value * 100}% do HP máximo\n`;
                            break;
                        case 'buff':
                            Object.entries(skill.effect.stats).forEach(([stat, value]) => {
                                text += `${value > 1 ? '+' : ''}${Math.floor((value - 1) * 100)}% ${stat}\n`;
                            });
                            break;
                        default:
                            text += `${skill.effect.type}\n`;
                    }
                }
                text += '\n';
            });
        }

        // Habilidades Disponíveis
        const available = this.getAvailableSkills(player);
        if (available.length > 0) {
            text += `\n✨ *HABILIDADES DISPONÍVEIS*\n\n`;
            available.forEach(skill => {
                text += `*${skill.name}*\n`;
                text += `├ ${skill.description}\n`;
                text += `└ Requer nível ${skill.level}\n\n`;
            });
        }

        return text;
    }
}

module.exports = new SkillSystem();
