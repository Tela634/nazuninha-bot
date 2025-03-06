class EventSystem {
    constructor() {
        this.events = {
            // Eventos Globais
            'chuva_meteoros': {
                name: 'Chuva de Meteoros',
                description: 'Meteoros caem do céu trazendo recursos raros!',
                duration: 3600000, // 1 hora
                effects: {
                    mining: {
                        type: 'bonus',
                        value: 2.0,
                        description: 'Dobro de recursos minerados'
                    },
                    rare_drop: {
                        type: 'chance',
                        value: 0.2,
                        description: '20% de chance de recursos especiais'
                    }
                },
                chance: 0.1
            },
            'eclipse': {
                name: 'Eclipse',
                description: 'A escuridão traz criaturas poderosas!',
                duration: 1800000, // 30 minutos
                effects: {
                    combat: {
                        type: 'bonus',
                        value: 1.5,
                        description: '50% mais XP em combate'
                    },
                    boss_spawn: {
                        type: 'chance',
                        value: 0.3,
                        description: '30% de chance de boss'
                    }
                },
                chance: 0.05
            },

            // Eventos de Área
            'tempestade': {
                name: 'Tempestade',
                description: 'Uma tempestade afeta as atividades!',
                duration: 7200000, // 2 horas
                area: 'all',
                effects: {
                    fishing: {
                        type: 'bonus',
                        value: 1.5,
                        description: '50% mais peixes'
                    },
                    farming: {
                        type: 'malus',
                        value: 0.5,
                        description: '50% menos colheitas'
                    }
                },
                chance: 0.15
            },
            'seca': {
                name: 'Seca',
                description: 'Um período de seca afeta as plantações!',
                duration: 14400000, // 4 horas
                area: 'farming',
                effects: {
                    farming: {
                        type: 'malus',
                        value: 0.3,
                        description: '70% menos colheitas'
                    },
                    water_cost: {
                        type: 'increase',
                        value: 2.0,
                        description: 'Dobro do custo de água'
                    }
                },
                chance: 0.1
            },

            // Eventos de Facção
            'guerra_faccoes': {
                name: 'Guerra de Facções',
                description: 'As facções entram em conflito!',
                duration: 86400000, // 24 horas
                area: 'faction',
                effects: {
                    pvp: {
                        type: 'bonus',
                        value: 2.0,
                        description: 'Dobro de pontos de facção'
                    },
                    territory: {
                        type: 'bonus',
                        value: 1.5,
                        description: '50% mais pontos por território'
                    }
                },
                chance: 0.05
            },

            // Eventos de Dungeon
            'invasao_boss': {
                name: 'Invasão de Bosses',
                description: 'Bosses invadem as dungeons!',
                duration: 3600000, // 1 hora
                area: 'dungeon',
                effects: {
                    boss_rate: {
                        type: 'increase',
                        value: 3.0,
                        description: 'Triplo de chance de boss'
                    },
                    loot: {
                        type: 'bonus',
                        value: 2.0,
                        description: 'Dobro de loot'
                    }
                },
                chance: 0.08
            },

            // Eventos Especiais
            'festival': {
                name: 'Festival',
                description: 'Um festival traz bônus para todos!',
                duration: 259200000, // 3 dias
                effects: {
                    all: {
                        type: 'bonus',
                        value: 1.5,
                        description: '50% mais recursos em tudo'
                    },
                    xp: {
                        type: 'bonus',
                        value: 2.0,
                        description: 'Dobro de XP'
                    },
                    money: {
                        type: 'bonus',
                        value: 1.5,
                        description: '50% mais dinheiro'
                    }
                },
                chance: 0.02
            }
        };

        this.activeEvents = new Map();
    }

    checkForEvents() {
        const events = {};

        // Verifica cada evento
        Object.entries(this.events).forEach(([id, event]) => {
            // Se já está ativo, verifica se terminou
            if (this.activeEvents.has(id)) {
                const activeEvent = this.activeEvents.get(id);
                if (Date.now() >= activeEvent.endTime) {
                    this.activeEvents.delete(id);
                } else {
                    events[id] = {
                        ...event,
                        timeLeft: activeEvent.endTime - Date.now()
                    };
                }
                return;
            }

            // Chance de iniciar novo evento
            if (Math.random() < event.chance) {
                const startTime = Date.now();
                const endTime = startTime + event.duration;

                this.activeEvents.set(id, {
                    startTime,
                    endTime
                });

                events[id] = {
                    ...event,
                    timeLeft: event.duration
                };
            }
        });

        return events;
    }

    getActiveEvents() {
        const events = {};

        this.activeEvents.forEach((timing, id) => {
            if (Date.now() < timing.endTime) {
                events[id] = {
                    ...this.events[id],
                    timeLeft: timing.endTime - Date.now()
                };
            } else {
                this.activeEvents.delete(id);
            }
        });

        return events;
    }

    applyEventEffects(player, activity) {
        const effects = {
            bonus: 1.0,
            malus: 1.0,
            chances: {}
        };

        // Aplica efeitos de eventos ativos
        this.activeEvents.forEach((timing, id) => {
            if (Date.now() >= timing.endTime) {
                this.activeEvents.delete(id);
                return;
            }

            const event = this.events[id];
            Object.entries(event.effects).forEach(([type, effect]) => {
                if (type === activity || type === 'all') {
                    switch(effect.type) {
                        case 'bonus':
                            effects.bonus *= effect.value;
                            break;
                        case 'malus':
                            effects.malus *= effect.value;
                            break;
                        case 'chance':
                            effects.chances[type] = effect.value;
                            break;
                    }
                }
            });
        });

        return effects;
    }

    formatEventList() {
        const activeEvents = this.getActiveEvents();
        
        if (Object.keys(activeEvents).length === 0) {
            return `🎉 *EVENTOS* 🎉\n\n` +
                   `_Nenhum evento ativo no momento_\n\n` +
                   `Fique atento a novos eventos!`;
        }

        let text = `🎉 *EVENTOS ATIVOS* 🎉\n\n`;

        Object.entries(activeEvents).forEach(([id, event]) => {
            const timeLeft = Math.ceil(event.timeLeft / 1000 / 60); // Converte para minutos
            text += `*${event.name}*\n`;
            text += `├ ${event.description}\n`;
            text += `├ Tempo restante: ${timeLeft} minutos\n`;
            text += `└ Efeitos:\n`;
            Object.entries(event.effects).forEach(([type, effect]) => {
                text += `   └ ${effect.description}\n`;
            });
            text += '\n';
        });

        return text;
    }
}

module.exports = new EventSystem();
