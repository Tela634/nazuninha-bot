const menurpg = (prefix) => {
  return `
╭━━━『 🎮 RPG 』━━━╮
┃ *COMANDOS DE RPG*
┃
┃ *MINERAÇÃO* ⛏️
┃ ${prefix}minerar
┃ ${prefix}picareta
┃ ${prefix}mochila
┃ ${prefix}minerios
┃ ${prefix}upminerador
┃ ${prefix}skillminerador
┃ ${prefix}minas
┃
┃ *FAZENDA* 🌾
┃ ${prefix}plantar
┃ ${prefix}fazenda
┃ ${prefix}colher
┃ ${prefix}clima
┃ ${prefix}plantacoes
┃ ${prefix}upfazendeiro
┃ ${prefix}skillfazendeiro
┃ ${prefix}tratamentos
┃ ${prefix}ferramentas
┃
┃ *PESCA* 🎣
┃ ${prefix}pescar
┃ ${prefix}vara
┃ ${prefix}iscas
┃ ${prefix}peixes
┃ ${prefix}uppescador
┃ ${prefix}skillpescador
┃ ${prefix}locais
┃ ${prefix}equipamentos
┃
┃ *CULINÁRIA* 👨‍🍳
┃ ${prefix}cozinhar
┃ ${prefix}receitas
┃ ${prefix}ingredientes
┃ ${prefix}upcozinheiro
┃ ${prefix}skillcozinheiro
┃ ${prefix}cozinha
┃
┃ *CRAFTING* 🛠️
┃ ${prefix}craft
┃ ${prefix}craftlist
┃ ${prefix}estacoes
┃ ${prefix}comprarestacao
┃ ${prefix}melhorarestacao
┃ ${prefix}craftinfo
┃
┃ *BATALHA* ⚔️
┃ ${prefix}batalhar
┃ ${prefix}skills
┃ ${prefix}usarskill
┃ ${prefix}usaritem
┃ ${prefix}status
┃ ${prefix}classe
┃ ${prefix}subclasse
┃ ${prefix}talentos
┃ ${prefix}atributos
┃
┃ *RAID & BOSS* 🏰
┃ ${prefix}raid
┃ ${prefix}raidinfo
┃ ${prefix}entrarraid
┃ ${prefix}boss
┃ ${prefix}bosslist
┃ ${prefix}desafiarboss
┃
┃ *DUNGEON* 🏰
┃ ${prefix}dungeon
┃ ${prefix}dungeonlist
┃ ${prefix}explorar
┃ ${prefix}salaatual
┃
┃ *MISSÕES & CONQUISTAS* 📜
┃ ${prefix}missoes
┃ ${prefix}historia
┃ ${prefix}diarias
┃ ${prefix}semanais
┃ ${prefix}conquistas
┃ ${prefix}titulos
┃ ${prefix}colecao
┃
┃ *PETS* 🐾
┃ ${prefix}pet
┃ ${prefix}petinfo
┃ ${prefix}treinar
┃ ${prefix}habilidade
┃
┃ *CLÃ* 🛡️
┃ ${prefix}clan
┃ ${prefix}claninfo
┃ ${prefix}criarclan
┃ ${prefix}convidar
┃ ${prefix}expulsar
┃ ${prefix}promover
┃ ${prefix}rebaixar
┃ ${prefix}banco
┃ ${prefix}construcao
┃
┃ *FACÇÕES & GANGS* ⚔️
┃ ${prefix}faccao
┃ ${prefix}faccaoinfo
┃ ${prefix}guerra
┃ ${prefix}territorio
┃ ${prefix}gang
┃ ${prefix}ganginfo
┃ ${prefix}criargang
┃
┃ *ECONOMIA* 💰
┃ ${prefix}loja
┃ ${prefix}comprar
┃ ${prefix}vender
┃ ${prefix}mercado
┃ ${prefix}depositar
┃ ${prefix}sacar
┃ ${prefix}transferir
┃ ${prefix}carteira
┃ ${prefix}extrato
┃
┃ *INVESTIMENTOS* 📈
┃ ${prefix}investir
┃ ${prefix}portfolio
┃ ${prefix}acoes
┃ ${prefix}dividendos
┃
┃ *CASSINO* 🎲
┃ ${prefix}cassino
┃ ${prefix}roleta
┃ ${prefix}blackjack
┃ ${prefix}slots
┃
┃ *PROFISSÕES & CARREIRA* 🎓
┃ ${prefix}profissao
┃ ${prefix}profissaoinfo
┃ ${prefix}aprenderprof
┃ ${prefix}melhorarprof
┃ ${prefix}abandonarprof
┃ ${prefix}carreira
┃ ${prefix}trabalhar
┃ ${prefix}promover
┃ ${prefix}especializar
┃
┃ *EVENTOS* 🎉
┃ ${prefix}eventos
┃ ${prefix}eventoinfo
┃ ${prefix}participar
┃
┃ *GERAL* 📋
┃ ${prefix}registrar
┃ ${prefix}perfil
┃ ${prefix}inventario
┃
╰━━━━━━━━━━━━━━━╯
`
}

module.exports = menurpg;
