class CareerSystem {
    constructor() {
        this.careers = {
            // Carreiras Comerciais
            'comerciante': {
                name: 'Comerciante',
                description: 'Especialista em compra e venda',
                baseIncome: 500,
                levels: {
                    1: {
                        title: 'Vendedor Iniciante',
                        multiplier: 1.0,
                        bonus: {
                            type: 'shop_discount',
                            value: 0.05 // 5% desconto
                        }
                    },
                    5: {
                        title: 'Vendedor Experiente',
                        multiplier: 1.5,
                        bonus: {
                            type: 'shop_discount',
                            value: 0.1
                        }
                    },
                    10: {
                        title: 'Gerente de Loja',
                        multiplier: 2.0,
                        bonus: {
                            type: 'shop_discount',
                            value: 0.15
                        }
                    },
                    20: {
                        title: 'Dono de Loja',
                        multiplier: 3.0,
                        bonus: {
                            type: 'shop_discount',
                            value: 0.2
                        }
                    },
                    30: {
                        title: 'Magnata do Comércio',
                        multiplier: 4.0,
                        bonus: {
                            type: 'shop_discount',
                            value: 0.25
                        }
                    }
                },
                skills: ['negociacao', 'marketing', 'gestao']
            },

            // Carreiras Criminosas
            'criminoso': {
                name: 'Criminoso',
                description: 'Especialista em atividades ilegais',
                baseIncome: 1000,
                risk: 0.3, // 30% chance de ser pego
                levels: {
                    1: {
                        title: 'Batedor de Carteira',
                        multiplier: 1.0,
                        bonus: {
                            type: 'crime_success',
                            value: 0.05
                        }
                    },
                    5: {
                        title: 'Assaltante',
                        multiplier: 1.5,
                        bonus: {
                            type: 'crime_success',
                            value: 0.1
                        }
                    },
                    10: {
                        title: 'Criminoso Profissional',
                        multiplier: 2.0,
                        bonus: {
                            type: 'crime_success',
                            value: 0.15
                        }
                    },
                    20: {
                        title: 'Chefe do Crime',
                        multiplier: 3.0,
                        bonus: {
                            type: 'crime_success',
                            value: 0.2
                        }
                    },
                    30: {
                        title: 'Lorde do Crime',
                        multiplier: 4.0,
                        bonus: {
                            type: 'crime_success',
                            value: 0.25
                        }
                    }
                },
                skills: ['furtividade', 'intimidacao', 'lockpicking']
            },

            // Carreiras de Aventureiro
            'aventureiro': {
                name: 'Aventureiro',
                description: 'Explorador de dungeons',
                baseIncome: 800,
                levels: {
                    1: {
                        title: 'Aventureiro Novato',
                        multiplier: 1.0,
                        bonus: {
                            type: 'dungeon_loot',
                            value: 0.05
                        }
                    },
                    5: {
                        title: 'Aventureiro Experiente',
                        multiplier: 1.5,
                        bonus: {
                            type: 'dungeon_loot',
                            value: 0.1
                        }
                    },
                    10: {
                        title: 'Explorador de Dungeons',
                        multiplier: 2.0,
                        bonus: {
                            type: 'dungeon_loot',
                            value: 0.15
                        }
                    },
                    20: {
                        title: 'Mestre Aventureiro',
                        multiplier: 3.0,
                        bonus: {
                            type: 'dungeon_loot',
                            value: 0.2
                        }
                    },
                    30: {
                        title: 'Lenda das Dungeons',
                        multiplier: 4.0,
                        bonus: {
                            type: 'dungeon_loot',
                            value: 0.25
                        }
                    }
                },
                skills: ['exploracao', 'sobrevivencia', 'combate']
            },

            // Carreiras de Artesão
            'artesao': {
                name: 'Artesão',
                description: 'Mestre na criação de itens',
                baseIncome: 600,
                levels: {
                    1: {
                        title: 'Aprendiz de Artesão',
                        multiplier: 1.0,
                        bonus: {
                            type: 'craft_quality',
                            value: 0.05
                        }
                    },
                    5: {
                        title: 'Artesão Habilidoso',
                        multiplier: 1.5,
                        bonus: {
                            type: 'craft_quality',
                            value: 0.1
                        }
                    },
                    10: {
                        title: 'Mestre Artesão',
                        multiplier: 2.0,
                        bonus: {
                            type: 'craft_quality',
                            value: 0.15
                        }
                    },
                    20: {
                        title: 'Artífice Supremo',
                        multiplier: 3.0,
                        bonus: {
                            type: 'craft_quality',
                            value: 0.2
                        }
                    },
                    30: {
                        title: 'Lenda do Artesanato',
                        multiplier: 4.0,
                        bonus: {
                            type: 'craft_quality',
                            value: 0.25
                        }
                    }
                },
                skills: ['crafting', 'reparo', 'encantamento']
            },

            // Carreiras de Fazendeiro
            'fazendeiro': {
                name: 'Fazendeiro',
                description: 'Especialista em agricultura',
                baseIncome: 400,
                levels: {
                    1: {
                        title: 'Fazendeiro Iniciante',
                        multiplier: 1.0,
                        bonus: {
                            type: 'crop_yield',
                            value: 0.05
                        }
                    },
                    5: {
                        title: 'Fazendeiro Experiente',
                        multiplier: 1.5,
                        bonus: {
                            type: 'crop_yield',
                            value: 0.1
                        }
                    },
                    10: {
                        title: 'Mestre Fazendeiro',
                        multiplier: 2.0,
                        bonus: {
                            type: 'crop_yield',
                            value: 0.15
                        }
                    },
                    20: {
                        title: 'Magnata Rural',
                        multiplier: 3.0,
                        bonus: {
                            type: 'crop_yield',
                            value: 0.2
                        }
                    },
                    30: {
                        title: 'Barão da Agricultura',
                        multiplier: 4.0,
                        bonus: {
                            type: 'crop_yield',
                            value: 0.25
                        }
                    }
                },
                skills: ['agricultura', 'pecuaria', 'irrigacao']
            }
        };

        // Habilidades de Carreira
        this.careerSkills = {
            // Comerciante
            'negociacao': {
                name: 'Negociação',
                effect: {
                    type: 'price_bonus',
                    value: 0.1 // +10% nos preços de venda
                }
            },
            'marketing': {
                name: 'Marketing',
                effect: {
                    type: 'customer_bonus',
                    value: 0.2 // +20% de clientes
                }
            },
            'gestao': {
                name: 'Gestão',
                effect: {
                    type: 'income_bonus',
                    value: 0.15 // +15% de renda
                }
            },

            // Criminoso
            'furtividade': {
                name: 'Furtividade',
                effect: {
                    type: 'stealth_bonus',
                    value: 0.2 // +20% chance de não ser pego
                }
            },
            'intimidacao': {
                name: 'Intimidação',
                effect: {
                    type: 'crime_value',
                    value: 0.3 // +30% valor do crime
                }
            },
            'lockpicking': {
                name: 'Lockpicking',
                effect: {
                    type: 'lock_bonus',
                    value: 0.25 // +25% chance de abrir fechaduras
                }
            },

            // Aventureiro
            'exploracao': {
                name: 'Exploração',
                effect: {
                    type: 'find_bonus',
                    value: 0.2 // +20% chance de encontrar itens
                }
            },
            'sobrevivencia': {
                name: 'Sobrevivência',
                effect: {
                    type: 'survival_bonus',
                    value: 0.15 // +15% resistência
                }
            },
            'combate': {
                name: 'Combate',
                effect: {
                    type: 'combat_bonus',
                    value: 0.1 // +10% dano
                }
            },

            // Artesão
            'crafting': {
                name: 'Crafting',
                effect: {
                    type: 'craft_bonus',
                    value: 0.2 // +20% qualidade
                }
            },
            'reparo': {
                name: 'Reparo',
                effect: {
                    type: 'repair_bonus',
                    value: 0.3 // +30% durabilidade
                }
            },
            'encantamento': {
                name: 'Encantamento',
                effect: {
                    type: 'enchant_bonus',
                    value: 0.25 // +25% poder de encantamentos
                }
            },

            // Fazendeiro
            'agricultura': {
                name: 'Agricultura',
                effect: {
                    type: 'crop_bonus',
                    value: 0.2 // +20% produção
                }
            },
            'pecuaria': {
                name: 'Pecuária',
                effect: {
                    type: 'animal_bonus',
                    value: 0.15 // +15% produção animal
                }
            },
            'irrigacao': {
                name: 'Irrigação',
                effect: {
                    type: 'water_bonus',
                    value: 0.25 // +25% eficiência de água
                }
            }
        };
    }

    selectCareer(player, careerId) {
        const career = this.careers[careerId];
        if (!career) throw new Error('❌ Carreira não encontrada!');

        // Inicia carreira
        player.career = {
            id: careerId,
            level: 1,
            xp: 0,
            skills: [],
            lastWork: 0
        };

        return {
            success: true,
            message: `💼 *CARREIRA INICIADA*\n\n` +
                    `${career.name}\n` +
                    `${career.description}\n\n` +
                    `Título: ${career.levels[1].title}\n` +
                    `Salário: R$ ${career.baseIncome}`
        };
    }

    work(player) {
        if (!player.career) throw new Error('❌ Você precisa escolher uma carreira!');

        // Verifica cooldown (3 horas)
        const now = Date.now();
        const cooldown = 3 * 60 * 60 * 1000;
        if (now - player.career.lastWork < cooldown) {
            const timeLeft = Math.ceil((cooldown - (now - player.career.lastWork)) / (60 * 1000));
            throw new Error(`❌ Você precisa esperar ${timeLeft} minutos para trabalhar novamente!`);
        }

        const career = this.careers[player.career.id];
        const level = this.getCurrentLevel(player.career);

        // Calcula pagamento
        let payment = career.baseIncome * level.multiplier;

        // Aplica bônus de habilidades
        player.career.skills.forEach(skillId => {
            const skill = this.careerSkills[skillId];
            if (skill.effect.type === 'income_bonus') {
                payment *= (1 + skill.effect.value);
            }
        });

        // Chance de bônus
        if (Math.random() < 0.1) { // 10% chance
            payment *= 2;
            var gotBonus = true;
        }

        // Chance de falha (apenas para criminoso)
        if (career.risk && Math.random() < career.risk) {
            payment = 0;
            var gotCaught = true;
        }

        // Atualiza último trabalho
        player.career.lastWork = now;

        // Adiciona XP
        const xpGained = Math.floor(payment * 0.1);
        player.career.xp += xpGained;

        // Verifica level up
        let levelUp = false;
        const xpNeeded = player.career.level * 1000;
        if (player.career.xp >= xpNeeded) {
            player.career.level++;
            player.career.xp -= xpNeeded;
            levelUp = true;
        }

        // Adiciona dinheiro
        player.money.wallet += payment;

        return {
            success: true,
            payment: payment,
            xp: xpGained,
            levelUp: levelUp,
            bonus: gotBonus,
            caught: gotCaught,
            message: `💼 *TRABALHO CONCLUÍDO*\n\n` +
                    `Profissão: ${career.name}\n` +
                    `Título: ${level.title}\n` +
                    (gotCaught ? '❌ Você foi pego pela polícia!\n' :
                     `💰 Pagamento: R$ ${payment}${gotBonus ? ' (Bônus!)' : ''}\n`) +
                    `✨ XP: ${xpGained}\n` +
                    (levelUp ? `\n🎉 Subiu para o nível ${player.career.level}!` : '')
        };
    }

    learnCareerSkill(player, skillId) {
        if (!player.career) throw new Error('❌ Você precisa ter uma carreira!');

        const career = this.careers[player.career.id];
        const skill = this.careerSkills[skillId];

        if (!skill) throw new Error('❌ Habilidade não encontrada!');
        if (!career.skills.includes(skillId)) {
            throw new Error('❌ Esta habilidade não pertence à sua carreira!');
        }
        if (player.career.skills.includes(skillId)) {
            throw new Error('❌ Você já possui esta habilidade!');
        }

        // Aprende habilidade
        player.career.skills.push(skillId);

        return {
            success: true,
            message: `✨ *NOVA HABILIDADE*\n\n` +
                    `${skill.name}\n` +
                    `Efeito: +${skill.effect.value * 100}% ${skill.effect.type}`
        };
    }

    getCurrentLevel(career) {
        const levels = Object.entries(this.careers[career.id].levels)
            .sort(([a], [b]) => Number(b) - Number(a));

        for (const [reqLevel, levelData] of levels) {
            if (career.level >= Number(reqLevel)) {
                return levelData;
            }
        }

        return this.careers[career.id].levels[1];
    }

    formatCareerList() {
        let text = `💼 *CARREIRAS DISPONÍVEIS* 💼\n\n`;

        Object.entries(this.careers).forEach(([id, career]) => {
            text += `*${career.name}*\n`;
            text += `├ ${career.description}\n`;
            text += `├ Salário base: R$ ${career.baseIncome}\n`;
            if (career.risk) text += `├ Risco: ${career.risk * 100}%\n`;
            text += `├ Níveis:\n`;
            Object.entries(career.levels).forEach(([level, data]) => {
                text += `│ ├ ${level}: ${data.title}\n`;
            });
            text += `└ Habilidades:\n`;
            career.skills.forEach(skillId => {
                const skill = this.careerSkills[skillId];
                text += `  └ ${skill.name}\n`;
            });
            text += '\n';
        });

        return text;
    }

    formatCareerInfo(player) {
        if (!player.career) {
            return `💼 *CARREIRA* 💼\n\n` +
                   `_Você não tem uma carreira!_\n` +
                   `Use /carreira para ver as opções.`;
        }

        const career = this.careers[player.career.id];
        const level = this.getCurrentLevel(player.career);

        let text = `💼 *SUA CARREIRA* 💼\n\n`;
        text += `*${career.name}*\n`;
        text += `├ ${career.description}\n`;
        text += `├ Nível: ${player.career.level}\n`;
        text += `├ XP: ${player.career.xp}/${player.career.level * 1000}\n`;
        text += `├ Título: ${level.title}\n`;
        text += `└ Salário: R$ ${Math.floor(career.baseIncome * level.multiplier)}\n\n`;

        if (player.career.skills.length > 0) {
            text += `*Habilidades:*\n`;
            player.career.skills.forEach(skillId => {
                const skill = this.careerSkills[skillId];
                text += `├ ${skill.name}\n`;
                text += `└ +${skill.effect.value * 100}% ${skill.effect.type}\n`;
            });
        }

        // Próximas habilidades disponíveis
        const availableSkills = career.skills
            .filter(skillId => !player.career.skills.includes(skillId));

        if (availableSkills.length > 0) {
            text += `\n*Habilidades Disponíveis:*\n`;
            availableSkills.forEach(skillId => {
                const skill = this.careerSkills[skillId];
                text += `└ ${skill.name}\n`;
            });
        }

        return text;
    }
}

module.exports = new CareerSystem();
