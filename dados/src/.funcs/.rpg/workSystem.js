const jobs = {
    // Empregos Básicos
    'entregador': {
        name: 'Entregador',
        description: 'Entrega encomendas pela cidade',
        baseIncome: 100,
        xpPerWork: 20,
        level: 1,
        emoji: '🛵',
        messages: [
            'Você fez várias entregas pela cidade! 📦',
            'Entregou todas as encomendas no prazo! 🚚',
            'Recebeu várias gorjetas pelas entregas rápidas! 💰'
        ],
        bonusChance: 0.3, // 30% de chance de bonus
        bonusMultiplier: 1.5
    },
    'vendedor': {
        name: 'Vendedor',
        description: 'Vende produtos em uma loja',
        baseIncome: 150,
        xpPerWork: 25,
        level: 1,
        emoji: '🏪',
        messages: [
            'Você bateu a meta de vendas do dia! 📈',
            'Conseguiu vender vários produtos! 🛍️',
            'Fez um ótimo atendimento aos clientes! 👥'
        ],
        bonusChance: 0.35,
        bonusMultiplier: 1.6
    },
    'garcom': {
        name: 'Garçom',
        description: 'Atende clientes em restaurante',
        baseIncome: 120,
        xpPerWork: 22,
        level: 1,
        emoji: '🍽️',
        messages: [
            'Os clientes adoraram seu atendimento! 🤝',
            'Recebeu ótimas gorjetas hoje! 💰',
            'O restaurante estava lotado mas você deu conta! 🏃'
        ],
        bonusChance: 0.4,
        bonusMultiplier: 1.4
    },

    // Empregos Intermediários
    'policial': {
        name: 'Policial',
        description: 'Protege a cidade do crime',
        baseIncome: 300,
        xpPerWork: 40,
        level: 5,
        emoji: '👮',
        messages: [
            'Você prendeu vários criminosos hoje! 🚔',
            'Fez uma importante apreensão de drogas! 🚨',
            'Ajudou a manter a paz na cidade! ⭐'
        ],
        bonusChance: 0.35,
        bonusMultiplier: 1.8,
        events: [
            {
                name: 'Perseguição',
                chance: 0.2,
                reward: 500,
                message: '🚨 Você perseguiu e capturou um criminoso perigoso!'
            }
        ]
    },
    'professor': {
        name: 'Professor',
        description: 'Ensina em uma escola',
        baseIncome: 250,
        xpPerWork: 35,
        level: 5,
        emoji: '👨‍🏫',
        messages: [
            'Seus alunos aprenderam muito hoje! 📚',
            'A aula foi um sucesso! ✏️',
            'Você inspirou vários estudantes! 🎓'
        ],
        bonusChance: 0.3,
        bonusMultiplier: 1.7,
        events: [
            {
                name: 'Feira de Ciências',
                chance: 0.15,
                reward: 400,
                message: '🔬 Seu projeto na feira de ciências ganhou um prêmio!'
            }
        ]
    },
    'chef': {
        name: 'Chef',
        description: 'Cozinha em restaurante fino',
        baseIncome: 400,
        xpPerWork: 45,
        level: 5,
        emoji: '👨‍🍳',
        messages: [
            'Seus pratos fizeram muito sucesso! 🍽️',
            'O restaurante recebeu elogios pela sua comida! ⭐',
            'Você criou um novo prato incrível! 🍳'
        ],
        bonusChance: 0.4,
        bonusMultiplier: 2.0,
        events: [
            {
                name: 'Crítico Gastronômico',
                chance: 0.1,
                reward: 1000,
                message: '🌟 Um crítico famoso adorou sua comida!'
            }
        ]
    },

    // Empregos Avançados
    'medico': {
        name: 'Médico',
        description: 'Salva vidas no hospital',
        baseIncome: 800,
        xpPerWork: 100,
        level: 10,
        emoji: '👨‍⚕️',
        messages: [
            'Você realizou uma cirurgia complexa com sucesso! 🏥',
            'Salvou várias vidas hoje no hospital! ❤️',
            'Seu diagnóstico preciso ajudou muitos pacientes! 📋'
        ],
        bonusChance: 0.3,
        bonusMultiplier: 2.5,
        events: [
            {
                name: 'Cirurgia de Emergência',
                chance: 0.15,
                reward: 2000,
                message: '💉 Você realizou uma cirurgia de emergência e salvou uma vida!'
            }
        ]
    },
    'advogado': {
        name: 'Advogado',
        description: 'Defende casos importantes',
        baseIncome: 700,
        xpPerWork: 90,
        level: 10,
        emoji: '👨‍⚖️',
        messages: [
            'Você ganhou um caso importante! ⚖️',
            'Defendeu seu cliente com sucesso! 📜',
            'Fechou um acordo milionário! 💼'
        ],
        bonusChance: 0.35,
        bonusMultiplier: 2.2,
        events: [
            {
                name: 'Caso de Alto Perfil',
                chance: 0.1,
                reward: 3000,
                message: '⚖️ Você venceu um caso muito importante!'
            }
        ]
    },
    'empresario': {
        name: 'Empresário',
        description: 'Gerencia uma empresa',
        baseIncome: 1000,
        xpPerWork: 120,
        level: 10,
        emoji: '💼',
        messages: [
            'Sua empresa teve lucros recordes! 📈',
            'Fechou um contrato milionário! 💰',
            'Expandiu os negócios internacionalmente! 🌎'
        ],
        bonusChance: 0.4,
        bonusMultiplier: 3.0,
        events: [
            {
                name: 'Fusão Empresarial',
                chance: 0.05,
                reward: 5000,
                message: '🏢 Você realizou uma fusão empresarial de sucesso!'
            }
        ]
    },

    // Empregos Especiais
    'hacker': {
        name: 'Hacker',
        description: 'Especialista em segurança digital',
        baseIncome: 1500,
        xpPerWork: 150,
        level: 15,
        emoji: '👨‍💻',
        messages: [
            'Você impediu um ataque cibernético! 🔒',
            'Descobriu uma falha de segurança crítica! 💻',
            'Protegeu dados importantes! 🛡️'
        ],
        bonusChance: 0.45,
        bonusMultiplier: 3.5,
        events: [
            {
                name: 'Ameaça Digital',
                chance: 0.1,
                reward: 8000,
                message: '🔓 Você impediu um ataque hacker massivo!'
            }
        ]
    },
    'astronauta': {
        name: 'Astronauta',
        description: 'Explora o espaço',
        baseIncome: 2000,
        xpPerWork: 200,
        level: 20,
        emoji: '👨‍🚀',
        messages: [
            'Você fez descobertas importantes no espaço! 🚀',
            'Completou uma missão espacial com sucesso! 🛸',
            'Coletou amostras de um asteroide! ☄️'
        ],
        bonusChance: 0.5,
        bonusMultiplier: 4.0,
        events: [
            {
                name: 'Descoberta Espacial',
                chance: 0.05,
                reward: 10000,
                message: '🌠 Você descobriu um novo planeta habitável!'
            }
        ]
    }
};

function formatJobList(player) {
    let text = `💼 *EMPREGOS DISPONÍVEIS* 💼\n\n`;
    
    // Organiza os empregos por nível
    const categories = {
        'Empregos Básicos (Nível 1)': Object.entries(jobs).filter(([_, job]) => job.level === 1),
        'Empregos Intermediários (Nível 5)': Object.entries(jobs).filter(([_, job]) => job.level === 5),
        'Empregos Avançados (Nível 10)': Object.entries(jobs).filter(([_, job]) => job.level === 10),
        'Empregos Especiais (Nível 15+)': Object.entries(jobs).filter(([_, job]) => job.level >= 15)
    };

    for (const [category, jobList] of Object.entries(categories)) {
        if (jobList.length > 0) {
            text += `\n*${category}*\n`;
            jobList.forEach(([id, job]) => {
                const available = player.level >= job.level;
                text += `\n${job.emoji} *${job.name}*\n`;
                text += `├ ${job.description}\n`;
                text += `├ Salário base: R$ ${job.baseIncome}\n`;
                text += `├ XP por trabalho: ${job.xpPerWork}\n`;
                text += `├ Chance de bônus: ${job.bonusChance * 100}%\n`;
                if (job.events) {
                    text += `├ Eventos especiais: ${job.events.length}\n`;
                }
                text += `└ ${available ? '✅ Disponível' : `❌ Requer nível ${job.level}`}\n`;
            });
        }
    }

    return text;
}

function startWork(player) {
    const job = jobs[player.job];
    if (!job) throw new Error('❌ Você não tem um emprego! Use /trabalhos para ver as opções.');

    // Mensagem aleatória de trabalho
    const message = job.messages[Math.floor(Math.random() * job.messages.length)];

    // Calcula recompensa base
    let moneyEarned = job.baseIncome;
    let xpEarned = job.xpPerWork;
    let bonusText = '';

    // Chance de bônus
    if (Math.random() < job.bonusChance) {
        moneyEarned *= job.bonusMultiplier;
        xpEarned *= job.bonusMultiplier;
        bonusText = '\n\n🎉 *BÔNUS!* Você teve um desempenho excepcional!';
    }

    // Chance de evento especial
    let eventText = '';
    if (job.events) {
        for (const event of job.events) {
            if (Math.random() < event.chance) {
                moneyEarned += event.reward;
                eventText = `\n\n🌟 *EVENTO ESPECIAL*\n${event.message}\n💰 Recompensa extra: R$ ${event.reward}`;
                break;
            }
        }
    }

    // Atualiza dinheiro e XP do jogador
    player.money.wallet += moneyEarned;
    player.xp += xpEarned;

    // Verifica level up
    const oldLevel = player.level;
    while (player.xp >= player.level * 100) {
        player.xp -= player.level * 100;
        player.level++;
    }
    const levelUp = player.level > oldLevel;

    return {
        success: true,
        message: message + bonusText + eventText,
        rewards: {
            money: moneyEarned,
            xp: xpEarned
        },
        levelUp: levelUp
    };
}

module.exports = {
    jobs,
    formatJobList,
    startWork
};
