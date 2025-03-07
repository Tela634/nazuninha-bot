// Sistema de Jogo da Velha
// Sistema unico, diferente de qualquer outro bot
// Criador: Hiudy
// Caso for usar deixe o caralho dos créditos 
// <3

const activeGames = {};

class TicTacToe {
    constructor(player1, player2) {
        this.board = Array(9).fill('');
        this.players = {
            'X': player1,
            'O': player2
        };
        this.currentTurn = 'X';
        this.moves = 0;
    };

    makeMove(player, position) {
        if (player !== this.players[this.currentTurn]) {
            return { success: false, message: '❌ Não é sua vez de jogar!' };
        };

        if (position < 1 || position > 9) {
            return { success: false, message: '❌ Posição inválida! Escolha um número entre 1 e 9.' };
        };

        const index = position - 1;

        if (this.board[index] !== '') {
            return { success: false, message: '❌ Esta posição já está ocupada!' };
        };

        this.board[index] = this.currentTurn;
        this.moves++;

        if (this.checkWin()) {
            return {
                success: true,
                finished: true,
                winner: player,
                board: this.renderBoard(),
                message: `🎮 *JOGO DA VELHA - FIM DE JOGO*\n\n🎉 @${player.split('@')[0]} venceu! 🏆\n\n${this.renderBoard()}`
            };
        };

        if (this.moves === 9) {
            return {
                success: true,
                finished: true,
                draw: true,
                board: this.renderBoard(),
                message: `🎮 *JOGO DA VELHA - FIM DE JOGO*\n\n🤝 Deu velha! Jogo empatado!\n\n${this.renderBoard()}`
            };
        };

        this.currentTurn = this.currentTurn === 'X' ? 'O' : 'X';

        return {
            success: true,
            finished: false,
            board: this.renderBoard(),
            message: `🎮 *JOGO DA VELHA*\n\n👉 Vez de @${this.players[this.currentTurn].split('@')[0]}\n\n${this.renderBoard()}\n\n💡 Digite o número da opção para jogar.`
        };
    };

    renderBoard() {
        let board = '';
        for (let i = 0; i < 9; i += 3) {
            for (let j = i; j < i + 3; j++) {
                board += this.board[j] || (j + 1);
                if (j < i + 2) board += ' │ ';
            };
            if (i < 6) board += '\n──┼───┼──\n';
        };
        return '```\n' + board + '\n```';
    };

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
    };
};

module.exports = {
    startGame: (groupId, player1, player2) => {
        if (activeGames[groupId]) {
            return { 
                success: false, 
                message: '❌ Já existe um jogo em andamento neste grupo!' 
            };
        };
        activeGames[groupId] = new TicTacToe(player1, player2);
        return {
            success: true,
            message: `🎮 *JOGO DA VELHA*\n\n🎯 Jogo iniciado!\n\n👥 Jogadores:\n➤ ❌: @${player1.split('@')[0]}\n➤ ⭕: @${player2.split('@')[0]}\n\n${activeGames[groupId].renderBoard()}\n\n💡 Digite o número da opção para jogar.`,
            mentions: [player1, player2]
        };
    },
    makeMove: (groupId, player, position) => {
        const game = activeGames[groupId];
        if (!game) {
            return { 
                success: false, 
                message: '❌ Não há nenhum jogo em andamento neste grupo!' 
            };
        };
        const result = game.makeMove(player, position);
        if (result.finished) {
            delete activeGames[groupId];
        };
        return result;
    },
    endGame: (groupId) => {
        if (!activeGames[groupId]) {
            return { 
                success: false, 
                message: '❌ Não há nenhum jogo em andamento neste grupo!' 
            };
        };
        delete activeGames[groupId];
        return { 
            success: true, 
            message: '🎮 Jogo encerrado!' 
        };
    },
    hasActiveGame: (groupId) => {
        return !!activeGames[groupId];
    }
};