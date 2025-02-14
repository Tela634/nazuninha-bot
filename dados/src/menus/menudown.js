async function menudown(prefix) {
  return `
╭━━━━━━━━━━━━━━━━━━━━━╮
┃ 📥 *MENU DE DOWNLOADS* 📥
╰━━━━━━━━━━━━━━━━━━━━━╯

╭─────────────────────╮
│  🛠️ *Comandos disponíveis* 
├─────────────────────┤
│🎥 *${prefix}tiktok* ou *${prefix}ttk*
│  ➥ _Baixa vídeos e fotos do TikTok._
│  ➥ _Uso: ${prefix}tiktok <link ou nome>_
│📌 *${prefix}pinterest* ou *${prefix}pin*
│  ➥ _Baixa fotos e vídeos do Pinterest._
│  ➥ _Uso: ${prefix}pinterest <link ou nome>_
│🎶 *${prefix}play*
│  ➥ _Baixa músicas pelo nome._
│  ➥ _Uso: ${prefix}play <nome da música>_
│💫 *${prefix}instagram* ou *${prefix}ig*
│  ➥ _Baixa fotos e vídeos do Instagram._
│  ➥ Uso: ${prefix}instagram <link>
╰─────────────────────╯

╭━━━━━━━━━━━━━━━━━━━━━╮
┃ 📥 *Aproveite os downloads!* 📥
╰━━━━━━━━━━━━━━━━━━━━━╯
`;
};

module.exports = menudown;