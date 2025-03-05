class CasinoSystem {
    constructor() {
        // Jogos de Casino
        this.games = {
            // Roleta
            'roulette': {
                name: 'Roleta',
                description: 'Aposte em números ou cores',
                minBet: 100,
                maxBet: 100000,
                bets: {
                    'number': {
                        description: 'Número específico (0-36)',
                        payout: 36
                    },
                    'color': {
                        description: 'Vermelho ou Preto',
                        payout: 2,
                        options: ['red', 'black']
                    },
                    'even_odd': {
                        description: 'Par ou Ímpar',
                        payout: 2,
                        options: ['even', 'odd']
                    },
                    'dozen': {
                        description: '1-12, 13-24, 25-36',
                        payout: 3,
                        options: ['first', 'second', 'third']
                    }
                }
            },

            // Blackjack
            'blackjack': {
                name: 'Blackjack',
                description: 'Chegue mais perto de 21',
                minBet: 500,
                maxBet: 50000,
                actions: ['hit', 'stand', 'double', 'split'],
                payout: {
                    'blackjack': 2.5,
                    'win': 2,
                    'push': 1
                }
            },

            // Slots
            'slots': {
                name: 'Caça-Níquel',
                description: 'Combine símbolos',
                minBet: 100,
                maxBet: 10000,
                symbols: {
                    '🍒': { value: 2, chance: 0.2 },
                    '🍊': { value: 3, chance: 0.15 },
                    '🍇': { value: 4, chance: 0.1 },
                    '🔔': { value: 5, chance: 0.08 },
                    '💎': { value: 10, chance: 0.05 },
                    '7️⃣': { value: 20, chance: 0.02 }
                },
                lines: [
                    [0, 1, 2], // horizontal
                    [3, 4, 5], // horizontal
                    [6, 7, 8], // horizontal
                    [0, 4, 8], // diagonal
                    [2, 4, 6]  // diagonal
                ]
            },

            // Poker
            'poker': {
                name: 'Poker',
                description: 'Texas Hold\'em',
                minBuy: 5000,
                maxBuy: 500000,
                blinds: {
                    small: 100,
                    big: 200
                },
                maxPlayers: 6,
                hands: {
                    'royal_flush': 1000,
                    'straight_flush': 200,
                    'four_kind': 50,
                    'full_house': 25,
                    'flush': 15,
                    'straight': 10,
                    'three_kind': 5,
                    'two_pair': 3,
                    'pair': 2
                }
            },

            // Dados
            'dice': {
                name: 'Dados',
                description: 'Aposte no resultado',
                minBet: 200,
                maxBet: 20000,
                bets: {
                    'number': {
                        description: 'Número específico (1-6)',
                        payout: 6
                    },
                    'over_under': {
                        description: 'Maior/Menor que 3.5',
                        payout: 2
                    },
                    'sum': {
                        description: 'Soma dos dados',
                        payout: {
                            '2': 36,
                            '3': 18,
                            '4': 12,
                            '5': 9,
                            '6': 7,
                            '7': 6,
                            '8': 7,
                            '9': 9,
                            '10': 12,
                            '11': 18,
                            '12': 36
                        }
                    }
                }
            }
        };

        // Sistema VIP
        this.vipSystem = {
            levels: {
                'bronze': {
                    name: 'Bronze VIP',
                    requirement: 100000,
                    benefits: {
                        'max_bet_multiplier': 1.2,
                        'daily_bonus': 5000,
                        'cashback': 0.01
                    }
                },
                'silver': {
                    name: 'Silver VIP',
                    requirement: 500000,
                    benefits: {
                        'max_bet_multiplier': 1.5,
                        'daily_bonus': 15000,
                        'cashback': 0.02
                    }
                },
                'gold': {
                    name: 'Gold VIP',
                    requirement: 2000000,
                    benefits: {
                        'max_bet_multiplier': 2.0,
                        'daily_bonus': 50000,
                        'cashback': 0.05
                    }
                },
                'platinum': {
                    name: 'Platinum VIP',
                    requirement: 10000000,
                    benefits: {
                        'max_bet_multiplier': 3.0,
                        'daily_bonus': 200000,
                        'cashback': 0.1
                    }
                }
            }
        };

        // Sistema de Torneios
        this.tournaments = {
            'daily': {
                name: 'Torneio Diário',
                entryFee: 10000,
                prizePool: 100000,
                maxPlayers: 100,
                duration: 86400000, // 24 horas
                rewards: {
                    1: 0.5,  // 50% do prize pool
                    2: 0.3,  // 30% do prize pool
                    3: 0.2   // 20% do prize pool
                }
            },
            'weekly': {
                name: 'Torneio Semanal',
                entryFee: 50000,
                prizePool: 1000000,
                maxPlayers: 500,
                duration: 604800000, // 7 dias
                rewards: {
                    1: 0.4,
                    2: 0.25,
                    3: 0.15,
                    4: 0.1,
                    5: 0.1
                }
            },
            'monthly': {
                name: 'Torneio Mensal',
                entryFee: 200000,
                prizePool: 10000000,
                maxPlayers: 1000,
                duration: 2592000000, // 30 dias
                rewards: {
                    1: 0.3,
                    2: 0.2,
                    3: 0.15,
                    4: 0.1,
                    5: 0.08,
                    6: 0.07,
                    7: 0.05,
                    8: 0.03,
                    9: 0.01,
                    10: 0.01
                }
            }
        };
    }

    playRoulette(player, betType, betValue, amount) {
        game = this.games.roulette;
        const bet = game.bets[betType];

        if (!bet) throw new Error('❌ Tipo de aposta inválido!');

        // Verifica limites
        if (amount < game.minBet || amount > this.getMaxBet(player, game)) {
            throw new Error(`❌ Aposta deve ser entre R$ ${game.minBet} e R$ ${this.getMaxBet(player, game)}!`);
        }

        // Verifica dinheiro
        if (player.money.wallet < amount) {
            throw new Error('❌ Dinheiro insuficiente!');
        }

        // Gira a roleta
        const result = Math.floor(Math.random() * 37); // 0-36

        // Verifica vitória
        let win = false;
        switch(betType) {
            case 'number':
                win = result === parseInt(betValue);
                break;
            case 'color':
                const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
                win = (betValue === 'red' && redNumbers.includes(result)) ||
                     (betValue === 'black' && !redNumbers.includes(result) && result !== 0);
                break;
            case 'even_odd':
                win = (betValue === 'even' && result % 2 === 0 && result !== 0) ||
                     (betValue === 'odd' && result % 2 === 1);
                break;
            case 'dozen':
                win = (betValue === 'first' && result >= 1 && result <= 12) ||
                     (betValue === 'second' && result >= 13 && result <= 24) ||
                     (betValue === 'third' && result >= 25 && result <= 36);
                break;
        }

        // Processa resultado
        if (win) {
            const winnings = amount * bet.payout;
            player.money.wallet += winnings;
            this.updateStats(player, 'roulette', winnings - amount);
            
            return {
                success: true,
                result: result,
                win: true,
                amount: winnings,
                message: `🎰 *ROLETA - VITÓRIA!*\n\n` +
                        `Número: ${result}\n` +
                        `Aposta: R$ ${amount}\n` +
                        `Ganhou: R$ ${winnings}`
            };
        } else {
            player.money.wallet -= amount;
            this.updateStats(player, 'roulette', -amount);

            return {
                success: true,
                result: result,
                win: false,
                amount: -amount,
                message: `🎰 *ROLETA - DERROTA*\n\n` +
                        `Número: ${result}\n` +
                        `Aposta: R$ ${amount}\n` +
                        `Perdeu: R$ ${amount}`
            };
        }
    }

    playBlackjack(player, action, amount) {
        let game = this.games.blackjack;

        // Inicia novo jogo
        if (action === 'start') {
            // Verifica limites
            if (amount < game.minBet || amount > this.getMaxBet(player, game)) {
                throw new Error(`❌ Aposta deve ser entre R$ ${game.minBet} e R$ ${this.getMaxBet(player, game)}!`);
            }

            // Verifica dinheiro
            if (player.money.wallet < amount) {
                throw new Error('❌ Dinheiro insuficiente!');
            }

            // Cria jogo
            const playerHand = [this.drawCard(), this.drawCard()];
            const dealerHand = [this.drawCard(), this.drawCard()];

            return {
                id: `blackjack_${Date.now()}`,
                playerHand: playerHand,
                dealerHand: [dealerHand[0], '?'],
                bet: amount,
                status: 'playing',
                message: this.formatBlackjackHand(playerHand, [dealerHand[0], '?'])
            };
        }

        // Continua jogo existente
        game = player.casino?.currentGame;
        if (!game || game.status !== 'playing') {
            throw new Error('❌ Nenhum jogo em andamento!');
        }

        switch(action) {
            case 'hit':
                game.playerHand.push(this.drawCard());
                playerTotal = this.calculateHand(game.playerHand);
                
                if (playerTotal > 21) {
                    player.money.wallet -= game.bet;
                    this.updateStats(player, 'blackjack', -game.bet);
                    game.status = 'ended';
                    
                    return {
                        hand: game.playerHand,
                        dealerHand: game.dealerHand,
                        result: 'bust',
                        message: `🃏 *BLACKJACK - ESTOUROU!*\n\n` +
                                `Suas cartas: ${game.playerHand.join(' ')}\n` +
                                `Total: ${playerTotal}\n` +
                                `Perdeu: R$ ${game.bet}`
                    };
                }
                
                return {
                    hand: game.playerHand,
                    dealerHand: game.dealerHand,
                    message: this.formatBlackjackHand(game.playerHand, game.dealerHand)
                };

            case 'stand':
                // Revela carta do dealer
                game.dealerHand[1] = game.dealerHand[1].value;
                
                // Dealer compra até ter 17 ou mais
                while (this.calculateHand(game.dealerHand) < 17) {
                    game.dealerHand.push(this.drawCard());
                }

                playerTotal = this.calculateHand(game.playerHand);
                const dealerTotal = this.calculateHand(game.dealerHand);

                let result;
                let winnings = 0;

                if (dealerTotal > 21 || playerTotal > dealerTotal) {
                    result = 'win';
                    winnings = game.bet * game.payout.win;
                    player.money.wallet += winnings;
                } else if (playerTotal < dealerTotal) {
                    result = 'lose';
                    winnings = -game.bet;
                    player.money.wallet -= game.bet;
                } else {
                    result = 'push';
                    winnings = game.bet;
                    player.money.wallet += game.bet;
                }

                this.updateStats(player, 'blackjack', winnings - game.bet);
                game.status = 'ended';

                return {
                    hand: game.playerHand,
                    dealerHand: game.dealerHand,
                    result: result,
                    winnings: winnings,
                    message: `🃏 *BLACKJACK - ${result.toUpperCase()}*\n\n` +
                            `Suas cartas: ${game.playerHand.join(' ')}\n` +
                            `Total: ${playerTotal}\n\n` +
                            `Dealer: ${game.dealerHand.join(' ')}\n` +
                            `Total: ${dealerTotal}\n\n` +
                            `${winnings >= 0 ? 'Ganhou' : 'Perdeu'}: R$ ${Math.abs(winnings)}`
                };
        }
    }

    playSlots(player, amount) {
        game = this.games.slots;

        // Verifica limites
        if (amount < game.minBet || amount > this.getMaxBet(player, game)) {
            throw new Error(`❌ Aposta deve ser entre R$ ${game.minBet} e R$ ${this.getMaxBet(player, game)}!`);
        }

        // Verifica dinheiro
        if (player.money.wallet < amount) {
            throw new Error('❌ Dinheiro insuficiente!');
        }

        // Gira os slots
        const grid = [];
        for (let i = 0; i < 9; i++) {
            grid.push(this.spinSlot());
        }

        // Verifica linhas
        let totalWin = 0;
        const wins = [];

        game.lines.forEach(line => {
            const symbols = line.map(pos => grid[pos]);
            if (symbols.every(s => s === symbols[0])) {
                const win = amount * game.symbols[symbols[0]].value;
                totalWin += win;
                wins.push({
                    line: line,
                    symbol: symbols[0],
                    amount: win
                });
            }
        });

        // Processa resultado
        if (totalWin > 0) {
            player.money.wallet += totalWin;
            this.updateStats(player, 'slots', totalWin - amount);

            return {
                success: true,
                grid: grid,
                wins: wins,
                amount: totalWin,
                message: `🎰 *CAÇA-NÍQUEL - VITÓRIA!*\n\n` +
                        this.formatSlotsGrid(grid) + '\n\n' +
                        wins.map(w => `${w.symbol} Linha: R$ ${w.amount}`).join('\n') +
                        `\n\nTotal: R$ ${totalWin}`
            };
        } else {
            player.money.wallet -= amount;
            this.updateStats(player, 'slots', -amount);

            return {
                success: true,
                grid: grid,
                amount: -amount,
                message: `🎰 *CAÇA-NÍQUEL - DERROTA*\n\n` +
                        this.formatSlotsGrid(grid) + '\n\n' +
                        `Perdeu: R$ ${amount}`
            };
        }
    }

    playDice(player, betType, betValue, amount) {
        game = this.games.dice;
        const bet = game.bets[betType];

        if (!bet) throw new Error('❌ Tipo de aposta inválido!');

        // Verifica limites
        if (amount < game.minBet || amount > this.getMaxBet(player, game)) {
            throw new Error(`❌ Aposta deve ser entre R$ ${game.minBet} e R$ ${this.getMaxBet(player, game)}!`);
        }

        // Verifica dinheiro
        if (player.money.wallet < amount) {
            throw new Error('❌ Dinheiro insuficiente!');
        }

        // Rola os dados
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const sum = dice1 + dice2;

        // Verifica vitória
        let win = false;
        let payout = 0;

        switch(betType) {
            case 'number':
                win = dice1 === parseInt(betValue) || dice2 === parseInt(betValue);
                payout = bet.payout;
                break;
            case 'over_under':
                win = (betValue === 'over' && sum > 7) ||
                     (betValue === 'under' && sum < 7);
                payout = bet.payout;
                break;
            case 'sum':
                win = sum === parseInt(betValue);
                payout = bet.payout[betValue];
                break;
        }

        // Processa resultado
        if (win) {
            const winnings = amount * payout;
            player.money.wallet += winnings;
            this.updateStats(player, 'dice', winnings - amount);

            return {
                success: true,
                dice: [dice1, dice2],
                win: true,
                amount: winnings,
                message: `🎲 *DADOS - VITÓRIA!*\n\n` +
                        `Dados: ${dice1} ${dice2}\n` +
                        `Soma: ${sum}\n` +
                        `Aposta: R$ ${amount}\n` +
                        `Ganhou: R$ ${winnings}`
            };
        } else {
            player.money.wallet -= amount;
            this.updateStats(player, 'dice', -amount);

            return {
                success: true,
                dice: [dice1, dice2],
                win: false,
                amount: -amount,
                message: `🎲 *DADOS - DERROTA*\n\n` +
                        `Dados: ${dice1} ${dice2}\n` +
                        `Soma: ${sum}\n` +
                        `Aposta: R$ ${amount}\n` +
                        `Perdeu: R$ ${amount}`
            };
        }
    }

    joinTournament(player, type) {
        const tournament = this.tournaments[type];
        if (!tournament) throw new Error('❌ Torneio não encontrado!');

        // Verifica dinheiro
        if (player.money.wallet < tournament.entryFee) {
            throw new Error(`❌ Taxa de entrada: R$ ${tournament.entryFee}!`);
        }

        // Verifica se já está em um torneio
        if (player.casino?.currentTournament) {
            throw new Error('❌ Você já está em um torneio!');
        }

        // Entra no torneio
        player.money.wallet -= tournament.entryFee;
        player.casino = {
            ...player.casino,
            currentTournament: {
                type: type,
                points: 0,
                startTime: Date.now()
            }
        };

        return {
            success: true,
            message: `🏆 *TORNEIO ${tournament.name}*\n\n` +
                    `Taxa: R$ ${tournament.entryFee}\n` +
                    `Prêmio: R$ ${tournament.prizePool}\n` +
                    `Duração: ${tournament.duration / (1000 * 60 * 60)} horas`
        };
    }

    claimVIPBonus(player) {
        const vipLevel = this.getVIPLevel(player);
        if (!vipLevel) throw new Error('❌ Você não é VIP!');

        const benefits = this.vipSystem.levels[vipLevel].benefits;
        
        // Verifica cooldown
        const lastClaim = player.casino?.lastVIPClaim || 0;
        if (Date.now() - lastClaim < 86400000) { // 24 horas
            throw new Error('❌ Bônus já coletado hoje!');
        }

        // Dá bônus
        player.money.wallet += benefits.daily_bonus;
        player.casino = {
            ...player.casino,
            lastVIPClaim: Date.now()
        };

        return {
            success: true,
            amount: benefits.daily_bonus,
            message: `👑 *BÔNUS VIP*\n\n` +
                    `Nível: ${this.vipSystem.levels[vipLevel].name}\n` +
                    `Bônus: R$ ${benefits.daily_bonus}`
        };
    }

    getMaxBet(player, game) {
        const vipLevel = this.getVIPLevel(player);
        if (!vipLevel) return game.maxBet;

        return game.maxBet * this.vipSystem.levels[vipLevel].benefits.max_bet_multiplier;
    }

    getVIPLevel(player) {
        const totalBet = player.casino?.totalBet || 0;
        
        return Object.entries(this.vipSystem.levels)
            .reverse()
            .find(([_, level]) => totalBet >= level.requirement)?.[0];
    }

    updateStats(player, game, amount) {
        if (!player.casino) player.casino = {};
        
        player.casino.totalBet = (player.casino.totalBet || 0) + Math.abs(amount);
        player.casino[game] = {
            played: (player.casino[game]?.played || 0) + 1,
            won: (player.casino[game]?.won || 0) + (amount > 0 ? amount : 0),
            lost: (player.casino[game]?.lost || 0) + (amount < 0 ? -amount : 0)
        };
    }

    drawCard() {
        const suits = ['♠️', '♥️', '♣️', '♦️'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        return values[Math.floor(Math.random() * values.length)] + 
               suits[Math.floor(Math.random() * suits.length)];
    }

    calculateHand(hand) {
        let total = 0;
        let aces = 0;

        hand.forEach(card => {
            const value = card[0];
            if (value === 'A') {
                aces++;
                total += 11;
            } else if (['K', 'Q', 'J'].includes(value)) {
                total += 10;
            } else {
                total += parseInt(value);
            }
        });

        while (total > 21 && aces > 0) {
            total -= 10;
            aces--;
        }

        return total;
    }

    spinSlot() {
        const roll = Math.random();
        let cumulative = 0;

        for (const [symbol, data] of Object.entries(this.games.slots.symbols)) {
            cumulative += data.chance;
            if (roll <= cumulative) return symbol;
        }

        return Object.keys(this.games.slots.symbols)[0];
    }

    formatBlackjackHand(playerHand, dealerHand) {
        return `🃏 *BLACKJACK*\n\n` +
               `Suas cartas: ${playerHand.join(' ')}\n` +
               `Total: ${this.calculateHand(playerHand)}\n\n` +
               `Dealer: ${dealerHand.join(' ')}`;
    }

    formatSlotsGrid(grid) {
        return `${grid[0]} ${grid[1]} ${grid[2]}\n` +
               `${grid[3]} ${grid[4]} ${grid[5]}\n` +
               `${grid[6]} ${grid[7]} ${grid[8]}`;
    }

    formatCasinoStats(player) {
        if (!player.casino) {
            return `🎰 *ESTATÍSTICAS DO CASINO* 🎰\n\n` +
                   `_Você ainda não jogou no casino!_`;
        }

        let text = `🎰 *ESTATÍSTICAS DO CASINO* 🎰\n\n`;

        // VIP Status
        const vipLevel = this.getVIPLevel(player);
        if (vipLevel) {
            const vip = this.vipSystem.levels[vipLevel];
            text += `👑 *STATUS VIP*\n`;
            text += `├ Nível: ${vip.name}\n`;
            text += `├ Bônus Diário: R$ ${vip.benefits.daily_bonus}\n`;
            text += `├ Multiplicador: ${vip.benefits.max_bet_multiplier}x\n`;
            text += `└ Cashback: ${vip.benefits.cashback * 100}%\n\n`;
        }

        // Estatísticas Gerais
        text += `📊 *GERAL*\n`;
        text += `├ Total Apostado: R$ ${player.casino.totalBet}\n`;
        
        // Estatísticas por Jogo
        const games = ['roulette', 'blackjack', 'slots', 'dice'];
        games.forEach(game => {
            if (player.casino[game]) {
                const stats = player.casino[game];
                text += `\n🎲 *${this.games[game].name}*\n`;
                text += `├ Jogos: ${stats.played}\n`;
                text += `├ Ganhou: R$ ${stats.won}\n`;
                text += `└ Perdeu: R$ ${stats.lost}\n`;
            }
        });

        // Torneios
        if (player.casino.currentTournament) {
            const tournament = this.tournaments[player.casino.currentTournament.type];
            text += `\n🏆 *TORNEIO ATUAL*\n`;
            text += `├ ${tournament.name}\n`;
            text += `├ Pontos: ${player.casino.currentTournament.points}\n`;
            text += `└ Tempo: ${Math.floor((Date.now() - player.casino.currentTournament.startTime) / 
                (1000 * 60 * 60))}h`;
        }

        return text;
    }
}

module.exports = new CasinoSystem();
