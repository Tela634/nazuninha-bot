class ClassSystem {
    constructor() {
        this.classes = {
            // Classes Básicas
            'warrior': {
                name: 'Guerreiro',
                description: 'Especialista em combate corpo a corpo',
                emoji: '⚔️',
                baseStats: {
                    health: 150,
                    energy: 100,
                    attack: 15,
                    defense: 12,
                    speed: 8
                },
                growthStats: {
                    health: 15,
                    energy: 8,
                    attack: 2,
                    defense: 1.5,
                    speed: 0.5
                },
                skills: ['golpe_pesado', 'provocar', 'berserk'],
                evolution: {
                    'knight': {
                        name: 'Cavaleiro',
                        level: 20,
                        bonusStats: {
                            health: 50,
                            defense: 5
                        },
                        newSkills: ['proteger_aliado', 'investida']
                    },
                    'berserker': {
                        name: 'Berserker',
                        level: 20,
                        bonusStats: {
                            attack: 8,
                            speed: 3
                        },
                        newSkills: ['furia_selvagem', 'execucao']
                    }
                }
            },
            'mage': {
                name: 'Mago',
                description: 'Mestre das artes arcanas',
                emoji: '🔮',
                baseStats: {
                    health: 100,
                    energy: 150,
                    attack: 18,
                    defense: 8,
                    speed: 10
                },
                growthStats: {
                    health: 8,
                    energy: 15,
                    attack: 2.5,
                    defense: 0.8,
                    speed: 0.8
                },
                skills: ['bola_fogo', 'raio', 'cura'],
                evolution: {
                    'archmage': {
                        name: 'Arquimago',
                        level: 20,
                        bonusStats: {
                            energy: 50,
                            attack: 5
                        },
                        newSkills: ['meteoro', 'time_stop']
                    },
                    'necromancer': {
                        name: 'Necromante',
                        level: 20,
                        bonusStats: {
                            health: 30,
                            energy: 30
                        },
                        newSkills: ['invocar_mortos', 'drenar_vida']
                    }
                }
            },
            'rogue': {
                name: 'Ladino',
                description: 'Mestre da furtividade e agilidade',
                emoji: '🗡️',
                baseStats: {
                    health: 120,
                    energy: 120,
                    attack: 12,
                    defense: 10,
                    speed: 15
                },
                growthStats: {
                    health: 10,
                    energy: 10,
                    attack: 1.8,
                    defense: 1,
                    speed: 1.5
                },
                skills: ['ataque_furtivo', 'evasao', 'veneno'],
                evolution: {
                    'assassin': {
                        name: 'Assassino',
                        level: 20,
                        bonusStats: {
                            attack: 6,
                            speed: 5
                        },
                        newSkills: ['assassinato', 'invisibilidade']
                    },
                    'ninja': {
                        name: 'Ninja',
                        level: 20,
                        bonusStats: {
                            energy: 40,
                            speed: 8
                        },
                        newSkills: ['jutsu_sombra', 'shuriken']
                    }
                }
            },

            // Classes Avançadas (após evolução)
            'knight': {
                name: 'Cavaleiro',
                description: 'Guardião nobre e poderoso',
                emoji: '🛡️',
                skills: ['proteger_aliado', 'investida', 'golpe_pesado', 'provocar', 'berserk'],
                requirements: {
                    class: 'warrior',
                    level: 20
                }
            },
            'berserker': {
                name: 'Berserker',
                description: 'Guerreiro furioso e implacável',
                emoji: '😡',
                skills: ['furia_selvagem', 'execucao', 'golpe_pesado', 'provocar', 'berserk'],
                requirements: {
                    class: 'warrior',
                    level: 20
                }
            },
            'archmage': {
                name: 'Arquimago',
                description: 'Mestre supremo da magia',
                emoji: '🌟',
                skills: ['meteoro', 'time_stop', 'bola_fogo', 'raio', 'cura'],
                requirements: {
                    class: 'mage',
                    level: 20
                }
            },
            'necromancer': {
                name: 'Necromante',
                description: 'Controlador dos mortos',
                emoji: '💀',
                skills: ['invocar_mortos', 'drenar_vida', 'bola_fogo', 'raio', 'cura'],
                requirements: {
                    class: 'mage',
                    level: 20
                }
            },
            'assassin': {
                name: 'Assassino',
                description: 'Mestre das sombras e morte',
                emoji: '🔪',
                skills: ['assassinato', 'invisibilidade', 'ataque_furtivo', 'evasao', 'veneno'],
                requirements: {
                    class: 'rogue',
                    level: 20
                }
            },
            'ninja': {
                name: 'Ninja',
                description: 'Mestre das artes marciais e furtividade',
                emoji: '👥',
                skills: ['jutsu_sombra', 'shuriken', 'ataque_furtivo', 'evasao', 'veneno'],
                requirements: {
                    class: 'rogue',
                    level: 20
                }
            }
        };
    }

    selectClass(player, classId) {
        const selectedClass = this.classes[classId];
        if (!selectedClass) throw new Error('❌ Classe não encontrada!');

        // Verifica requisitos para classes avançadas
        if (selectedClass.requirements) {
            if (player.class !== selectedClass.requirements.class) {
                throw new Error(`❌ Requer classe base: ${this.classes[selectedClass.requirements.class].name}`);
            }
            if (player.level < selectedClass.requirements.level) {
                throw new Error(`❌ Requer nível ${selectedClass.requirements.level}`);
            }
        }

        // Define classe
        player.class = classId;

        // Define stats base para classes iniciais
        if (selectedClass.baseStats) {
            player.stats = { ...selectedClass.baseStats };
            player.growthStats = { ...selectedClass.growthStats };
        }

        // Aplica bônus para classes avançadas
        if (selectedClass.requirements && selectedClass.requirements.class) {
            const evolution = this.classes[selectedClass.requirements.class]
                .evolution[classId];
            
            Object.entries(evolution.bonusStats).forEach(([stat, value]) => {
                player.stats[stat] += value;
            });
        }

        return {
            success: true,
            message: `🎮 *CLASSE SELECIONADA*\n\n` +
                    `${selectedClass.emoji} ${selectedClass.name}\n` +
                    `${selectedClass.description}\n\n` +
                    `*Stats Iniciais:*\n` +
                    Object.entries(player.stats)
                        .map(([stat, value]) => `├ ${stat}: ${value}`)
                        .join('\n') +
                    `\n\n*Habilidades:*\n` +
                    selectedClass.skills
                        .map(skill => `├ ${skill}`)
                        .join('\n')
        };
    }

    evolveClass(player, evolutionId) {
        const currentClass = this.classes[player.class];
        if (!currentClass.evolution?.[evolutionId]) {
            throw new Error('❌ Evolução não disponível para sua classe!');
        }

        const evolution = currentClass.evolution[evolutionId];
        if (player.level < evolution.level) {
            throw new Error(`❌ Requer nível ${evolution.level}!`);
        }

        // Aplica evolução
        return this.selectClass(player, evolutionId);
    }

    levelUp(player) {
        // Aumenta stats baseado no crescimento da classe
        if (player.growthStats) {
            Object.entries(player.growthStats).forEach(([stat, growth]) => {
                player.stats[stat] += growth;
            });
        }

        // Verifica evoluções disponíveis
        const currentClass = this.classes[player.class];
        if (currentClass.evolution) {
            const availableEvolutions = Object.entries(currentClass.evolution)
                .filter(([_, evo]) => player.level >= evo.level);

            if (availableEvolutions.length > 0) {
                return {
                    levelUp: true,
                    evolutions: availableEvolutions.map(([id, evo]) => ({
                        id: id,
                        name: evo.name,
                        bonusStats: evo.bonusStats,
                        newSkills: evo.newSkills
                    }))
                };
            }
        }

        return { levelUp: true };
    }

    formatClassList() {
        let text = `🎮 *CLASSES DISPONÍVEIS* 🎮\n\n`;

        // Classes Básicas
        text += `*CLASSES BÁSICAS*\n\n`;
        Object.entries(this.classes)
            .filter(([_, c]) => !c.requirements)
            .forEach(([id, c]) => {
                text += `${c.emoji} *${c.name}*\n`;
                text += `├ ${c.description}\n`;
                text += `├ Stats Base:\n`;
                Object.entries(c.baseStats).forEach(([stat, value]) => {
                    text += `│ ├ ${stat}: ${value}\n`;
                });
                text += `├ Habilidades:\n`;
                c.skills.forEach(skill => {
                    text += `│ ├ ${skill}\n`;
                });
                text += `└ Evoluções:\n`;
                Object.entries(c.evolution).forEach(([evoId, evo]) => {
                    text += `  ├ ${evo.name} (Nível ${evo.level})\n`;
                });
                text += '\n';
            });

        // Classes Avançadas
        text += `*CLASSES AVANÇADAS*\n\n`;
        Object.entries(this.classes)
            .filter(([_, c]) => c.requirements)
            .forEach(([id, c]) => {
                text += `${c.emoji} *${c.name}*\n`;
                text += `├ ${c.description}\n`;
                text += `├ Requer: ${this.classes[c.requirements.class].name} nível ${c.requirements.level}\n`;
                text += `└ Habilidades: ${c.skills.join(', ')}\n\n`;
            });

        return text;
    }
}

module.exports = new ClassSystem();
