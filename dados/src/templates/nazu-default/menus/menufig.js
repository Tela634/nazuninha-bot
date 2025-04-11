async function menuMembros(prefix, botName = "MeuBot", userName = "Usuário") {
  return `
╭─🌸 *${botName}*
│ Oii, *${userName}*
╰───────────────

╭─🌷 *CRIAR FIGURINHAS* 🌷
│ Escolha sua opção:
├──────────────┤
│ *${prefix}emojimix*
│    → Combinar emojis em figurinhas
│ *${prefix}ttp*
│    → Texto em figurinha
│ *${prefix}sticker* ou *${prefix}s*
│    → Criar figurinha de mídia
│ *${prefix}qc*
│    → Criar figurinha com citação
╰──────────────╯

╭─🌷 *OUTROS COMANDOS* 🌷
│ Escolha sua opção:
├──────────────┤
│ *${prefix}figualetoria*
│    → Gerar figurinha aleatória
│ *${prefix}rename*
│    → Renomear figurinha
│ *${prefix}rgtake*
│    → Pegar figurinha registrada
│ *${prefix}take*
│    → Roubar figurinha
│ *${prefix}toimg*
│    → Converter figurinha em imagem
╰──────────────╯
`;
}

module.exports = menuMembros;