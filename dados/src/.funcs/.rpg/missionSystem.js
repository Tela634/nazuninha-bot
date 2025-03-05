const fs = require('fs');
const path = require('path');

class MissionSystem {
    constructor() {
        this.missionsPath = path.join(__dirname, '..', '..', 'database', 'rpg', 'missions.json');
        this.ensureDirectoryExists();
        this.missions = {
            // Missões Diárias
            'daily_training': {
                title: 'Treino Diário',
                description: 'Treine 3 vezes em um dia',
                type: 'daily',
                emoji: '💪',
                requirement: 3,
                reward: { money: 2000, xp: 1000 }
            },
            'daily_battles': {
                title: 'Guerreiro Diário',
                description: 'Vença 5 batalhas em um dia',
                type: 'daily',
                emoji: '⚔️',
                requirement: 5,
                reward: { money: 3000, xp: 1500 }
            },
            'daily_work': {
                title: 'Trabalhador do Dia',
                description: 'Complete 3 turnos de trabalho',
                type: 'daily',
                emoji: '💼',
                requirement: 3,
                reward: { money: 2500, xp: 1200 }
            },

            // Missões Semanais
            'weekly_boss': {
                title: 'Caçador de Chefes',
                description: 'Derrote 3 chefes em uma semana',
                type: 'weekly',
                emoji: '👑',
                requirement: 3,
                reward: { money: 10000, xp: 5000 }
            },
            'weekly_pvp': {
                title: 'Dominador PvP',
                description: 'Vença 10 duelos PvP em uma semana',
                type: 'weekly',
                emoji: '🏆',
                requirement: 10,
                reward: { money: 15000, xp: 7000 }
            },
            'weekly_robbery': {
                title: 'Mestre do Crime',
                description: 'Complete 15 assaltos com sucesso em uma semana',
                type: 'weekly',
                emoji: '🦹‍♂️',
                requirement: 15,
                reward: { money: 20000, xp: 8000 }
            },

            // Missões de História
            'chapter1_start': {
                title: 'O Começo de uma Lenda',
                description: 'Alcance nível 10 e derrote 20 monstros',
                type: 'story',
                chapter: 1,
                emoji: '📖',
                requirements: {
                    level: 10,
                    monstersDefeated: 20
                },
                reward: { money: 5000, xp: 2000, item: 'espada_iniciante' }
            },
            'chapter2_guild': {
                title: 'Ascensão na Guilda',
                description: 'Alcance nível 20 e complete 30 missões',
                type: 'story',
                chapter: 2,
                emoji: '📖',
                requirements: {
                    level: 20,
                    missionsCompleted: 30
                },
                reward: { money: 10000, xp: 4000, item: 'armadura_guilda' }
            },
            'chapter3_darkness': {
                title: 'Combatendo a Escuridão',
                description: 'Derrote 5 chefes e alcance nível 30',
                type: 'story',
                chapter: 3,
                emoji: '📖',
                requirements: {
                    level: 30,
                    bossesDefeated: 5
                },
                reward: { money: 20000, xp: 8000, item: 'amuleto_luz' }
            },

            // Missões de Gangue
            'gang_territory': {
                title: 'Expansão Territorial',
                description: 'Vença 5 guerras de gangue',
                type: 'gang',
                emoji: '🏰',
                requirement: 5,
                reward: { money: 25000, xp: 10000, territory: 2 }
            },
            'gang_power': {
                title: 'Poder da União',
                description: 'Alcance nível 5 com sua gangue',
                type: 'gang',
                emoji: '⭐',
                requirement: 5,
                reward: { money: 30000, xp: 12000, territory: 3 }
            },

            // Missões de Profissão
            'job_promotion': {
                title: 'Promoção Merecida',
                description: 'Alcance 3 promoções em qualquer trabalho',
                type: 'job',
                emoji: '📈',
                requirement: 3,
                reward: { money: 15000, xp: 6000 }
            },
            'job_master': {
                title: 'Mestre do Ofício',
                description: 'Alcance o cargo mais alto em uma profissão',
                type: 'job',
                emoji: '🎓',
                requirement: 1,
                reward: { money: 50000, xp: 20000 }
            }
        };
    }

    ensureDirectoryExists() {
        const dir = path.dirname(this.missionsPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(this.missionsPath)) {
            fs.writeFileSync(this.missionsPath, JSON.stringify({}));
        }
    }

    getPlayerMissions(playerId) {
        try {
            const data = JSON.parse(fs.readFileSync(this.missionsPath));
            if (!data[playerId]) {
                data[playerId] = {
                    active: {},
                    completed: [],
                    daily: {
                        missions: {},
                        lastReset: new Date().toISOString()
                    },
                    weekly: {
                        missions: {},
                        lastReset: new Date().toISOString()
                    }
                };
                fs.writeFileSync(this.missionsPath, JSON.stringify(data, null, 2));
            }
            return data[playerId];
        } catch {
            return {
                active: {},
                completed: [],
                daily: {
                    missions: {},
                    lastReset: new Date().toISOString()
                },
                weekly: {
                    missions: {},
                    lastReset: new Date().toISOString()
                }
            };
        }
    }

    resetDailyMissions(playerData) {
        const lastReset = new Date(playerData.daily.lastReset);
        const now = new Date();
        if (lastReset.getDate() !== now.getDate()) {
            playerData.daily.missions = {};
            playerData.daily.lastReset = now.toISOString();
            return true;
        }
        return false;
    }

    resetWeeklyMissions(playerData) {
        const lastReset = new Date(playerData.weekly.lastReset);
        const now = new Date();
        if (lastReset.getDay() === 0 && now.getDay() !== 0) {
            playerData.weekly.missions = {};
            playerData.weekly.lastReset = now.toISOString();
            return true;
        }
        return false;
    }

    updateMissionProgress(playerId, missionType, action, amount = 1) {
        const data = JSON.parse(fs.readFileSync(this.missionsPath));
        const playerData = this.getPlayerMissions(playerId);
        
        this.resetDailyMissions(playerData);
        this.resetWeeklyMissions(playerData);

        // Atualiza progresso das missões ativas
        Object.entries(this.missions)
            .filter(([_, mission]) => mission.type === missionType)
            .forEach(([missionId, mission]) => {
                if (!playerData.active[missionId] && !playerData.completed.includes(missionId)) {
                    playerData.active[missionId] = {
                        progress: 0,
                        startedAt: new Date().toISOString()
                    };
                }

                if (playerData.active[missionId]) {
                    playerData.active[missionId].progress += amount;
                    
                    // Verifica se completou a missão
                    if (playerData.active[missionId].progress >= mission.requirement) {
                        delete playerData.active[missionId];
                        playerData.completed.push(missionId);
                        // Retorna a recompensa
                        return mission.reward;
                    }
                }
            });

        data[playerId] = playerData;
        fs.writeFileSync(this.missionsPath, JSON.stringify(data, null, 2));
    }

    formatMissionList(playerId) {
        const playerData = this.getPlayerMissions(playerId);
        let text = `📜 *SUAS MISSÕES* 📜\n\n`;

        // Organiza as missões por tipo
        const categories = {
            'Missões Diárias': Object.entries(this.missions).filter(([_, m]) => m.type === 'daily'),
            'Missões Semanais': Object.entries(this.missions).filter(([_, m]) => m.type === 'weekly'),
            'História': Object.entries(this.missions).filter(([_, m]) => m.type === 'story'),
            'Missões de Gangue': Object.entries(this.missions).filter(([_, m]) => m.type === 'gang'),
            'Missões de Profissão': Object.entries(this.missions).filter(([_, m]) => m.type === 'job')
        };

        for (const [category, missions] of Object.entries(categories)) {
            if (missions.length > 0) {
                text += `\n*${category}*\n`;
                missions.forEach(([id, mission]) => {
                    const isActive = playerData.active[id];
                    const isCompleted = playerData.completed.includes(id);
                    const progress = isActive ? playerData.active[id].progress : 0;
                    
                    text += `${mission.emoji} ${mission.title}\n`;
                    text += `${isCompleted ? '✅' : '❌'} ${mission.description}\n`;
                    if (!isCompleted && isActive) {
                        text += `└ Progresso: ${progress}/${mission.requirement}\n`;
                    }
                    if (isCompleted) {
                        text += `└ Recompensa recebida: R$ ${mission.reward.money} + ${mission.reward.xp} XP\n`;
                    }
                    text += '\n';
                });
            }
        }

        const totalMissions = Object.keys(this.missions).length;
        const completedMissions = playerData.completed.length;
        text += `\n📊 *Progresso*: ${completedMissions}/${totalMissions} missões`;

        return text;
    }
}

module.exports = new MissionSystem();
