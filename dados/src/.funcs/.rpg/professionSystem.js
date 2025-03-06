class ProfessionSystem {
    constructor() {
        this.professions = {
            // Profissões de Coleta
            'minerador': {
                name: 'Minerador',
                description: 'Especialista em mineração e extração de recursos',
                baseStats: {
                    mining_speed: 1.2,
                    mining_luck: 1.1
                },
                skills: {
                    'veia_mineral': {
                        name: 'Veia Mineral',
                        description: 'Chance de encontrar minérios raros',
                        maxLevel: 5,
                        effect: level => ({ rare_find: 0.05 * level })
                    },
                    'eficiencia': {
                        name: 'Eficiência',
                        description: 'Aumenta velocidade de mineração',
                        maxLevel: 5,
                        effect: level => ({ mining_speed: 0.1 * level })
                    }
                }
            },
            'lenhador': {
                name: 'Lenhador',
                description: 'Especialista em coleta de madeira',
                baseStats: {
                    woodcutting_speed: 1.2,
                    wood_quality: 1.1
                },
                skills: {
                    'corte_preciso': {
                        name: 'Corte Preciso',
                        description: 'Aumenta qualidade da madeira',
                        maxLevel: 5,
                        effect: level => ({ wood_quality: 0.1 * level })
                    },
                    'olho_madeira': {
                        name: 'Olho para Madeira',
                        description: 'Chance de madeiras especiais',
                        maxLevel: 5,
                        effect: level => ({ special_wood: 0.05 * level })
                    }
                }
            },

            // Profissões de Artesanato
            'ferreiro': {
                name: 'Ferreiro',
                description: 'Especialista em forjar armas e armaduras',
                baseStats: {
                    crafting_quality: 1.2,
                    durability: 1.1
                },
                skills: {
                    'forja_quente': {
                        name: 'Forja Quente',
                        description: 'Aumenta qualidade dos itens',
                        maxLevel: 5,
                        effect: level => ({ item_quality: 0.1 * level })
                    },
                    'reforco': {
                        name: 'Reforço',
                        description: 'Aumenta durabilidade dos itens',
                        maxLevel: 5,
                        effect: level => ({ durability: 0.1 * level })
                    }
                }
            },
            'alquimista': {
                name: 'Alquimista',
                description: 'Especialista em criar poções e elixires',
                baseStats: {
                    potion_power: 1.2,
                    duration: 1.1
                },
                skills: {
                    'destilacao': {
                        name: 'Destilação',
                        description: 'Aumenta poder das poções',
                        maxLevel: 5,
                        effect: level => ({ potion_power: 0.1 * level })
                    },
                    'preservacao': {
                        name: 'Preservação',
                        description: 'Aumenta duração dos efeitos',
                        maxLevel: 5,
                        effect: level => ({ duration: 0.1 * level })
                    }
                }
            },

            // Profissões de Comércio
            'mercador': {
                name: 'Mercador',
                description: 'Especialista em comércio e negociação',
                baseStats: {
                    bargain: 1.2,
                    sell_price: 1.1
                },
                skills: {
                    'negociacao': {
                        name: 'Negociação',
                        description: 'Melhores preços nas lojas',
                        maxLevel: 5,
                        effect: level => ({ shop_prices: -0.05 * level })
                    },
                    'carisma': {
                        name: 'Carisma',
                        description: 'Vende itens por preços maiores',
                        maxLevel: 5,
                        effect: level => ({ sell_price: 0.1 * level })
                    }
                }
            },
            'banqueiro': {
                name: 'Banqueiro',
                description: 'Especialista em finanças e investimentos',
                baseStats: {
                    interest: 1.2,
                    transfer_limit: 1.1
                },
                skills: {
                    'investimento': {
                        name: 'Investimento',
                        description: 'Aumenta juros recebidos',
                        maxLevel: 5,
                        effect: level => ({ interest_rate: 0.001 * level })
                    },
                    'conexoes': {
                        name: 'Conexões',
                        description: 'Aumenta limite de transferência',
                        maxLevel: 5,
                        effect: level => ({ transfer_limit: 0.2 * level })
                    }
                }
            }
        };
    }

    learnProfession(player, professionId) {
        const profession = this.professions[professionId];
        if (!profession) throw new Error('❌ Profissão não encontrada!');

        // Verifica se já tem profissão primária/secundária
        if (!player.professions) player.professions = {};
        const profCount = Object.keys(player.professions).length;

        if (profCount >= 2) {
            throw new Error('❌ Você já tem duas profissões! Use /abandonar para remover uma.');
        }

        // Adiciona profissão
        player.professions[professionId] = {
            level: 1,
            xp: 0,
            skills: {}
        };

        // Aplica bônus base
        Object.entries(profession.baseStats).forEach(([stat, value]) => {
            if (!player.stats[stat]) player.stats[stat] = 1.0;
            player.stats[stat] *= value;
        });

        return {
            success: true,
            message: `🎓 *PROFISSÃO APRENDIDA*\n\n` +
                    `${profession.name}\n` +
                    `${profession.description}\n\n` +
                    `Bônus Base:\n` +
                    Object.entries(profession.baseStats)
                        .map(([stat, value]) => `└ ${stat}: +${((value - 1) * 100).toFixed(0)}%`)
                        .join('\n')
        };
    }

    gainProfessionXP(player, professionId, amount) {
        if (!player.professions?.[professionId]) {
            throw new Error('❌ Você não tem esta profissão!');
        }

        const prof = player.professions[professionId];
        prof.xp += amount;

        // Verifica level up
        const xpNeeded = prof.level * 1000;
        if (prof.xp >= xpNeeded) {
            prof.level++;
            prof.xp -= xpNeeded;

            // Aumenta bônus base
            const profession = this.professions[professionId];
            Object.entries(profession.baseStats).forEach(([stat, value]) => {
                player.stats[stat] *= 1.1;
            });

            return {
                levelUp: true,
                message: `📈 *LEVEL UP*\n\n` +
                        `${profession.name}\n` +
                        `Novo nível: ${prof.level}\n` +
                        `Bônus aumentados em 10%!`
            };
        }

        return {
            levelUp: false,
            xpGained: amount,
            message: `📊 *EXPERIÊNCIA*\n\n` +
                    `${this.professions[professionId].name}\n` +
                    `XP: ${prof.xp}/${xpNeeded}\n` +
                    `(+${amount} XP)`
        };
    }

    learnProfessionSkill(player, professionId, skillId) {
        if (!player.professions?.[professionId]) {
            throw new Error('❌ Você não tem esta profissão!');
        }

        const profession = this.professions[professionId];
        const skill = profession.skills[skillId];
        if (!skill) throw new Error('❌ Habilidade não encontrada!');

        const prof = player.professions[professionId];
        if (!prof.skills[skillId]) prof.skills[skillId] = 0;

        // Verifica nível da skill
        if (prof.skills[skillId] >= skill.maxLevel) {
            throw new Error('❌ Esta habilidade já está no nível máximo!');
        }

        // Verifica requisitos
        const cost = (prof.skills[skillId] + 1) * 1000;
        if (player.money.wallet < cost) {
            throw new Error(`❌ Você precisa de R$ ${cost} para aprender esta habilidade!`);
        }

        // Aprende habilidade
        player.money.wallet -= cost;
        prof.skills[skillId]++;

        // Aplica efeito
        const effect = skill.effect(prof.skills[skillId]);
        Object.entries(effect).forEach(([stat, value]) => {
            if (!player.stats[stat]) player.stats[stat] = 1.0;
            player.stats[stat] += value;
        });

        return {
            success: true,
            message: `✨ *HABILIDADE MELHORADA*\n\n` +
                    `${skill.name} ➡️ Nível ${prof.skills[skillId]}\n` +
                    `Efeito: ${Object.entries(effect)
                        .map(([stat, value]) => `${stat} ${value > 0 ? '+' : ''}${value}`)
                        .join(', ')}`
        };
    }

    abandonProfession(player, professionId) {
        if (!player.professions?.[professionId]) {
            throw new Error('❌ Você não tem esta profissão!');
        }

        const profession = this.professions[professionId];

        // Remove bônus
        Object.entries(profession.baseStats).forEach(([stat, value]) => {
            player.stats[stat] /= value;
        });

        // Remove skills
        const prof = player.professions[professionId];
        Object.entries(prof.skills).forEach(([skillId, level]) => {
            const skill = profession.skills[skillId];
            const effect = skill.effect(level);
            Object.entries(effect).forEach(([stat, value]) => {
                player.stats[stat] -= value;
            });
        });

        // Remove profissão
        delete player.professions[professionId];

        return {
            success: true,
            message: `📜 Você abandonou a profissão de ${profession.name}!`
        };
    }

    formatProfessionList() {
        let text = `🎓 *PROFISSÕES* 🎓\n\n`;

        Object.entries(this.professions).forEach(([id, prof]) => {
            text += `*${prof.name}*\n`;
            text += `├ ${prof.description}\n`;
            text += `├ Bônus Base:\n`;
            Object.entries(prof.baseStats).forEach(([stat, value]) => {
                text += `│ └ ${stat}: +${((value - 1) * 100).toFixed(0)}%\n`;
            });
            text += `└ Habilidades:\n`;
            Object.entries(prof.skills).forEach(([_, skill]) => {
                text += `  └ ${skill.name}: ${skill.description}\n`;
            });
            text += '\n';
        });

        return text;
    }

    formatProfessionInfo(player, professionId) {
        if (!player.professions?.[professionId]) {
            throw new Error('❌ Você não tem esta profissão!');
        }

        const profession = this.professions[professionId];
        const prof = player.professions[professionId];

        let text = `🎓 *${profession.name}* 🎓\n\n`;
        text += `${profession.description}\n\n`;
        text += `Nível: ${prof.level}\n`;
        text += `XP: ${prof.xp}/${prof.level * 1000}\n\n`;

        text += `*Bônus Ativos:*\n`;
        Object.entries(profession.baseStats).forEach(([stat, value]) => {
            const bonus = value * Math.pow(1.1, prof.level - 1);
            text += `├ ${stat}: +${((bonus - 1) * 100).toFixed(0)}%\n`;
        });

        text += `\n*Habilidades:*\n`;
        Object.entries(profession.skills).forEach(([id, skill]) => {
            const level = prof.skills[id] || 0;
            text += `${skill.name} (${level}/${skill.maxLevel})\n`;
            text += `├ ${skill.description}\n`;
            if (level < skill.maxLevel) {
                text += `└ Próximo nível: ${(level + 1) * 1000} moedas\n`;
            }
            text += '\n';
        });

        return text;
    }
}

module.exports = new ProfessionSystem();
