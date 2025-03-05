const items = {
    // Itens existentes...
    'faca': {
        name: 'Faca',
        description: 'Uma faca simples para assaltos (30% de sucesso)',
        price: 1000,
        emoji: '🔪',
        type: 'weapon',
        effect: {
            type: 'robbery',
            successRate: 0.3,
            minReward: 100,
            maxReward: 1000
        }
    },
    'revolver': {
        name: 'Revólver',
        description: 'Um revólver para assaltos (50% de sucesso)',
        price: 5000,
        emoji: '🔫',
        type: 'weapon',
        effect: {
            type: 'robbery',
            successRate: 0.5,
            minReward: 500,
            maxReward: 3000
        },
        level: 5
    },
    'rifle': {
        name: 'Rifle',
        description: 'Um rifle poderoso para assaltos (70% de sucesso)',
        price: 10000,
        emoji: '🎯',
        type: 'weapon',
        effect: {
            type: 'robbery',
            successRate: 0.7,
            minReward: 1000,
            maxReward: 5000
        },
        level: 10
    },
    'escudo_magico': {
        name: 'Escudo Mágico',
        description: 'Protege contra assaltos (pode quebrar)',
        price: 3000,
        emoji: '🛡️',
        type: 'shield',
        effect: {
            type: 'protection',
            breakChance: 0.3
        },
        level: 3
    }
};
