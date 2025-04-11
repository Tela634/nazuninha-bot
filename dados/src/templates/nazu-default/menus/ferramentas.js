async function menuMembros(prefix, botName = "MeuBot", userName = "Usuário") {
  return `
╭─🌸 *${botName}*
│ Oii, *${userName}*
╰───────────────

╭─🌷 *FERRAMENTAS* 🌷─
│ Escolha sua opção: 
├──────────────┤
│ *${prefix}gerarnick* ou *${prefix}nick*
│    → Criar nicks personalizados
│ *${prefix}ssweb*
│    → Capturar tela de sites
│ *${prefix}upload*
│    → Fazer upload de arquivos
│ *${prefix}encurtalink*
│    → Encurtar links
╰──────────────╯
`;
};

module.exports = menuMembros;