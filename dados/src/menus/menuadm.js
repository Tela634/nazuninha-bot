async function menuadm(prefix) {
  return `
╭━━━━━━━━━━━━━━━━━━━━━╮
┃     🛠️ *MENU DE ADM* 🛠️     
╰━━━━━━━━━━━━━━━━━━━━━╯

╭─────────────────────╮
│ 🔧 *Comandos de Administração*
├─────────────────────┤
│🔒 *${prefix}hidetag*
│  ➥ _Marca todos os membros sem @_
│🔖 *${prefix}marcar*
│  ➥ _Marca todos os membros com @_
│🚫 *${prefix}ban* ou *${prefix}b*
│  ➥ _Bane um usuário do grupo_
│📈 *${prefix}promover*
│  ➥ _Promove um membro a admin_
│📉 *${prefix}rebaixar*
│  ➥ _Remove um usuário da admin_
│📝 *${prefix}setname*
│  ➥ _Altera o nome do grupo_
│📄 *${prefix}setdesc*
│  ➥ _Altera a descrição do grupo_
╰─────────────────────╯

╭━━━━━━━━━━━━━━━━━━━━━╮
┃  🌟 *Ativações disponíveis*
├─────────────────────┤
│🎮 *${prefix}modobn*
│  ➥ _Ativa o modo brincadeiras_
╰━━━━━━━━━━━━━━━━━━━━━╯
`;
}

module.exports = menuadm;