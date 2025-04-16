/**
 * Menu de RPG (em desenvolvimento)
 * @module menurpg
 * @param {string} prefix - Prefixo dos comandos do bot
 * @param {string} [botName="MeuBot"] - Nome do bot
 * @param {string} [userName="Usuário"] - Nome do usuário
 * @returns {Promise<string>} Menu formatado com comandos de RPG
 * @description Lista os comandos relacionados ao sistema de RPG
 * (Funcionalidade em desenvolvimento)
 */
async function menuRpg(prefix, botName = "MeuBot", userName = "Usuário") {
  return `
╭─🌸 *${botName}*
│ Oii, *${userName}*
╰───────────────

╭─🌷 *RPG (EM BREVE)* 🌷─
│ Escolha sua opção:
├──────────────┤
│ Em breve!
╰──────────────╯
`;
}

module.exports = menuRpg;
