// Core Systems
const miningSystem = require('./.rpg/miningSystem.js');
const farmingSystem = require('./.rpg/farmingSystem.js');
const fishingSystem = require('./.rpg/fishingSystem.js');
const cookingSystem = require('./.rpg/cookingSystem.js');
const craftSystem = require('./.rpg/craftSystem.js');

// Quest & Achievement Systems
const questSystem = require('./.rpg/questSystem.js');
const achievementSystem = require('./.rpg/achievementSystem.js');

// Combat Systems
const dungeonSystem = require('./.rpg/dungeonSystem.js');
const raidSystem = require('./.rpg/raidSystem.js');
const bossSystem = require('./.rpg/bossSystem.js');

// Organization Systems
const factionSystem = require('./.rpg/factionSystem.js');
const territorySystem = require('./.rpg/territorySystem.js');
const gangSystem = require('./.rpg/gangSystem.js');

// Economy Systems
const investmentSystem = require('./.rpg/investmentSystem.js');
const casinoSystem = require('./.rpg/casinoSystem.js');
const shopSystem = require('./.rpg/shopSystem.js');

// Character Systems
const classSystem = require('./.rpg/classSystem.js');
const careerSystem = require('./.rpg/careerSystem.js');

// Event System
const randomEventsSystem = require('./.rpg/randomEventsSystem.js');

// Helper Functions
const { playerExists, checkRPGAction, savePlayer } = require('./.rpg/rpgFunctions.js');

// Main RPG command handler
const rpgCommands = async (type, nazu, from, sender, info, reply, command, q, prefix, isModoRpg) => {
    // Verifica se RPG está ativo
    if (!isModoRpg) return reply('❌ O modo RPG está desativado!');

    switch(command) {
        // Comandos Básicos
        case 'eventos': {
        const events = randomEventsSystem.checkForEvents();
        if (Object.keys(events).length > 0) {
         reply(randomEventsSystem.formatEventList());
        }else {
        reply('Nenhum evento ativo');
        }
        }
        break
        
        case 'registrar': {
            if (playerExists(sender)) return reply('❌ Você já está registrado!');
            if (!q) return reply(`❌ Digite seu nome. Exemplo: ${prefix}registrar Aventureiro`);
            
            try {
                const player = {
                    id: sender,
                    name: q,
                    level: 1,
                    xp: 0,
                    money: {
                        wallet: 1000,
                        bank: 0
                    },
                    stats: {
                        health: 100,
                        maxHealth: 100,
                        energy: 100,
                        maxEnergy: 100,
                        attack: 10,
                        defense: 5,
                        speed: 10
                    },
                    inventory: [],
                    createdAt: Date.now()
                };
                
                savePlayer(sender, player);
                reply(`✅ Bem-vindo ao RPG, ${q}!\n\nUse ${prefix}rpgmenu para ver os comandos.`);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'perfil': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            
            try {
                const player = await checkRPGAction(sender);
                let text = `👤 *PERFIL* 👤\n\n`;
                text += `Nome: ${player.name}\n`;
                text += `Nível: ${player.level}\n`;
                text += `XP: ${player.xp}/${player.level * 1000}\n\n`;
                
                text += `💰 *DINHEIRO*\n`;
                text += `├ Carteira: R$ ${player.money.wallet}\n`;
                text += `└ Banco: R$ ${player.money.bank}\n\n`;
                
                text += `📊 *STATS*\n`;
                text += `├ Vida: ${player.stats.health}/${player.stats.maxHealth}\n`;
                text += `├ Energia: ${player.stats.energy}/${player.stats.maxEnergy}\n`;
                text += `├ Ataque: ${player.stats.attack}\n`;
                text += `├ Defesa: ${player.stats.defense}\n`;
                text += `└ Velocidade: ${player.stats.speed}\n\n`;

                if (player.class) {
                    const classInfo = classSystem.classes[player.class];
                    text += `🎮 *CLASSE*\n`;
                    text += `└ ${classInfo.name}\n\n`;
                }

                if (player.faction) {
                    const factionInfo = factionSystem.factions[player.faction.id];
                    text += `⚔️ *FACÇÃO*\n`;
                    text += `└ ${factionInfo.name}\n\n`;
                }

                if (player.gang) {
                    text += `🎭 *GANGUE*\n`;
                    text += `└ ${player.gang.name}\n\n`;
                }

                if (player.career) {
                    const careerInfo = careerSystem.careers[player.career.id];
                    text += `💼 *CARREIRA*\n`;
                    text += `└ ${careerInfo.name}\n\n`;
                }

                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;
    }
};

module.exports = rpgCommands;
