class AchievementSystem {
    constructor() {
        this.achievements = {
            // Conquistas de Nível
            'level': {
                'level_10': {
                    name: 'Iniciante',
                    description: 'Alcance o nível 10',
                    type: 'level',
                    requirement: 10,
                    rewards: {
                        money: 5000,
                        xp: 2000,
                        title: 'Novato'
                    }
                },
                'level_50': {
                    name: 'Veterano',
                    description: 'Alcance o nível 50',
                    type: 'level',
                    requirement: 50,
                    rewards: {
                        money: 50000,
                        xp: 20000,
                        title: 'Veterano'
                    }
                },
                'level_100': {
                    name: 'Mestre',
                    description: 'Alcance o nível 100',
                    type: 'level',
                    requirement: 100,
                    rewards: {
                        money: 200000,
                        xp: 100000,
                        title: 'Mestre'
                    }
                }
            },

            // Conquistas de Combate
            'combat': {
                'kill_1000': {
                    name: 'Caçador',
                    description: 'Derrote 1000 monstros',
                    type: 'kills',
                    requirement: 1000,
                    rewards: {
                        money: 10000,
                        xp: 5000,
                        title: 'Caçador'
                    }
                },
                'boss_50': {
                    name: 'Matador de Chefes',
                    description: 'Derrote 50 chefes',
                    type: 'boss_kills',
                    requirement: 50,
                    rewards: {
                        money: 100000,
                        xp: 50000,
                        title: 'Matador de Chefes'
                    }
                },
                'pvp_500': {
                    name: 'Guerreiro PvP',
                    description: 'Vença 500 batalhas PvP',
                    type: 'pvp_wins',
                    requirement: 500,
                    rewards: {
                        money: 50000,
                        xp: 25000,
                        title: 'Guerreiro PvP'
                    }
                }
            },

            // Conquistas de Mineração
            'mining': {
                'mine_10000': {
                    name: 'Minerador Experiente',
                    description: 'Minere 10000 recursos',
                    type: 'mining',
                    requirement: 10000,
                    rewards: {
                        money: 20000,
                        xp: 10000,
                        title: 'Minerador'
                    }
                },
                'gems_1000': {
                    name: 'Caçador de Gemas',
                    description: 'Encontre 1000 gemas',
                    type: 'gems',
                    requirement: 1000,
                    rewards: {
                        money: 100000,
                        xp: 50000,
                        title: 'Gemólogo'
                    }
                }
            },

            // Conquistas de Pesca
            'fishing': {
                'fish_5000': {
                    name: 'Pescador Mestre',
                    description: 'Pesque 5000 peixes',
                    type: 'fishing',
                    requirement: 5000,
                    rewards: {
                        money: 15000,
                        xp: 7500,
                        title: 'Pescador'
                    }
                },
                'rare_fish_100': {
                    name: 'Pescador Lendário',
                    description: 'Pesque 100 peixes raros',
                    type: 'rare_fish',
                    requirement: 100,
                    rewards: {
                        money: 50000,
                        xp: 25000,
                        title: 'Pescador Lendário'
                    }
                }
            },

            // Conquistas de Fazenda
            'farming': {
                'harvest_10000': {
                    name: 'Fazendeiro Dedicado',
                    description: 'Colha 10000 plantas',
                    type: 'harvest',
                    requirement: 10000,
                    rewards: {
                        money: 25000,
                        xp: 12500,
                        title: 'Fazendeiro'
                    }
                },
                'perfect_crops_1000': {
                    name: 'Mestre Fazendeiro',
                    description: 'Colha 1000 plantas perfeitas',
                    type: 'perfect_crops',
                    requirement: 1000,
                    rewards: {
                        money: 75000,
                        xp: 35000,
                        title: 'Mestre Fazendeiro'
                    }
                }
            },

            // Conquistas de Culinária
            'cooking': {
                'cook_5000': {
                    name: 'Chef Experiente',
                    description: 'Prepare 5000 refeições',
                    type: 'cooking',
                    requirement: 5000,
                    rewards: {
                        money: 20000,
                        xp: 10000,
                        title: 'Chef'
                    }
                },
                'perfect_dishes_500': {
                    name: 'Chef Estrelado',
                    description: 'Prepare 500 pratos perfeitos',
                    type: 'perfect_dishes',
                    requirement: 500,
                    rewards: {
                        money: 100000,
                        xp: 50000,
                        title: 'Chef Estrelado'
                    }
                }
            },

            // Conquistas de Pet
            'pet': {
                'max_level_pet': {
                    name: 'Mestre dos Pets',
                    description: 'Tenha um pet nível máximo',
                    type: 'pet_level',
                    requirement: 50,
                    rewards: {
                        money: 50000,
                        xp: 25000,
                        title: 'Mestre dos Pets'
                    }
                },
                'evolve_10_pets': {
                    name: 'Evolucionista',
                    description: 'Evolua 10 pets',
                    type: 'pet_evolution',
                    requirement: 10,
                    rewards: {
                        money: 100000,
                        xp: 50000,
                        title: 'Evolucionista'
                    }
                }
            },

            // Conquistas de Território
            'territory': {
                'conquer_20': {
                    name: 'Conquistador',
                    description: 'Conquiste 20 territórios',
                    type: 'territories',
                    requirement: 20,
                    rewards: {
                        money: 200000,
                        xp: 100000,
                        title: 'Conquistador'
                    }
                },
                'defend_100': {
                    name: 'Defensor Supremo',
                    description: 'Defenda territórios 100 vezes',
                    type: 'territory_defenses',
                    requirement: 100,
                    rewards: {
                        money: 150000,
                        xp: 75000,
                        title: 'Defensor'
                    }
                }
            },

            // Conquistas de Facção
            'faction': {
                'faction_leader': {
                    name: 'Líder de Facção',
                    description: 'Torne-se líder de uma facção',
                    type: 'faction_rank',
                    requirement: 'leader',
                    rewards: {
                        money: 500000,
                        xp: 250000,
                        title: 'Líder'
                    }
                },
                'faction_wars_100': {
                    name: 'Veterano de Guerra',
                    description: 'Participe de 100 guerras de facção',
                    type: 'faction_wars',
                    requirement: 100,
                    rewards: {
                        money: 200000,
                        xp: 100000,
                        title: 'Veterano de Guerra'
                    }
                }
            },

            // Conquistas de Riqueza
            'wealth': {
                'millionaire': {
                    name: 'Milionário',
                    description: 'Acumule 1.000.000 de dinheiro',
                    type: 'total_money',
                    requirement: 1000000,
                    rewards: {
                        xp: 100000,
                        title: 'Milionário'
                    }
                },
                'billionaire': {
                    name: 'Bilionário',
                    description: 'Acumule 1.000.000.000 de dinheiro',
                    type: 'total_money',
                    requirement: 1000000000,
                    rewards: {
                        xp: 1000000,
                        title: 'Bilionário'
                    }
                }
            }
        };
    }

    checkAchievement(player, type, value) {
        let completed = [];

        // Procura conquistas do tipo
        Object.entries(this.achievements).forEach(([category, achievements]) => {
            Object.entries(achievements).forEach(([id, achievement]) => {
                // Verifica se já completou
                if (player.achievements?.includes(id)) return;

                // Verifica se é do tipo correto
                if (achievement.type !== type) return;

                // Verifica se completou
                if (value >= achievement.requirement) {
                    completed.push({
                        id: id,
                        ...achievement
                    });
                }
            });
        });

        return completed;
    }

    completeAchievement(player, achievementId) {
        let category, achievement;

        // Encontra a conquista
        Object.entries(this.achievements).forEach(([cat, achievements]) => {
            if (achievements[achievementId]) {
                category = cat;
                achievement = achievements[achievementId];
            }
        });

        if (!achievement) throw new Error('❌ Conquista não encontrada!');

        // Adiciona conquista
        if (!player.achievements) player.achievements = [];
        player.achievements.push(achievementId);

        // Adiciona recompensas
        if (achievement.rewards.money) {
            player.money.wallet += achievement.rewards.money;
        }
        if (achievement.rewards.xp) {
            player.xp += achievement.rewards.xp;
        }
        if (achievement.rewards.title) {
            if (!player.titles) player.titles = [];
            player.titles.push(achievement.rewards.title);
        }

        return {
            success: true,
            achievement: achievement,
            message: `🏆 *CONQUISTA DESBLOQUEADA!*\n\n` +
                    `${achievement.name}\n` +
                    `${achievement.description}\n\n` +
                    `💰 Recompensas:\n` +
                    (achievement.rewards.money ? `├ R$ ${achievement.rewards.money}\n` : '') +
                    (achievement.rewards.xp ? `├ ${achievement.rewards.xp} XP\n` : '') +
                    (achievement.rewards.title ? `└ Título: ${achievement.rewards.title}` : '')
        };
    }

    formatAchievementList(player) {
        let text = `🏆 *CONQUISTAS* 🏆\n\n`;

        Object.entries(this.achievements).forEach(([category, achievements]) => {
            text += `*${category.toUpperCase()}*\n\n`;

            Object.entries(achievements).forEach(([id, achievement]) => {
                const completed = player.achievements?.includes(id);
                text += `${completed ? '✅' : '❌'} *${achievement.name}*\n`;
                text += `├ ${achievement.description}\n`;
                text += `└ Recompensas:\n`;
                if (achievement.rewards.money) text += `  ├ R$ ${achievement.rewards.money}\n`;
                if (achievement.rewards.xp) text += `  ├ ${achievement.rewards.xp} XP\n`;
                if (achievement.rewards.title) text += `  └ Título: ${achievement.rewards.title}\n`;
                text += '\n';
            });
        });

        return text;
    }

    getProgress(player, type) {
        let progress = [];

        Object.entries(this.achievements).forEach(([category, achievements]) => {
            Object.entries(achievements).forEach(([id, achievement]) => {
                if (achievement.type === type) {
                    const completed = player.achievements?.includes(id);
                    progress.push({
                        id: id,
                        name: achievement.name,
                        requirement: achievement.requirement,
                        completed: completed
                    });
                }
            });
        });

        return progress;
    }
}

module.exports = new AchievementSystem();
