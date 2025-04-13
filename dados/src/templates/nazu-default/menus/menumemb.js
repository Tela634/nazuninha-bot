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
│    → Ver ranking de ativos do grupo
│ *${prefix}rankinativo*
│    → Ver ranking de inativos
│ *${prefix}statusgp*
│    → Ver estatísticas do grupo
│ *${prefix}statusbot*
│    → Ver estatísticas globais do bot
│ *${prefix}meustatus*
│    → Ver suas estatísticas pessoais
│ *${prefix}rankativog*
│    → Ver ranking global de ativos
╰──────────────╯
`;
}

module.exports = menuMembros;