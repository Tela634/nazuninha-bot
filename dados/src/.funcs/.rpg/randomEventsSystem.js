class RandomEventsSystem {
    constructor() {
        this.events = {
            // Eventos Globais (afetam todos)
            'eclipse': {
                name: 'Eclipse Lunar',
                description: 'Um eclipse lunar místico está acontecendo!',
                duration: 3600000, // 1 hora
                effects: {
                    'xp_gain': 2.0,      // 2x XP
                    'drop_rate': 1.5,    // +50% drops
                    'magic_power': 2.0   // 2x poder mágico
                },
                chance: 0.001 // 0.1% chance por hora
            },
            'blood_moon': {
                name: 'Lua de Sangue',
                description: 'A lua está vermelha e os monstros mais fortes!',
                duration: 3600000,
                effects: {
                    'monster_strength': 2.0,  // Monstros 2x mais fortes
                    'monster_drops': 3.0,     // 3x mais drops
                    'monster_xp': 2.5         // 2.5x XP
                },
                chance: 0.001
            },
            'market_crash': {
                name: 'Crise Econômica',
                description: 'Os preços estão instáveis!',
                duration: 7200000, // 2 horas
                effects: {
                    'sell_price': 0.5,    // -50% preço de venda
                    'buy_price': 1.5      // +50% preço de compra
                },
                chance: 0.002
            },
            'golden_hour': {
                name: 'Hora Dourada',
                description: 'Tudo que reluz é ouro!',
                duration: 1800000, // 30 minutos
                effects: {
                    'money_gain': 2.0,    // 2x dinheiro
                    'gold_find': 3.0      // 3x chance de ouro
                },
                chance: 0.002
            },

            // Eventos de Trabalho
            'rush_hour': {
                name: 'Hora do Rush',
                description: 'Mais clientes, mais dinheiro!',
                duration: 1800000,
                effects: {
                    'work_money': 2.0,    // 2x dinheiro do trabalho
                    'work_xp': 1.5        // +50% XP do trabalho
                },
                chance: 0.01,
                type: 'work'
            },
            'strike': {
                name: 'Greve',
                description: 'Os trabalhadores estão em greve!',
                duration: 3600000,
                effects: {
                    'work_disabled': true  // Não pode trabalhar
                },
                chance: 0.005,
                type: 'work'
            },

            // Eventos de Crime
            'police_patrol': {
                name: 'Patrulha Policial',
                description: 'A polícia está em alerta!',
                duration: 1800000,
                effects: {
                    'crime_success': 0.5,  // -50% chance de sucesso
                    'crime_reward': 2.0    // 2x recompensa
                },
                chance: 0.02,
                type: 'crime'
            },
            'corrupt_cop': {
                name: 'Policial Corrupto',
                description: 'A polícia está distraída...',
                duration: 1800000,
                effects: {
                    'crime_success': 2.0,  // 2x chance de sucesso
                    'crime_reward': 1.5    // +50% recompensa
                },
                chance: 0.01,
                type: 'crime'
            },

            // Eventos Naturais
            'storm': {
                name: 'Tempestade',
                description: 'Uma tempestade forte está acontecendo!',
                duration: 3600000,
                effects: {
                    'fishing_disabled': true,  // Não pode pescar
                    'farming_growth': 2.0,     // Plantações crescem 2x mais rápido
                    'mining_danger': 2.0       // 2x chance de acidente
                },
                chance: 0.01,
                type: 'nature'
            },
            'drought': {
                name: 'Seca',
                description: 'Falta água na região!',
                duration: 7200000,
                effects: {
                    'farming_growth': 0.5,     // Plantações crescem 50% mais devagar
                    'fishing_spots': 0.5       // Metade dos pontos de pesca
                },
                chance: 0.005,
                type: 'nature'
            },

            // Eventos de Mercado
            'market_boom': {
                name: 'Boom Econômico',
                description: 'A economia está aquecida!',
                duration: 3600000,
                effects: {
                    'sell_price': 2.0,     // 2x preço de venda
                    'job_salary': 1.5      // +50% salário
                },
                chance: 0.005,
                type: 'market'
            },
            'black_market': {
                name: 'Mercado Negro',
                description: 'Comerciantes suspeitos na área...',
                duration: 1800000,
                effects: {
                    'rare_items': true,     // Itens raros disponíveis
                    'illegal_goods': true   // Mercadorias ilegais
                },
                chance: 0.008,
                type: 'market'
            },

            // Eventos de Gangue
            'gang_war': {
                name: 'Guerra de Gangues',
                description: 'As gangues estão em conflito!',
                duration: 3600000,
                effects: {
                    'territory_bonus': 2.0,  // 2x bônus de território
                    'pvp_damage': 1.5        // +50% dano PvP
                },
                chance: 0.01,
                type: 'gang'
            },
            'peace_treaty': {
                name: 'Acordo de Paz',
                description: 'As gangues fizeram uma trégua',
                duration: 7200000,
                effects: {
                    'pvp_disabled': true,    // PvP desativado
                    'trade_bonus': 2.0       // 2x bônus em trocas
                },
                chance: 0.005,
                type: 'gang'
            },

            // Eventos de Dungeon
            'monster_invasion': {
                name: 'Invasão de Monstros',
                description: 'Monstros estão invadindo!',
                duration: 3600000,
                effects: {
                    'monster_quantity': 2.0,  // 2x mais monstros
                    'monster_level': 1.5,     // Monstros 50% mais fortes
                    'drop_quality': 2.0       // 2x qualidade de drops
                },
                chance: 0.01,
                type: 'dungeon'
            },
            'treasure_hunt': {
                name: 'Caça ao Tesouro',
                description: 'Tesouros raros apareceram!',
                duration: 1800000,
                effects: {
                    'chest_chance': 3.0,      // 3x chance de baús
                    'rare_loot': 2.0          // 2x itens raros
                },
                chance: 0.008,
                type: 'dungeon'
            }
        };

        // Eventos ativos
        this.activeEvents = {};
    }

    checkForEvents() {
        const now = Date.now();

        // Remove eventos expirados
        Object.entries(this.activeEvents).forEach(([id, event]) => {
            if (now > event.endTime) {
                delete this.activeEvents[id];
            }
        });

        // Checa novos eventos
        Object.entries(this.events).forEach(([id, event]) => {
            // Não ativa se já tiver um do mesmo tipo
            if (event.type && Object.values(this.activeEvents).some(e => e.type === event.type)) {
                return;
            }

            if (Math.random() < event.chance) {
                this.activeEvents[id] = {
                    ...event,
                    startTime: now,
                    endTime: now + event.duration
                };
            }
        });

        return this.activeEvents;
    }

    getActiveEffects() {
        const effects = {};
        
        Object.values(this.activeEvents).forEach(event => {
            Object.entries(event.effects).forEach(([effect, value]) => {
                if (effects[effect]) {
                    // Se já existe um efeito, multiplica ou usa o mais forte
                    if (typeof value === 'number') {
                        effects[effect] *= value;
                    } else {
                        effects[effect] = value;
                    }
                } else {
                    effects[effect] = value;
                }
            });
        });

        return effects;
    }

    formatEventList() {
        let text = `📅 *EVENTOS ATIVOS* 📅\n\n`;
        
        const activeEvents = Object.values(this.activeEvents);
        if (activeEvents.length === 0) {
            text += `_Nenhum evento ativo no momento_\n`;
            text += `_Eventos podem começar a qualquer momento!_\n`;
        } else {
            activeEvents.forEach(event => {
                const timeLeft = Math.ceil((event.endTime - Date.now()) / 60000);
                
                text += `${event.name}\n`;
                text += `├ ${event.description}\n`;
                text += `└ Tempo restante: ${timeLeft} minutos\n\n`;
            });

            text += `\n*Efeitos Ativos:*\n`;
            const effects = this.getActiveEffects();
            Object.entries(effects).forEach(([effect, value]) => {
                if (typeof value === 'number') {
                    const percent = (value - 1) * 100;
                    text += `└ ${effect}: ${percent > 0 ? '+' : ''}${percent}%\n`;
                } else {
                    text += `└ ${effect}: ${value}\n`;
                }
            });
        }

        return text;
    }

    applyEffects(type, values) {
        const effects = this.getActiveEffects();
        const result = {...values};

        // Aplica multiplicadores
        Object.entries(effects).forEach(([effect, value]) => {
            if (effect.startsWith(type) && typeof value === 'number') {
                Object.keys(result).forEach(key => {
                    if (typeof result[key] === 'number') {
                        result[key] *= value;
                    }
                });
            }
        });

        // Aplica efeitos booleanos
        if (effects[`${type}_disabled`]) {
            return null; // Atividade desativada
        }

        return result;
    }
}

module.exports = new RandomEventsSystem();
