class FactionSystem {
    constructor() {
        this.factions = {
            // Facções Principais
            'cavaleiros': {
                name: 'Ordem dos Cavaleiros',
                description: 'Nobres guerreiros que protegem o reino',
                alignment: 'good',
                baseStats: {
                    attack: 1.2,
                    defense: 1.3,
                    speed: 1.0
                },
                ranks: {
                    'recruta': {
                        name: 'Recruta',
                        points: 0,
                        perks: ['equipamento_basico']
                    },
                    'escudeiro': {
                        name: 'Escudeiro',
                        points: 1000,
                        perks: ['equipamento_basico', 'montaria_basica']
                    },
                    'cavaleiro': {
                        name: 'Cavaleiro',
                        points: 5000,
                        perks: ['equipamento_avancado', 'montaria_avancada']
                    },
                    'capitao': {
                        name: 'Capitão',
                        points: 20000,
                        perks: ['equipamento_elite', 'montaria_elite', 'lideranca']
                    },
                    'lorde': {
                        name: 'Lorde',
                        points: 50000,
                        perks: ['equipamento_lendario', 'montaria_lendaria', 'lideranca', 'comando']
                    }
                },
                enemies: ['necromantes', 'bandidos'],
                allies: ['magos'],
                territories: ['castelo', 'cidade_principal', 'campos'],
                specialUnits: ['cavaleiro_sagrado', 'paladino', 'templario']
            },

            'magos': {
                name: 'Círculo dos Magos',
                description: 'Mestres das artes arcanas',
                alignment: 'neutral',
                baseStats: {
                    attack: 1.5,
                    defense: 0.8,
                    speed: 1.2
                },
                ranks: {
                    'aprendiz': {
                        name: 'Aprendiz',
                        points: 0,
                        perks: ['grimorio_basico']
                    },
                    'mago': {
                        name: 'Mago',
                        points: 1000,
                        perks: ['grimorio_basico', 'familiar']
                    },
                    'arquimago': {
                        name: 'Arquimago',
                        points: 5000,
                        perks: ['grimorio_avancado', 'familiar', 'teleporte']
                    },
                    'grão_mago': {
                        name: 'Grão-Mago',
                        points: 20000,
                        perks: ['grimorio_elite', 'familiar_elite', 'teleporte', 'portal']
                    },
                    'arquimago_supremo': {
                        name: 'Arquimago Supremo',
                        points: 50000,
                        perks: ['grimorio_lendario', 'familiar_lendario', 'teleporte', 'portal', 'tempo']
                    }
                },
                enemies: ['necromantes', 'demonios'],
                allies: ['cavaleiros'],
                territories: ['torre_magica', 'biblioteca', 'laboratorio'],
                specialUnits: ['elementalista', 'cronomante', 'arquimago']
            },

            'necromantes': {
                name: 'Culto dos Necromantes',
                description: 'Mestres da morte e ressurreição',
                alignment: 'evil',
                baseStats: {
                    attack: 1.3,
                    defense: 1.0,
                    speed: 1.1
                },
                ranks: {
                    'cultista': {
                        name: 'Cultista',
                        points: 0,
                        perks: ['invocacao_basica']
                    },
                    'necromante': {
                        name: 'Necromante',
                        points: 1000,
                        perks: ['invocacao_basica', 'morto_vivo']
                    },
                    'senhor_mortos': {
                        name: 'Senhor dos Mortos',
                        points: 5000,
                        perks: ['invocacao_avancada', 'morto_vivo', 'dreno_vida']
                    },
                    'lorde_morto': {
                        name: 'Lorde Morto-Vivo',
                        points: 20000,
                        perks: ['invocacao_elite', 'morto_vivo_elite', 'dreno_vida', 'praga']
                    },
                    'rei_lich': {
                        name: 'Rei Lich',
                        points: 50000,
                        perks: ['invocacao_lendaria', 'morto_vivo_lendario', 'dreno_vida', 'praga', 'imortalidade']
                    }
                },
                enemies: ['cavaleiros', 'magos'],
                allies: ['demonios'],
                territories: ['cemiterio', 'cripta', 'catacumbas'],
                specialUnits: ['lich', 'cavaleiro_morte', 'necromante_supremo']
            },

            'demonios': {
                name: 'Legião Demoníaca',
                description: 'Servos do caos e destruição',
                alignment: 'evil',
                baseStats: {
                    attack: 1.6,
                    defense: 0.7,
                    speed: 1.3
                },
                ranks: {
                    'imp': {
                        name: 'Imp',
                        points: 0,
                        perks: ['fogo_infernal']
                    },
                    'demonio': {
                        name: 'Demônio',
                        points: 1000,
                        perks: ['fogo_infernal', 'asas']
                    },
                    'demonio_maior': {
                        name: 'Demônio Maior',
                        points: 5000,
                        perks: ['fogo_infernal_maior', 'asas', 'corrupcao']
                    },
                    'lorde_demonio': {
                        name: 'Lorde Demônio',
                        points: 20000,
                        perks: ['fogo_infernal_elite', 'asas_elite', 'corrupcao', 'portal_infernal']
                    },
                    'principe_demonio': {
                        name: 'Príncipe Demônio',
                        points: 50000,
                        perks: ['fogo_infernal_lendario', 'asas_lendarias', 'corrupcao', 'portal_infernal', 'apocalipse']
                    }
                },
                enemies: ['cavaleiros', 'magos'],
                allies: ['necromantes'],
                territories: ['inferno', 'portal_abissal', 'terra_corrompida'],
                specialUnits: ['demonio_elite', 'succubus', 'lorde_abissal']
            }
        };

        // Perks das Facções
        this.perks = {
            // Equipamentos
            'equipamento_basico': {
                name: 'Equipamento Básico',
                effect: {
                    type: 'stats',
                    stats: {
                        attack: 1.1,
                        defense: 1.1
                    }
                }
            },
            'equipamento_avancado': {
                name: 'Equipamento Avançado',
                effect: {
                    type: 'stats',
                    stats: {
                        attack: 1.2,
                        defense: 1.2
                    }
                }
            },
            'equipamento_elite': {
                name: 'Equipamento de Elite',
                effect: {
                    type: 'stats',
                    stats: {
                        attack: 1.3,
                        defense: 1.3
                    }
                }
            },
            'equipamento_lendario': {
                name: 'Equipamento Lendário',
                effect: {
                    type: 'stats',
                    stats: {
                        attack: 1.5,
                        defense: 1.5
                    }
                }
            },

            // Montarias
            'montaria_basica': {
                name: 'Montaria Básica',
                effect: {
                    type: 'mount',
                    speed: 1.2
                }
            },
            'montaria_avancada': {
                name: 'Montaria Avançada',
                effect: {
                    type: 'mount',
                    speed: 1.4
                }
            },
            'montaria_elite': {
                name: 'Montaria de Elite',
                effect: {
                    type: 'mount',
                    speed: 1.6,
                    combat: true
                }
            },
            'montaria_lendaria': {
                name: 'Montaria Lendária',
                effect: {
                    type: 'mount',
                    speed: 2.0,
                    combat: true,
                    fly: true
                }
            },

            // Magias
            'grimorio_basico': {
                name: 'Grimório Básico',
                effect: {
                    type: 'magic',
                    spells: ['bola_fogo', 'escudo_magico']
                }
            },
            'grimorio_avancado': {
                name: 'Grimório Avançado',
                effect: {
                    type: 'magic',
                    spells: ['bola_fogo', 'escudo_magico', 'teleporte', 'meteoro']
                }
            },
            'grimorio_elite': {
                name: 'Grimório de Elite',
                effect: {
                    type: 'magic',
                    spells: ['bola_fogo', 'escudo_magico', 'teleporte', 'meteoro', 'tempo_lento']
                }
            },
            'grimorio_lendario': {
                name: 'Grimório Lendário',
                effect: {
                    type: 'magic',
                    spells: ['bola_fogo', 'escudo_magico', 'teleporte', 'meteoro', 'tempo_lento', 'apocalipse']
                }
            },

            // Habilidades Especiais
            'lideranca': {
                name: 'Liderança',
                effect: {
                    type: 'command',
                    troops: 5,
                    bonus: 1.2
                }
            },
            'comando': {
                name: 'Comando',
                effect: {
                    type: 'command',
                    troops: 10,
                    bonus: 1.5
                }
            },
            'familiar': {
                name: 'Familiar',
                effect: {
                    type: 'pet',
                    stats: {
                        attack: 100,
                        defense: 50
                    }
                }
            },
            'familiar_elite': {
                name: 'Familiar de Elite',
                effect: {
                    type: 'pet',
                    stats: {
                        attack: 300,
                        defense: 150
                    }
                }
            },
            'familiar_lendario': {
                name: 'Familiar Lendário',
                effect: {
                    type: 'pet',
                    stats: {
                        attack: 1000,
                        defense: 500
                    }
                }
            }
        };

        // Sistema de Guerra
        this.warSystem = {
            preparationTime: 86400000, // 24 horas
            duration: 604800000, // 7 dias
            minParticipants: 10,
            territoryPoints: {
                capital: 100,
                city: 50,
                outpost: 20
            },
            rewards: {
                winner: {
                    money: 1000000,
                    points: 10000,
                    items: ['banner_vitorioso', 'titulo_conquistador']
                },
                participant: {
                    money: 100000,
                    points: 1000
                }
            }
        };
    }

    joinFaction(player, factionId) {
        const faction = this.factions[factionId];
        if (!faction) throw new Error('❌ Facção não encontrada!');

        // Verifica se já está em uma facção
        if (player.faction) {
            throw new Error('❌ Você já está em uma facção! Use /sairfaccao primeiro.');
        }

        // Inicia na facção
        player.faction = {
            id: factionId,
            rank: Object.keys(faction.ranks)[0],
            points: 0,
            joinedAt: Date.now()
        };

        // Aplica bônus base da facção
        Object.entries(faction.baseStats).forEach(([stat, value]) => {
            player.stats[stat] *= value;
        });

        return {
            success: true,
            message: `⚔️ *FACÇÃO ESCOLHIDA*\n\n` +
                    `${faction.name}\n` +
                    `${faction.description}\n\n` +
                    `Rank: ${faction.ranks[player.faction.rank].name}\n` +
                    `Bônus:\n` +
                    Object.entries(faction.baseStats)
                        .map(([stat, value]) => `└ ${stat}: ${(value * 100 - 100)}%`)
                        .join('\n')
        };
    }

    earnPoints(player, amount) {
        if (!player.faction) throw new Error('❌ Você não está em uma facção!');

        const faction = this.factions[player.faction.id];
        player.faction.points += amount;

        // Verifica rank up
        const ranks = Object.entries(faction.ranks)
            .sort(([_, a], [__, b]) => b.points - a.points);

        for (const [rankId, rank] of ranks) {
            if (player.faction.points >= rank.points && rankId !== player.faction.rank) {
                player.faction.rank = rankId;
                return {
                    rankUp: true,
                    newRank: rank.name,
                    message: `✨ *RANK UP*\n\n` +
                            `Novo rank: ${rank.name}\n` +
                            `Novos perks:\n` +
                            rank.perks.map(perk => `└ ${this.perks[perk].name}`).join('\n')
                };
            }
        }

        return { rankUp: false };
    }

    declareWar(faction1Id, faction2Id) {
        const faction1 = this.factions[faction1Id];
        const faction2 = this.factions[faction2Id];

        if (!faction1 || !faction2) throw new Error('❌ Facção não encontrada!');

        // Cria guerra
        const war = {
            id: `war_${Date.now()}`,
            faction1: faction1Id,
            faction2: faction2Id,
            participants: {
                [faction1Id]: [],
                [faction2Id]: []
            },
            territories: {
                [faction1Id]: [],
                [faction2Id]: []
            },
            points: {
                [faction1Id]: 0,
                [faction2Id]: 0
            },
            startTime: Date.now() + this.warSystem.preparationTime,
            endTime: Date.now() + this.warSystem.preparationTime + this.warSystem.duration,
            status: 'preparing' // preparing, active, ended
        };

        return {
            success: true,
            war: war,
            message: `⚔️ *GUERRA DECLARADA*\n\n` +
                    `${faction1.name} vs ${faction2.name}\n\n` +
                    `Preparação: 24 horas\n` +
                    `Duração: 7 dias\n\n` +
                    `Use /entrarguerra para participar!`
        };
    }

    joinWar(war, player) {
        if (!player.faction) throw new Error('❌ Você não está em uma facção!');
        if (war.status !== 'preparing') throw new Error('❌ A guerra já começou!');
        if (![war.faction1, war.faction2].includes(player.faction.id)) {
            throw new Error('❌ Sua facção não está nesta guerra!');
        }

        // Adiciona participante
        war.participants[player.faction.id].push(player.id);

        return {
            success: true,
            message: `⚔️ Você entrou na guerra!\n` +
                    `Participantes da sua facção: ${war.participants[player.faction.id].length}`
        };
    }

    startWar(war) {
        // Verifica mínimo de participantes
        if (Object.values(war.participants).some(p => p.length < this.warSystem.minParticipants)) {
            throw new Error('❌ Mínimo de participantes não atingido!');
        }

        war.status = 'active';

        return {
            success: true,
            message: `⚔️ *A GUERRA COMEÇOU*\n\n` +
                    `${this.factions[war.faction1].name}: ${war.participants[war.faction1].length} guerreiros\n` +
                    `${this.factions[war.faction2].name}: ${war.participants[war.faction2].length} guerreiros\n\n` +
                    `Que vença o melhor!`
        };
    }

    captureTerritory(war, territory, player) {
        if (!player.faction) throw new Error('❌ Você não está em uma facção!');
        if (war.status !== 'active') throw new Error('❌ A guerra não está ativa!');
        if (![war.faction1, war.faction2].includes(player.faction.id)) {
            throw new Error('❌ Sua facção não está nesta guerra!');
        }

        // Captura território
        war.territories[player.faction.id].push(territory);
        war.points[player.faction.id] += this.warSystem.territoryPoints[territory.type];

        return {
            success: true,
            message: `🏰 *TERRITÓRIO CAPTURADO*\n\n` +
                    `${territory.name}\n` +
                    `+${this.warSystem.territoryPoints[territory.type]} pontos\n\n` +
                    `Pontuação atual:\n` +
                    `${this.factions[war.faction1].name}: ${war.points[war.faction1]}\n` +
                    `${this.factions[war.faction2].name}: ${war.points[war.faction2]}`
        };
    }

    endWar(war) {
        war.status = 'ended';

        // Determina vencedor
        const winner = war.points[war.faction1] > war.points[war.faction2] ? 
            war.faction1 : war.faction2;

        // Distribui recompensas
        const rewards = {
            [winner]: {
                ...this.warSystem.rewards.winner,
                territories: war.territories[winner]
            },
            [winner === war.faction1 ? war.faction2 : war.faction1]: {
                ...this.warSystem.rewards.participant
            }
        };

        return {
            success: true,
            winner: winner,
            rewards: rewards,
            message: `🏆 *GUERRA TERMINADA*\n\n` +
                    `Vencedor: ${this.factions[winner].name}\n\n` +
                    `Pontuação Final:\n` +
                    `${this.factions[war.faction1].name}: ${war.points[war.faction1]}\n` +
                    `${this.factions[war.faction2].name}: ${war.points[war.faction2]}\n\n` +
                    `Territórios Conquistados: ${war.territories[winner].length}\n` +
                    `Recompensas distribuídas aos participantes!`
        };
    }

    formatFactionList() {
        let text = `⚔️ *FACÇÕES* ⚔️\n\n`;

        Object.entries(this.factions).forEach(([id, faction]) => {
            text += `*${faction.name}*\n`;
            text += `├ ${faction.description}\n`;
            text += `├ Alinhamento: ${faction.alignment}\n`;
            text += `├ Bônus:\n`;
            Object.entries(faction.baseStats).forEach(([stat, value]) => {
                text += `│ └ ${stat}: ${(value * 100 - 100)}%\n`;
            });
            text += `├ Ranks:\n`;
            Object.entries(faction.ranks).forEach(([_, rank]) => {
                text += `│ └ ${rank.name} (${rank.points} pontos)\n`;
            });
            text += `├ Aliados: ${faction.allies.map(a => this.factions[a].name).join(', ')}\n`;
            text += `├ Inimigos: ${faction.enemies.map(e => this.factions[e].name).join(', ')}\n`;
            text += `└ Territórios: ${faction.territories.join(', ')}\n\n`;
        });

        return text;
    }

    formatFactionInfo(player) {
        if (!player.faction) {
            return `⚔️ *FACÇÃO* ⚔️\n\n` +
                   `_Você não está em uma facção!_\n` +
                   `Use /facção para ver as opções.`;
        }

        const faction = this.factions[player.faction.id];
        const rank = faction.ranks[player.faction.rank];

        let text = `⚔️ *SUA FACÇÃO* ⚔️\n\n`;
        text += `*${faction.name}*\n`;
        text += `├ ${faction.description}\n`;
        text += `├ Rank: ${rank.name}\n`;
        text += `├ Pontos: ${player.faction.points}\n`;
        text += `├ Próximo rank: `;

        // Encontra próximo rank
        const ranks = Object.entries(faction.ranks)
            .sort(([_, a], [__, b]) => a.points - b.points);
        
        const nextRank = ranks.find(([_, r]) => r.points > player.faction.points);
        if (nextRank) {
            text += `${nextRank[1].name} (${nextRank[1].points - player.faction.points} pontos)\n`;
        } else {
            text += `Rank máximo atingido!\n`;
        }

        text += `└ Perks ativos:\n`;
        rank.perks.forEach(perk => {
            const perkInfo = this.perks[perk];
            text += `  └ ${perkInfo.name}\n`;
        });

        return text;
    }
}

module.exports = new FactionSystem();
