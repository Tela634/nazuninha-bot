async function menudown(prefix, botName = "MeuBot", userName = "Usuário") {
  return `
╭─🌸 *${botName}*
│ Oii, *${userName}*
╰───────────────

╭──🌷 *PESQUISAS* 🌷──
│ Escolha sua opção:
├──────────────┤
│ *${prefix}play*
│    → Baixar música do YouTube
│ *${prefix}play2*
│    → Baixar música (alternativo)
│ *${prefix}playvid*
│    → Baixar vídeo do YouTube
│ *${prefix}playvid2*
│    → Baixar vídeo (alternativo)
│ *${prefix}assistir*
│    → Pesquisar vídeos para assistir
│ *${prefix}mcplugin*
│    → Buscar plugins de Minecraft
│ *${prefix}apkmod* ou *${prefix}mod*
│    → Buscar APKs modificados
╰──────────────╯

╭──🌷 *DOWNLOADS* 🌷──
│ Escolha sua opção:
├──────────────┤
│ *${prefix}tiktok* ou *${prefix}ttk*
│    → Baixar vídeos do TikTok
│ *${prefix}pinterest* ou *${prefix}pin*
│    → Baixar do Pinterest
│ *${prefix}instagram* ou *${prefix}ig*
│    → Baixar do Instagram
╰──────────────╯
`;
}

module.exports = menudown;