const items = {
    // Poções e Consumíveis
    'poção_hp': {
        name: 'Poção de Vida',
        description: 'Recupera 50 pontos de vida',
        price: 100,
        emoji: '🧪',
        type: 'consumable',
        effect: {
            type: 'heal',
            value: 50
        }
    },
    'poção_hp_grande': {
        name: 'Poção de Vida Grande',
        description: 'Recupera 150 pontos de vida',
        price: 250,
        emoji: '🧪',
        type: 'consumable',
        effect: {
            type: 'heal',
            value: 150
        }
    },
    'poção_energia': {
        name: 'Poção de Energia',
        description: 'Recupera 50 pontos de energia',
        price: 100,
        emoji: '⚡',
        type: 'consumable',
        effect: {
            type: 'energy',
            value: 50
        }
    },
    'poção_energia_grande': {
        name: 'Poção de Energia Grande',
        description: 'Recupera 150 pontos de energia',
        price: 250,
        emoji: '⚡',
        type: 'consumable',
        effect: {
            type: 'energy',
            value: 150
        }
    },
    'comida_gourmet': {
        name: 'Comida Gourmet',
        description: 'Recupera 100 de vida e energia',
        price: 300,
        emoji: '🍱',
        type: 'consumable',
        effect: {
            type: 'heal_energy',
            value: 100
        }
    },

    // Armas para Assalto
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

    // Proteção
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
    },

    // Equipamentos de Batalha
    'espada_iniciante': {
        name: 'Espada de Iniciante',
        description: 'Aumenta força em 3 pontos',
        price: 300,
        emoji: '⚔️',
        type: 'equipment',
        effect: {
            type: 'strength',
            value: 3
        }
    },
    'espada_ferro': {
        name: 'Espada de Ferro',
        description: 'Aumenta força em 5 pontos',
        price: 500,
        emoji: '⚔️',
        type: 'equipment',
        effect: {
            type: 'strength',
            value: 5
        },
        level: 2
    },
    'espada_aço': {
        name: 'Espada de Aço',
        description: 'Aumenta força em 8 pontos',
        price: 1000,
        emoji: '⚔️',
        type: 'equipment',
        effect: {
            type: 'strength',
            value: 8
        },
        level: 5
    },
    'espada_mithril': {
        name: 'Espada de Mithril',
        description: 'Aumenta força em 12 pontos',
        price: 2000,
        emoji: '⚔️',
        type: 'equipment',
        effect: {
            type: 'strength',
            value: 12
        },
        level: 10
    },
    'espada_dragão': {
        name: 'Espada do Dragão',
        description: 'Aumenta força em 20 pontos',
        price: 5000,
        emoji: '🗡️',
        type: 'equipment',
        effect: {
            type: 'strength',
            value: 20
        },
        level: 20
    },

    // Armaduras
    'armadura_couro': {
        name: 'Armadura de Couro',
        description: 'Aumenta defesa em 3 pontos',
        price: 300,
        emoji: '🛡️',
        type: 'equipment',
        effect: {
            type: 'defense',
            value: 3
        }
    },
    'armadura_ferro': {
        name: 'Armadura de Ferro',
        description: 'Aumenta defesa em 5 pontos',
        price: 500,
        emoji: '🛡️',
        type: 'equipment',
        effect: {
            type: 'defense',
            value: 5
        },
        level: 2
    },
    'armadura_aço': {
        name: 'Armadura de Aço',
        description: 'Aumenta defesa em 8 pontos',
        price: 1000,
        emoji: '🛡️',
        type: 'equipment',
        effect: {
            type: 'defense',
            value: 8
        },
        level: 5
    },
    'armadura_mithril': {
        name: 'Armadura de Mithril',
        description: 'Aumenta defesa em 12 pontos',
        price: 2000,
        emoji: '🛡️',
        type: 'equipment',
        effect: {
            type: 'defense',
            value: 12
        },
        level: 10
    },
    'armadura_dragão': {
        name: 'Armadura do Dragão',
        description: 'Aumenta defesa em 20 pontos',
        price: 5000,
        emoji: '🛡️',
        type: 'equipment',
        effect: {
            type: 'defense',
            value: 20
        },
        level: 20
    },

    // Acessórios
    'anel_vida': {
        name: 'Anel da Vida',
        description: 'Aumenta vida máxima em 20 pontos',
        price: 1000,
        emoji: '💍',
        type: 'equipment',
        effect: {
            type: 'maxHealth',
            value: 20
        },
        level: 3
    },
    'amuleto_energia': {
        name: 'Amuleto de Energia',
        description: 'Aumenta energia máxima em 20 pontos',
        price: 1000,
        emoji: '📿',
        type: 'equipment',
        effect: {
            type: 'maxEnergy',
            value: 20
        },
        level: 3
    },
    'anel_sorte': {
        name: 'Anel da Sorte',
        description: 'Aumenta as chances de drops raros',
        price: 2000,
        emoji: '🍀',
        type: 'equipment',
        effect: {
            type: 'luck',
            value: 1.5
        },
        level: 5
    },
    'amuleto_xp': {
        name: 'Amuleto da Sabedoria',
        description: 'Aumenta o XP ganho em 50%',
        price: 3000,
        emoji: '📚',
        type: 'equipment',
        effect: {
            type: 'xpBoost',
            value: 1.5
        },
        level: 8
    },
    'colar_proteção': {
        name: 'Colar de Proteção',
        description: 'Reduz o dano recebido em 20%',
        price: 4000,
        emoji: '⭐',
        type: 'equipment',
        effect: {
            type: 'damageReduction',
            value: 0.2
        },
        level: 10
    }
};

const skills = {
    'golpe_forte': {
        name: 'Golpe Forte',
        description: 'Aumenta o dano do próximo ataque em 50%',
        price: 1000,
        emoji: '💥',
        type: 'combat',
        energyCost: 30,
        cooldown: 2,
        effect: {
            type: 'damage',
            multiplier: 1.5
        },
        level: 3
    },
    'defesa_total': {
        name: 'Defesa Total',
        description: 'Reduz o próximo dano recebido em 50%',
        price: 1000,
        emoji: '🛡️',
        type: 'combat',
        energyCost: 25,
        cooldown: 2,
        effect: {
            type: 'defense',
            multiplier: 0.5
        },
        level: 3
    },
    'cura_rapida': {
        name: 'Cura Rápida',
        description: 'Recupera 30% da vida máxima',
        price: 2000,
        emoji: '💖',
        type: 'combat',
        energyCost: 40,
        cooldown: 3,
        effect: {
            type: 'heal',
            percentage: 0.3
        },
        level: 4
    },
    'golpe_duplo': {
        name: 'Golpe Duplo',
        description: 'Ataca duas vezes em sequência',
        price: 3000,
        emoji: '⚔️',
        type: 'combat',
        energyCost: 45,
        cooldown: 3,
        effect: {
            type: 'multiattack',
            hits: 2
        },
        level: 5
    },
    'furia_batalha': {
        name: 'Fúria de Batalha',
        description: 'Aumenta força em 30% por 3 turnos',
        price: 4000,
        emoji: '😡',
        type: 'buff',
        energyCost: 50,
        cooldown: 4,
        effect: {
            type: 'buff',
            stat: 'strength',
            multiplier: 1.3,
            duration: 3
        },
        level: 6
    },
    'inspiracao': {
        name: 'Inspiração',
        description: 'Recupera 20 de energia',
        price: 2500,
        emoji: '✨',
        type: 'utility',
        energyCost: 0,
        cooldown: 4,
        effect: {
            type: 'energy',
            value: 20
        },
        level: 4
    },
    'roubo_vida': {
        name: 'Roubo de Vida',
        description: 'Causa dano e recupera 50% como vida',
        price: 3500,
        emoji: '🩸',
        type: 'combat',
        energyCost: 35,
        cooldown: 3,
        effect: {
            type: 'lifesteal',
            percentage: 0.5
        },
        level: 5
    },
    'provocar': {
        name: 'Provocar',
        description: 'Reduz a defesa do inimigo em 30% por 2 turnos',
        price: 3000,
        emoji: '😤',
        type: 'debuff',
        energyCost: 30,
        cooldown: 3,
        effect: {
            type: 'debuff',
            stat: 'defense',
            multiplier: 0.7,
            duration: 2
        },
        level: 5
    },
    'meditacao': {
        name: 'Meditação',
        description: 'Recupera 10% de vida e energia por turno por 3 turnos',
        price: 5000,
        emoji: '🧘',
        type: 'buff',
        energyCost: 40,
        cooldown: 5,
        effect: {
            type: 'regeneration',
            percentage: 0.1,
            duration: 3
        },
        level: 8
    },
    'escudo_magico': {
        name: 'Escudo Mágico',
        description: 'Cria uma barreira que absorve 100% do próximo dano',
        price: 6000,
        emoji: '🌟',
        type: 'combat',
        energyCost: 60,
        cooldown: 5,
        effect: {
            type: 'shield',
            value: 1
        },
        level: 10
    }
};

module.exports = { items, skills };
