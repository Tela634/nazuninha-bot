const fs = require('fs');
const path = require('path');

class EventSystem {
    constructor() {
        this.eventsPath = path.join(__dirname, '..', '..', 'database', 'rpg', 'events.json');
        this.ensureDirectoryExists();
        this.events = {
            // Eventos Mundiais
            'boss_mundial': {
                name: 'Chefe Mundial',
                description: 'Um poderoso chefe apareceu! Junte-se a outros jogadores para derrotá-lo!',
                duration: 3600000, // 1 hora
                minPlayers: 5,
                boss: {
                    name: 'Dragão Ancião',
                    health: 100000,
                    attack: 500,
                    defense: 300,
                    rewards: {
                        money: { min: 10000, max: 50000 },
                        xp: { min: 5000, max: 10000 },
                        items: ['escama_dragao', 'espada_dragao', 'amuleto_dragao']
                    }
                }
            },
            'guerra_faccoes': {
                name: 'Guerra de Facções',
                description: 'As facções estão em guerra! Escolha seu lado e lute!',
                duration: 7200000, // 2 horas
                factions: ['Luz', 'Trevas'],
                rewards: {
                    winning: {
                        money: 20000,
                        xp: 8000,
                        items: ['medalha_guerra', 'titulo_guerreiro']
                    },
                    participation: {
                        money: 5000,
                        xp: 2000
                    }
                }
            },

            // Eventos de Gangue
            'invasao': {
                name: 'Invasão Territorial',
                description: 'Defenda seu território de invasores ou invada outros territórios!',
                duration: 3600000, // 1 hora
                rewards: {
                    territory: 2,
                    money: 15000,
                    xp: 5000
                },
                penalty: {
                    territory: -1
                }
            },

            // Eventos de Caça
            'cacada_tesouro': {
                name: 'Caçada ao Tesouro',
                description: 'Um mapa do tesouro foi descoberto! Encontre as pistas e o tesouro!',
                duration: 1800000, // 30 minutos
                clues: 5,
                rewards: {
                    money: { min: 5000, max: 30000 },
                    items: ['bau_tesouro', 'mapa_antigo', 'reliquia_antiga']
                }
            },

            // Eventos PvP
            'torneio_pvp': {
                name: 'Torneio PvP',
                description: 'Prove sua força no torneio de combate!',
                duration: 5400000, // 1.5 horas
                minPlayers: 8,
                rewards: {
                    first: {
                        money: 50000,
                        xp: 15000,
                        items: ['trofeu_campeao', 'titulo_campeao']
                    },
                    second: {
                        money: 25000,
                        xp: 10000,
                        items: ['medalha_prata']
                    },
                    third: {
                        money: 10000,
                        xp: 5000,
                        items: ['medalha_bronze']
                    }
                }
            },

            // Eventos de Raid
            'raid_dungeon': {
                name: 'Raid na Dungeon',
                description: 'Uma dungeon antiga foi descoberta! Reúna sua equipe para explorá-la!',
                duration: 3600000, // 1 hora
                minPlayers: 4,
                maxPlayers: 8,
                difficulty: 'Difícil',
                bosses: [
                    {
                        name: 'Guardião Ancestral',
                        health: 50000,
                        attack: 300,
                        defense: 200
                    },
                    {
                        name: 'Lich Supremo',
                        health: 75000,
                        attack: 400,
                        defense: 250
                    }
                ],
                rewards: {
                    money: { min: 20000, max: 100000 },
                    xp: { min: 8000, max: 20000 },
                    items: ['arma_lendaria', 'armadura_antiga', 'reliquia_poder']
                }
            }
        };

        // Eventos Ativos
        this.activeEvents = {};
    }

    ensureDirectoryExists() {
        const dir = path.dirname(this.eventsPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(this.eventsPath)) {
            fs.writeFileSync(this.eventsPath, JSON.stringify({
                activeEvents: {},
                participants: {},
                scores: {}
            }));
        }
    }

    startEvent(eventId) {
        const event = this.events[eventId];
        if (!event) throw new Error('Evento não encontrado!');
        if (this.activeEvents[eventId]) throw new Error('Este evento já está ativo!');

        this.activeEvents[eventId] = {
            ...event,
            startTime: Date.now(),
            endTime: Date.now() + event.duration,
            participants: [],
            scores: {},
            status: 'active'
        };

        this.saveEvents();
        return this.activeEvents[eventId];
    }

    joinEvent(eventId, playerId) {
        const event = this.activeEvents[eventId];
        if (!event) throw new Error('Evento não encontrado ou não está ativo!');
        if (event.participants.includes(playerId)) throw new Error('Você já está participando deste evento!');
        
        // Verifica requisitos específicos do evento
        if (event.minPlayers && event.participants.length >= event.maxPlayers) {
            throw new Error('Este evento já está cheio!');
        }

        event.participants.push(playerId);
        event.scores[playerId] = 0;
        this.saveEvents();
        return event;
    }

    updateScore(eventId, playerId, score) {
        const event = this.activeEvents[eventId];
        if (!event) throw new Error('Evento não encontrado ou não está ativo!');
        if (!event.participants.includes(playerId)) throw new Error('Você não está participando deste evento!');

        event.scores[playerId] = (event.scores[playerId] || 0) + score;
        this.saveEvents();
        return event.scores[playerId];
    }

    getEventRanking(eventId) {
        const event = this.activeEvents[eventId];
        if (!event) throw new Error('Evento não encontrado ou não está ativo!');

        return Object.entries(event.scores)
            .sort(([_, a], [__, b]) => b - a)
            .map(([playerId, score], index) => ({
                position: index + 1,
                playerId,
                score
            }));
    }

    endEvent(eventId) {
        const event = this.activeEvents[eventId];
        if (!event) throw new Error('Evento não encontrado ou não está ativo!');

        const ranking = this.getEventRanking(eventId);
        const rewards = this.calculateRewards(event, ranking);

        delete this.activeEvents[eventId];
        this.saveEvents();

        return {
            ranking,
            rewards
        };
    }

    calculateRewards(event, ranking) {
        const rewards = {};

        switch (event.name) {
            case 'Torneio PvP':
                if (ranking.length >= 1) {
                    rewards[ranking[0].playerId] = event.rewards.first;
                }
                if (ranking.length >= 2) {
                    rewards[ranking[1].playerId] = event.rewards.second;
                }
                if (ranking.length >= 3) {
                    rewards[ranking[2].playerId] = event.rewards.third;
                }
                break;

            case 'Guerra de Facções':
                const winningFaction = ranking[0].score > ranking[1].score ? 0 : 1;
                ranking.forEach(({ playerId, score }, index) => {
                    if (index % 2 === winningFaction) {
                        rewards[playerId] = event.rewards.winning;
                    } else {
                        rewards[playerId] = event.rewards.participation;
                    }
                });
                break;

            default:
                ranking.forEach(({ playerId, score }) => {
                    rewards[playerId] = {
                        money: Math.floor(event.rewards.money.min + (score / 100) * (event.rewards.money.max - event.rewards.money.min)),
                        xp: Math.floor(event.rewards.xp.min + (score / 100) * (event.rewards.xp.max - event.rewards.xp.min)),
                        items: event.rewards.items
                    };
                });
        }

        return rewards;
    }

    getActiveEvents() {
        return Object.entries(this.activeEvents).map(([id, event]) => ({
            id,
            name: event.name,
            description: event.description,
            timeLeft: event.endTime - Date.now(),
            participants: event.participants.length,
            status: event.status
        }));
    }

    saveEvents() {
        fs.writeFileSync(this.eventsPath, JSON.stringify({
            activeEvents: this.activeEvents
        }, null, 2));
    }

    formatEventList() {
        const activeEvents = this.getActiveEvents();
        let text = `🎉 *EVENTOS ATIVOS* 🎉\n\n`;

        if (activeEvents.length === 0) {
            text += `_Nenhum evento ativo no momento..._\n`;
            text += `_Use ${prefix}evento para iniciar um!_\n\n`;
        } else {
            activeEvents.forEach(event => {
                text += `${event.name}\n`;
                text += `├ ${event.description}\n`;
                text += `├ Participantes: ${event.participants}\n`;
                text += `└ Tempo restante: ${Math.floor(event.timeLeft / 60000)} minutos\n\n`;
            });
        }

        text += `\n📅 *PRÓXIMOS EVENTOS*\n\n`;
        Object.entries(this.events).forEach(([id, event]) => {
            if (!this.activeEvents[id]) {
                text += `${event.name}\n`;
                text += `├ ${event.description}\n`;
                if (event.minPlayers) {
                    text += `├ Mínimo de jogadores: ${event.minPlayers}\n`;
                }
                if (event.rewards) {
                    text += `└ Recompensas disponíveis!\n`;
                }
                text += '\n';
            }
        });

        return text;
    }
}

module.exports = new EventSystem();
