// Sistema de assalto
function attemptRobbery(player, target) {
    // Verifica se o jogador tem uma arma
    const weapon = player.inventory.find(item => item.type === 'weapon');
    if (!weapon) {
        throw new Error('❌ Você precisa de uma arma para assaltar! Compre uma na /loja');
    }

    // Verifica se o alvo tem escudo
    const shield = target.inventory?.find(item => item.id === 'escudo_magico');
    if (shield) {
        // 30% de chance de quebrar o escudo
        const breakShield = Math.random() < 0.3;
        if (breakShield) {
            // Remove o escudo do inventário
            target.inventory = target.inventory.filter(item => item.id !== 'escudo_magico');
            return {
                success: false,
                message: '🛡️ O alvo tinha um escudo mágico, mas você conseguiu quebrá-lo!',
                shieldBroken: true
            };
        } else {
            return {
                success: false,
                message: '🛡️ O alvo está protegido por um escudo mágico!',
                shieldBroken: false
            };
        }
    }

    // Calcula chance de sucesso baseado na arma
    const success = Math.random() < weapon.effect.successRate;
    
    if (success) {
        // Calcula o valor roubado
        const stolenAmount = Math.floor(
            Math.random() * (weapon.effect.maxReward - weapon.effect.minReward + 1) + 
            weapon.effect.minReward
        );

        // Verifica se o alvo tem dinheiro suficiente
        const availableMoney = target.money.wallet;
        const actualStolen = Math.min(stolenAmount, availableMoney);

        if (actualStolen <= 0) {
            return {
                success: false,
                message: '❌ O alvo está sem dinheiro na carteira!'
            };
        }

        // Transfere o dinheiro
        target.money.wallet -= actualStolen;
        player.money.wallet += actualStolen;

        return {
            success: true,
            amount: actualStolen,
            message: `💰 Assalto bem sucedido! Você roubou R$ ${actualStolen}`
        };
    } else {
        // Se falhar, perde dinheiro como penalidade
        const penalty = Math.floor(weapon.price * 0.1); // 10% do preço da arma
        if (player.money.wallet >= penalty) {
            player.money.wallet -= penalty;
        } else {
            player.money.wallet = 0;
        }

        return {
            success: false,
            penalty,
            message: `❌ O assalto falhou! Você perdeu R$ ${penalty} tentando fugir!`
        };
    }
}

module.exports = { attemptRobbery };
