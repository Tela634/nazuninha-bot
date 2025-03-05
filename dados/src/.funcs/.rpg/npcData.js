// Sistema de NPCs e Inimigos
const enemies = {
    // Inimigos Básicos (Nível 1-10)
    'slime': {
        name: 'Slime',
        description: 'Uma criatura gelatinosa e fraca',
        level: 1,
        emoji: '🟢',
        health: 50,
        attack: 5,
        defense: 2,
        xp: 20,
        money: { min: 10, max: 50 },
        drops: ['poção_hp']
    },
    'goblin': {
        name: 'Goblin',
        description: 'Um pequeno humanóide verde',
        level: 1,
        emoji: '👺',
        health: 60,
        attack: 8,
        defense: 3,
        xp: 25,
        money: { min: 20, max: 70 },
        drops: ['poção_hp', 'faca']
    },
    'rato': {
        name: 'Rato Gigante',
        description: 'Um rato mutante de esgoto',
        level: 2,
        emoji: '🐀',
        health: 70,
        attack: 10,
        defense: 4,
        xp: 30,
        money: { min: 30, max: 90 },
        drops: ['poção_hp']
    },

    // Inimigos Intermediários (Nível 11-20)
    'skeleton': {
        name: 'Esqueleto',
        description: 'Um guerreiro morto-vivo',
        level: 15,
        emoji: '💀',
        health: 120,
        attack: 25,
        defense: 15,
        xp: 100,
        money: { min: 100, max: 300 },
        drops: ['poção_hp', 'espada_ferro']
    },
    'wolf': {
        name: 'Lobo Selvagem',
        description: 'Um lobo feroz da floresta',
        level: 18,
        emoji: '🐺',
        health: 150,
        attack: 30,
        defense: 20,
        xp: 120,
        money: { min: 150, max: 400 },
        drops: ['poção_hp', 'armadura_ferro']
    },
    'bandit': {
        name: 'Bandido',
        description: 'Um ladrão armado',
        level: 20,
        emoji: '🦹',
        health: 180,
        attack: 35,
        defense: 25,
        xp: 150,
        money: { min: 200, max: 500 },
        drops: ['poção_hp', 'revolver']
    },

    // Inimigos Avançados (Nível 21-30)
    'orc': {
        name: 'Orc',
        description: 'Um guerreiro brutal',
        level: 25,
        emoji: '👹',
        health: 250,
        attack: 45,
        defense: 35,
        xp: 200,
        money: { min: 300, max: 800 },
        drops: ['poção_hp', 'espada_ferro', 'armadura_ferro']
    },
    'dark_mage': {
        name: 'Mago Negro',
        description: 'Um mago corrompido pelas trevas',
        level: 28,
        emoji: '🧙‍♂️',
        health: 200,
        attack: 60,
        defense: 30,
        xp: 250,
        money: { min: 400, max: 1000 },
        drops: ['poção_hp', 'amuleto_energia']
    },
    'assassin': {
        name: 'Assassino',
        description: 'Um matador profissional',
        level: 30,
        emoji: '🗡️',
        health: 220,
        attack: 70,
        defense: 40,
        xp: 300,
        money: { min: 500, max: 1200 },
        drops: ['poção_hp', 'rifle']
    },

    // Chefes (Nível 31+)
    'dragon': {
        name: 'Dragão',
        description: 'Uma antiga criatura de poder imenso',
        level: 40,
        emoji: '🐉',
        health: 500,
        attack: 100,
        defense: 80,
        xp: 1000,
        money: { min: 2000, max: 5000 },
        drops: ['poção_hp', 'espada_dragão', 'escama_dragão'],
        isBoss: true
    },
    'demon': {
        name: 'Demônio',
        description: 'Um ser das profundezas do inferno',
        level: 45,
        emoji: '👿',
        health: 600,
        attack: 120,
        defense: 90,
        xp: 1200,
        money: { min: 3000, max: 7000 },
        drops: ['poção_hp', 'espada_demoníaca', 'amuleto_demônio'],
        isBoss: true
    },
    'lich': {
        name: 'Lich',
        description: 'Um poderoso mago imortal',
        level: 50,
        emoji: '☠️',
        health: 700,
        attack: 150,
        defense: 100,
        xp: 1500,
        money: { min: 5000, max: 10000 },
        drops: ['poção_hp', 'cajado_lich', 'amuleto_imortal'],
        isBoss: true
    }
};

// Funções de formatação
function formatEnemyList() {
    let text = `👾 *LISTA DE INIMIGOS* 👾\n\n`;

    // Organiza os inimigos por nível
    const categories = {
        'Inimigos Básicos (Nível 1-10)': Object.entries(enemies).filter(([_, e]) => e.level <= 10),
        'Inimigos Intermediários (Nível 11-20)': Object.entries(enemies).filter(([_, e]) => e.level > 10 && e.level <= 20),
        'Inimigos Avançados (Nível 21-30)': Object.entries(enemies).filter(([_, e]) => e.level > 20 && e.level <= 30),
        'Chefes (Nível 31+)': Object.entries(enemies).filter(([_, e]) => e.level > 30)
    };

    for (const [category, enemyList] of Object.entries(categories)) {
        if (enemyList.length > 0) {
            text += `\n*${category}*\n`;
            enemyList.forEach(([id, enemy]) => {
                text += `\n${enemy.emoji} *${enemy.name}* (Nível ${enemy.level})\n`;
                text += `├ ${enemy.description}\n`;
                text += `├ Vida: ${enemy.health}\n`;
                text += `├ Ataque: ${enemy.attack}\n`;
                text += `├ Defesa: ${enemy.defense}\n`;
                text += `├ XP: ${enemy.xp}\n`;
                text += `└ Recompensa: R$ ${enemy.money.min}-${enemy.money.max}\n`;
            });
            text += '\n';
        }
    }

    return text;
}

function formatEnemyInfo(enemyId) {
    const enemy = enemies[enemyId];
    if (!enemy) return null;

    let text = `${enemy.emoji} *${enemy.name}* ${enemy.isBoss ? '(CHEFE)' : ''}\n\n`;
    text += `📝 *Descrição*: ${enemy.description}\n\n`;
    text += `📊 *Estatísticas*\n`;
    text += `├ Nível: ${enemy.level}\n`;
    text += `├ Vida: ${enemy.health}\n`;
    text += `├ Ataque: ${enemy.attack}\n`;
    text += `├ Defesa: ${enemy.defense}\n`;
    text += `├ XP: ${enemy.xp}\n`;
    text += `└ Recompensa: R$ ${enemy.money.min}-${enemy.money.max}\n\n`;
    
    if (enemy.drops.length > 0) {
        text += `💎 *Possíveis Drops*\n`;
        enemy.drops.forEach(drop => {
            text += `└ ${drop}\n`;
        });
    }

    return text;
}

module.exports = {
    enemies,
    formatEnemyList,
    formatEnemyInfo
};
