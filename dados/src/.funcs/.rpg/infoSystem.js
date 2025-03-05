const { npcs, jobs } = require('./npcData');
const { missions } = require('./battleSystem');

function formatEnemyList() {
    let text = `👾 *LISTA DE INIMIGOS* 👾\n\n`;
    
    // Agrupa inimigos por nível
    const enemiesByLevel = {};
    Object.entries(npcs).forEach(([id, npc]) => {
        if (!enemiesByLevel[npc.level]) {
            enemiesByLevel[npc.level] = [];
        }
        enemiesByLevel[npc.level].push({ id, ...npc });
    });

    // Lista inimigos por nível
    Object.keys(enemiesByLevel).sort((a, b) => a - b).forEach(level => {
        text += `*NÍVEL ${level}*\n`;
        enemiesByLevel[level].forEach(enemy => {
            text += `${enemy.emoji} *${enemy.name}*\n`;
            text += `├ ❤️ Vida: ${enemy.maxHealth}\n`;
            text += `├ 💪 Força: ${enemy.strength}\n`;
            text += `├ 🛡️ Defesa: ${enemy.defense}\n`;
            text += `├ ✨ XP: ${enemy.xpReward}\n`;
            text += `└ 💰 Recompensa: R$ ${enemy.moneyReward.min}-${enemy.moneyReward.max}\n\n`;
        });
    });

    return text;
}

function formatJobDetails() {
    let text = `💼 *LISTA DE EMPREGOS* 💼\n\n`;
    
    // Agrupa empregos por nível
    const jobsByLevel = {};
    Object.entries(jobs).forEach(([id, job]) => {
        if (!jobsByLevel[job.level]) {
            jobsByLevel[job.level] = [];
        }
        jobsByLevel[job.level].push({ id, ...job });
    });

    // Lista empregos por nível
    Object.keys(jobsByLevel).sort((a, b) => a - b).forEach(level => {
        text += `*NÍVEL ${level}*\n`;
        jobsByLevel[level].forEach(job => {
            text += `💼 *${job.name}*\n`;
            text += `├ 📝 ${job.description}\n`;
            text += `├ ⚡ Energia: ${job.energyCost}\n`;
            text += `├ ⏰ Cooldown: ${job.cooldown} min\n`;
            text += `└ 💰 Salário: R$ ${job.rewards.money.min}-${job.rewards.money.max}\n\n`;
        });
    });

    return text;
}

function formatMissionDetails() {
    let text = `📜 *LISTA DE MISSÕES* 📜\n\n`;
    
    Object.entries(missions).forEach(([id, mission]) => {
        text += `${mission.emoji} *${mission.title}*\n`;
        text += `├ 📝 ${mission.description}\n`;
        text += `├ 💰 Recompensa: R$ ${mission.reward.money}\n`;
        text += `└ ✨ XP: ${mission.reward.xp}\n\n`;
    });

    return text;
}

function formatHelp() {
    return `
⚔️ *GUIA DO RPG* ⚔️

*COMEÇANDO*
1️⃣ Use /registrar para criar seu personagem
2️⃣ Colete sua recompensa diária com /daily
3️⃣ Treine seus atributos com /treinar
4️⃣ Batalhe contra monstros com /batalhar
5️⃣ Consiga um emprego com /emprego

*DICAS*
• Treine seus atributos regularmente
• Cure-se após as batalhas
• Guarde dinheiro no banco
• Complete missões para ganhar recompensas
• Trabalhe para ganhar dinheiro extra

*BATALHA*
• Verifique o nível dos inimigos
• Mantenha sua vida e energia altas
• Use golpes críticos a seu favor
• Desafie outros jogadores com /pvp

*TRABALHO*
• Comece com empregos básicos
• Acumule experiência de trabalho
• Busque promoções
• Gerencie sua energia

*ECONOMIA*
• Colete recompensas diárias
• Deposite seu dinheiro no banco
• Faça transferências com /pix
• Complete missões para lucrar

Use /menurpg para ver todos os comandos!`;
}

module.exports = {
    formatEnemyList,
    formatJobDetails,
    formatMissionDetails,
    formatHelp
};
