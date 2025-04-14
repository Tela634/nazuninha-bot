// Sistema de Jogo da Velha Premium
// Desenvolvido por Hiudy
// Mantenha os créditos, por favor! <3

const activeGames = {};
const pendingInvitations = {};

class TicTacToe {
  /**
   * Inicializa um jogo da velha
   * @param {string} player1 - ID do primeiro jogador
   * @param {string} player2 - ID do segundo jogador
   */
  constructor(player1, player2) {
    this.board = Array(9).fill(null);
    this.players = { X: player1, O: player2 };
    this.currentTurn = 'X';
    this.moves = 0;
    this.startTime = Date.now();
  }

  /**
   * Realiza uma jogada
   * @param {string} player - ID do jogador
   * @param {string|number} position - Posição (1-9)
   * @returns {Object} - Resultado da jogada
   */
  makeMove(player, position) {
    if (!this.players.X || !this.players.O) {
      return { success: false, message: '❌ Erro: Jogadores inválidos' };
    }

    if (player !== this.players[this.currentTurn]) {
      return { success: false, message: '❌ Não é sua vez!' };
    }

    const pos = parseInt(position);
    if (isNaN(pos) || pos < 1 || pos > 9) {
      return { success: false, message: '❌ Posição inválida! Use 1-9.' };
    }

    const index = pos - 1;
    if (this.board[index]) {
      return { success: false, message: '❌ Posição já ocupada!' };
    }

    this.board[index] = this.currentTurn === 'X' ? '❌' : '⭕';
    this.moves++;

    if (this.checkWin()) {
      const winner = this.players[this.currentTurn];
      return {
        success: true,
        finished: true,
        winner,
        board: this.renderBoard(),
        message: `🎮 *JOGO DA VELHA - FIM*\n\n🎉 @${winner.split('@')[0]} venceu! 🏆\n\n${this.renderBoard()}`,
        mentions: [winner]
      };
    }

    if (this.moves === 9) {
      return {
        success: true,
        finished: true,
        draw: true,
        board: this.renderBoard(),
        message: `🎮 *JOGO DA VELHA - FIM*\n\n🤝 Empate!\n\n${this.renderBoard()}`,
        mentions: Object.values(this.players)
      };
    }

    this.currentTurn = this.currentTurn === 'X' ? 'O' : 'X';
    return {
      success: true,
      finished: false,
      board: this.renderBoard(),
      message: `🎮 *JOGO DA VELHA*\n\n👉 Vez de @${this.players[this.currentTurn].split('@')[0]}\n\n${this.renderBoard()}\n\n💡 Digite um número de 1 a 9.`,
      mentions: [this.players[this.currentTurn]]
    };
  }

  /**
   * Renderiza o tabuleiro
   * @returns {string} - Tabuleiro formatado
   */
  renderBoard() {
    const display = pos => this.board[pos] || (pos + 1);
    return '```\n' +
      `${display(0)} │ ${display(1)} │ ${display(2)}\n` +
      '──┼───┼──\n' +
      `${display(3)} │ ${display(4)} │ ${display(5)}\n` +
      '──┼───┼──\n' +
      `${display(6)} │ ${display(7)} │ ${display(8)}\n` +
      '```';
  }

  /**
   * Verifica vitória
   * @returns {boolean} - Se há vencedor
   */
  checkWin() {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    return winPatterns.some(([a, b, c]) =>
      this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]
    );
  }
}

module.exports = {
  /**
   * Envia convite para um jogo
   * @param {string} groupId - ID do grupo
   * @param {string} inviter - ID do jogador que convida
   * @param {string} invitee - ID do jogador convidado
   * @returns {Object} - Resultado do convite
   */
  async invitePlayer(groupId, inviter, invitee) {
    if (!groupId || !inviter || !invitee || inviter === invitee) {
      return { success: false, message: '❌ Dados inválidos para o convite' };
    }

    if (activeGames[groupId]) {
      return { success: false, message: '❌ Já existe um jogo em andamento!' };
    }

    if (pendingInvitations[groupId]) {
      return { success: false, message: '❌ Já existe um convite pendente!' };
    }

    pendingInvitations[groupId] = { inviter, invitee, timestamp: Date.now() };

    // Timeout de 15 minutos
    setTimeout(() => delete pendingInvitations[groupId], 15 * 60 * 1000);

    return {
      success: true,
      message: `🎮 *CONVITE JOGO DA VELHA*\n\n@${inviter.split('@')[0]} convidou @${invitee.split('@')[0]}!\n\n✅ Aceitar: "sim", "s", "yes", "y"\n❌ Recusar: "não", "n", "no"\n\n⏳ Expira em 15 minutos.`,
      mentions: [inviter, invitee]
    };
  },

  /**
   * Processa resposta ao convite
   * @param {string} groupId - ID do grupo
   * @param {string} invitee - ID do jogador convidado
   * @param {string} response - Resposta do jogador
   * @returns {Object} - Resultado da resposta
   */
  processInvitationResponse(groupId, invitee, response) {
    const invitation = pendingInvitations[groupId];
    if (!invitation || invitation.invitee !== invitee) {
      return { success: false, message: '❌ Nenhum convite pendente para você' };
    }

    const normalizedResponse = response.toLowerCase().trim();
    const acceptResponses = ['s', 'sim', 'y', 'yes'];
    const rejectResponses = ['n', 'não', 'nao', 'no'];

    if (!acceptResponses.includes(normalizedResponse) && !rejectResponses.includes(normalizedResponse)) {
      return { success: false, message: '❌ Resposta inválida. Use "sim" ou "não"' };
    }

    delete pendingInvitations[groupId];

    if (rejectResponses.includes(normalizedResponse)) {
      return {
        success: true,
        accepted: false,
        message: '❌ Convite recusado. Jogo cancelado.',
        mentions: [invitation.inviter, invitee]
      };
    }

    activeGames[groupId] = new TicTacToe(invitation.inviter, invitation.invitee);
    return {
      success: true,
      accepted: true,
      message: `🎮 *JOGO DA VELHA*\n\n🎯 Iniciado!\n\n👥 Jogadores:\n➤ ❌: @${invitation.inviter.split('@')[0]}\n➤ ⭕: @${invitation.invitee.split('@')[0]}\n\n${activeGames[groupId].renderBoard()}\n\n💡 Vez de @${invitation.inviter.split('@')[0]} (1-9).`,
      mentions: [invitation.inviter, invitation.invitee]
    };
  },

  /**
   * Realiza uma jogada no jogo
   * @param {string} groupId - ID do grupo
   * @param {string} player - ID do jogador
   * @param {string|number} position - Posição (1-9)
   * @returns {Object} - Resultado da jogada
   */
  makeMove(groupId, player, position) {
    const game = activeGames[groupId];
    if (!game) {
      return { success: false, message: '❌ Nenhum jogo em andamento!' };
    }

    if (Date.now() - game.startTime > 30 * 60 * 1000) {
      delete activeGames[groupId];
      return { success: false, message: '❌ Jogo encerrado por inatividade (30 minutos)' };
    }

    const result = game.makeMove(player, position);
    if (result.finished) {
      delete activeGames[groupId];
    }
    return result;
  },

  /**
   * Encerra um jogo manualmente
   * @param {string} groupId - ID do grupo
   * @returns {Object} - Resultado do encerramento
   */
  endGame(groupId) {
    if (!activeGames[groupId]) {
      return { success: false, message: '❌ Nenhum jogo em andamento!' };
    }
    const players = Object.values(activeGames[groupId].players);
    delete activeGames[groupId];
    return {
      success: true,
      message: '🎮 Jogo encerrado manualmente!',
      mentions: players
    };
  },

  /**
   * Verifica se há jogo ativo
   * @param {string} groupId - ID do grupo
   * @returns {boolean} - Se há jogo ativo
   */
  hasActiveGame(groupId) {
    return !!activeGames[groupId];
  },

  /**
   * Verifica se há convite pendente
   * @param {string} groupId - ID do grupo
   * @returns {boolean} - Se há convite pendente
   */
  hasPendingInvitation(groupId) {
    return !!pendingInvitations[groupId];
  }
};

// Sistema de Jogo da Velha Premium
// Desenvolvido por Hiudy - Mantenha os créditos