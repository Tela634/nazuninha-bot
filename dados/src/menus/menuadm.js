async function menuadm(prefix) {
  return `
╭━━━━━━━━━━━━━━━━━━━━━╮
┃     🛠️ MENU DE ADM 🛠️     
╰━━━━━━━━━━━━━━━━━━━━━╯

╭─────────────────────╮
│ 🔧 Comandos de Administração
├─────────────────────┤
│🔒 ${prefix}hidetag
│  ➥ Marca todos os membros sem @
│🔖 ${prefix}marcar
│  ➥ Marca todos os membros com @
│🚫 ${prefix}ban
│  ➥ Bane um usuário do grupo
│📈 ${prefix}promover
│  ➥ Promove um membro a admin
│📉 ${prefix}rebaixar
│  ➥ Remove um usuário da admin
│📝 ${prefix}setname
│  ➥ Altera o nome do grupo
│📄 ${prefix}setdesc
│  ➥ Altera a descrição do grupo
╰─────────────────────╯

╭━━━━━━━━━━━━━━━━━━━━━╮
┃  🌟 Ativações disponíveis
├─────────────────────┤
│🎮 ${prefix}modobn
│  ➥ Ativa o modo brincadeiras
╰━━━━━━━━━━━━━━━━━━━━━╯
`;
}

module.exports = menuadm;