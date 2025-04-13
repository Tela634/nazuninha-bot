const activeGames = {};
const pendingInvitations = {};

class TicTacToe {
    constructor(player1, player2) {
        this.board = Array(9).fill('');
        this.players = {
            'X': player1,
            'O': player2
        };
        this.currentTurn = 'X';
        this.moves = 0;
        this.startTime = Date.now();
    }

    makeMove(player, position) {
        if (player !== this.players[this.currentTurn]) {
            return { success: false, message: '❌ Não é sua vez de jogar!' };
        }

        position = parseInt(position);
        if (isNaN(position) || position < 1 || position > 9) {
            return { success: false, message: '❌ Posição inválida! Escolha um número entre 1 e 9.' };
        }

        const index = position - 1;
        if (this.board[index] !== '') {
            return { success: false, message: '❌ Esta posição já está ocupada!' };
        }

        this.board[index] = this.currentTurn === 'X' ? "❌" : "⭕";
        this.moves++;

        if (this.checkWin()) {
            return {
                success: true,
                finished: true,
                winner: player,
                board: this.renderBoard(),
                message: `🎮 *JOGO DA VELHA - FIM DE JOGO*\n\n🎉 @${player.split('@')[0]} venceu! 🏆\n\n${this.renderBoard()}`
            };
        }

        if (this.moves === 9) {
            return {
                success: true,
                finished: true,
                draw: true,
                board: this.renderBoard(),
                message: `🎮 *JOGO DA VELHA - FIM DE JOGO*\n\n🤝 Deu velha! Jogo empatado!\n\n${this.renderBoard()}`
            };
        }

        this.currentTurn = this.currentTurn === 'X' ? 'O' : 'X';

        return {
            success: true,
            finished: false,
            board: this.renderBoard(),
            message: `🎮 *JOGO DA VELHA*\n\n👉 Vez de @${this.players[this.currentTurn].split('@')[0]}\n\n${this.renderBoard()}\n\n💡 Digite o número da posição (1-9) para jogar.`
        };
    }

    renderBoard() {
        let board = '';
        for (let i = 0; i < 9; i += 3) {
            for (let j = i; j < i + 3; j++) {
                board += this.board[j] || (j + 1);
                if (j < i + 2) board += ' │ ';
            }
            if (i < 6) board += '\n──┼───┼──\n';
        }
        return '```\n' + board + '\n```';
    }

    checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return this.board[a] && 
                   this.board[a] === this.board[b] && 
                   this.board[a] === this.board[c];
        });
    }
}

module.exports = {
    async invitePlayer(groupId, inviter, invitee) {
        if (activeGames[groupId]) {
            return { 
                success: false, 
                message: '❌ Já existe um jogo em andamento neste grupo!' 
            };
        }

        if (pendingInvitations[groupId]) {
            return {
                success: false,
                message: '❌ Já existe um convite pendente neste grupo!'
            };
        }

        pendingInvitations[groupId] = {
            inviter,
            invitee,
            timestamp: Date.now()
        };

        // Configura timeout para 15 minutos
        setTimeout(() => {
            if (pendingInvitations[groupId]) {
                delete pendingInvitations[groupId];
            }
        }, 15 * 60 * 1000);

        return {
            success: true,
            message: `🎮 *CONVITE PARA JOGO DA VELHA*\n\n@${inviter.split('@')[0]} convidou @${invitee.split('@')[0]} para um jogo!\n\n✅ Para aceitar, responda "s", "sim", "y" ou "yes"\n❌ Para recusar, responda "n", "não", "nao" ou "no"\n\n⏳ O convite expira em 15 minutos.`,
            mentions: [inviter, invitee]
        };
    },

    processInvitationResponse(groupId, invitee, response) {
        const invitation = pendingInvitations[groupId];
        if (!invitation || invitation.invitee !== invitee) {
            return { success: false, message: '❌ Nenhum convite pendente para você.' };
        }

        const normalizedResponse = response.toLowerCase();
        const accepted = ['s', 'sim', 'y', 'yes'].includes(normalizedResponse);
        const rejected = ['n', 'não', 'nao', 'no'].includes(normalizedResponse);

        if (!accepted && !rejected) {
            return { success: false, message: '❌ Resposta inválida. Use "sim" ou "não".' };
        }

        delete pendingInvitations[groupId];

        if (rejected) {
            return { 
                success: true, 
                accepted: false, 
                message: '❌ O convite foi recusado. Jogo cancelado.' 
            };
        }

        // Convite aceito - inicia o jogo
        activeGames[groupId] = new TicTacToe(invitation.inviter, invitation.invitee);
        return {
            success: true,
            accepted: true,
            message: `🎮 *JOGO DA VELHA*\n\n🎯 Jogo iniciado!\n\n👥 Jogadores:\n➤ ❌: @${invitation.inviter.split('@')[0]}\n➤ ⭕: @${invitation.invitee.split('@')[0]}\n\n${activeGames[groupId].renderBoard()}\n\n💡 Digite o número da posição (1-9) para jogar.`,
            mentions: [invitation.inviter, invitation.invitee]
        };
    },

    makeMove(groupId, player, position) {
        const game = activeGames[groupId];
        if (!game) {
            return { 
                success: false, 
                message: '❌ Não há nenhum jogo em andamento neste grupo!' 
            };
        }
        
        // Verifica se o jogo está inativo há muito tempo (30 minutos)
        if (Date.now() - game.startTime > 30 * 60 * 1000) {
            delete activeGames[groupId];
            return {
                success: false,
                message: '❌ O jogo foi encerrado por inatividade (30 minutos sem movimentos).'
            };
        }

        const result = game.makeMove(player, position);
        if (result.finished) {
            delete activeGames[groupId];
        }
        return result;
    },

    endGame(groupId) {
        if (!activeGames[groupId]) {
            return { 
                success: false, 
                message: '❌ Não há nenhum jogo em andamento neste grupo!' 
            };
        }
        delete activeGames[groupId];
        return { 
            success: true, 
            message: '🎮 Jogo encerrado pelo administrador!' 
        };
    },

    hasActiveGame(groupId) {
        return !!activeGames[groupId];
    },

    hasPendingInvitation(groupId) {
        return !!pendingInvitations[groupId];
    }
};

// Sistema de Jogo da Velha Premium
// Desenvolvido por Hiudy - Mantenha os créditos