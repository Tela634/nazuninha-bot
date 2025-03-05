class GangSystem {
    constructor() {
        // Tipos de Gangue
        this.gangTypes = {
            'mafia': {
                name: 'Máfia',
                description: 'Organização criminosa tradicional',
                baseStats: {
                    influence: 1.2,
                    stealth: 1.0,
                    combat: 1.1
                },
                specialties: ['extorsao', 'lavagem_dinheiro', 'protecao'],
                maxMembers: 20,
                territories: ['distrito_comercial', 'porto', 'bairro_rico']
            },
            'yakuza': {
                name: 'Yakuza',
                description: 'Sindicato do crime organizado',
                baseStats: {
                    influence: 1.3,
                    stealth: 1.1,
                    combat: 1.0
                },
                specialties: ['cassino', 'contrabando', 'chantagem'],
                maxMembers: 15,
                territories: ['distrito_entretenimento', 'mercado_negro', 'zona_portuaria']
            },
            'cartel': {
                name: 'Cartel',
                description: 'Organização de tráfico internacional',
                baseStats: {
                    influence: 1.0,
                    stealth: 1.2,
                    combat: 1.3
                },
                specialties: ['trafico', 'contrabando', 'corrupcao'],
                maxMembers: 25,
                territories: ['armazem', 'fronteira', 'favela']
            },
            'cyber_gang': {
                name: 'Gangue Cyber',
                description: 'Criminosos tecnológicos',
                baseStats: {
                    influence: 1.1,
                    stealth: 1.3,
                    combat: 0.9
                },
                specialties: ['hacking', 'fraude', 'espionagem'],
                maxMembers: 10,
                territories: ['distrito_tecnologico', 'centro_dados', 'zona_industrial']
            }
        };

        // Hierarquia
        this.ranks = {
            'recruta': {
                name: 'Recruta',
                influence: 0,
                permissions: ['basic_missions']
            },
            'soldado': {
                name: 'Soldado',
                influence: 1000,
                permissions: ['basic_missions', 'territory_defense']
            },
            'capanga': {
                name: 'Capanga',
                influence: 5000,
                permissions: ['basic_missions', 'territory_defense', 'recruit']
            },
            'tenente': {
                name: 'Tenente',
                influence: 20000,
                permissions: ['basic_missions', 'territory_defense', 'recruit', 'territory_attack']
            },
            'capitao': {
                name: 'Capitão',
                influence: 50000,
                permissions: ['all']
            },
            'sub_chefe': {
                name: 'Sub-Chefe',
                influence: 100000,
                permissions: ['all']
            },
            'chefe': {
                name: 'Chefe',
                influence: 200000,
                permissions: ['all']
            }
        };

        // Especialidades
        this.specialties = {
            'extorsao': {
                name: 'Extorsão',
                description: 'Cobrar proteção de estabelecimentos',
                baseIncome: 5000,
                risk: 0.3,
                cooldown: 3600000 // 1 hora
            },
            'lavagem_dinheiro': {
                name: 'Lavagem de Dinheiro',
                description: 'Limpar dinheiro sujo',
                baseIncome: 10000,
                risk: 0.4,
                cooldown: 7200000 // 2 horas
            },
            'contrabando': {
                name: 'Contrabando',
                description: 'Traficar mercadorias ilegais',
                baseIncome: 15000,
                risk: 0.5,
                cooldown: 14400000 // 4 horas
            },
            'cassino': {
                name: 'Cassino Ilegal',
                description: 'Operar jogos de azar',
                baseIncome: 20000,
                risk: 0.3,
                cooldown: 10800000 // 3 horas
            },
            'trafico': {
                name: 'Tráfico',
                description: 'Vender mercadorias ilegais',
                baseIncome: 25000,
                risk: 0.6,
                cooldown: 21600000 // 6 horas
            },
            'hacking': {
                name: 'Hacking',
                description: 'Crimes cibernéticos',
                baseIncome: 30000,
                risk: 0.4,
                cooldown: 18000000 // 5 horas
            }
        };

        // Sistema de Guerra
        this.warSystem = {
            minMembers: 5,
            preparationTime: 86400000, // 24 horas
            duration: 604800000, // 7 dias
            rewards: {
                territory: true,
                money: 100000,
                influence: 10000
            }
        };

        // Sistema de Alianças
        this.allianceSystem = {
            maxAllies: 2,
            benefits: {
                shared_territory: true,
                combat_assistance: true,
                trade_bonus: 1.2
            }
        };
    }

    createGang(leader, name, type) {
        const gangType = this.gangTypes[type];
        if (!gangType) throw new Error('❌ Tipo de gangue inválido!');

        // Verifica requisitos
        if (leader.level < 10) {
            throw new Error('❌ Você precisa ser nível 10 para criar uma gangue!');
        }

        if (leader.money.wallet < 100000) {
            throw new Error('❌ Você precisa de R$ 100.000 para criar uma gangue!');
        }

        // Cria gangue
        const gang = {
            id: `gang_${Date.now()}`,
            name: name,
            type: type,
            leader: leader.id,
            members: [leader.id],
            ranks: {
                [leader.id]: 'chefe'
            },
            influence: 0,
            money: 0,
            territories: [],
            allies: [],
            enemies: [],
            stats: { ...gangType.baseStats },
            createdAt: Date.now()
        };

        // Remove dinheiro
        leader.money.wallet -= 100000;

        return {
            success: true,
            gang: gang,
            message: `🎭 *GANGUE CRIADA*\n\n` +
                    `${name} (${gangType.name})\n\n` +
                    `Stats:\n` +
                    Object.entries(gang.stats)
                        .map(([stat, value]) => `└ ${stat}: ${value}`)
                        .join('\n') +
                    `\n\nEspecialidades:\n` +
                    gangType.specialties
                        .map(s => `└ ${this.specialties[s].name}`)
                        .join('\n')
        };
    }

    joinGang(gang, player) {
        // Verifica limite de membros
        if (gang.members.length >= this.gangTypes[gang.type].maxMembers) {
            throw new Error('❌ Gangue está cheia!');
        }

        // Adiciona membro
        gang.members.push(player.id);
        gang.ranks[player.id] = 'recruta';

        return {
            success: true,
            message: `🎭 Você entrou na gangue ${gang.name}!`
        };
    }

    promoteGangMember(gang, promoter, member, newRank) {
        // Verifica permissão
        if (!this.hasPermission(gang, promoter.id, 'promote')) {
            throw new Error('❌ Você não tem permissão para promover membros!');
        }

        // Verifica ranking
        const promoterRank = this.getRankLevel(gang.ranks[promoter.id]);
        const memberRank = this.getRankLevel(gang.ranks[member]);
        const newRankLevel = this.getRankLevel(newRank);

        if (promoterRank <= memberRank || promoterRank <= newRankLevel) {
            throw new Error('❌ Você não pode promover para um rank igual ou superior ao seu!');
        }

        // Promove membro
        gang.ranks[member] = newRank;

        return {
            success: true,
            message: `👑 @${member.split('@')[0]} foi promovido para ${this.ranks[newRank].name}!`
        };
    }

    executeSpecialty(gang, player, specialty) {
        const spec = this.specialties[specialty];
        if (!spec) throw new Error('❌ Especialidade não encontrada!');

        // Verifica se gangue tem especialidade
        if (!this.gangTypes[gang.type].specialties.includes(specialty)) {
            throw new Error('❌ Sua gangue não tem esta especialidade!');
        }

        // Verifica cooldown
        const lastUse = gang.lastSpecialty?.[specialty] || 0;
        if (Date.now() - lastUse < spec.cooldown) {
            const timeLeft = Math.ceil((spec.cooldown - (Date.now() - lastUse)) / (60 * 1000));
            throw new Error(`❌ Aguarde ${timeLeft} minutos para usar esta especialidade!`);
        }

        // Calcula resultado
        const success = Math.random() > spec.risk;
        const income = success ? Math.floor(spec.baseIncome * (0.8 + Math.random() * 0.4)) : 0;

        // Atualiza gangue
        if (!gang.lastSpecialty) gang.lastSpecialty = {};
        gang.lastSpecialty[specialty] = Date.now();
        
        if (success) {
            gang.money += income;
            gang.influence += Math.floor(income * 0.1);
        }

        return {
            success: success,
            income: income,
            message: success ?
                `💰 *${spec.name} BEM SUCEDIDA*\n\n` +
                `Lucro: R$ ${income}\n` +
                `Influência: +${Math.floor(income * 0.1)}` :
                `❌ *${spec.name} FALHOU*\n\n` +
                `A polícia estava de olho...`
        };
    }

    declareWar(gang1, gang2) {
        // Verifica requisitos
        if (gang1.members.length < this.warSystem.minMembers || 
            gang2.members.length < this.warSystem.minMembers) {
            throw new Error(`❌ Mínimo de ${this.warSystem.minMembers} membros por gangue!`);
        }

        // Cria guerra
        const war = {
            id: `war_${Date.now()}`,
            gang1: gang1.id,
            gang2: gang2.id,
            territories: [],
            points: {
                [gang1.id]: 0,
                [gang2.id]: 0
            },
            startTime: Date.now() + this.warSystem.preparationTime,
            endTime: Date.now() + this.warSystem.preparationTime + this.warSystem.duration,
            status: 'preparing' // preparing, active, ended
        };

        return {
            success: true,
            war: war,
            message: `⚔️ *GUERRA DECLARADA*\n\n` +
                    `${gang1.name} vs ${gang2.name}\n\n` +
                    `Preparação: 24 horas\n` +
                    `Duração: 7 dias`
        };
    }

    formAlliance(gang1, gang2) {
        // Verifica limite de aliados
        if (gang1.allies.length >= this.allianceSystem.maxAllies) {
            throw new Error('❌ Limite de alianças atingido!');
        }

        // Forma aliança
        gang1.allies.push(gang2.id);
        gang2.allies.push(gang1.id);

        return {
            success: true,
            message: `🤝 *ALIANÇA FORMADA*\n\n` +
                    `${gang1.name} & ${gang2.name}\n\n` +
                    `Benefícios:\n` +
                    Object.entries(this.allianceSystem.benefits)
                        .map(([benefit, value]) => 
                            typeof value === 'boolean' ? 
                                `└ ${benefit}` : 
                                `└ ${benefit}: +${(value - 1) * 100}%`
                        )
                        .join('\n')
        };
    }

    getRankLevel(rank) {
        return Object.keys(this.ranks).indexOf(rank);
    }

    hasPermission(gang, memberId, permission) {
        const rank = gang.ranks[memberId];
        return this.ranks[rank].permissions.includes(permission) || 
               this.ranks[rank].permissions.includes('all');
    }

    formatGangInfo(gang) {
        const type = this.gangTypes[gang.type];

        let text = `🎭 *${gang.name}* 🎭\n\n`;
        text += `Tipo: ${type.name}\n`;
        text += `Líder: @${gang.leader.split('@')[0]}\n`;
        text += `Membros: ${gang.members.length}/${type.maxMembers}\n`;
        text += `Influência: ${gang.influence}\n`;
        text += `Dinheiro: R$ ${gang.money}\n\n`;

        text += `📊 *STATS*\n`;
        Object.entries(gang.stats).forEach(([stat, value]) => {
            text += `└ ${stat}: ${value}\n`;
        });
        text += '\n';

        text += `👥 *MEMBROS*\n`;
        gang.members.forEach(member => {
            text += `└ @${member.split('@')[0]} (${this.ranks[gang.ranks[member]].name})\n`;
        });
        text += '\n';

        if (gang.territories.length > 0) {
            text += `🏰 *TERRITÓRIOS*\n`;
            gang.territories.forEach(territory => {
                text += `└ ${territory}\n`;
            });
            text += '\n';
        }

        if (gang.allies.length > 0) {
            text += `🤝 *ALIADOS*\n`;
            gang.allies.forEach(ally => {
                text += `└ ${ally}\n`;
            });
            text += '\n';
        }

        if (gang.enemies.length > 0) {
            text += `⚔️ *INIMIGOS*\n`;
            gang.enemies.forEach(enemy => {
                text += `└ ${enemy}\n`;
            });
        }

        return text;
    }

    formatGangList() {
        let text = `🎭 *TIPOS DE GANGUE* 🎭\n\n`;

        Object.entries(this.gangTypes).forEach(([id, type]) => {
            text += `*${type.name}*\n`;
            text += `├ ${type.description}\n`;
            text += `├ Membros: ${type.maxMembers}\n`;
            text += `├ Stats:\n`;
            Object.entries(type.baseStats).forEach(([stat, value]) => {
                text += `│ └ ${stat}: ${value}\n`;
            });
            text += `├ Especialidades:\n`;
            type.specialties.forEach(spec => {
                const specialty = this.specialties[spec];
                text += `│ └ ${specialty.name}\n`;
            });
            text += `└ Territórios: ${type.territories.join(', ')}\n\n`;
        });

        return text;
    }
}

module.exports = new GangSystem();
