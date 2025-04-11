async function menuMembros(prefix, botName = "MeuBot", userName = "Usuário") {
  return `
╭─🌸 *${botName}*
│ Oii, *${userName}*
╰───────────────

╭──🌷 *COMANDOS GERAIS* 🌷──
│ Escolha sua opção:
├──────────────┤
│ *${prefix}mention*
│    → Configurar menções
│ *${prefix}ping*
│    → Verificar status da bot
│ *${prefix}rvisu*
│    → Revelar visualização única
│ *${prefix}totalcmd*
│    → Total de comandos do bot
│ *${prefix}rankativo*
│    → Ver ranking de ativos
│ *${prefix}rankinativo*
│    → Ver ranking de inativos
╰──────────────╯
`;
}

module.exports = menuMembros;