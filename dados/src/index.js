//Criador: hiudy
//Versão: 0.0.1
//Esse arquivo contem direitos autorais, caso meus creditos sejam tirados poderei tomar medidas jurídicas.

const { downloadContentFromMessage } = require('baileys');
const { reportError, youtube, tiktok, pinterest }  = require(__dirname+'/.funcs/.exports.js');
const menu = require(__dirname+'/menus/menu.js');
const menudown = require(__dirname+'/menus/menudown.js');
const axios = require('axios');
const fs = require('fs');

async function NazuninhaBotExec(nazu, info) {
const { numerodono, nomedono, nomebot, prefixo, prefixo: prefix, debug } = JSON.parse(fs.readFileSync(__dirname+'/config.json'));
try {
 const from = info.key.remoteJid;
 const isGroup = from.endsWith('@g.us');
 const sender = isGroup ? info.key.participant.includes(':') ? info.key.participant.split(':')[0] +'@s.whatsapp.net': info.key.participant : info.key.remoteJid;
 const isStatus = from.endsWith('@broadcast');
 
 const baileys = require('baileys');
 const type = baileys.getContentType(info.message);
 
 const pushname = info.pushName ? info.pushName : '';
 
 var body = info.message?.conversation || info.message?.viewOnceMessageV2?.message?.imageMessage?.caption || info.message?.viewOnceMessageV2?.message?.videoMessage?.caption || info.message?.imageMessage?.caption || info.message?.videoMessage?.caption || info.message?.extendedTextMessage?.text || info.message?.viewOnceMessage?.message?.videoMessage?.caption || info.message?.viewOnceMessage?.message?.imageMessage?.caption || info.message?.documentWithCaptionMessage?.message?.documentMessage?.caption || info.message?.editedMessage?.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text || info.message?.editedMessage?.message?.protocolMessage?.editedMessage?.imageMessage?.caption || info?.text || '';
 
 const args = body.trim().split(/ +/).slice(1);
 const q = args.join(' ');
 const budy2 = body.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
 
 var isCmd = body.trim().startsWith(prefix);
 const command = isCmd ? budy2.trim().slice(1).split(/ +/).shift().toLocaleLowerCase().trim().replaceAll(' ', '') : null;
 
 //INFOS DE GRUPO
  const groupMetadata = await nazu.groupMetadata(from);
  const AllgroupMembers = groupMetadata.participants.map(p => p.id);
  const groupAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
  const botNumber = nazu.user.id.split(':')[0] + '@s.whatsapp.net';
  const isGroupAdmin = groupAdmins.includes(sender);
  const isBotAdmin = groupAdmins.includes(botNumber);
 
 //FUNÇÕES BASICAS
 async function reply(text) { return nazu.sendMessage(from, {text: text.trim()}, {sendEphemeral: true, contextInfo: { forwardingScore: 50, isForwarded: true, externalAdReply: { showAdAttribution: true }}, quoted: info})};nazu.reply=reply;
 
 const reagir = async (emj) => { if (typeof emj === 'string') { await nazu.sendMessage(from, { react: { text: emj, key: info.key } }); } else if (Array.isArray(emj)) { for (const emjzin of emj) { await nazu.sendMessage(from, { react: { text: emjzin, key: info.key } }); await new Promise(res => setTimeout(res, 500)); } } }; nazu.react = reagir;
 
 const getFileBuffer = async (mediakey, MediaType) => {const stream = await downloadContentFromMessage(mediakey, MediaType);let buffer = Buffer.from([]);for await(const chunk of stream) {buffer = Buffer.concat([buffer, chunk]) };return buffer}
 //FIM FUNÇÕES BASICAS
 
 switch(command) {

  case 'play':
  case 'ytmp3':
  try {
    if (!q) return reply(`Digite o nome da música.\n> Ex: ${prefix + command} Back to Black`);
    nazu.react(['❤️','💖']);
    datinha = await youtube.search(q);
    if(!datinha.ok) return reply(datinha.msg);
    await nazu.sendMessage(from, { image: { url: datinha.data.thumbnails.pop().url }, caption: `🎵 *Música Encontrada* 🎵\n\n📌 *Nome:* ${datinha.data.title}\n👤 *Canal:* ${datinha.data.channelName}\n👀 *Visualizações:* ${datinha.data.viewCount}\n🔗 *Link:* ${datinha.data.url}`, footer: `By: ${nomebot}` }, { quoted: info });
    dlRes = await youtube.mp3(datinha.data.url);
    if(!dlRes.ok) return reply(dlRes.msg);
    await nazu.sendMessage(from, {audio: {url: dlRes.url}, fileName: datinha.data.title, mimetype: 'audio/mp4'}, {quoted: info});
  } catch (e) {
    console.error(e);
    reply('Ocorreu um erro durante a requisição.');
  }
  break;
  
  case 'tiktok': case 'tiktokaudio': case 'tiktokvideo': case 'tiktoks': case 'tiktoksearch':
   try {
    if (!q) return reply(`Digite um nome ou o link de um vídeo.\n> Ex: ${prefix}${command} Gato`);
    nazu.react(['❤️','💖']);
    let isTikTokUrl = /^https?:\/\/(?:www\.|m\.|vm\.|t\.)?tiktok\.com\//.test(q);
    let datinha = await (isTikTokUrl ? tiktok.dl(q) : tiktok.search(q));
    if (!datinha.ok) return reply(datinha.msg);
    for (const urlz of datinha.urls) {
        await nazu.sendMessage(from, { [datinha.type]: { url: urlz }, mimetype: datinha.mime }, { quoted: info });
    }
    if (datinha.audio) await nazu.sendMessage(from, { audio: { url: datinha.audio }, mimetype: 'audio/mp4' }, { quoted: info });
   } catch (e) {
    console.error(e);
    reply('Ocorreu um erro durante a requisição.');
   }
   break;
  
  case 'pinterest': case 'pin': case 'pinterestdl': case 'pinterestsearch':
   try {
    if (!q) return reply(`Digite um nome ou envie um link do Pinterest.\n> Ex: ${prefix}${command} Gatos\n> Ex: ${prefix}${command} https://www.pinterest.com/pin/123456789/`);  
    nazu.react(['❤️','📌']); 
    let datinha = await (/^https?:\/\/(?:[a-zA-Z0-9-]+\.)?pinterest\.\w{2,6}(?:\.\w{2})?\/pin\/\d+|https?:\/\/pin\.it\/[a-zA-Z0-9]+/.test(q) ? pinterest.dl(q) : pinterest.search(q));
    if (!datinha.ok) return reply(datinha.msg);
    for (const urlz of datinha.urls) {
        await nazu.sendMessage(from, { [datinha.type]: { url: urlz }, mimetype: datinha.mime }, { quoted: info });
    }
   } catch (e) {
    console.error(e);
    reply('Ocorreu um erro na requisição.');
   }
   break;
   
   
   //MENUS AQUI BB
   case 'menu':
   await reply(await menu(prefix));
   break
   
   case 'menudown':
   await reply(await menudown(prefix));
   break
   
   
   //COMANDOS DE DONO BB
   case 'prefixo':
   case 'numerodono':
   case 'nomedono':
   case 'nomebot': try {
    if (!q) return reply(`Uso correto: ${prefix}${command} <valor>`);
     let config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
     config[command] = q;
     fs.writeFileSync(__dirname + '/config.json', JSON.stringify(config, null, 2));
     reply(`✅ ${command} atualizado para: *${q}*`);
   } catch (e) {
   console.error(e);
   reply('❌ Ocorreu um erro ao atualizar a configuração.');
   };
  break;
  
  
  //COMANDOS GERAIS
  case 'ping':
  try {
    const timestamp = Date.now();
    const speedConverted = (Date.now() - (info.messageTimestamp * 1000)) / 1000;
    const config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
    function formatUptime(seconds) {let d = Math.floor(seconds / (24 * 3600));let h = Math.floor((seconds % (24 * 3600)) / 3600);let m = Math.floor((seconds % 3600) / 60);let s = Math.floor(seconds % 60);let uptimeStr = [];if (d > 0) uptimeStr.push(`${d}d`);if (h > 0) uptimeStr.push(`${h}h`);if (m > 0) uptimeStr.push(`${m}m`);if (s > 0) uptimeStr.push(`${s}s`);return uptimeStr.join(' ');};    
    const uptime = formatUptime(process.uptime());    
    await reply(`\n📡 *Status do Bot*\n-----------------------------------\n🤖 *Nome:* ${config.nomebot}\n👤 *Dono:* ${config.nomedono}\n\n📌 *Prefixo:* ${config.prefixo}\n🚀 *Latência:* ${speedConverted.toFixed(3)}s\n⏳ *Uptime:* ${uptime}`);
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao obter as informações.');
  }
  break;
  
  case 'mention':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    
    let dir = __dirname + `/../database/grupos/`;
    let file = dir + `${from}.json`;

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({ mark: {} }, null, 2));

    let groupData = JSON.parse(fs.readFileSync(file));
    if (!groupData.mark) groupData.mark = {};

    if (!q) return reply(`📢 *Configuração de Marcações*\n\n🔧 Escolha como deseja ser mencionado:\n\n✅ *${prefix}mention all* → Marcado em tudo (marcações e jogos).\n📢 *${prefix}mention marca* → Apenas em marcações de administradores.\n🎮 *${prefix}mention games* → Somente em jogos do bot.\n🚫 *${prefix}mention 0* → Não será mencionado em nenhuma ocasião.`);

    let options = {  all: '✨ Você agora será mencionado em todas as interações do bot, incluindo marcações de administradores e os jogos!', marca: '📢 A partir de agora, você será mencionado apenas quando um administrador marcar.',games: '🎮 Você optou por ser mencionado somente em jogos do bot.', 0: '🔕 Silêncio ativado! Você não será mais mencionado pelo bot, nem em marcações nem em jogos.'};
    if (options[q.toLowerCase()] !== undefined) {
      groupData.mark[sender] = q.toLowerCase();
      fs.writeFileSync(file, JSON.stringify(groupData, null, 2));
      return reply(`*${options[q.toLowerCase()]}*`);
    }

    reply(`❌ Opção inválida! Use *${prefix}mention* para ver as opções.`);
  } catch (e) {
    console.error(e);
    reply('❌ Erro ao atualizar configuração.');
  }
  break;
  
  
  //COMANDOS DE ADM
  case 'banir':
  case 'ban':
  case 'kick':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!isBotAdmin) return reply('❌ O bot precisa ser administrador para remover membros.');
    const mentioned = info.message.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned) return reply('❌ Marque o usuário que deseja banir.');   
    await nazu.groupParticipantsUpdate(from, mentioned, 'remove');
    reply(`✅ Usuário banido com sucesso!`);
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao tentar banir o usuário.');
  }
  break;

case 'promover':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!isBotAdmin) return reply('❌ O bot precisa ser administrador para promover membros.');
    const mentioned = info.message.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned) return reply('❌ Marque o usuário que deseja promover.');
    await nazu.groupParticipantsUpdate(from, mentioned, 'promote');
    reply(`✅ Usuário promovido a administrador!`);
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao tentar promover o usuário.');
  }
  break;

case 'rebaixar':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!isBotAdmin) return reply('❌ O bot precisa ser administrador para rebaixar membros.');
    const mentioned = info.message.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned) return reply('❌ Marque o usuário que deseja rebaixar.');
    await nazu.groupParticipantsUpdate(from, mentioned, 'demote');
    reply(`✅ Usuário rebaixado com sucesso!`);
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao tentar rebaixar o usuário.');
  }
  break;

case 'setname':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!isBotAdmin) return reply('❌ O bot precisa ser administrador para mudar o nome do grupo.');
    const newName = q.trim();
    if (!newName) return reply('❌ Digite um novo nome para o grupo.');
    await nazu.groupUpdateSubject(from, newName);
    reply(`✅ Nome do grupo alterado para: *${newName}*`);
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao tentar mudar o nome do grupo.');
  }
  break;

case 'setdesc':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!isBotAdmin) return reply('❌ O bot precisa ser administrador para mudar a descrição do grupo.');
    const newDesc = q.trim();
    if (!newDesc) return reply('❌ Digite uma nova descrição para o grupo.');
    await nazu.groupUpdateDescription(from, newDesc);
    reply(`✅ Descrição do grupo alterada!`);
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao tentar mudar a descrição do grupo.');
  }
  break;

case 'setpp':
case 'fotogp':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!isBotAdmin) return reply('❌ O bot precisa ser administrador para mudar a foto do grupo.');
    if (!info.message.imageMessage) return reply('❌ Envie uma imagem com o comando para definir como foto do grupo.');
    const imageBuffer = await getFileBuffer(info.message.imageMessage, 'image');
    await nazu.updateProfilePicture(from, imageBuffer);    
    reply('✅ Foto do grupo alterada com sucesso!');
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao tentar mudar a foto do grupo.');
  }
  break;
  
  case 'marcar':
  if (!isGroup) return reply('❌ Apenas para grupos.');
  if (!isGroupAdmins) return reply('🚫 Apenas admins.');
  if (!isBotGroupAdmins) return reply('🤖 O bot precisa ser admin.');
  try {
    let path = __dirname + '/../database/grupos/' + from + '.json';
    let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : { mark: {} };
    let membros = AllgroupMembers.filter(m => !['0', 'games'].includes(data.mark[m]));
    if (!membros.length) return reply('❌ Nenhum membro para mencionar.');
    let msg = `📢 *Membros mencionados:* ${q ? `\n💬 *Mensagem:* ${q}` : ''}\n\n`;
    await nazu.sendMessage(from, {text: msg + membros.map(m => `➤ @${m.split('@')[0]}`).join('\n'), mentions: membros});
  } catch (e) {
    console.error(e);
    reply('⚠️ Erro ao marcar.');
  }
  break;
 default:
 if(isCmd) await nazu.react('❌');
 };
 
 
} catch(e) {
console.error(e);
var {version} = JSON.parse(fs.readFileSync(__dirname+'/../../package.json'));
if (debug) reportError(e, version);
};
};

module.exports = NazuninhaBotExec;