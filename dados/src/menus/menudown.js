async function menudown(prefix) {
  return `
╭━━━━━━━━━━━━━━━━━━━━━╮
┃ 📥 *MENU DE DOWNLOADS* 📥
╰━━━━━━━━━━━━━━━━━━━━━╯

╭─────────────────────╮
│  🛠️ *Comandos disponíveis* 
├─────────────────────┤
│🎥 *${prefix}tiktok*
│  ➥ _Baixa vídeos, fotos e áudio do TikTok._
│  ➥ Uso: ${prefix}tiktok <link ou nome>
├─────────────────────┤
│📌 *${prefix}pinterest* ou *${prefix}pin*
│  ➥ _Baixa fotos ou vídeos do Pinterest._
│  ➥ Uso: ${prefix}pinterest <link ou nome>
├─────────────────────┤
│🎶 *${prefix}play*
│  ➥ _Baixa músicas pelo nome._
│  ➥ Uso: ${prefix}play <nome da música>
╰─────────────────────╯

╭━━━━━━━━━━━━━━━━━━━━━╮
┃ 📥 *Aproveite os downloads!* 📥
╰━━━━━━━━━━━━━━━━━━━━━╯
`;
};

module.exports = menudown;