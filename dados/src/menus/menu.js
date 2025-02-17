async function menu(prefix) {
  return `
╭━━━━━━━━━━━━━━━━━━━━━╮
┃ 🌸 *MENU PRINCIPAL* 🌸
╰━━━━━━━━━━━━━━━━━━━━━╯

╭─────────────────────╮
│  📂 *Submenus disponíveis* 
├─────────────────────┤
│📥 *${prefix}menudown*
│  ➥ _Baixe músicas, vídeos, fotos_
│      _e muito mais!_
│🛠️ *${prefix}menuadm*
│  ➥ _Comandos de administração_
│      _e ativações do grupo_
│🎭 *${prefix}menubrincadeiras*
│  ➥ _Comandos de brincadeiras_
│      _e interações divertidas!_
│👑 *${prefix}menudono*
│  ➥ _Comandos exclusivos_
│      _para o dono do bot_
╰─────────────────────╯

╭━━━━━━━━━━━━━━━━━━━━━╮
┃ 🌸 *Explore e Divirta-se!* 🌸
╰━━━━━━━━━━━━━━━━━━━━━╯
`;
}

module.exports = menu;