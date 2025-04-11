async function menu(prefix, botName = "MeuBot", userName = "Usuário") {
  return `
╭─🌸 *${botName}*
│ Oii, *${userName}*
╰───────────────

╭──🌷 *SUBMENUS* 🌷──
│ Escolha sua opção: 
├──────────────┤
│ 🤖 *${prefix}menuia*
│    → inteligência artificial
│ 📥 *${prefix}menudown*
│    → Baixar vídeos e músicas
│ 🛠️ *${prefix}menuadm*
│    → Gerenciar o grupo
│ 🎭 *${prefix}menubn*
│    → Jogos e brincadeiras
│ 👑 *${prefix}menudono*
│    → Comandos do dono
│ 🌟 *${prefix}menumemb*
│    → Para todos os membros
│ ⚒️ *${prefix}ferramentas*
│    → Ferramentas úteis
│ 💫 *${prefix}menufig*
│    → Criar figurinhas
╰──────────────╯
`;
};

module.exports = menu;