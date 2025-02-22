//Criador: hiudy
//Versão: 0.0.1
//Esse arquivo contem direitos autorais, caso meus creditos sejam tirados poderei tomar medidas jurídicas.

const { downloadContentFromMessage, Mimetype } = require('baileys');
const { reportError, youtube, tiktok, pinterest, igdl, sendSticker, FilmesDL }  = require(__dirname+'/.funcs/.exports.js');
const { menu, menudown, menuadm, menubn, menuDono } = require(__dirname+'/menus/index.js');
const axios = require('axios');
const pathz = require('path');
const fs = require('fs');

async function NazuninhaBotExec(nazu, info) {
const { numerodono, nomedono, nomebot, prefixo, prefixo: prefix, debug } = JSON.parse(fs.readFileSync(__dirname+'/config.json'));
try {
 const from = info.key.remoteJid;
 const isGroup = from.endsWith('@g.us');
 const sender = isGroup ? info.key.participant.includes(':') ? info.key.participant.split(':')[0] +'@s.whatsapp.net': info.key.participant : info.key.remoteJid;
 const isStatus = from.endsWith('@broadcast');
 const nmrdn = numerodono.replace(new RegExp("[()+-/ +/]", "gi"), "") + `@s.whatsapp.net`
 const isOwner = nmrdn == sender ? true : false;
 
 const baileys = require('baileys');
 const type = baileys.getContentType(info.message);
 
 const pushname = info.pushName ? info.pushName : '';
 
 var body = info.message?.conversation || info.message?.viewOnceMessageV2?.message?.imageMessage?.caption || info.message?.viewOnceMessageV2?.message?.videoMessage?.caption || info.message?.imageMessage?.caption || info.message?.videoMessage?.caption || info.message?.extendedTextMessage?.text || info.message?.viewOnceMessage?.message?.videoMessage?.caption || info.message?.viewOnceMessage?.message?.imageMessage?.caption || info.message?.documentWithCaptionMessage?.message?.documentMessage?.caption || info.message?.editedMessage?.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text || info.message?.editedMessage?.message?.protocolMessage?.editedMessage?.imageMessage?.caption || info?.text || '';
 
 const args = body.trim().split(/ +/).slice(1);
 const q = args.join(' ');
 const budy2 = body.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
 const menc_prt = info.message?.extendedTextMessage?.contextInfo?.participant;
 const menc_jid = args?.join(" ").replace("@", "") + "@s.whatsapp.net";
 const menc_jid2 = info.message?.extendedTextMessage?.contextInfo?.mentionedJid;
 const menc_os2 = q.includes("@") ? menc_jid : menc_prt;
 const sender_ou_n = q.includes("@") ? menc_jid : menc_prt ? menc_prt : sender;

 var isCmd = body.trim().startsWith(prefix);
 const command = isCmd ? budy2.trim().slice(1).split(/ +/).shift().toLocaleLowerCase().trim().replaceAll(' ', '') : null;
 
 //INFOS DE GRUPO
  const groupMetadata = !isGroup ? {} : await nazu.groupMetadata(from);
  const AllgroupMembers = !isGroup ? [] : groupMetadata.participants.map(p => p.id);
  const groupAdmins = !isGroup ? [] : groupMetadata.participants.filter(p => p.admin).map(p => p.id);
  const botNumber = nazu.user.id.split(':')[0] + '@s.whatsapp.net';
  const isGroupAdmin = !isGroup ? null : groupAdmins.includes(sender) || isOwner;
  const isBotAdmin = !isGroup ? null : groupAdmins.includes(botNumber);
  if(isGroup) {
  if (!fs.existsSync(__dirname + `/../database/grupos`)) fs.mkdirSync(__dirname + `/../database/grupos`, { recursive: true });
  if (!fs.existsSync(__dirname + `/../database/grupos/${from}.json`)) fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify({ mark: {} }, null, 2));
  };
  let groupData = {};
  try {groupData = JSON.parse(fs.readFileSync(__dirname + `/../database/grupos/${from}.json`));} catch (error) {};
  const isModoBn = groupData.modobrincadeira ? true : false;
     
 //FUNÇÕES BASICAS
 async function reply(text) { return nazu.sendMessage(from, {text: text.trim()}, {sendEphemeral: true, contextInfo: { forwardingScore: 50, isForwarded: true, externalAdReply: { showAdAttribution: true }}, quoted: info})};nazu.reply=reply;
 
 const reagir = async (emj) => { if (typeof emj === 'string') { await nazu.sendMessage(from, { react: { text: emj, key: info.key } }); } else if (Array.isArray(emj)) { for (const emjzin of emj) { await nazu.sendMessage(from, { react: { text: emjzin, key: info.key } }); await new Promise(res => setTimeout(res, 500)); } } }; nazu.react = reagir;
 
 const getFileBuffer = async (mediakey, MediaType) => {const stream = await downloadContentFromMessage(mediakey, MediaType);let buffer = Buffer.from([]);for await(const chunk of stream) {buffer = Buffer.concat([buffer, chunk]) };return buffer}
 //FIM FUNÇÕES BASICAS
 
 //DEFINIÇÕES DE ISQUOTED
 const content = JSON.stringify(info.message);
 const isQuotedMsg = type === 'extendedTextMessage' && content.includes('conversation')
 const isQuotedMsg2 = type === 'extendedTextMessage' && content.includes('text')
 const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
 const isQuotedVisuU = type === 'extendedTextMessage' && content.includes('viewOnceMessage')
 const isQuotedVisuU2 = type === 'extendedTextMessage' && content.includes('viewOnceMessageV2')
 const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
 const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage')
 const isQuotedDocW = type === 'extendedTextMessage' && content.includes('documentWithCaptionMessage')
 const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
 const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
 const isQuotedContact = type === 'extendedTextMessage' && content.includes('contactMessage')
 const isQuotedLocation = type === 'extendedTextMessage' && content.includes('locationMessage')
 const isQuotedProduct = type === 'extendedTextMessage' && content.includes('productMessage')

 switch(command) {
  
  case 'assistir': {
  if(!q) return reply('Cadê o nome do filme ou episódio de série? 🤔');
  await reply('Um momento, estou buscando as informações para você 🕵️‍♂️');
  datyz = await FilmesDL(q);
  if(!datyz || !datyz.url) return reply('Desculpe, não consegui encontrar nada. Tente com outro nome de filme ou série. 😔');
  anu = await axios.get(`https://tinyurl.com/api-create.php?url=${datyz.url}`);
  linkEncurtado = anu.data;
  await nazu.sendMessage(from, {image: { url: datyz.img },caption: `Aqui está o que encontrei! 🎬\n\n*Nome*: ${datyz.name}\n\nSe tudo estiver certo, você pode assistir no link abaixo:\n${linkEncurtado}\n\nFique tranquilo, não é vírus! O link foi encurtado por ser muito longo.\n\n> Você pode apoiar o projeto de outra forma! 💖 Que tal dar uma estrela no repositório do GitHub? Isso ajuda a motivar e melhorar o bot!\n> ⭐ https://github.com/hiudyy/nazuninha-bot 🌟`}, { quoted: info });
  };
  break;
  
  case 'play':
  case 'ytmp3':
  try {
    if (!q) return reply(`Digite o nome da música.\n> Ex: ${prefix + command} Back to Black`);
    nazu.react(['❤️','💖']);
    datinha = await youtube.search(q);
    if(!datinha.ok) return reply(datinha.msg);
    await nazu.sendMessage(from, { image: { url: datinha.data.thumbnail }, caption: `🎵 *Música Encontrada* 🎵\n\n📌 *Nome:* ${datinha.data.title}\n👤 *Canal:* ${datinha.data.author.name}\n👀 *Visualizações:* ${datinha.data.views}\n🔗 *Link:* ${datinha.data.url}`, footer: `By: ${nomebot}` }, { quoted: info });
    dlRes = await youtube.mp3(datinha.data.url);
    if(!dlRes.ok) return reply(dlRes.msg);
    await nazu.sendMessage(from, {audio: {url: dlRes.url}, fileName: datinha.data.title, mimetype: 'audio/mp4'}, {quoted: info});
  } catch (e) {
    console.error(e);
    reply('Ocorreu um erro durante a requisição.');
  }
  break;
  
  case 'playvid':
  case 'ytmp4':
  try {
    if (!q) return reply(`Digite o nome da música.\n> Ex: ${prefix + command} Back to Black`);
    nazu.react(['❤️','💖']);
    datinha = await youtube.search(q);
    if(!datinha.ok) return reply(datinha.msg);
    await nazu.sendMessage(from, { image: { url: datinha.data.thumbnail }, caption: `🎵 *Música Encontrada* 🎵\n\n📌 *Nome:* ${datinha.data.title}\n👤 *Canal:* ${datinha.data.author.name}\n👀 *Visualizações:* ${datinha.data.views}\n🔗 *Link:* ${datinha.data.url}`, footer: `By: ${nomebot}` }, { quoted: info });
    dlRes = await youtube.mp4(datinha.data.url);
    if(!dlRes.ok) return reply(dlRes.msg);
    await nazu.sendMessage(from, {video: {url: dlRes.url}, fileName: datinha.data.title, mimetype: 'video/mp4'}, {quoted: info});
  } catch (e) {
    console.error(e);
    reply('Ocorreu um erro durante a requisição.');
  }
  break;
  
  case 'tiktok': case 'tiktokaudio': case 'tiktokvideo': case 'tiktoks': case 'tiktoksearch': case 'ttk':
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
   
   case 'instagram': case 'igdl': case 'ig': case 'instavideo':
  try {
    if (!q) return reply(`Digite um link do Instagram.\n> Ex: ${prefix}${command} https://www.instagram.com/reel/DFaq_X7uoiT/?igsh=M3Q3N2ZyMWU1M3Bo`);
    nazu.react(['❤️', '📌']);
    const datinha = await igdl.dl(q);
    if (!datinha.ok) return reply(datinha.msg);
    await Promise.all(datinha.data.map(urlz => nazu.sendMessage(from, { [urlz.type]: urlz.buff }, { quoted: info })));
  } catch (e) {
    console.error(e);
    reply('Ocorreu um erro na requisição.');
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
   case 'menu': case 'help':
  nazu.sendMessage(from, {image: fs.readFileSync(__dirname+'/../midias/menu.jpg'), caption: await menu(prefix)}, {quoted: info});
  break;
  case 'menubn': case 'menubrincadeira': case 'menubrincadeiras':
  nazu.sendMessage(from, {image: fs.readFileSync(__dirname+'/../midias/menu.jpg'), caption: await menubn(prefix)}, {quoted: info});
  break;
  case 'menudown': case 'menudownload': case 'menudownloads':
  nazu.sendMessage(from, {image: fs.readFileSync(__dirname+'/../midias/menu.jpg'), caption: await menudown(prefix)}, {quoted: info});
  break;
  case 'menuadm': case 'menuadmin': case 'menuadmins':
  nazu.sendMessage(from, {image: fs.readFileSync(__dirname+'/../midias/menu.jpg'), caption: await menuadm(prefix)}, {quoted: info});
  break;
  case 'menudono': case 'ownermenu':
  if(!isOwner) return reply('Apenas meu dono.');
  nazu.sendMessage(from, {image: fs.readFileSync(__dirname+'/../midias/menu.jpg'), caption: await menuDono(prefix)}, {quoted: info});
  break;
   
   
   //COMANDOS DE DONO BB
   case 'prefixo':
   case 'numerodono':
   case 'nomedono':
   case 'nomebot': try {
    if(!isOwner) return reply('Apenas meu dono.');
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
  case 'totalcmd':
  case 'totalcomando':
    fs.readFile(__dirname + '/index.js', 'utf8', async (err, data) => {
      if (err) throw err;
      const comandos = [...data.matchAll(/case [`'"](\w+)[`'"]/g)].map(m => m[1]);
      const categorias = [
        { name: 'Sub Menus', files: ['/menus/menu.js'] },
        { name: 'Downloads', files: ['/menus/menudown.js'] },
        { name: 'Funções de adm', files: ['/menus/menuadm.js'] },
        { name: 'Brincadeiras', files: ['/menus/menubn.js'] },
        { name: 'Funções de dono', files: ['/menus/menudono.js'] },
      ];
      let comandosPorCategoria = {};
      let totalComandosCategoria = 0;
      const countComandos = (filePath) => new Promise((resolve, reject) => {
        fs.readFile(__dirname + filePath, 'utf8', (err, data) => {
          if (err) return reject(err);
          const count = (data.match(/{prefix}/g) || []).length;
          resolve(count);
        });
      });
      for (const categoria of categorias) {
        let comandosCategoria = 0;
        for (const file of categoria.files) {
          try {
            comandosCategoria += await countComandos(file);
          } catch (error) {
            console.error(`Erro ao contar comandos em ${file}:`, error);
          }
        }
        comandosPorCategoria[categoria.name] = comandosCategoria;
        totalComandosCategoria += comandosCategoria;
      };
      const comandosSemCategoria = comandos.length - totalComandosCategoria;
      await nazu.sendMessage(from, {image: {url: `https://nazuninha-banner-gen.onrender.com/banner?num=${String(comandos.length)}&theme=miku`}, caption: `╭━━〔 🤖 *Meus Comandos* 〕━━╮\n` + `┣ 📌 Total: *${comandos.length}* comandos\n` + `┣ 📌 Comandos por Categoria:\n┣\n` + Object.keys(comandosPorCategoria).map(categoria => `┣ 📌 ${categoria}: *${comandosPorCategoria[categoria]}* comandos`).join('\n') + `\n┣ 📌 Sem categoria: *${comandosSemCategoria}* comandos\n` + `╰━━━━━━━━━━━━━━━━━━━╯`}, { quoted: info });
    });
  break;

  case 'ping':
  try {
    const timestamp = Date.now();
    const speedConverted = (Date.now() - (info.messageTimestamp * 1000)) / 1000;
    const config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
    function formatUptime(seconds) {let d = Math.floor(seconds / (24 * 3600));let h = Math.floor((seconds % (24 * 3600)) / 3600);let m = Math.floor((seconds % 3600) / 60);let s = Math.floor(seconds % 60);let uptimeStr = [];if (d > 0) uptimeStr.push(`${d}d`);if (h > 0) uptimeStr.push(`${h}h`);if (m > 0) uptimeStr.push(`${m}m`);if (s > 0) uptimeStr.push(`${s}s`);return uptimeStr.join(' ');};    
    const uptime = formatUptime(process.uptime());
    await nazu.sendMessage(from, { image: {url: `https://nazuninha-banner-gen.onrender.com/banner?num=${String(speedConverted.toFixed(3)).replaceAll('.', '')}&theme=original`}, caption: `\n📡 *Status do Bot*\n-----------------------------------\n🤖 *Nome:* ${config.nomebot}\n👤 *Dono:* ${config.nomedono}\n\n📌 *Prefixo:* ${config.prefixo}\n🚀 *Latência:* ${speedConverted.toFixed(3)}s\n⏳ *Uptime:* ${uptime}` }, { quoted: info })
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao obter as informações.');
  }
  break;
  
  case 'st':
  case 'stk':
  case 'sticker':
  case 's': {
    var RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    var boij2 = RSM?.imageMessage || info.message?.imageMessage || RSM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSM?.viewOnceMessage?.message?.imageMessage;
   var boij = RSM?.videoMessage || info.message?.videoMessage || RSM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSM?.viewOnceMessage?.message?.videoMessage;
    if (!boij && !boij2) return reply(`Marque uma imagem ou um vídeo de até 9.9 segundos para fazer figurinha, com o comando: ${prefix + command} (mencionando a mídia)`);
    var isVideo = !!boij;
    if (isVideo && boij.seconds > 9.9) return reply(`O vídeo precisa ter no máximo 9.9 segundos para ser convertido em figurinha.`);
    var buffer = await getFileBuffer(isVideo ? boij : boij2, isVideo ? 'video' : 'image')
    await sendSticker(nazu, from, { sticker: buffer, author: '.', packname: '.', type: isVideo ? 'video' : 'image'}, { quoted: info })
  }
  break
  
  case 'mention':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!q) return reply(`📢 *Configuração de Marcações*\n\n🔧 Escolha como deseja ser mencionado:\n\n✅ *${prefix}mention all* → Marcado em tudo (marcações e jogos).\n📢 *${prefix}mention marca* → Apenas em marcações de administradores.\n🎮 *${prefix}mention games* → Somente em jogos do bot.\n🚫 *${prefix}mention 0* → Não será mencionado em nenhuma ocasião.`);
    let options = {  all: '✨ Você agora será mencionado em todas as interações do bot, incluindo marcações de administradores e os jogos!', marca: '📢 A partir de agora, você será mencionado apenas quando um administrador marcar.',games: '🎮 Você optou por ser mencionado somente em jogos do bot.', 0: '🔕 Silêncio ativado! Você não será mais mencionado pelo bot, nem em marcações nem em jogos.'};
    if (options[q.toLowerCase()] !== undefined) {
      if(!groupData.mark) groupData.mark = {};
      groupData.mark[sender] = q.toLowerCase();
      fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
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
  case 'b':
  case 'kick':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!isBotAdmin) return reply('❌ O bot precisa ser administrador para remover membros.');
    if (!menc_os2) return reply('❌ Marque o usuário que deseja banir.');   
    await nazu.groupParticipantsUpdate(from, [menc_os2], 'remove');
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
    if (!menc_os2) return reply('❌ Marque o usuário que deseja promover.');
    await nazu.groupParticipantsUpdate(from, [menc_os2], 'promote');
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
    if (!menc_os2) return reply('❌ Marque o usuário que deseja rebaixar.');
    await nazu.groupParticipantsUpdate(from, [menc_os2], 'demote');
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
  
  case 'marcar':
  if (!isGroup) return reply('❌ Apenas para grupos.');
  if (!isGroupAdmin) return reply('🚫 Apenas admins.');
  if (!isBotAdmin) return reply('🤖 O bot precisa ser admin.');
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
  
  case 'totag':
  case 'cita':
  case 'hidetag':
  if (!isGroup) return reply('❌ Apenas para grupos.');
  if (!isGroupAdmin) return reply('🚫 Apenas admins.');
  if (!isBotAdmin) return reply('🤖 O bot precisa ser admin.');
    const rsm4 = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const messageTypes = {image: isQuotedImage ? rsm4?.imageMessage : info.message?.imageMessage, video: isQuotedVideo ? rsm4?.videoMessage : info.message?.videoMessage, document: isQuotedDocument ? rsm4?.documentMessage : info.message?.documentMessage, documentWithCaption: isQuotedDocW ? rsm4?.documentWithCaptionMessage?.message?.documentMessage : info.message?.documentWithCaptionMessage?.message?.documentMessage, audio: isQuotedAudio ? rsm4.audioMessage : "", sticker: isQuotedSticker ? rsm4.stickerMessage : "", conversation: isQuotedMsg && !rsm4.audioMessage && !rsm4.stickerMessage && !rsm4.imageMessage && !rsm4.videoMessage && !rsm4.documentMessage && !rsm4.documentWithCaptionMessage ? rsm4.conversation : info.message?.conversation, extendedText: rsm4?.extendedTextMessage?.text || info?.message?.extendedTextMessage?.text
    };
    let path = __dirname + '/../database/grupos/' + from + '.json';
    let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : { mark: {} };
    const MRC_TD4 = AllgroupMembers.filter(m => !['0', 'games'].includes(data.mark[m]));
    let DFC4;
    const createMessage = (type, message, caption) => {message.caption = caption;message.mentions = MRC_TD4;message[type] = {url: message.url};return message;};
    if (messageTypes.image && !messageTypes.audio && !messageTypes.document) {
        DFC4 = createMessage('image', messageTypes.image, q.length > 1 ? `\n${q}` : messageTypes.image.caption.replace(new RegExp(prefix + command, "gi"), `❪ *Marcação do(a) Adm:* ${pushname}\n\n`));
    } else if (messageTypes.video && !messageTypes.audio && !messageTypes.document) {
        DFC4 = createMessage('video', messageTypes.video, q.length > 1 ? `\n${q.trim()}` : messageTypes.video.caption.replace(new RegExp(prefix + command, "gi"), `❪ *Marcação do(a) Adm:* ${pushname}\n\n`).trim());
    } else if (messageTypes.conversation) {
        DFC4 = {text: messageTypes.conversation.replace(new RegExp(prefix + command, "gi"), `❪ *Marcação do(a) Adm:* ${pushname}\n\n`).trim(), mentions: MRC_TD4};
    } else if (messageTypes.extendedText) {
        DFC4 = {text: messageTypes.extendedText.replace(new RegExp(prefix + command, "gi"), `❪ *Marcação do(a) Adm:* ${pushname}\n\n`).trim(), mentions: MRC_TD4};
    } else if (messageTypes.document) {
        DFC4 = createMessage('document', messageTypes.document, q.length > 1 ? `\n${q.trim()}` : messageTypes.document.caption.replace(new RegExp(prefix + command, "gi"), `❪ *Marcação do(a) Adm:* ${pushname}\n\n`).trim());
    } else if (messageTypes.sticker && !messageTypes.audio) {
        DFC4 = createMessage('sticker', messageTypes.sticker);
    } else if (messageTypes.audio) {
        DFC4 = {audio: { url: messageTypes.audio.url },mentions: MRC_TD4,ptt: true};
    };
    await nazu.sendMessage(from, DFC4).catch((error) => {});
    break;
    
    case 'modobrincadeira': case 'modobrincadeiras': case 'modobn': {
    if (!isGroup) return reply('❌ Apenas para grupos.');
    if (!isGroupAdmin) return reply('🚫 Apenas admins.'); 
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    if (!groupData.modobrincadeira || groupData.modobrincadeira === undefined) {
        groupData.modobrincadeira = true;
    } else {
        groupData.modobrincadeira = !groupData.modobrincadeira;
    };
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    if (groupData.modobrincadeira) {
        await reply('🎉 *Modo de Brincadeiras ativado!* Agora o grupo está no modo de brincadeiras. Divirta-se!');
    } else {
        await reply('⚠️ *Modo de Brincadeiras desativado!* O grupo não está mais no modo de brincadeiras.');
    }};
    break;
    
    case 'bemvindo': case 'bv': case 'boasvindas': {
    if (!isGroup) return reply('❌ *Este comando só pode ser usado em grupos!*');
    if (!isGroupAdmin) return reply('🚫 *Apenas administradores podem ativar ou desativar as boas-vindas!*');     
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;   
    if (!groupData.bemvindo || groupData.bemvindo === undefined) {
        groupData.bemvindo = true;
    } else {
        groupData.bemvindo = !groupData.bemvindo;
    };
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    if (groupData.bemvindo) {
        await reply(`✅ *Boas-vindas ativadas!* Agora, novos membros serão recebidos com uma mensagem personalizada.\n📝 Para configurar a mensagem, use: *${prefixo}legendabv*`);
    } else {
        await reply('⚠️ *Boas-vindas desativadas!* O grupo não enviará mais mensagens para novos membros.');
    }};
    break;
    
    case 'legendabv': case 'textbv': {
    if (!isGroup) return reply('❌ *Este comando só pode ser usado em grupos!*');
    if (!isGroupAdmin) return reply('🚫 *Apenas administradores podem configurar a mensagem de boas-vindas!*');
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    if (!q) return reply(`📝 *Configuração da Mensagem de Boas-Vindas*\n\nPara definir uma mensagem personalizada, digite o comando seguido do texto desejado. Você pode usar as seguintes variáveis:\n\n- *#numerodele#* → Marca o novo membro.\n- *#nomedogp#* → Nome do grupo.\n- *#desc#* → Descrição do grupo.\n- *#membros#* → Número total de membros no grupo.\n\n📌 *Exemplo:*\n${prefixo}legendabv Bem-vindo(a) #numerodele# ao grupo *#nomedogp#*! Agora somos #membros# membros. Leia a descrição: #desc#`);
    groupData.textbv = q;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    reply(`✅ *Mensagem de boas-vindas configurada com sucesso!*\n\n📌 Nova mensagem:\n"${groupData.textbv}"`);};
break;
    
    
    //COMANDOS DE BRINCADEIRAS

   case 'gay': case 'burro': case 'inteligente': case 'otaku': case 'fiel': case 'infiel': case 'corno':  case 'gado': case 'gostoso': case 'feio': case 'rico': case 'pobre': case 'pirocudo': case 'pirokudo': case 'nazista': case 'ladrao': case 'safado': case 'vesgo': case 'bebado': case 'machista': case 'homofobico': case 'racista': case 'chato': case 'sortudo': case 'azarado': case 'forte': case 'fraco': case 'pegador': case 'otario': case 'macho': case 'bobo': case 'nerd': case 'preguicoso': case 'trabalhador': case 'brabo': case 'lindo': case 'malandro': case 'simpatico': case 'engracado': case 'charmoso': case 'misterioso': case 'carinhoso': case 'desumilde': case 'humilde': case 'ciumento': case 'corajoso': case 'covarde': case 'esperto': case 'talarico': case 'chorao': case 'brincalhao': case 'bolsonarista': case 'petista': case 'comunista': case 'lulista': case 'traidor': case 'bandido': case 'cachorro': case 'vagabundo': case 'pilantra': case 'mito': case 'padrao': case 'comedia': case 'psicopata': case 'fortao': case 'magrelo': case 'bombado': case 'chefe': case 'presidente': case 'rei': case 'patrao': case 'playboy': case 'zueiro': case 'gamer': case 'programador': case 'visionario': case 'billionario': case 'poderoso': case 'vencedor': case 'senhor': {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isModoBn) return reply('❌ O modo brincadeira não esta ativo nesse grupo');
    let gamesData = fs.existsSync(__dirname + '/.funcs/.json/.games.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.games.json')) : { games: {} };
    const target = menc_os2 ? menc_os2 : sender;
    const targetName = `@${target.split('@')[0]}`;
    const level = Math.floor(Math.random() * 101);
    let responses = fs.existsSync(__dirname + '/.funcs/.json/.gamestext.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.gamestext.json')) : {};
    const responseText = responses[command].replaceAll('#nome#', targetName).replaceAll('#level#', level) || `📊 ${targetName} tem *${level}%* de ${command}! 🔥`;
    const media = gamesData.games[command]
    if (media?.image) {
        await nazu.sendMessage(from, { image: media.image, caption: responseText, mentions: [target] });
    } else if (media?.video) {
        await nazu.sendMessage(from, { video: media.video, caption: responseText, mentions: [target], gifPlayback: true});
    } else {
        await nazu.sendMessage(from, {text: responseText, mentions: [target]});
    };
};
break;

   case 'lesbica': case 'burra': case 'inteligente': case 'otaku': case 'fiel': case 'infiel': case 'corna': case 'gado': case 'gostosa': case 'feia': case 'rica': case 'pobre': case 'bucetuda': case 'nazista': case 'ladra': case 'safada': case 'vesga': case 'bebada': case 'machista': case 'homofobica': case 'racista': case 'chata': case 'sortuda': case 'azarada': case 'forte': case 'fraca': case 'pegadora': case 'otaria': case 'boba': case 'nerd': case 'preguicosa': case 'trabalhadora': case 'braba': case 'linda': case 'malandra': case 'simpatica': case 'engracada': case 'charmosa': case 'misteriosa': case 'carinhosa': case 'desumilde': case 'humilde': case 'ciumenta': case 'corajosa': case 'covarde': case 'esperta': case 'talarica': case 'chorona': case 'brincalhona': case 'bolsonarista': case 'petista': case 'comunista': case 'lulista': case 'traidora': case 'bandida': case 'cachorra': case 'vagabunda': case 'pilantra': case 'mito': case 'padrao': case 'comedia': case 'psicopata': case 'fortona': case 'magrela': case 'bombada': case 'chefe': case 'presidenta': case 'rainha': case 'patroa': case 'playboy': case 'zueira': case 'gamer': case 'programadora': case 'visionaria': case 'bilionaria': case 'poderosa': case 'vencedora': case 'senhora': {
    if (!isGroup) return reply('❌ Este comando so pode ser usado em grupos.');
    if (!isModoBn) return reply('❌ O modo brincadeira não esta ativo nesse grupo');
    let gamesData = fs.existsSync(__dirname + '/.funcs/.json/.games.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.games.json')) : { games: {} };
    const target = menc_os2 ? menc_os2 : sender;
    const targetName = `@${target.split('@')[0]}`;
    const level = Math.floor(Math.random() * 101);
    let responses = fs.existsSync(__dirname + '/.funcs/.json/.gamestext2.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.gamestext2.json')) : {};
    const responseText = responses[command].replaceAll('#nome#', targetName).replaceAll('#level#', level) || `📊 ${targetName} tem *${level}%* de ${command}! 🔥`;
    const media = gamesData.games[command]
    if (media?.image) {
        await nazu.sendMessage(from, { image: media.image, caption: responseText, mentions: [target] });
    } else if (media?.video) {
        await nazu.sendMessage(from, { video: media.video, caption: responseText, mentions: [target], gifPlayback: true});
    } else {
        await nazu.sendMessage(from, {text: responseText, mentions: [target]});
    };
};
break;

case 'rankgay': case 'rankburro': case 'rankinteligente': case 'rankotaku': case 'rankfiel': case 'rankinfiel': case 'rankcorno': case 'rankgado': case 'rankgostoso': case 'rankrico': case 'rankpobre': case 'rankforte': case 'rankpegador': case 'rankmacho': case 'ranknerd': case 'ranktrabalhador': case 'rankbrabo': case 'ranklindo': case 'rankmalandro': case 'rankengracado': case 'rankcharmoso': case 'rankvisionario': case 'rankpoderoso': case 'rankvencedor':case 'rankgays': case 'rankburros': case 'rankinteligentes': case 'rankotakus': case 'rankfiels': case 'rankinfieis': case 'rankcornos': case 'rankgados': case 'rankgostosos': case 'rankricos': case 'rankpobres': case 'rankfortes': case 'rankpegadores': case 'rankmachos': case 'ranknerds': case 'ranktrabalhadores': case 'rankbrabos': case 'ranklindos': case 'rankmalandros': case 'rankengracados': case 'rankcharmosos': case 'rankvisionarios': case 'rankpoderosos': case 'rankvencedores': {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isModoBn) return reply('❌ O modo brincadeira não está ativo nesse grupo.');
    let path = __dirname + '/../database/grupos/' + from + '.json';
    let gamesData = fs.existsSync(__dirname + '/.funcs/.json/.games.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.games.json')) : { ranks: {} };
    let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : { mark: {} };
    let membros = AllgroupMembers.filter(m => !['0', 'marca'].includes(data.mark[m]));
    if (membros.length < 5) return reply('❌ Membros insuficientes para formar um ranking.');
    let top5 = membros.sort(() => Math.random() - 0.5).slice(0, 5);
    let cleanedCommand = command.endsWith('s') ? command.slice(0, -1) : command;
    let ranksData = fs.existsSync(__dirname + '/.funcs/.json/.ranks.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.ranks.json')) : { ranks: {} };
    let responseText = ranksData[cleanedCommand] || `📊 *Ranking de ${cleanedCommand.replace('rank', '')}*:\n\n`;
    top5.forEach((m, i) => {
        responseText += `🏅 *#${i + 1}* - @${m.split('@')[0]}\n`;
    });
    let media = gamesData.ranks[cleanedCommand];
    if (media?.image) {
        await nazu.sendMessage(from, { image: media.image, caption: responseText, mentions: top5 });
    } else if (media?.video) {
        await nazu.sendMessage(from, { video: media.video, caption: responseText, mentions: top5, gifPlayback: true });
    } else {
        await nazu.sendMessage(from, { text: responseText, mentions: top5 });
    }
};
break;

case 'ranklesbica': case 'rankburra': case 'rankinteligente': case 'rankotaku': case 'rankfiel': case 'rankinfiel': case 'rankcorna': case 'rankgada': case 'rankgostosa': case 'rankrica': case 'rankpobre': case 'rankforte': case 'rankpegadora': case 'ranknerd': case 'ranktrabalhadora': case 'rankbraba': case 'ranklinda': case 'rankmalandra': case 'rankengracada': case 'rankcharmosa': case 'rankvisionaria': case 'rankpoderosa': case 'rankvencedora':case 'ranklesbicas': case 'rankburras': case 'rankinteligentes': case 'rankotakus': case 'rankfiels': case 'rankinfieis': case 'rankcornas': case 'rankgads': case 'rankgostosas': case 'rankricas': case 'rankpobres': case 'rankfortes': case 'rankpegadoras': case 'ranknerds': case 'ranktrabalhadoras': case 'rankbrabas': case 'ranklindas': case 'rankmalandras': case 'rankengracadas': case 'rankcharmosas': case 'rankvisionarias': case 'rankpoderosas': case 'rankvencedoras': {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isModoBn) return reply('❌ O modo brincadeira não está ativo nesse grupo.');
    let path = __dirname + '/../database/grupos/' + from + '.json';
    let gamesData = fs.existsSync(__dirname + '/.funcs/.json/.games.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.games.json')) : { ranks: {} };
    let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : { mark: {} };
    let membros = AllgroupMembers.filter(m => !['0', 'marca'].includes(data.mark[m]));
    if (membros.length < 5) return reply('❌ Membros insuficientes para formar um ranking.');
    let top5 = membros.sort(() => Math.random() - 0.5).slice(0, 5);
    let cleanedCommand = command.endsWith('s') ? command.slice(0, -1) : command;
    let ranksData = fs.existsSync(__dirname + '/.funcs/.json/.ranks.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.ranks.json')) : { ranks: {} };
    let responseText = ranksData[cleanedCommand]+'\n\n' || `📊 *Ranking de ${cleanedCommand.replace('rank', '')}*:\n\n`;
    top5.forEach((m, i) => {
        responseText += `🏅 *#${i + 1}* - @${m.split('@')[0]}\n`;
    });
    let media = gamesData.ranks[cleanedCommand];
    if (media?.image) {
        await nazu.sendMessage(from, { image: media.image, caption: responseText, mentions: top5 });
    } else if (media?.video) {
        await nazu.sendMessage(from, { video: media.video, caption: responseText, mentions: top5, gifPlayback: true });
    } else {
        await nazu.sendMessage(from, { text: responseText, mentions: top5 });
    }
};
break;

   case 'chute': case 'chutar': case 'tapa': case 'soco': case 'socar': case 'beijo': case 'beijar': case 'beijob': case 'beijarb': case 'abraco': case 'abracar': case 'mata': case 'matar': case 'tapar': case 'goza': case 'gozar': case 'mamar': case 'mamada': case 'cafune': case 'morder': case 'mordida': case 'lamber': case 'lambida': case 'explodir':
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isModoBn) return reply('❌ O modo brincadeira não está ativo nesse grupo.');
    if(!menc_os2) return reply('Marque um usuário.');
    let gamesData = fs.existsSync(__dirname + '/.funcs/.json/.games.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.games.json')) : { games2: {} };
    let GamezinData = fs.existsSync(__dirname + '/.funcs/.json/.markgame.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.markgame.json')) : { ranks: {} };
    let responseText = GamezinData[command].replaceAll('#nome#', `@${menc_os2.split('@')[0]}`) || `Voce acabou de dar um(a) ${command} no(a) @${menc_os2.split('@')[0]}`;
    let media = gamesData.games2[command];
    if (media?.image) {
        await nazu.sendMessage(from, { image: media.image, caption: responseText, mentions: [menc_os2] });
    } else if (media?.video) {
        await nazu.sendMessage(from, { video: media.video, caption: responseText, mentions: [menc_os2], gifPlayback: true });
    } else {
        await nazu.sendMessage(from, { text: responseText, mentions: [menc_os2] });
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