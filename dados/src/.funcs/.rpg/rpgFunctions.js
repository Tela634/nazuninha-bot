const fs = require('fs');
const path = require('path');

const RPG_DIR = path.join(__dirname, '../../../database/users/rpg');

// Garante que o diretório existe
if (!fs.existsSync(RPG_DIR)) {
    fs.mkdirSync(RPG_DIR, { recursive: true });
}

// Estrutura inicial de um jogador
const defaultPlayer = {
    name: '',
    level: 1,
    xp: 0,
    health: 100,
    maxHealth: 100,
    energy: 100,
    maxEnergy: 100,
    strength: 10,
    defense: 10,
    stamina: 10,
    money: {
        wallet: 0,
        bank: 0
    },
    inventory: [],
    skills: [],
    lastDaily: null,
    lastTrain: {
        strength: null,
        defense: null,
        stamina: null,
        health: null
    },
    lastBattle: null,
    lastWork: null,
    job: null,
    jobExp: 0,
    stats: {
        battlesWon: 0,
        battlesLost: 0,
        npcKills: {},
        lowHealthVictories: 0,
        pvpWins: 0,
        pvpLosses: 0,
        pvpStreak: 0,
        bestPvpStreak: 0,
        criticalHits: 0,
        totalDamageDealt: 0,
        totalDamageTaken: 0,
        totalWorked: 0,
        successfulWorks: 0,
        failedWorks: 0,
        moneyEarned: 0
    },
    completedMissions: [],
    trainCount: 0,
    createdAt: null,
    updatedAt: null
};

// Função para verificar se um jogador existe
function playerExists(userId) {
    const playerPath = path.join(RPG_DIR, `${userId}.json`);
    return fs.existsSync(playerPath);
}

// Função para criar um novo jogador
function createPlayer(userId, name) {
    const playerPath = path.join(RPG_DIR, `${userId}.json`);
    if (playerExists(userId)) {
        throw new Error('Jogador já registrado');
    }

    const player = {
        ...defaultPlayer,
        name: name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(playerPath, JSON.stringify(player, null, 2));
    return player;
}

// Função para deletar um jogador
function deletePlayer(userId) {
    const playerPath = path.join(RPG_DIR, `${userId}.json`);
    if (!playerExists(userId)) {
        throw new Error('Jogador não encontrado');
    }

    fs.unlinkSync(playerPath);
    return true;
}

// Função para obter dados do jogador
function getPlayer(userId) {
    const playerPath = path.join(RPG_DIR, `${userId}.json`);
    if (!playerExists(userId)) {
        throw new Error('Jogador não encontrado');
    }

    const player = JSON.parse(fs.readFileSync(playerPath));
    return player;
}

// Função para salvar dados do jogador
function savePlayer(userId, player) {
    const playerPath = path.join(RPG_DIR, `${userId}.json`);
    player.updatedAt = new Date().toISOString();
    fs.writeFileSync(playerPath, JSON.stringify(player, null, 2));
    return player;
}

// Função para coletar recompensa diária
function claimDaily(userId) {
    if (!playerExists(userId)) {
        throw new Error('Jogador não encontrado');
    }

    const player = getPlayer(userId);
    const now = new Date();
    const lastDaily = player.lastDaily ? new Date(player.lastDaily) : null;

    // Verifica se já se passou 24 horas desde a última coleta
    if (lastDaily && (now - lastDaily) < 24 * 60 * 60 * 1000) {
        const timeLeft = 24 * 60 * 60 * 1000 - (now - lastDaily);
        const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
        const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        throw new Error(`Você precisa esperar ${hoursLeft}h ${minutesLeft}m para coletar novamente!`);
    }

    // Gera recompensa aleatória entre 100 e 1000
    const reward = Math.floor(Math.random() * 901) + 100;
    
    // Atualiza dados do jogador
    player.money.wallet += reward;
    player.lastDaily = now.toISOString();
    
    // Salva as alterações
    savePlayer(userId, player);
    
    return {
        reward,
        newBalance: player.money.wallet
    };
}

// Função para treinar atributos
function train(userId, attribute) {
    if (!playerExists(userId)) {
        throw new Error('Jogador não encontrado');
    }

    const player = getPlayer(userId);
    const now = new Date();
    const attr = attribute.toLowerCase();
    const lastTrain = player.lastTrain[attr] ? new Date(player.lastTrain[attr]) : null;
    
    // Verifica se já pode treinar novamente (6 minutos de cooldown)
    if (lastTrain && (now - lastTrain) < 6 * 60 * 1000) {
        const timeLeft = 6 * 60 * 1000 - (now - lastTrain);
        const minutesLeft = Math.ceil(timeLeft / (60 * 1000));
        throw new Error(`Aguarde ${minutesLeft} minutos para treinar ${attr} novamente!`);
    }

    // Verifica se tem energia suficiente
    if (player.energy < 20) {
        throw new Error('Você não tem energia suficiente para treinar! Mínimo: 20');
    }

    // Aplica o treino baseado no atributo escolhido
    let gained = 0;
    switch(attr) {
        case 'força':
        case 'forca':
        case 'strength':
            gained = Math.floor(Math.random() * 3) + 1;
            player.strength += gained;
            player.lastTrain.strength = now.toISOString();
            break;
        case 'defesa':
        case 'defense':
            gained = Math.floor(Math.random() * 3) + 1;
            player.defense += gained;
            player.lastTrain.defense = now.toISOString();
            break;
        case 'stamina':
        case 'resistência':
        case 'resistencia':
            gained = Math.floor(Math.random() * 3) + 1;
            player.stamina += gained;
            player.maxEnergy += gained * 2;
            player.lastTrain.stamina = now.toISOString();
            break;
        case 'vida':
        case 'health':
            gained = Math.floor(Math.random() * 5) + 5;
            player.maxHealth += gained;
            player.lastTrain.health = now.toISOString();
            break;
        default:
            throw new Error('Atributo inválido! Use: força, defesa, stamina ou vida');
    }

    // Consome energia e atualiza status
    player.energy -= 20;
    player.trainCount = (player.trainCount || 0) + 1;
    
    // Chance de ganhar XP (30%)
    if (Math.random() < 0.3) {
        const xpGained = Math.floor(Math.random() * 50) + 50;
        player.xp += xpGained;
        
        // Level up a cada 1000 XP
        if (player.xp >= player.level * 1000) {
            player.level += 1;
            player.xp = 0;
            player.health = player.maxHealth; // Cura completa ao subir de nível
            player.energy = player.maxEnergy;
        }
    }
    
    // Salva as alterações
    savePlayer(userId, player);
    
    return {
        attribute,
        gained,
        newValue: player[attr] || player.maxHealth,
        energy: player.energy,
        level: player.level,
        xp: player.xp
    };
}

// Função para curar vida
function heal(userId, amount) {
    if (!playerExists(userId)) {
        throw new Error('Jogador não encontrado');
    }

    const player = getPlayer(userId);
    
    // Verifica se precisa de cura
    if (player.health >= player.maxHealth) {
        throw new Error('Sua vida já está cheia!');
    }

    // Verifica se tem dinheiro suficiente (10 coins = 1 HP)
    const cost = amount * 10;
    if (player.money.wallet < cost) {
        throw new Error(`Você precisa de R$ ${cost} para curar ${amount} de vida!`);
    }

    // Calcula quanto pode curar
    const maxHeal = player.maxHealth - player.health;
    if (amount > maxHeal) {
        amount = maxHeal;
    }

    // Aplica a cura e cobra o custo
    player.health += amount;
    player.money.wallet -= amount * 10;
    
    // Salva as alterações
    savePlayer(userId, player);
    
    return {
        healed: amount,
        newHealth: player.health,
        cost: amount * 10,
        wallet: player.money.wallet
    };
}

// Funções de banco
function deposit(userId, amount) {
    if (!playerExists(userId)) {
        throw new Error('Jogador não encontrado');
    }

    const player = getPlayer(userId);
    
    // Verifica se o valor é válido
    if (isNaN(amount) || amount <= 0) {
        throw new Error('Valor inválido para depósito');
    }

    // Verifica se tem dinheiro suficiente na carteira
    if (player.money.wallet < amount) {
        throw new Error(`Você só tem R$ ${player.money.wallet} na carteira`);
    }

    // Realiza a transferência
    player.money.wallet -= amount;
    player.money.bank += amount;
    
    // Salva as alterações
    savePlayer(userId, player);
    
    return {
        deposited: amount,
        newWallet: player.money.wallet,
        newBank: player.money.bank
    };
}

function withdraw(userId, amount) {
    if (!playerExists(userId)) {
        throw new Error('Jogador não encontrado');
    }

    const player = getPlayer(userId);
    
    // Verifica se o valor é válido
    if (isNaN(amount) || amount <= 0) {
        throw new Error('Valor inválido para saque');
    }

    // Verifica se tem dinheiro suficiente no banco
    if (player.money.bank < amount) {
        throw new Error(`Você só tem R$ ${player.money.bank} no banco`);
    }

    // Realiza a transferência
    player.money.bank -= amount;
    player.money.wallet += amount;
    
    // Salva as alterações
    savePlayer(userId, player);
    
    return {
        withdrawn: amount,
        newWallet: player.money.wallet,
        newBank: player.money.bank
    };
}

function depositAll(userId) {
    if (!playerExists(userId)) {
        throw new Error('Jogador não encontrado');
    }

    const player = getPlayer(userId);
    
    // Verifica se tem dinheiro na carteira
    if (player.money.wallet <= 0) {
        throw new Error('Você não tem dinheiro na carteira para depositar');
    }

    const amount = player.money.wallet;
    
    // Realiza a transferência
    player.money.wallet = 0;
    player.money.bank += amount;
    
    // Salva as alterações
    savePlayer(userId, player);
    
    return {
        deposited: amount,
        newWallet: 0,
        newBank: player.money.bank
    };
}

function withdrawAll(userId) {
    if (!playerExists(userId)) {
        throw new Error('Jogador não encontrado');
    }

    const player = getPlayer(userId);
    
    // Verifica se tem dinheiro no banco
    if (player.money.bank <= 0) {
        throw new Error('Você não tem dinheiro no banco para sacar');
    }

    const amount = player.money.bank;
    
    // Realiza a transferência
    player.money.bank = 0;
    player.money.wallet += amount;
    
    // Salva as alterações
    savePlayer(userId, player);
    
    return {
        withdrawn: amount,
        newWallet: player.money.wallet,
        newBank: 0
    };
}

function transfer(userId, targetId, amount) {
    if (!playerExists(userId)) {
        throw new Error('Jogador não encontrado');
    }
    if (!playerExists(targetId)) {
        throw new Error('O jogador de destino não foi encontrado');
    }

    const player = getPlayer(userId);
    const target = getPlayer(targetId);
    
    // Verifica se o valor é válido
    if (isNaN(amount) || amount <= 0) {
        throw new Error('Valor inválido para transferência');
    }

    // Verifica se tem dinheiro suficiente na carteira
    if (player.money.wallet < amount) {
        throw new Error(`Você só tem R$ ${player.money.wallet} na carteira`);
    }

    // Realiza a transferência
    player.money.wallet -= amount;
    target.money.wallet += amount;
    
    // Salva as alterações
    savePlayer(userId, player);
    savePlayer(targetId, target);
    
    return {
        transferred: amount,
        fromWallet: player.money.wallet,
        toWallet: target.money.wallet
    };
}

// Função para formatar o perfil do jogador
function formatProfile(player) {
    return `⚔️ *PERFIL DO GUERREIRO* ⚔️

━━━━━━━━━━━━━━━
👤 *Nome:* ${player.name}
📊 *Level:* ${player.level}
🌟 *XP:* ${player.xp}/${player.level * 1000}
━━━━━━━━━━━━━━━

🔰 *STATUS*
❤️ Vida: ${player.health}/${player.maxHealth}
⚡ Energia: ${player.energy}/${player.maxEnergy}

⚔️ *ATRIBUTOS*
💪 Força: ${player.strength}
🛡️ Defesa: ${player.defense}
🏃 Stamina: ${player.stamina}

💰 *ECONOMIA*
👝 Carteira: R$ ${player.money.wallet}
🏦 Banco: R$ ${player.money.bank}

📜 *Iniciou sua jornada em:* 
📅 ${new Date(player.createdAt).toLocaleDateString('pt-BR')}

_Continue sua jornada para se tornar uma lenda!_ ⚔️`;
}

// Função para batalhar contra NPC
function startBattle(userId, npcType) {
    if (!playerExists(userId)) {
        throw new Error('Jogador não encontrado');
    }

    const player = getPlayer(userId);
    const now = new Date();
    const lastBattle = player.lastBattle ? new Date(player.lastBattle) : null;

    // Verifica cooldown de 3 minutos
    if (lastBattle && (now - lastBattle) < 3 * 60 * 1000) {
        const timeLeft = 3 * 60 * 1000 - (now - lastBattle);
        const minutesLeft = Math.ceil(timeLeft / (60 * 1000));
        throw new Error(`Aguarde ${minutesLeft} minutos para batalhar novamente!`);
    }

    // Verifica se tem energia suficiente
    if (player.energy < 30) {
        throw new Error('Você não tem energia suficiente para batalhar! Mínimo: 30');
    }

    // Verifica se tem vida suficiente
    if (player.health < 30) {
        throw new Error('Sua vida está muito baixa para batalhar! Cure-se primeiro!');
    }

    const { battle } = require('./battleSystem');
    const result = battle(player, npcType);

    // Atualiza estatísticas do jogador
    player.health = result.playerHealth;
    player.energy -= 30;
    player.lastBattle = now.toISOString();

    if (result.won) {
        // Atualiza estatísticas
        player.stats.battlesWon = (player.stats.battlesWon || 0) + 1;
        player.stats.npcKills[npcType] = (player.stats.npcKills[npcType] || 0) + 1;
        if (player.health <= player.maxHealth * 0.2) {
            player.stats.lowHealthVictories = (player.stats.lowHealthVictories || 0) + 1;
        }

        // Adiciona recompensas
        player.money.wallet += result.rewards.money;
        player.xp += result.rewards.xp;

        // Verifica level up
        if (player.xp >= player.level * 1000) {
            player.level += 1;
            player.xp = 0;
            player.health = player.maxHealth;
            player.energy = player.maxEnergy;
            result.levelUp = true;
        }
    } else {
        player.stats.battlesLost = (player.stats.battlesLost || 0) + 1;
    }

    // Verifica conquistas
    const { checkAchievements } = require('./battleSystem');
    const newAchievements = checkAchievements(player);

    // Aplica recompensas das conquistas
    for (const achievement of newAchievements) {
        player.completedMissions.push(achievement.id);
        player.money.wallet += achievement.reward.money;
        player.xp += achievement.reward.xp;
    }

    // Salva o estado do jogador
    savePlayer(userId, player);

    return {
        ...result,
        newAchievements
    };
}

// Função para batalha PvP
function startPvpBattle(player1Id, player2Id) {
    if (!playerExists(player1Id) || !playerExists(player2Id)) {
        throw new Error('Um dos jogadores não está registrado no RPG!');
    }

    const player1 = getPlayer(player1Id);
    const player2 = getPlayer(player2Id);
    const now = new Date();

    // Verifica cooldown (2 minutos)
    const lastBattle = player1.lastBattle ? new Date(player1.lastBattle) : null;
    if (lastBattle && (now - lastBattle) < 2 * 60 * 1000) {
        const timeLeft = 2 * 60 * 1000 - (now - lastBattle);
        const minutesLeft = Math.ceil(timeLeft / (60 * 1000));
        throw new Error(`Aguarde ${minutesLeft} minutos para batalhar novamente!`);
    }

    // Verifica energia e vida dos jogadores
    if (player1.energy < 40) {
        throw new Error('Você não tem energia suficiente para um duelo! Mínimo: 40');
    }
    if (player1.health < 50) {
        throw new Error('Sua vida está muito baixa para um duelo! Mínimo: 50');
    }
    if (player2.energy < 40) {
        throw new Error('Seu oponente não tem energia suficiente para um duelo!');
    }
    if (player2.health < 50) {
        throw new Error('Seu oponente está com a vida muito baixa para um duelo!');
    }

    // Copia os jogadores para não alterar os originais durante a batalha
    const p1Battle = { ...player1 };
    const p2Battle = { ...player2 };

    // Realiza a batalha
    const { battle: pvpBattle } = require('./battleSystem');
    const result = pvpBattle(p1Battle, p2Battle);

    // Atualiza os jogadores com o resultado
    player1.health = p1Battle.health;
    player2.health = p2Battle.health;
    player1.energy -= 40;
    player2.energy -= 40;
    player1.lastBattle = now.toISOString();
    player2.lastBattle = now.toISOString();

    // Atualiza estatísticas
    if (result.winner === p1Battle) {
        // Vencedor
        player1.stats.pvpWins = (player1.stats.pvpWins || 0) + 1;
        player1.stats.pvpStreak = (player1.stats.pvpStreak || 0) + 1;
        player1.stats.bestPvpStreak = Math.max(player1.stats.pvpStreak, player1.stats.bestPvpStreak || 0);
        player1.money.wallet += result.rewards.money;
        player1.xp += result.rewards.xp;

        // Perdedor
        player2.stats.pvpLosses = (player2.stats.pvpLosses || 0) + 1;
        player2.stats.pvpStreak = 0;
    } else {
        // Vencedor
        player2.stats.pvpWins = (player2.stats.pvpWins || 0) + 1;
        player2.stats.pvpStreak = (player2.stats.pvpStreak || 0) + 1;
        player2.stats.bestPvpStreak = Math.max(player2.stats.pvpStreak, player2.stats.bestPvpStreak || 0);
        player2.money.wallet += result.rewards.money;
        player2.xp += result.rewards.xp;

        // Perdedor
        player1.stats.pvpLosses = (player1.stats.pvpLosses || 0) + 1;
        player1.stats.pvpStreak = 0;
    }

    // Verifica level up
    for (const player of [player1, player2]) {
        if (player.xp >= player.level * 1000) {
            player.level += 1;
            player.xp = 0;
            player.health = player.maxHealth;
            player.energy = player.maxEnergy;
            result.levelUp = true;
        }
    }

    // Verifica conquistas
    const { checkAchievements } = require('./battleSystem');
    const p1Achievements = checkAchievements(player1);
    const p2Achievements = checkAchievements(player2);

    // Aplica recompensas das conquistas
    for (const achievement of [...p1Achievements, ...p2Achievements]) {
        const player = achievement.playerId === player1Id ? player1 : player2;
        player.completedMissions.push(achievement.id);
        player.money.wallet += achievement.reward.money;
        player.xp += achievement.reward.xp;
    }

    // Salva os jogadores
    savePlayer(player1Id, player1);
    savePlayer(player2Id, player2);

    return {
        ...result,
        newAchievements: {
            player1: p1Achievements,
            player2: p2Achievements
        }
    };
}

// Funções do sistema de trabalho
const { formatJobList, work, getJob, quitJob } = require('./workSystem');

function startWork(userId) {
    if (!playerExists(userId)) {
        throw new Error('Jogador não encontrado');
    }

    const player = getPlayer(userId);
    const result = work(userId, player);

    // Atualiza estatísticas
    player.stats.totalWorked = (player.stats.totalWorked || 0) + 1;
    if (result.success) {
        player.stats.successfulWorks = (player.stats.successfulWorks || 0) + 1;
        player.stats.moneyEarned = (player.stats.moneyEarned || 0) + result.rewards.money;
    } else {
        player.stats.failedWorks = (player.stats.failedWorks || 0) + 1;
    }

    // Verifica level up
    if (player.xp >= player.level * 1000) {
        player.level += 1;
        player.xp = 0;
        player.health = player.maxHealth;
        player.energy = player.maxEnergy;
        result.levelUp = true;
    }

    // Salva o jogador
    savePlayer(userId, player);

    return result;
}

function applyForJob(userId, jobId) {
    if (!playerExists(userId)) {
        throw new Error('Jogador não encontrado');
    }

    const player = getPlayer(userId);
    const job = getJob(userId, player, jobId);
    savePlayer(userId, player);

    return job;
}

function resignFromJob(userId) {
    if (!playerExists(userId)) {
        throw new Error('Jogador não encontrado');
    }

    const player = getPlayer(userId);
    const oldJob = quitJob(userId, player);
    savePlayer(userId, player);

    return oldJob;
}

// Funções do sistema de loja
const { formatShop, formatSkills, buyItem, buySkill, useItem, checkTraining } = require('./shopSystem');

function purchaseItem(userId, itemId) {
    if (!playerExists(userId)) {
        throw new Error('Jogador não encontrado');
    }

    const player = getPlayer(userId);
    
    // Verifica se está em treinamento
    const training = checkTraining(player);
    if (training && !training.completed) {
        throw new Error(`Você está treinando uma habilidade! Aguarde ${training.timeLeft} minutos.`);
    }

    const item = buyItem(player, itemId);
    player.stats.itemsBought = (player.stats.itemsBought || 0) + 1;
    savePlayer(userId, player);

    return item;
}

function learnSkill(userId, skillId) {
    if (!playerExists(userId)) {
        throw new Error('Jogador não encontrado');
    }

    const player = getPlayer(userId);
    
    // Verifica se está em treinamento
    const training = checkTraining(player);
    if (training && !training.completed) {
        throw new Error(`Você está treinando uma habilidade! Aguarde ${training.timeLeft} minutos.`);
    }

    const skill = buySkill(player, skillId);
    player.stats.skillsLearned = (player.stats.skillsLearned || 0) + 1;
    savePlayer(userId, player);

    return skill;
}

function useInventoryItem(userId, itemId) {
    if (!playerExists(userId)) {
        throw new Error('Jogador não encontrado');
    }

    const player = getPlayer(userId);
    
    // Verifica se está em treinamento
    const training = checkTraining(player);
    if (training && !training.completed) {
        throw new Error(`Você está treinando uma habilidade! Aguarde ${training.timeLeft} minutos.`);
    }

    const item = useItem(player, itemId);
    player.stats.itemsUsed = (player.stats.itemsUsed || 0) + 1;
    savePlayer(userId, player);

    return item;
}

function verifyTraining(userId) {
    if (!playerExists(userId)) {
        throw new Error('Jogador não encontrado');
    }

    const player = getPlayer(userId);
    const result = checkTraining(player);

    if (result?.completed) {
        savePlayer(userId, player);
    }

    return result;
}

module.exports = {
    playerExists,
    createPlayer,
    deletePlayer,
    getPlayer,
    savePlayer,
    claimDaily,
    formatProfile,
    deposit,
    withdraw,
    depositAll,
    withdrawAll,
    transfer,
    train,
    heal,
    startBattle,
    startPvpBattle,
    startWork,
    applyForJob,
    resignFromJob,
    formatJobList,
    formatShop,
    formatSkills,
    purchaseItem,
    learnSkill,
    useInventoryItem,
    verifyTraining
};
