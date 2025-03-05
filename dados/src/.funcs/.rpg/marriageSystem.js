class MarriageSystem {
    constructor() {
        this.proposals = {}; // Armazena propostas ativas
        this.benefits = {
            // Bônus de casal
            'shared_bank': {
                name: 'Conta Conjunta',
                description: 'Acesso ao banco compartilhado',
                unlockLevel: 1
            },
            'exp_boost': {
                name: 'Amor Verdadeiro',
                description: '+20% de XP quando jogam juntos',
                unlockLevel: 5
            },
            'healing_boost': {
                name: 'Cuidado Mútuo',
                description: '+30% de cura um no outro',
                unlockLevel: 10
            },
            'combat_boost': {
                name: 'União Faz a Força',
                description: '+25% de dano em combate juntos',
                unlockLevel: 15
            },
            'luck_boost': {
                name: 'Sorte no Amor',
                description: '+15% de sorte em todas atividades',
                unlockLevel: 20
            }
        };

        // Presentes disponíveis
        this.gifts = {
            'flor': {
                name: 'Flor',
                description: 'Uma linda flor',
                price: 100,
                affection: 1,
                emoji: '🌹'
            },
            'chocolate': {
                name: 'Chocolate',
                description: 'Uma caixa de chocolates',
                price: 500,
                affection: 3,
                emoji: '🍫'
            },
            'anel': {
                name: 'Anel',
                description: 'Um anel precioso',
                price: 5000,
                affection: 10,
                emoji: '💍'
            },
            'colar': {
                name: 'Colar',
                description: 'Um colar elegante',
                price: 10000,
                affection: 15,
                emoji: '📿'
            },
            'coroa': {
                name: 'Coroa',
                description: 'Uma coroa majestosa',
                price: 50000,
                affection: 30,
                emoji: '👑'
            }
        };
    }

    propose(player, targetId) {
        if (player.marriage) {
            throw new Error('❌ Você já está casado!');
        }

        if (this.proposals[player.id]) {
            throw new Error('❌ Você já tem uma proposta pendente!');
        }

        // Cria a proposta
        this.proposals[player.id] = {
            from: player.id,
            to: targetId,
            timestamp: Date.now()
        };

        return {
            success: true,
            message: `💝 *PEDIDO DE CASAMENTO*\n\n` +
                    `@${player.id.split('@')[0]} pediu @${targetId.split('@')[0]} em casamento!\n\n` +
                    `Use /casar aceitar para aceitar o pedido!`
        };
    }

    acceptProposal(player, proposerId) {
        const proposal = this.proposals[proposerId];
        if (!proposal || proposal.to !== player.id) {
            throw new Error('❌ Não há pedido de casamento pendente!');
        }

        if (player.marriage) {
            throw new Error('❌ Você já está casado!');
        }

        // Remove a proposta
        delete this.proposals[proposerId];

        // Cria o casamento
        const marriage = {
            partner: proposerId,
            date: new Date().toISOString(),
            level: 1,
            affection: 0,
            sharedBank: 0,
            gifts: []
        };

        return {
            success: true,
            marriage: marriage,
            message: `💒 *CASAMENTO REALIZADO!*\n\n` +
                    `Parabéns aos noivos!\n` +
                    `@${player.id.split('@')[0]} & @${proposerId.split('@')[0]}\n\n` +
                    `_Que comecem as bênçãos do casal!_`
        };
    }

    divorce(player) {
        if (!player.marriage) {
            throw new Error('❌ Você não está casado!');
        }

        // Divide o banco compartilhado
        const sharedMoney = player.marriage.sharedBank;
        const half = Math.floor(sharedMoney / 2);

        // Adiciona metade para cada um
        player.money.wallet += half;

        return {
            success: true,
            amount: half,
            message: `💔 *DIVÓRCIO FINALIZADO*\n\n` +
                    `O casamento chegou ao fim...\n` +
                    `Dinheiro dividido: R$ ${half} para cada\n\n` +
                    `_Que encontrem a felicidade em novos caminhos._`
        };
    }

    giveGift(player, targetId, giftId) {
        if (!player.marriage || player.marriage.partner !== targetId) {
            throw new Error('❌ Você só pode dar presentes ao seu cônjuge!');
        }

        const gift = this.gifts[giftId];
        if (!gift) throw new Error('❌ Presente não encontrado!');

        if (player.money.wallet < gift.price) {
            throw new Error(`❌ Você precisa de R$ ${gift.price} para comprar este presente!`);
        }

        // Remove dinheiro e adiciona afeição
        player.money.wallet -= gift.price;
        player.marriage.affection += gift.affection;

        // Verifica level up do casamento
        let levelUp = false;
        while (player.marriage.affection >= player.marriage.level * 100) {
            player.marriage.affection -= player.marriage.level * 100;
            player.marriage.level++;
            levelUp = true;
        }

        return {
            success: true,
            levelUp: levelUp,
            message: `${gift.emoji} *PRESENTE DADO*\n\n` +
                    `Você deu ${gift.name} para seu amor!\n` +
                    `Afeição +${gift.affection}\n` +
                    (levelUp ? `\n🎊 Nível do casamento aumentou para ${player.marriage.level}!` : '')
        };
    }

    depositShared(player, amount) {
        if (!player.marriage) {
            throw new Error('❌ Você não está casado!');
        }

        if (player.money.wallet < amount) {
            throw new Error('❌ Você não tem dinheiro suficiente!');
        }

        // Transfere o dinheiro
        player.money.wallet -= amount;
        player.marriage.sharedBank += amount;

        return {
            success: true,
            message: `💰 *DEPÓSITO CONJUNTO*\n\n` +
                    `Valor: R$ ${amount}\n` +
                    `Novo saldo: R$ ${player.marriage.sharedBank}`
        };
    }

    withdrawShared(player, amount) {
        if (!player.marriage) {
            throw new Error('❌ Você não está casado!');
        }

        if (player.marriage.sharedBank < amount) {
            throw new Error('❌ Não há dinheiro suficiente na conta conjunta!');
        }

        // Transfere o dinheiro
        player.marriage.sharedBank -= amount;
        player.money.wallet += amount;

        return {
            success: true,
            message: `💰 *SAQUE CONJUNTO*\n\n` +
                    `Valor: R$ ${amount}\n` +
                    `Novo saldo: R$ ${player.marriage.sharedBank}`
        };
    }

    getMarriageInfo(player) {
        if (!player.marriage) {
            throw new Error('❌ Você não está casado!');
        }

        let text = `💑 *INFORMAÇÕES DO CASAMENTO* 💑\n\n`;
        text += `👫 Casal:\n`;
        text += `├ @${player.id.split('@')[0]}\n`;
        text += `└ @${player.marriage.partner.split('@')[0]}\n\n`;
        
        text += `📊 *STATUS*\n`;
        text += `├ Nível: ${player.marriage.level}\n`;
        text += `├ Afeição: ${player.marriage.affection}/${player.marriage.level * 100}\n`;
        text += `└ Casados há: ${this.getMarriageTime(player.marriage.date)}\n\n`;
        
        text += `🏦 *CONTA CONJUNTA*\n`;
        text += `└ Saldo: R$ ${player.marriage.sharedBank}\n\n`;
        
        text += `✨ *BENEFÍCIOS ATIVOS*\n`;
        Object.entries(this.benefits)
            .filter(([_, benefit]) => benefit.unlockLevel <= player.marriage.level)
            .forEach(([_, benefit]) => {
                text += `├ ${benefit.name}\n`;
                text += `└ ${benefit.description}\n`;
            });

        return text;
    }

    getMarriageTime(date) {
        const start = new Date(date);
        const now = new Date();
        const diff = now - start;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days < 1) return 'Menos de um dia';
        if (days < 30) return `${days} dias`;
        if (days < 365) return `${Math.floor(days / 30)} meses`;
        return `${Math.floor(days / 365)} anos`;
    }

    formatGiftList() {
        let text = `🎁 *PRESENTES DISPONÍVEIS* 🎁\n\n`;

        Object.entries(this.gifts).forEach(([id, gift]) => {
            text += `${gift.emoji} *${gift.name}*\n`;
            text += `├ ${gift.description}\n`;
            text += `├ Preço: R$ ${gift.price}\n`;
            text += `└ Afeição: +${gift.affection}\n\n`;
        });

        text += `💝 *COMO PRESENTEAR*\n`;
        text += `Use ${prefix}presente [item] @pessoa\n`;
        text += `Exemplo: ${prefix}presente flor @amor\n\n`;
        
        text += `💑 *BENEFÍCIOS DO CASAMENTO*\n`;
        Object.entries(this.benefits).forEach(([_, benefit]) => {
            text += `\n*${benefit.name}* (Nível ${benefit.unlockLevel})\n`;
            text += `└ ${benefit.description}`;
        });

        return text;
    }
}

module.exports = new MarriageSystem();
