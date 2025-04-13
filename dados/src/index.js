// Index principal do bot
// Sistema unico, diferente de qualquer outro bot
// Criador: Hiudy
// Caso for usar deixe o caralho dos créditos 
// <3

const { downloadContentFromMessage, Mimetype } = require('baileys');
const { exec, spawn, execSync } = require('child_process');
const { reportError, youtube, tiktok, pinterest, igdl, sendSticker, FilmesDL, styleText, emojiMix, upload, mcPlugin, tictactoe, rpg, toolsJson, vabJson, apkMod }  = require(__dirname+'/funcs/exports.js');
const axios = require('axios');
const pathz = require('path');
const fs = require('fs');
const os = require('os');

async function NazuninhaBotExec(nazu, info) {
const { numerodono, nomedono, nomebot, prefixo, prefixo: prefix, debug } = JSON.parse(fs.readFileSync(__dirname+'/config.json'));

try {
 const settingsz = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
 const template = settingsz.template || 'nazu-default';
 const { menu, menudown, menuadm, menubn, menuDono, menuMembros, menuFerramentas, menuSticker, menuIa, menuRpg } = require(`${__dirname}/templates/${template}/menus/index.js`);
 const t = require(`${__dirname}/templates/${template}/texts/index.js`);
 const from = info.key.remoteJid;
 const isGroup = from.endsWith('@g.us');
 const sender = isGroup ? info.key.participant.includes(':') ? info.key.participant.split(':')[0] +'@s.whatsapp.net': info.key.participant : info.key.remoteJid;
 const isStatus = from.endsWith('@broadcast');
 const nmrdn = numerodono.replace(new RegExp("[()+-/ +/]", "gi"), "") + `@s.whatsapp.net`
 const isOwner = (nmrdn == sender ? true : false) || info.key.fromMe;
 
 const baileys = require('baileys');
 const type = baileys.getContentType(info.message);
 
 const isImage = type == 'imageMessage'
 const isVideo = type == 'videoMessage'
 const isVisuU2 = type == 'viewOnceMessageV2'
 const isVisuU = type == 'viewOnceMessage'
 
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
 
 //CRIAR PASTAS
  if (!fs.existsSync(__dirname + `/../database/grupos`)) fs.mkdirSync(__dirname + `/../database/grupos`, { recursive: true });
  if (!fs.existsSync(__dirname + `/../database/users`)) fs.mkdirSync(__dirname + `/../database/users`, { recursive: true });
  if (!fs.existsSync(__dirname + `/../database/dono`)) fs.mkdirSync(__dirname + `/../database/dono`, { recursive: true });
  
 //SISTEMA DE PREMIUM
 if (!fs.existsSync(__dirname + `/../database/dono/premium.json`)) fs.writeFileSync(__dirname + `/../database/dono/premium.json`, JSON.stringify({}, null, 2));
 const premiumListaZinha = JSON.parse(fs.readFileSync(__dirname + `/../database/dono/premium.json`, 'utf-8'));
 const isPremium = !!premiumListaZinha[sender] || !!premiumListaZinha[from] || isOwner;
 
 //BAN GPS
 if (!fs.existsSync(__dirname + `/../database/dono/bangp.json`)) fs.writeFileSync(__dirname + `/../database/dono/bangp.json`, JSON.stringify({}, null, 2));
 const banGpIds = JSON.parse(fs.readFileSync(__dirname + `/../database/dono/bangp.json`, 'utf-8'));
 if(!!banGpIds[from] && !isOwner && !isPremium) return;
 
 //INFOS DE GRUPO
  const groupMetadata = !isGroup ? {} : await nazu.groupMetadata(from);
  const groupName = isGroup && groupMetadata.subject ? groupMetadata.subject : '';
  const AllgroupMembers = !isGroup ? [] : groupMetadata.participants.map(p => p.id);
  const groupAdmins = !isGroup ? [] : groupMetadata.participants.filter(p => p.admin).map(p => p.id);
  const botNumber = nazu.user.id.split(':')[0] + '@s.whatsapp.net';
  const isGroupAdmin = !isGroup ? null : groupAdmins.includes(sender) || isOwner;
  const isBotAdmin = !isGroup ? null : groupAdmins.includes(botNumber);
  if(isGroup) {
  if (!fs.existsSync(__dirname + `/../database/grupos/${from}.json`)) fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify({ mark: {} }, null, 2));
  };
  let groupData = {};
  try {groupData = JSON.parse(fs.readFileSync(__dirname + `/../database/grupos/${from}.json`));} catch (error) {};
  const isModoBn = groupData.modobrincadeira ? true : false;
  const isOnlyAdmin = groupData.soadm ? true : false;
  const isAntiPorn = groupData.antiporn ? true : false;
  const isMuted = (groupData.mutedUsers && groupData.mutedUsers[sender]) ? true : false;
  const isAntiLinkGp = groupData.antilinkgp ? true : false;
  const isModoRpg = isGroup && groupData.modorpg ? true : false;
  if(isGroup && !isGroupAdmin && isOnlyAdmin) return;
  if(isGroup && !isGroupAdmin && isCmd && groupData.blockedCommands && groupData.blockedCommands[command]) return reply('Este comando foi bloqueado pelos administradores do grupo.');
  
 //BANIR USUÁRIOS MUTADOS 🤓☝🏻
 if(isGroup && isMuted) {
 await nazu.sendMessage(from, {text: `🤫 Hmm @${sender.split("@")[0]}, achou que ia passar despercebido? Achou errado lindo(a)! Você está sendo removido por enviar mensagem, sendo que você está mutado neste grupo.`, mentions: [sender]}, {quoted: info});
 await nazu.sendMessage(from, {delete: {remoteJid: from, fromMe: false, id: info.key.id, participant: sender}});
 await nazu.groupParticipantsUpdate(from, [sender], 'remove');
 delete groupData.mutedUsers[sender];
 fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
 };
 //FIM
 
 //CONTADOR DE MENSAGEM 🤓
 if(isGroup){/*Created By Hiudy*/groupData.contador=groupData.contador||[];const a=groupData.contador.findIndex(b=>b.id===sender);if(a!==-1){const c=groupData.contador[a];isCmd?c.cmd=(c.cmd||0)+1:type=="stickerMessage"?c.figu=(c.figu||0)+1:c.msg=(c.msg||0)+1;pushname&&c.pushname!==pushname&&(c.pushname=pushname)}else{groupData.contador.push({id:sender,msg:isCmd?0:1,cmd:isCmd?1:0,figu:type=="stickerMessage"?1:0,pushname:pushname||'Unknown User'})}try{fs.writeFileSync(`${__dirname}/../database/grupos/${from}.json`,JSON.stringify(groupData,null,2))}catch{}};
 //FIM DO CONTADOR
 
 //FUNÇÕES BASICAS
 async function reply(text) {
    const result = await nazu.sendMessage(from, {text: text.trim()}, {sendEphemeral: true, contextInfo: { forwardingScore: 50, isForwarded: true, externalAdReply: { showAdAttribution: true }}, quoted: info})}; nazu.reply=reply;
 
 const reagir = async (emj) => { if (typeof emj === 'string') { await nazu.sendMessage(from, { react: { text: emj, key: info.key } }); } else if (Array.isArray(emj)) { for (const emjzin of emj) { await nazu.sendMessage(from, { react: { text: emjzin, key: info.key } }); await new Promise(res => setTimeout(res, 500)); } } }; nazu.react = reagir;
 
 const sendAlbumMessage=async(jid,medias,options)=>(/* Created By Hiudy */options={...options},caption=options.text||options.caption||"",album=baileys.generateWAMessageFromContent(jid,{albumMessage:{expectedImageCount:medias.filter(media=>media.type==="image").length,expectedVideoCount:medias.filter(media=>media.type==="video").length,...(options.quoted?{contextInfo:{remoteJid:options.quoted.key.remoteJid,fromMe:options.quoted.key.fromMe,stanzaId:options.quoted.key.id,participant:options.quoted.key.participant||options.quoted.key.remoteJid,quotedMessage:options.quoted.message}}:{})}},{quoted:info}),await nazu.relayMessage(album.key.remoteJid,album.message,{messageId:album.key.id}),await Promise.all(medias.map(async media=>{const{type,data}=media,img=await baileys.generateWAMessage(album.key.remoteJid,{[type]:data,...(media===medias[0]?{caption}:{})},{upload:nazu.waUploadToServer});img.message.messageContextInfo={messageAssociation:{associationType:1,parentMessageKey:album.key}};await nazu.relayMessage(img.key.remoteJid,img.message,{messageId:img.key.id})})),album); nazu.sendAlbum = sendAlbumMessage;
 
 const getFileBuffer = async (mediakey, MediaType) => {const stream = await downloadContentFromMessage(mediakey, MediaType);let buffer = Buffer.from([]);for await(const chunk of stream) {buffer = Buffer.concat([buffer, chunk]) };return buffer}
 
 function normalizarTexto(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
 //FIM FUNÇÕES BASICAS

 //SISTEMA ANTI PORNOGRAFIA 🤫
 if (isGroup && isAntiPorn && (isImage || isVisuU || isVisuU2)) { const midiaz = info.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || info.message?.videoMessage || info.message?.stickerMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage; if (midiaz) { try { const stream = await getFileBuffer(midiaz, "image"); const mediaURL = await upload(stream, true); if (mediaURL) { const apiResponse = await axios.get(`https://nsfw-demo.sashido.io/api/image/classify?url=${mediaURL}`); const { Porn, Hentai } = apiResponse.data.reduce((acc, item) => ({...acc,[item.className]: item.probability}), {}); let userMessage = ''; let actionTaken = false; if (Porn > 0.80 || Hentai > 0.80) { if(!isGroupAdmin) { await nazu.sendMessage(from, { delete: info.key }); userMessage = `🚫 @${sender.split('@')[0]} foi removido por compartilhar conteúdo impróprio.\n\n🚫 Esta mídia contém conteúdo adulto (${apiResponse.data[0].className}) com uma probabilidade de ${apiResponse.data[0].probability.toFixed(2)} e foi removida!`; await nazu.groupParticipantsUpdate(from, [sender], "remove"); actionTaken = true; } else { await nazu.sendMessage(from, { delete: info.key }); await reply('Conteudo adulto detectado, porem como você é um administrador não irei banir.'); } } if (actionTaken) { await nazu.sendMessage(from, { text: userMessage, mentions: [sender] }, { quoted: info }); }; } } catch (error) { } } };
 //FIM 🤫

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
 
 //EXECUÇÕES DE DONO BBZIN 🥵
 if(body.startsWith('$')) {if(!isOwner) return;exec(q, (err, stdout) => {if(err) return reply(`${err}`);if(stdout) {reply(stdout);}})};
 
 if(body.startsWith('>>')){try { if(!isOwner) return;(async () => {try {const codeLines = body.slice(2).trim().split('\n');if (codeLines.length > 1) {codeLines[codeLines.length - 1] = 'return ' + codeLines[codeLines.length - 1];} else {codeLines[0] = 'return ' + codeLines[0];};const result = await eval(`(async () => { ${codeLines.join('\n')} })()`);let output;if (typeof result === 'object' && result !== null) {output = JSON.stringify(result, null, '\t');} else if (typeof result === 'function') {output = result.toString();} else {output = String(result);};return reply(output).catch(e => reply(String(e)));} catch (e) {return reply(String(e));};})();} catch (e){return reply(String(e));}};
 //FIM DAS EXECUÇÕES BB 🥵
 
 //ANTILINK DE GRUPOS :)
 if(isGroup && isAntiLinkGp && !isGroupAdmin && budy2.includes('chat.whatsapp.com') && isGroupAdmin) {
  if(isOwner) return;
  link_dgp = await nazu.groupInviteCode(from);
  if(budy2.match(link_dgp)) return;
  nazu.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}});
  if(!JSON.stringify(AllgroupMembers).includes(sender)) return;
  nazu.groupParticipantsUpdate(from, [sender], 'remove');
 };
 //FIM :)
 
 //LOGS AQUI BBZIN <3
 console.log(`=========================================`);
 console.log(`${isCmd ? '⚒️ Comando' : '🗨️ Mensagem'} ${isGroup ? 'em grupo 👥' : 'no privado 👤'}`);
 console.log(`${isCmd ? '⚒️ Comando' : '🗨️ Mensagem'}: "${isCmd ? prefix+command : budy2.substring(0, 12)+'...'}"`);
 console.log(`${isGroup ? '👥 Grupo' : '👤 Usuario'}: "${isGroup ? groupName : pushname}"`);
 console.log(`${isGroup ? '👤 Usuario' : '📲 Numero'}: "${isGroup ? pushname : sender.split('@')[0]}"`);
 console.log(`=========================================`);
 //FIM DOS LOGS
 
 //JOGO DA VELHA
 if (isGroup) {
    if (tictactoe.hasPendingInvitation(from) && budy2) {
        const normalizedResponse = budy2.toLowerCase().trim();
        const result = tictactoe.processInvitationResponse(from, sender, normalizedResponse);
        if (result.success) {
            await nazu.sendMessage(from, { 
                text: result.message, 
                mentions: result.mentions || [] 
            });
        };
    };
    if (tictactoe.hasActiveGame(from) && budy2) {
        if (['tttend', 'rv', 'fimjogo'].includes(budy2)) {
            if (!isGroupAdmin) return reply(t.b.admin());
            const result = tictactoe.endGame(from);
            await reply(result.message);
            return;
        };
        const position = parseInt(budy2.trim());
        if (!isNaN(position)) {
            const result = tictactoe.makeMove(from, sender, position);
            if (result.success) {
                await nazu.sendMessage(from, { 
                    text: result.message, 
                    mentions: result.mentions || [sender] 
                });
            };
        };
        return;
    };
};

 switch(command) {
  //INTELIGENCIA ARTIFICIAL
  
  case 'nazu': case 'nazuninha': case 'ai': 
  try {
    if (!q) return reply(t.b.digitarPrompt());
    nazu.react('💞');
    bahz = (await axios.post("https://api.cognima.com.br/api/ia/chat?key=CognimaTeamFreeKey", { message: q, chat_id: `nazuninha_${sender.split('@')[0]}`, model_name: "nazuninha", })).data;
    await reply(bahz.reply);
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;
  
  case 'gpt': case 'gpt4': case 'chatgpt':
  try {
    if (!q) return reply(t.b.digitarPrompt());
    nazu.react('🧠');
    bahz = (await axios.post("https://api.cognima.com.br/api/ia/chat?key=CognimaTeamFreeKey", { message: q, chat_id: `gpt_${sender.split('@')[0]}`, model_name: "gpt", })).data;
    await reply(bahz.reply);
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;
  
  case 'llama': case 'llama3': case 'llamachat':
  try {
    if (!q) return reply(t.b.digitarPrompt());
    nazu.react('🧠');
    bahz = (await axios.post("https://api.cognima.com.br/api/ia/chat?key=CognimaTeamFreeKey", { 
      message: q, 
      chat_id: `llama_${sender.split('@')[0]}`, 
      model_name: "llama" 
    })).data;
    await reply(bahz.reply);
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;
  
  case 'cognimai': case 'cog':
  try {
    if (!q) return reply(t.b.digitarPrompt());
    nazu.react('🤖');
    bahz = (await axios.post("https://api.cognima.com.br/api/ia/chat?key=CognimaTeamFreeKey", { 
      message: q, 
      chat_id: `cognimai_${sender.split('@')[0]}`, 
      model_name: "cognimai" 
    })).data;
    await reply(bahz.reply);
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;
  
  case 'qwen': case 'qwen2': case 'qwenchat':
  try {
    if (!q) return reply(t.b.digitarPrompt());
    nazu.react('🌠');
    bahz = (await axios.post("https://api.cognima.com.br/api/ia/chat?key=CognimaTeamFreeKey", { 
      message: q, 
      chat_id: `qwen_${sender.split('@')[0]}`, 
      model_name: "qwen"
    })).data;
    await reply(bahz.reply);
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;
  
  case 'gemma': case 'gemma2': case 'gecko':
  try {
    if (!q) return reply(t.b.digitarPrompt());
    nazu.react('💎');
    bahz = (await axios.post("https://api.cognima.com.br/api/ia/chat?key=CognimaTeamFreeKey", { 
      message: q, 
      chat_id: `gemma_${sender.split('@')[0]}`, 
      model_name: "gemma"
    })).data;
    await reply(bahz.reply);
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;
  
  case 'imagine': case 'img':
  try {
    const modelos = [
      "cognimai-realism",
      "cognimai-anime", 
      "cognimai-3d",
      "cognimai-cablyai",
      "cognimai-turbo",
      "cognimai-pro",
      "cognimai"
    ];
    if (!q) {
      let ajuda = `🖼️ *GERADOR DE IMAGENS* 🖼️\n\n`;
      ajuda += `⚠️ Use: *${prefix}imagine modelo/prompt*\n\n`;
      ajuda += `📝 *Modelos disponíveis:*\n`;
      ajuda += `• realism (Padrão)\n`;
      ajuda += `• anime\n`;
      ajuda += `• 3d\n`;
      ajuda += `• cablyai\n`;
      ajuda += `• turbo\n`;
      ajuda += `• pro\n\n`;
      ajuda += `Exemplo: *${prefix}imagine anime/gato samurai*`;
      return reply(ajuda);
    };
    nazu.react('🔄');
    const [inputModelo, ...promptArray] = q.split('/');
    const prompt = promptArray.join('/').trim() || inputModelo.trim();
    const modeloEscolhido = inputModelo.trim().toLowerCase();
    const modelosParaTestar = modeloEscolhido && modelos.includes(`cognimai-${modeloEscolhido}`)
      ? [`cognimai-${modeloEscolhido}`]
      : modelos;
    for (const model of modelosParaTestar) {
      try {
        const url = `https://api.cognima.com.br/api/ia/image/generate?key=CognimaTeamFreeKey&prompt=${encodeURIComponent(prompt)}&model_name=${model}`;
        await nazu.sendMessage(from, {
          image: { url },
          caption: `🎨 Modelo: ${model.replace('cognimai-', '') || 'padrão'}\n📌 Prompt: ${prompt}`
        });
        nazu.react('✅');
        return;
      } catch (e) {
        console.log(`❌ ${model} falhou, tentando próximo...`);
      }
    }

    await reply('❌ Todos os modelos falharam. Tente um prompt diferente.');
    nazu.react('❌');

  } catch (e) {
    console.error('Erro grave:', e);
    reply(t.b.erro());
  }
  break;
  
  case 'code-gen': try {
  if(!isPremium) return reply('Apenas usuários premium.');
  if(!q) return reply(t.b.digitarPrompt());
  nazu.react('✅');
  const response = await axios.get(`https://api.cognima.com.br/api/ia/code-gen?key=CognimaTeamFreeKey&q=${q}`, { responseType: 'arraybuffer' });
  const mimeType = response.headers['content-type'];
  const contentDisposition = response.headers['content-disposition'];
  let nomeArquivo = Date.now();
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match) nomeArquivo = match[1];
  };
  if (!nomeArquivo.includes('.')) {
    const extensoes = { 'application/json': 'json', 'text/plain': 'txt', 'application/javascript': 'js', 'application/zip': 'zip', 'application/pdf': 'pdf' };
    nomeArquivo += '.' + (extensoes[mimeType] || 'bin');
  };
  await nazu.sendMessage(from, { document: response.data, mimetype: mimeType, fileName: nomeArquivo }, { quoted: info });
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break
  
  
  //FERRAMENTAS
  case 'encurtalink': case 'tinyurl': try {
  if(!q) return reply(`❌️ *Forma incorreta, use está como exemplo:* ${prefix + command} https://instagram.com/hiudyyy_`);
  anu = await axios.get(`https://tinyurl.com/api-create.php?url=${link}`);
  reply(`${anu.data}`);
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break

  case 'nick': case 'gerarnick': try {
  if(!q) return reply('Digite o nick após o comando.');
  datzn = await styleText(q);
  await reply(datzn.join('\n'));
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break
  
  case 'printsite': case 'ssweb': try{
  if(!q) return reply(`Cade o link?`)
  await nazu.react('✅');
  await nazu.sendMessage(from, {image: {url: `https://image.thum.io/get/fullpage/${q}`}}, {quoted: info})
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break
  
  case 'upload':case 'imgpralink':case 'videopralink':case 'gerarlink': try {
  if(!isQuotedImage && !isQuotedVideo && !isQuotedDocument && !isQuotedAudio) return reply(`Marque um video, uma foto, um audio ou um documento`);
  var foto1 = isQuotedImage ? info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage : {};
  var video1 = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : {};
  var docc1 = isQuotedDocument ? info.message.extendedTextMessage.contextInfo.quotedMessage.documentMessage: {};
  var audio1 = isQuotedAudio ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : "";
  let media = {};
  if(isQuotedDocument) {
  media = await getFileBuffer(docc1, "document");
  } else if(isQuotedVideo) {
  media = await getFileBuffer(video1, "video");
  } else if(isQuotedImage) {
  media = await getFileBuffer(foto1, "image");
  } else if(isQuotedAudio) {
  media = await getFileBuffer(audio1, "audio");
  };
  let linkz = await upload(media);
  await reply(`${linkz}`);
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  }
  break

  
  //DOWNLOADS
  case 'assistir': try {
  if(!q) return reply('Cadê o nome do filme ou episódio de série? 🤔');
  await reply('Um momento, estou buscando as informações para você 🕵️‍♂️');
  datyz = await FilmesDL(q);
  if(!datyz || !datyz.url) return reply('Desculpe, não consegui encontrar nada. Tente com outro nome de filme ou série. 😔');
  anu = await axios.get(`https://tinyurl.com/api-create.php?url=${datyz.url}`);
  linkEncurtado = anu.data;
  await nazu.sendMessage(from, {image: { url: datyz.img },caption: `Aqui está o que encontrei! 🎬\n\n*Nome*: ${datyz.name}\n\nSe tudo estiver certo, você pode assistir no link abaixo:\n${linkEncurtado}\n\nFique tranquilo, não é vírus! O link foi encurtado por ser muito longo.\n\n> Você pode apoiar o projeto de outra forma! 💖 Que tal dar uma estrela no repositório do GitHub? Isso ajuda a motivar e melhorar o bot!\n> ⭐ https://github.com/hiudyy/nazuninha-bot 🌟`}, { quoted: info });
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  case 'apkmod':
case 'mod':
try {
if (!q) return reply('Digite o nome do aplicativo.');
datinha = await apkMod(q);
if (datinha.error) return reply(datinha.error);
anu = await axios.get(`https://tinyurl.com/api-create.php?url=${datinha.download}`);
linkEncurtado = anu.data;
await nazu.sendMessage(from, { image: { url: datinha.image }, caption: `\n💻 *Informações do Aplicativo*\n\n🔸 *Título:* ${datinha.title}\n🔹 *Descrição:*  \n_${datinha.description}_\n\n📋 *Detalhes Técnicos:*  \n- 📛 *Nome:* ${datinha.details.name}  \n- 🗓️ *Última Atualização:* ${datinha.details.updated}  \n- 🆚 *Versão:* ${datinha.details.version}  \n- 🏷️ *Categoria:* ${datinha.details.category}  \n- 🛠️ *Modificação:* ${datinha.details.modinfo}  \n- 📦 *Tamanho:* ${datinha.details.size}  \n- ⭐ *Classificação:* ${datinha.details.rate}  \n- 📱 *Requer Android:* ${datinha.details.requires}  \n- 👨‍💻 *Desenvolvedor:* ${datinha.details.developer}  \n- 🔗 *Google Play:* ${datinha.details.googleplay}  \n- 📥 *Downloads:* ${datinha.details.downloads}  \n\n⬇️ *Download do APK:*  \n📤 _Tentando enviar o APK para você..._  \nCaso não seja enviado, use o link abaixo:  \n🔗 ${linkEncurtado}` }, { quoted: info });
await nazu.sendMessage(from, { document: { url: datinha.download }, mimetype: 'application/vnd.android.package-archive', fileName: `${datinha.details.name}.apk`, caption: `🔒 *Instalação Bloqueada pelo Play Protect?* 🔒\n\nCaso a instalação do aplicativo seja bloqueada pelo Play Protect, basta seguir as instruções do vídeo abaixo:\n\n🎥 https://youtu.be/FqQB2vojzlU?si=9qPnu_PGj3GU3L4_`}, {quoted: info});
} catch (e) {
console.log(e);
await reply(t.b.erro());
};
break;
  
  case 'mcplugin':case 'mcplugins': try {
  if(!q) return reply('Cadê o nome do plugin para eu pesquisar? 🤔');
  await nazu.react('🔍');
  datz = await mcPlugin(q);
  if(!datz.ok) return reply(datz.msg);
  await nazu.sendMessage(from, {image: {url: datz.image}, caption: `🔍 Encontrei esse plugin aqui:\n\n*Nome*: _${datz.name}_\n*Publicado por*: _${datz.creator}_\n*Descrição*: _${datz.desc}_\n*Link para download*: _${datz.url}_\n\n> 💖 `}, {quoted: info});
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break
  
  case 'play':
  case 'ytmp3':
  try {
    if (!q) return reply(`Digite o nome da música.\n> Ex: ${prefix + command} Back to Black`);
    nazu.react(['💖']);
    datinha = await youtube.search(q);
    if(!datinha.ok) return reply(datinha.msg);
    await nazu.sendMessage(from, { image: { url: datinha.data.thumbnail }, caption: `🎵 *Música Encontrada* 🎵\n\n📌 *Nome:* ${datinha.data.title}\n👤 *Canal:* ${datinha.data.author.name}\n👀 *Visualizações:* ${datinha.data.views}\n🔗 *Link:* ${datinha.data.url}`, footer: `By: ${nomebot}` }, { quoted: info });
    dlRes = await youtube.mp3(datinha.data.url);
    if(!dlRes.ok) return reply(dlRes.msg);
    await nazu.sendMessage(from, {audio: {url: dlRes.url}, fileName: datinha.data.title, mimetype: 'audio/mp4'}, {quoted: info});
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'playvid':
  case 'ytmp4':
  try {
    if (!q) return reply(`Digite o nome da música.\n> Ex: ${prefix + command} Back to Black`);
    nazu.react(['💖']);
    datinha = await youtube.search(q);
    if(!datinha.ok) return reply(datinha.msg);
    await nazu.sendMessage(from, { image: { url: datinha.data.thumbnail }, caption: `🎵 *Música Encontrada* 🎵\n\n📌 *Nome:* ${datinha.data.title}\n👤 *Canal:* ${datinha.data.author.name}\n👀 *Visualizações:* ${datinha.data.views}\n🔗 *Link:* ${datinha.data.url}`, footer: `By: ${nomebot}` }, { quoted: info });
    dlRes = await youtube.mp4(datinha.data.url);
    if(!dlRes.ok) return reply(dlRes.msg);
    await nazu.sendMessage(from, {video: {url: dlRes.url}, fileName: datinha.data.title, mimetype: 'video/mp4'}, {quoted: info});
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
    
  case 'play2':
  case 'ytmp32':
  try {
    if (!q) return reply(`Digite o nome da música.\n> Ex: ${prefix + command} Back to Black`);
    nazu.react(['💖']);
    datinha = await youtube.search(q);
    if(!datinha.ok) return reply(datinha.msg);
    await nazu.sendMessage(from, { image: { url: datinha.data.thumbnail }, caption: `🎵 *Música Encontrada* 🎵\n\n📌 *Nome:* ${datinha.data.title}\n👤 *Canal:* ${datinha.data.author.name}\n👀 *Visualizações:* ${datinha.data.views}\n🔗 *Link:* ${datinha.data.url}`, footer: `By: ${nomebot}` }, { quoted: info });
    dlRes = await youtube.mp3v2(datinha.data.url);
    if(!dlRes.ok) return reply(dlRes.msg);
    await nazu.sendMessage(from, {audio: {url: dlRes.url}, fileName: datinha.data.title, mimetype: 'audio/mp4'}, {quoted: info});
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'playvid2':
  case 'ytmp42':
  try {
    if (!q) return reply(`Digite o nome da música.\n> Ex: ${prefix + command} Back to Black`);
    nazu.react(['💖']);
    datinha = await youtube.search(q);
    if(!datinha.ok) return reply(datinha.msg);
    await nazu.sendMessage(from, { image: { url: datinha.data.thumbnail }, caption: `🎵 *Música Encontrada* 🎵\n\n📌 *Nome:* ${datinha.data.title}\n👤 *Canal:* ${datinha.data.author.name}\n👀 *Visualizações:* ${datinha.data.views}\n🔗 *Link:* ${datinha.data.url}`, footer: `By: ${nomebot}` }, { quoted: info });
    dlRes = await youtube.mp4v2(datinha.data.url);
    if(!dlRes.ok) return reply(dlRes.msg);
    await nazu.sendMessage(from, {video: {url: dlRes.url}, fileName: datinha.data.title, mimetype: 'video/mp4'}, {quoted: info});
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'tiktok': case 'tiktokaudio': case 'tiktokvideo': case 'tiktoks': case 'tiktoksearch': case 'ttk': case 'tkk':
   try {
    if (!q) return reply(`Digite um nome ou o link de um vídeo.\n> Ex: ${prefix}${command} Gato`);
    nazu.react(['💖']);
    let isTikTokUrl = /^https?:\/\/(?:www\.|m\.|vm\.|t\.)?tiktok\.com\//.test(q);
    let datinha = await (isTikTokUrl ? tiktok.dl(q) : tiktok.search(q));
    if (!datinha.ok) return reply(datinha.msg);
    let bahzz = [];
    for (const urlz of datinha.urls) {
        bahzz.push({type: datinha.type, data: { url: urlz }});
    };
    await nazu.sendAlbum(from, bahzz, { quoted: info });
    if (datinha.audio) await nazu.sendMessage(from, { audio: { url: datinha.audio }, mimetype: 'audio/mp4' }, { quoted: info });
   } catch (e) {
    console.error(e);
    reply(t.b.erro());
   }
   break;
   
   case 'instagram': case 'igdl': case 'ig': case 'instavideo':
  try {
    if (!q) return reply(`Digite um link do Instagram.\n> Ex: ${prefix}${command} https://www.instagram.com/reel/DFaq_X7uoiT/?igsh=M3Q3N2ZyMWU1M3Bo`);
    nazu.react(['📌']);
    const datinha = await igdl.dl(q);
    if (!datinha.ok) return reply(datinha.msg);
    let bahzz = [];
    await Promise.all(datinha.data.map(urlz => bahzz.push({type: urlz.type, data: urlz.buff})));
    await nazu.sendAlbum(from, bahzz, { quoted: info });
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
    
  case 'pinterest': case 'pin': case 'pinterestdl': case 'pinterestsearch':
   try {
    if (!q) return reply(`Digite um nome ou envie um link do Pinterest.\n> Ex: ${prefix}${command} Gatos\n> Ex: ${prefix}${command} https://www.pinterest.com/pin/123456789/`);  
    nazu.react(['📌']); 
    let datinha = await (/^https?:\/\/(?:[a-zA-Z0-9-]+\.)?pinterest\.\w{2,6}(?:\.\w{2})?\/pin\/\d+|https?:\/\/pin\.it\/[a-zA-Z0-9]+/.test(q) ? pinterest.dl(q) : pinterest.search(q));
    if (!datinha.ok) return reply(datinha.msg);
    for (const urlz of datinha.urls) {
        await nazu.sendMessage(from, { [datinha.type]: { url: urlz }, mimetype: datinha.mime }, { quoted: info });
    }
   } catch (e) {
    console.error(e);
    reply(t.b.erro());
   }
   break;
   
   
   //MENUS AQUI BB
  case 'menu': case 'help':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menu(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;

  case 'rpg': case 'menurpg':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuRpg(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'menuia': case 'aimenu': case 'menuias':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuIa(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'menubn': case 'menubrincadeira': case 'menubrincadeiras':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menubn(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'menudown': case 'menudownload': case 'menudownloads':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menudown(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'ferramentas': case 'menuferramentas': case 'menuferramenta':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuFerramentas(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'menuadm': case 'menuadmin': case 'menuadmins':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuadm(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'menumembros': case 'menumemb': case 'menugeral':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuMembros(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'menudono': case 'ownermenu':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuDono(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'stickermenu': case 'menusticker':case 'menufig':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuSticker(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
   
   
  //COMANDOS DE DONO BB
  case 'seradm': try {
  if(!isOwner) return reply(t.b.dono());
  await nazu.groupParticipantsUpdate(from, [sender], "promote");
  await nazu.react('✅');
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break

  case 'sermembro': try {
  if(!isOwner) return reply(t.b.dono());
  await nazu.groupParticipantsUpdate(from, [sender], "demote");
  await nazu.react('✅');
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break

   case 'prefixo':case 'numerodono':case 'nomedono':case 'nomebot': try {
    if(!isOwner) return reply(t.b.dono());
    if (!q) return reply(`Uso correto: ${prefix}${command} <valor>`);
     let config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
     config[command] = q;
     fs.writeFileSync(__dirname + '/config.json', JSON.stringify(config, null, 2));
     reply(`✅ ${command} atualizado para: *${q}*`);
   } catch (e) {
   console.error(e);
   reply(t.b.erro());
   };
  break;
  
  case 'fotomenu':case 'videomenu':case 'mediamenu':case 'midiamenu': try {
   if(!isOwner) return reply(t.b.dono());
   if(fs.existsSync(__dirname+'/../midias/menu.jpg')) fs.unlinkSync(__dirname+'/../midias/menu.jpg');
   if(fs.existsSync(__dirname+'/../midias/menu.mp4')) fs.unlinkSync(__dirname+'/../midias/menu.mp4');
   var RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    var boij2 = RSM?.imageMessage || info.message?.imageMessage || RSM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSM?.viewOnceMessage?.message?.imageMessage;
   var boij = RSM?.videoMessage || info.message?.videoMessage || RSM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSM?.viewOnceMessage?.message?.videoMessage;
    if (!boij && !boij2) return reply(`Marque uma imagem ou um vídeo, com o comando: ${prefix + command} (mencionando a mídia)`);
    var isVideo2 = !!boij;
    var buffer = await getFileBuffer(isVideo2 ? boij : boij2, isVideo2 ? 'video' : 'image');
    fs.writeFileSync(__dirname+'/../midias/menu.' + (isVideo2 ? 'mp4' : 'jpg'), buffer);
    await reply('✅ Mídia do menu atualizada com sucesso.');
  } catch(e) {
   console.error(e);
   reply(t.b.erro());
  }
  break
  
  case 'bangp':case 'unbangp':case 'desbangp': try {
  if(!isGroup) return reply(t.b.grupo());
  if(!isOwner) return reply(t.b.dono());
  banGpIds[from] = !banGpIds[from];
  if(banGpIds[from]) {
  await reply('🚫 Grupo banido, apenas usuarios premium ou meu dono podem utilizar o bot aqui agora.');
  } else {
  await reply('✅ Grupo desbanido, todos podem utilizar o bot novamente.');
  };
  fs.writeFileSync(__dirname + `/../database/dono/bangp.json`, JSON.stringify(banGpIds));
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break
  
  case 'addpremium':case 'addvip':
  try {
    if (!isOwner) return reply(t.b.dono());
    if (!menc_os2) return reply(t.b.marcarAlguem());
    if(!!premiumListaZinha[menc_os2]) return reply('O usuário ja esta na lista premium.');
    premiumListaZinha[menc_os2] = true;
    await nazu.sendMessage(from, {text: `✅ @${menc_os2.split('@')[0]} foi adicionado(a) a lista premium.`, mentions: [menc_os2] }, { quoted: info });
    fs.writeFileSync(__dirname + `/../database/dono/premium.json`, JSON.stringify(premiumListaZinha));
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'delpremium':case 'delvip':case 'rmpremium':case 'rmvip':
  try {
    if(!isOwner) return reply(t.b.dono());
    if(!menc_os2) return reply(t.b.marcarAlguem());
    if(!premiumListaZinha[menc_os2]) return reply('O usuário não esta na lista premium.');
    delete premiumListaZinha[menc_os2];
    await nazu.sendMessage(from, {text: `🫡 @${menc_os2.split('@')[0]} foi removido(a) da lista premium.`, mentions: [menc_os2] }, { quoted: info });
    fs.writeFileSync(__dirname + `/../database/dono/premium.json`, JSON.stringify(premiumListaZinha));
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'addpremiumgp':case 'addvipgp':
  try {
    if (!isOwner) return reply(t.b.dono());
    if (!isGroup) return reply(t.b.grupo());
    if(!!premiumListaZinha[from]) return reply('O grupo ja esta na lista premium.');
    premiumListaZinha[from] = true;
    await nazu.sendMessage(from, {text: `✅ O grupo foi adicionado a lista premium.` }, { quoted: info });
    fs.writeFileSync(__dirname + `/../database/dono/premium.json`, JSON.stringify(premiumListaZinha));
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'delpremiumgp':case 'delvipgp':case 'rmpremiumgp':case 'rmvipgp':
  try {
    if(!isOwner) return reply(t.b.dono());
    if (!isGroup) return reply(t.b.grupo());
    if(!premiumListaZinha[from]) return reply('O grupo não esta na lista premium.');
    delete premiumListaZinha[from];
    await nazu.sendMessage(from, {text: `🫡 O grupo foi removido da lista premium.` }, { quoted: info });
    fs.writeFileSync(__dirname + `/../database/dono/premium.json`, JSON.stringify(premiumListaZinha));
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  
  //COMANDOS GERAIS
  case 'rvisu':case 'open':case 'revelar': try {
  await nazu.react("👀");
  var RSMM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
  var boij22 = RSMM?.imageMessage || info.message?.imageMessage || RSMM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSMM?.viewOnceMessage?.message?.imageMessage;
  var boijj = RSMM?.videoMessage || info.message?.videoMessage || RSMM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSMM?.viewOnceMessage?.message?.videoMessage;
  var boij33 = RSMM?.audioMessage || info.message?.audioMessage || RSMM?.viewOnceMessageV2?.message?.audioMessage || info.message?.viewOnceMessageV2?.message?.audioMessage || info.message?.viewOnceMessage?.message?.audioMessage || RSMM?.viewOnceMessage?.message?.audioMessage;
  if(boijj) {
  var px = boijj;
  px.viewOnce = false;
  px.video = {url: px.url};
  await nazu.sendMessage(from,px,{quoted:info});
  } else if(boij22) {
  var px = boij22;
  px.viewOnce = false;
  px.image = {url: px.url};
  await nazu.sendMessage(from,px,{quoted:info});
  } else if(boij33) {
  var px = boij33;
  px.viewOnce = false;
  px.audio = {url: px.url};
  await nazu.sendMessage(from,px,{quoted:info});
  } else {
  return reply('Por favor, *mencione uma imagem, video ou áudio em visualização única* para executar o comando.');
  };
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break
  
  case 'rankativos': 
  case 'rankativo': try {
    if (!isGroup) return reply(t.b.grupo());
    blue67 = groupData.contador.sort((a, b) => ((a.figu == undefined ? a.figu = 0 : a.figu + a.msg + a.cmd) < (b.figu == undefined ? b.figu = 0 : b.figu + b.cmd + b.msg)) ? 0 : -1);
    menc = [];
    blad = `*🏆 Rank dos ${blue67.length < 10 ? blue67.length : 10} mais ativos do grupo:*\n`;
    for (i6 = 0; i6 < (blue67.length < 10 ? blue67.length : 10); i6++) {
        if (i6 != null) blad += `\n*🏅 ${i6 + 1}º Lugar:* @${blue67[i6].id.split('@')[0]}\n- mensagens encaminhadas: *${blue67[i6].msg}*\n- comandos executados: *${blue67[i6].cmd}*\n- Figurinhas encaminhadas: *${blue67[i6].figu}*\n`;
        if(!groupData.mark) groupData.mark = {};
        if(!['0', 'marca'].includes(groupData.mark[blue67[i6].id])) {
        menc.push(blue67[i6].id);
        };
    };
    await nazu.sendMessage(from, {text: blad, mentions: menc}, {quoted: info});
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  case 'rankinativos': 
  case 'rankinativo': try {
    if (!isGroup) return reply(t.b.grupo());
    blue67 = groupData.contador.sort((a, b) => (a.msg + a.cmd) - (b.msg + b.cmd));
    menc = [];
    blad = `*🗑️ Rank dos ${blue67.length < 10 ? blue67.length : 10} mais inativos do grupo:*\n`;
    for (i6 = 0; i6 < (blue67.length < 10 ? blue67.length : 10); i6++) {
        if (i6 != null) blad += `\n*🏅 ${i6 + 1}º Lugar:* @${blue67[i6].id.split('@')[0]}\n- mensagens encaminhadas: *${blue67[i6].msg}*\n- comandos executados: *${blue67[i6].cmd}*\n- Figurinhas encaminhadas: *${blue67[i6].figu}*\n`;
        if(!groupData.mark) groupData.mark = {};
        if(!['0', 'marca'].includes(groupData.mark[blue67[i6].id])) {
        menc.push(blue67[i6].id);
        };
    };
    await nazu.sendMessage(from, {text: blad, mentions: menc}, {quoted: info});
  } catch(e) {
  console.error(e);
  reply(t.b.erro());
  };
  break;
  
  case 'totalcmd':
  case 'totalcomando': try {
    fs.readFile(__dirname + '/index.js', 'utf8', async (err, data) => {
      if (err) throw err;
      const comandos = [...data.matchAll(/case [`'"](\w+)[`'"]/g)].map(m => m[1]);
      await nazu.sendMessage(from, {image: {url: `https://api.cognima.com.br/api/banner/counter?key=CognimaTeamFreeKey&num=${String(comandos.length)}&theme=miku`}, caption: `╭〔 🤖 *Meus Comandos* 〕╮\n`+`┣ 📌 Total: *${comandos.length}* comandos\n`+`╰━━━━━━━━━━━━━━━╯`}, { quoted: info });
    });
    } catch(e) {
    console.error(e);
    await reply(t.b.erro());
    }
  break;

case 'ping':
  try {
    const timestamp = Date.now();
    const speedConverted = (Date.now() - (info.messageTimestamp * 1000)) / 1000;
    const config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
    function formatUptime(seconds) {
      let d = Math.floor(seconds / (24 * 3600));
      let h = Math.floor((seconds % (24 * 3600)) / 3600);
      let m = Math.floor((seconds % 3600) / 60);
      let s = Math.floor(seconds % 60);
      let uptimeStr = [];
      if (d > 0) uptimeStr.push(`${d}d`);
      if (h > 0) uptimeStr.push(`${h}h`);
      if (m > 0) uptimeStr.push(`${m}m`);
      if (s > 0) uptimeStr.push(`${s}s`);
      return uptimeStr.join(' ');
    };
    const uptimeBot = formatUptime(process.uptime());
    const uptimeSistema = formatUptime(os.uptime());
    const ramTotal = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const ramUso = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2);
    const cpuUso = os.loadavg()[0].toFixed(2);
    const cpuModelo = os.cpus()[0].model;
    const nodeVersao = process.version;
    var getGroups = await nazu.groupFetchAllParticipating();
    var groups = Object.entries(getGroups).map(entry => entry[1]);
    var totalGrupos = groups.length;
    const mensagem = `┏━〔 🤖 *STATUS DO BOT* 〕━┓\n\n📌 *Prefixo:* ${config.prefixo}\n👑 *Dono:* ${config.nomedono}\n🤖 *Nome:* ${config.nomebot}\n💬 *Grupos Ativos:* ${totalGrupos}\n\n🚀 *Latência:* ${speedConverted.toFixed(3)}s\n⏳ *Uptime do Bot:* ${uptimeBot}\n🖥 *Uptime do Sistema:* ${uptimeSistema}\n\n💾 *Memória:* ${ramUso} GB / ${ramTotal} GB\n⚡ *CPU:* ${cpuUso}%\n🔧 *Processador:* ${cpuModelo}\n📜 *Node.js:* ${nodeVersao}\n\n┗━━━━━━━━━━━━━━┛`;
    await nazu.sendMessage(from, { image: { url: `https://api.cognima.com.br/api/banner/counter?key=CognimaTeamFreeKey&num=${0.000>speedConverted ? "0" : String(speedConverted.toFixed(3)).replaceAll('.', '')}&theme=original` }, caption: mensagem }, { quoted: info });
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  };
  break;
  
  
  //COMANDOS DE FIGURINHAS
  case 'toimg':
  if(!isQuotedSticker) return reply('Por favor, *mencione um sticker* para executar o comando.');
  try {
  buff = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker');
  await nazu.sendMessage(from, {image: buff}, {quoted: info});
  } catch(error) {
  await reply(t.b.erro());
  };
  break

  case 'qc': try {
  if(!q) return reply('Falta o texto.');
   let ppimg = "";
   try {
   ppimg = await nazu.profilePictureUrl(sender, 'image');
   } catch {
   ppimg = 'https://telegra.ph/file/b5427ea4b8701bc47e751.jpg'
   };
  const json = {"type": "quote","format": "png","backgroundColor": "#FFFFFF","width": 512,"height": 768,"scale": 2,"messages": [{"entities": [],"avatar": true,"from": {"id": 1,"name": pushname,"photo": {"url": ppimg}},"text": q,"replyMessage": {}}]};
  res = await axios.post('https://bot.lyo.su/quote/generate', json, {headers: {'Content-Type': 'application/json'}});
  await sendSticker(nazu, from, { sticker: Buffer.from(res.data.result.image, 'base64'), author: 'Hiudy', packname: 'By:', type: 'image' }, {quoted: info });
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  case 'emojimix': try {
  emoji1 = q.split(`/`)[0];emoji2 = q.split(`/`)[1];
  if(!q || !emoji1 || !emoji2) return reply(`Formato errado, utilize:\n${prefix}${command} emoji1/emoji2\nEx: ${prefix}${command} 🤓/🙄`);
  datzc = await emojiMix(emoji1, emoji2);
  await sendSticker(nazu, from, { sticker: {url: datzc}, author: 'Hiudy', packname: 'By:', type: 'image'}, { quoted: info });
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  case 'ttp': try {
  if(!q) return reply('Cadê o texto?');
  cor = ["f702ff","ff0202","00ff2e","efff00","00ecff","3100ff","ffb400","ff00b0","00ff95","efff00"];
  fonte = ["Days%20One","Domine","Exo","Fredoka%20One","Gentium%20Basic","Gloria%20Hallelujah","Great%20Vibes","Orbitron","PT%20Serif","Pacifico"];
  cores = cor[Math.floor(Math.random() * (cor.length))];
  fontes = fonte[Math.floor(Math.random() * (fonte.length))];
  await sendSticker(nazu, from, { sticker: {url: `https://huratera.sirv.com/PicsArt_08-01-10.00.42.png?profile=Example-Text&text.0.text=${q}&text.0.outline.color=000000&text.0.outline.blur=0&text.0.outline.opacity=55&text.0.color=${cores}&text.0.font.family=${fontes}&text.0.background.color=ff0000`}, author: 'Hiudy', packname: 'By:', type: 'image'}, { quoted: info });
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  case 'brat': try {
  if(!q) return reply(t.b.formatoEspecifico('Texto', `${prefix}${command} Nazu é a melhor 🥵`));
  await sendSticker(nazu, from, { sticker: {url: `https://api.cognima.com.br/api/image/brat?key=CognimaTeamFreeKey&texto=${encodeURIComponent(q)}`}, author: 'Hiudy', packname: 'By:', type: 'image'}, { quoted: info });
  } catch(e) {
  console.error(e);
  };
  break;
  
  case 'st':case 'stk':case 'sticker':case 's': try {
    var RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    var boij2 = RSM?.imageMessage || info.message?.imageMessage || RSM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSM?.viewOnceMessage?.message?.imageMessage;
   var boij = RSM?.videoMessage || info.message?.videoMessage || RSM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSM?.viewOnceMessage?.message?.videoMessage;
    if (!boij && !boij2) return reply(`Marque uma imagem ou um vídeo de até 9.9 segundos para fazer figurinha, com o comando: ${prefix + command} (mencionando a mídia)`);
    var isVideo2 = !!boij;
    if (isVideo2 && boij.seconds > 9.9) return reply(`O vídeo precisa ter no máximo 9.9 segundos para ser convertido em figurinha.`);
    var buffer = await getFileBuffer(isVideo2 ? boij : boij2, isVideo2 ? 'video' : 'image')
    await sendSticker(nazu, from, { sticker: buffer, author: 'Hiudy', packname: 'By:', type: isVideo2 ? 'video' : 'image'}, { quoted: info });
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break
  
  case 'figualeatoria':case 'randomsticker': try {
   await nazu.sendMessage(from, { sticker: { url: `https://raw.githubusercontent.com/badDevelopper/Testfigu/main/fig (${Math.floor(Math.random() * 8051)}).webp`}}, {quoted: info});
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  case 'rename':case 'roubar': try {
   if(!isQuotedSticker) return reply('Você usou de forma errada... Marque uma figurinha.')
   author = q.split(`/`)[0];packname = q.split(`/`)[1];
   if(!q || !author || !packname) return reply(`Formato errado, utilize:\n${prefix}${command} Autor/Pack\nEx: ${prefix}${command} By:/Hiudy`);
   encmediats = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker');
   await sendSticker(nazu, from, { sticker: `data:image/jpeg;base64,${encmediats.toString('base64')}`, author: packname, packname: author, rename: true}, { quoted: info });
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  case 'rgtake': try {
  const [author, pack] = q.split('/');
  if (!q || !author || !pack) return reply(`Formato errado, utilize:\n${prefix}${command} Autor/Pack\nEx: ${prefix}${command} By:/Hiudy`);
  const filePath = __dirname + '/../database/users/take.json';
  const dataTake = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : {};
  dataTake[sender] = { author, pack };
  fs.writeFileSync(filePath, JSON.stringify(dataTake, null, 2), 'utf-8');
  reply(`Autor e pacote salvos com sucesso!\nAutor: ${author}\nPacote: ${pack}`);
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  case 'take': try {
  if (!isQuotedSticker) return reply('Você usou de forma errada... Marque uma figurinha.');
  const filePath = __dirname + '/../database/users/take.json';
  if (!fs.existsSync(filePath)) return reply('Nenhum autor e pacote salvos. Use o comando *rgtake* primeiro.');
  const dataTake = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!dataTake[sender]) return reply('Você não tem autor e pacote salvos. Use o comando *rgtake* primeiro.');
  const { author, pack } = dataTake[sender];
  const encmediats = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker');
  await sendSticker(nazu, from, { sticker: `data:image/jpeg;base64,${encmediats.toString('base64')}`, author: pack, packname: author, rename: true }, { quoted: info });
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  //FIM COMANDOS DE FIGURINHAS
  
  
  case 'mention':
  try {
    if (!isGroup) return reply(t.b.grupo());
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
    reply(t.b.erro());
  }
  break;
  
  //COMANDOS DE ADM
  case 'deletar': case 'delete': case 'del':  case 'd':
  if(!isGroupAdmin) return reply(t.b.admin());
  if(!menc_prt) return reply(t.b.marcarMensagem());
  let stanzaId, participant;
    if (info.message.extendedTextMessage) {
        stanzaId = info.message.extendedTextMessage.contextInfo.stanzaId;
        participant = info.message.extendedTextMessage.contextInfo.participant || menc_prt;
    } else if (info.message.viewOnceMessage) {
        stanzaId = info.key.id;
        participant = info.key.participant || menc_prt;
    };
    try {
        await nazu.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: stanzaId, participant: participant } });
    } catch (error) {
        reply(t.b.erro());
    };
  break

  case 'banir':
  case 'ban':
  case 'b':
  case 'kick':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());
    if (!menc_os2) return reply(t.b.marcarAlguem());
    await nazu.groupParticipantsUpdate(from, [menc_os2], 'remove');
    reply(`✅ Usuário banido com sucesso!`);
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
    case 'linkgp':
    case 'linkgroup': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());
    linkgc = await nazu.groupInviteCode(from)
    await reply('https://chat.whatsapp.com/'+linkgc)
    } catch(e) {
    console.error(e);
    await reply(t.b.erro());
    };
    break

  case 'promover':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());
    if (!menc_os2) return reply(t.b.marcarAlguem());
    await nazu.groupParticipantsUpdate(from, [menc_os2], 'promote');
    reply(`✅ Usuário promovido a administrador!`);
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;

  case 'rebaixar':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());
    if (!menc_os2) return reply(t.b.marcarAlguem());
    await nazu.groupParticipantsUpdate(from, [menc_os2], 'demote');
    reply(`✅ Usuário rebaixado com sucesso!`);
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;

  case 'setname':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());
    const newName = q.trim();
    if (!newName) return reply('❌ Digite um novo nome para o grupo.');
    await nazu.groupUpdateSubject(from, newName);
    reply(`✅ Nome do grupo alterado para: *${newName}*`);
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;

  case 'setdesc':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());
    const newDesc = q.trim();
    if (!newDesc) return reply('❌ Digite uma nova descrição para o grupo.');
    await nazu.groupUpdateDescription(from, newDesc);
    reply(`✅ Descrição do grupo alterada!`);
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'marcar':
  if (!isGroup) return reply(t.b.grupo());
  if (!isGroupAdmin) return reply(t.b.admin());
  if (!isBotAdmin) return reply(t.b.botAdm());
  try {
    let path = __dirname + '/../database/grupos/' + from + '.json';
    let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : { mark: {} };
    if(!data.mark) data.mark = {};
    let membros = AllgroupMembers.filter(m => !['0', 'games'].includes(data.mark[m]));
    if (!membros.length) return reply('❌ Nenhum membro para mencionar.');
    let msg = `📢 *Membros mencionados:* ${q ? `\n💬 *Mensagem:* ${q}` : ''}\n\n`;
    await nazu.sendMessage(from, {text: msg + membros.map(m => `➤ @${m.split('@')[0]}`).join('\n'), mentions: membros});
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'grupo': try {
  if (!isGroup) return reply(t.b.grupo());
  if (!isGroupAdmin) return reply(t.b.admin());
  if (!isBotAdmin) return reply(t.b.botAdm());
  if(q.toLowerCase() === 'a' || q.toLowerCase() === 'abrir') {
  await nazu.groupSettingUpdate(from, 'not_announcement');
  await reply('Grupo aberto.');
  } else if(q.toLowerCase() === 'f' || q.toLowerCase() === 'fechar') {
  await nazu.groupSettingUpdate(from, 'announcement');
  await reply('Grupo fechado.');
  }} catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break
  
  case 'totag':
  case 'cita':
  case 'hidetag': try {
  if (!isGroup) return reply(t.b.grupo());
  if (!isGroupAdmin) return reply(t.b.admin());
  if (!isBotAdmin) return reply(t.b.botAdm());
    
    var DFC4 = "";
    var rsm4 = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    var pink4 = isQuotedImage ? rsm4?.imageMessage : info.message?.imageMessage;
    var blue4 = isQuotedVideo ? rsm4?.videoMessage : info.message?.videoMessage;
    var purple4 = isQuotedDocument ? rsm4?.documentMessage : info.message?.documentMessage;
    var yellow4 = isQuotedDocW ? rsm4?.documentWithCaptionMessage?.message?.documentMessage : info.message?.documentWithCaptionMessage?.message?.documentMessage;
    var aud_d4 = isQuotedAudio ? rsm4.audioMessage : "";
    var figu_d4 = isQuotedSticker ? rsm4.stickerMessage : "";
    var red4 = isQuotedMsg && !aud_d4 && !figu_d4 && !pink4 && !blue4 && !purple4 && !yellow4 ? rsm4.conversation : info.message?.conversation;
    var green4 = rsm4?.extendedTextMessage?.text || info?.message?.extendedTextMessage?.text;
    let path = __dirname + '/../database/grupos/' + from + '.json';
    let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : { mark: {} };
    if(!data.mark) data.mark = {};
    var MRC_TD4 = AllgroupMembers.filter(m => !['0', 'games'].includes(data.mark[m]));

    if (pink4 && !aud_d4 && !purple4) {
        var DFC4 = pink4;
        pink4.caption = q.length > 1 ? q : pink4.caption.replace(new RegExp(prefix + command, "gi"), ` `);
        pink4.image = { url: pink4.url };
        pink4.mentions = MRC_TD4;
    } else if (blue4 && !aud_d4 && !purple4) {
        var DFC4 = blue4;
        blue4.caption = q.length > 1 ? q.trim() : blue4.caption.replace(new RegExp(prefix + command, "gi"), ` `).trim();
        blue4.video = { url: blue4.url };
        blue4.mentions = MRC_TD4;
    } else if (red4 && !aud_d4 && !purple4) {
        var black4 = {};
        black4.text = red4.replace(new RegExp(prefix + command, "gi"), ` `).trim();
        black4.mentions = MRC_TD4;
        var DFC4 = black4;
    } else if (!aud_d4 && !figu_d4 && green4 && !purple4) {
        var brown4 = {};
        brown4.text = green4.replace(new RegExp(prefix + command, "gi"), ` `).trim();
        brown4.mentions = MRC_TD4;
        var DFC4 = brown4;
    } else if (purple4) {
        var DFC4 = purple4;
        purple4.document = { url: purple4.url };
        purple4.mentions = MRC_TD4;
    } else if (yellow4 && !aud_d4) {
        var DFC4 = yellow4;
        yellow4.caption = q.length > 1 ? q.trim() : yellow4.caption.replace(new RegExp(prefix + command, "gi"), `${pushname}\n\n`).trim();
        yellow4.document = { url: yellow4.url };
        yellow4.mentions = MRC_TD4;
    } else if (figu_d4 && !aud_d4) {
        var DFC4 = figu_d4;
        figu_d4.sticker = { url: figu_d4.url };
        figu_d4.mentions = MRC_TD4;
    } else if (aud_d4) {
        var DFC4 = aud_d4;
        aud_d4.audio = { url: aud_d4.url };
        aud_d4.mentions = MRC_TD4;
        aud_d4.ptt = true;
    };
    await nazu.sendMessage(from, DFC4).catch((error) => {});
    } catch(e) {
    console.error(e);
    await reply(t.b.erro());
    };
    break;
    
    case 'modobrincadeira': case 'modobrincadeiras': case 'modobn': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
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
    }} catch(e) {
    console.error(e);
    await reply(t.b.erro());
    };
    break;
    
    case 'bemvindo': case 'bv': case 'boasvindas': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
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
    }} catch(e) {
    console.error(e);
    await reply(t.b.erro());
    };
    break;
    
   case 'fotobv':
   case 'welcomeimg': {
  if (!isGroup) return reply(t.b.grupo());
  if (!isGroupAdmin) return reply(t.b.admin());
  if (!isQuotedImage && !isImage) return reply('❌ Marque uma imagem ou envie uma imagem com o comando!');

  try {
      const imgMessage = isQuotedImage
        ? info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage
        : info.message.imageMessage;
      const media = await getFileBuffer(imgMessage, 'image');
      const uploadResult = await upload(media);
      if (!uploadResult) throw new Error('Falha ao fazer upload da imagem');
      if (!groupData.welcome) groupData.welcome = {};
      groupData.welcome.image = uploadResult;
      fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
    await reply('✅ Foto de boas-vindas configurada com sucesso!');
  } catch (error) {
    console.error(error);
    reply(t.b.erro());
  }
}
break;

   case 'fotosaida': case 'fotosaiu': case 'imgsaiu': case 'exitimg': {
     if (!isGroup) return reply(t.b.grupo());
     if (!isGroupAdmin) return reply(t.b.admin());
     if (!isQuotedImage && !isImage) return reply('❌ Marque uma imagem ou envie uma imagem com o comando!');
     try {
       const media = await getFileBuffer(
         isQuotedImage ? info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage : info.message.imageMessage,
         'image'
       );
       const uploadResult = await upload(media);
       if (!uploadResult) throw new Error('Falha ao fazer upload da imagem');
       if (!groupData.exit) groupData.exit = {};
       groupData.exit.image = uploadResult;
       fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
       await reply('✅ Foto de saída configurada com sucesso!');
     } catch (error) {
       console.error(error);
       reply(t.b.erro());
     };
   };
   break;

   case 'configsaida': case 'textsaiu': case 'legendasaiu': case 'exitmsg': {
     if (!isGroup) return reply(t.b.grupo());
     if (!isGroupAdmin) return reply(t.b.admin());
     if (!q) return reply(`📝 Para configurar a mensagem de saída, use:\n${prefix}${command} <mensagem>\n\nVocê pode usar:\n#numerodele# - Menciona quem saiu\n#nomedogp# - Nome do grupo\n#membros# - Total de membros\n#desc# - Descrição do grupo`);
     try {
       if (!groupData.exit) groupData.exit = {};
       groupData.exit.enabled = true;
       groupData.exit.text = q;
       fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
       await reply('✅ Mensagem de saída configurada com sucesso!\n\n📝 Mensagem definida como:\n' + q);
     } catch (error) {
       console.error(error);
       await reply(t.b.erro());
     }
   }
   break;

   case 'saida': case 'exit': {
     if (!isGroup) return reply(t.b.grupo());
     if (!isGroupAdmin) return reply(t.b.admin());
     try {
       if (!groupData.exit) groupData.exit = {};
       groupData.exit.enabled = !groupData.exit.enabled;
       fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
       await reply(groupData.exit.enabled ? '✅ Mensagens de saída ativadas!' : '❌ Mensagens de saída desativadas!');
     } catch (error) {
       console.error(error);
       await reply(t.b.erro());
     };
   };
   break;

   case 'modorpg': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!groupData.modorpg) {
      groupData.modorpg = true;
      fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
      reply('✅ *Modo RPG ativado!* Agora os comandos de RPG estão disponíveis no grupo.');
    } else {
      groupData.modorpg = false;
      fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
      reply('⚠️ *Modo RPG desativado!* Os comandos de RPG não estão mais disponíveis.');
    };
   } catch(e) {
   console.error(e);
   await reply(t.b.erro());
   };
   break;
   
    case 'soadm': case 'onlyadm': case 'soadmin': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;   
    if (!groupData.soadm || groupData.soadm === undefined) {
        groupData.soadm = true;
    } else {
        groupData.soadm = !groupData.soadm;
    };
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    if (groupData.soadm) {
        await reply(`✅ *Modo apenas adm ativado!* Agora apenas administrdores do grupo poderam utilizar o bot*`);
    } else {
        await reply('⚠️ *Modo apenas adm desativado!* Agora todos os membros podem utilizar o bot novamente.');
    }} catch(e) {
    console.error(e);
    reply(t.b.erro());
    };
    break;
    
    case 'antilinkgp':
    try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { antilinkgp: false };
    groupData.antilinkgp = !groupData.antilinkgp;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    const message = groupData.antilinkgp ? `✅ *Antilinkgp foi ativado com sucesso!*\n\nAgora, se alguém enviar links de outros grupos, será banido automaticamente. Mantenha o grupo seguro! 🛡️` : `✅ *Antilinkgp foi desativado.*\n\nLinks de outros grupos não serão mais bloqueados. Use com cuidado! ⚠️`;
     reply(`${message}`);
    } catch (e) {
     console.error(e);
     reply(t.b.erro());
    }
    break;
    
    case 'antiporn':
    try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());

    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { antiporn: false };
    groupData.antiporn = !groupData.antiporn;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    const message = groupData.antiporn ? `✅ *Antiporn foi ativado com sucesso!*\n\nAgora, se alguém enviar conteúdo adulto (NSFW), será banido automaticamente. Mantenha o grupo seguro e adequado! 🛡️` : `✅ *Antiporn foi desativado.*\n\nConteúdo adulto não será mais bloqueado. Use com responsabilidade! ⚠️`;

    reply(`${message}`);
    } catch (e) {
     console.error(e);
     reply(t.b.erro());
    }
    break;
    
    case 'antigore':
    try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { antigore: false };
    groupData.antigore = !groupData.antigore;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    const message = groupData.antigore ? `✅ *Antigore foi ativado com sucesso!*\n\nAgora, se alguém enviar conteúdo gore, será banido automaticamente. Mantenha o grupo seguro e saudável! 🛡️` : `✅ *Antigore foi desativado.*\n\nConteúdo gore não será mais bloqueado. Use com cuidado! ⚠️`;
    reply(`${message}`);
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
    
    case 'modonsfw':
    case 'modo+18':
    try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { nsfwMode: false };
    groupData.nsfwMode = !groupData.nsfwMode;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    if (groupData.nsfwMode) {
      await nazu.sendMessage(from, {text: `🔞 *Modo +18 ativado!*`,}, { quoted: info });
    } else {
      await nazu.sendMessage(from, {text: `✅ *Modo +18 desativado!.*`,}, { quoted: info });
    }
    } catch (e) {
     console.error(e);
     reply(t.b.erro());
    }
    break;
    
    case 'legendabv': case 'textbv': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    if (!q) return reply(`📝 *Configuração da Mensagem de Boas-Vindas*\n\nPara definir uma mensagem personalizada, digite o comando seguido do texto desejado. Você pode usar as seguintes variáveis:\n\n- *#numerodele#* → Marca o novo membro.\n- *#nomedogp#* → Nome do grupo.\n- *#desc#* → Descrição do grupo.\n- *#membros#* → Número total de membros no grupo.\n\n📌 *Exemplo:*\n${prefixo}legendabv Bem-vindo(a) #numerodele# ao grupo *#nomedogp#*! Agora somos #membros# membros. Leia a descrição: #desc#`);
    groupData.textbv = q;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    reply(`✅ *Mensagem de boas-vindas configurada com sucesso!*\n\n📌 Nova mensagem:\n"${groupData.textbv}"`);
    } catch(e) {
    console.error(e);
    await reply(t.b.erro());
    };
  break;
  
  case 'mute':
  case 'mutar':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());
    if (!menc_os2) return reply(t.b.marcarAlguem());
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { mutedUsers: {} };
    groupData.mutedUsers = groupData.mutedUsers || {};
    groupData.mutedUsers[menc_os2] = true;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    await nazu.sendMessage(from, {text: `✅ @${menc_os2.split('@')[0]} foi mutado. Se enviar mensagens, será banido.`, mentions: [menc_os2] }, { quoted: info });
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'desmute':
  case 'desmutar':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!menc_os2) return reply(t.b.marcarAlguem());
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { mutedUsers: {} };
    groupData.mutedUsers = groupData.mutedUsers || {};
    if (groupData.mutedUsers[menc_os2]) {
      delete groupData.mutedUsers[menc_os2];
      fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
      await nazu.sendMessage(from, {text: `✅ @${menc_os2.split('@')[0]} foi desmutado e pode enviar mensagens novamente.`, mentions: [menc_os2]}, { quoted: info });
    } else {
      reply('❌ Este usuário não está mutado.');
    }
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'blockcmd':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!q) return reply('❌ Digite o comando que deseja bloquear. Exemplo: /blockcmd sticker');
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { blockedCommands: {} };
    groupData.blockedCommands = groupData.blockedCommands || {};
    groupData.blockedCommands[q.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll(prefix, '')] = true;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    reply(`✅ O comando *${q.trim()}* foi bloqueado e só pode ser usado por administradores.`);
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
    
  case 'unblockcmd':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!q) return reply('❌ Digite o comando que deseja desbloquear. Exemplo: /unblockcmd sticker');
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { blockedCommands: {} };
    groupData.blockedCommands = groupData.blockedCommands || {};
    if (groupData.blockedCommands[q.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll(prefix, '')]) {
      delete groupData.blockedCommands[q.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll(prefix, '')];
      fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
      reply(`✅ O comando *${q.trim()}* foi desbloqueado e pode ser usado por todos.`);
    } else {
      reply('❌ Este comando não está bloqueado.');
    }
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
    
    
    //JOGO DA VELHA
    case 'ttt': case 'jogodavelha': {
    if (!isGroup) return reply(t.b.grupo());
    if (!menc_os2) return reply(t.b.marcarAlguem());
    const result = await tictactoe.invitePlayer(from, sender, menc_os2);
    await nazu.sendMessage(from, {
        text: result.message,
        mentions: result.mentions
    });
    break;
   };
   
    //COMANDOS DE BRINCADEIRAS
   
   case 'eununca': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isModoBn) return reply('❌ O modo brincadeira não esta ativo nesse grupo');
    await nazu.sendMessage(from, {poll: {name: toolsJson.iNever[Math.floor(Math.random() * toolsJson.iNever.length)],values: ["Eu nunca", "Eu ja"], selectableCount: 1}, messageContextInfo: { messageSecret: Math.random()}}, {from, options: {userJid: nazu?.user?.id}})
   } catch(e) {
   console.error(e);
   await reply(t.b.erro());
   };
   break
   
   case 'vab': try {
   if (!isGroup) return reply(t.b.grupo());
   if (!isModoBn) return reply('❌ O modo brincadeira não esta ativo nesse grupo');
   const vabs = vabJson[Math.floor(Math.random() * vabJson.length)];
   await nazu.sendMessage(from, {poll: {name: 'O que você prefere?',values: [vabs.option1, vabs.option2], selectableCount: 1}, messageContextInfo: { messageSecret: Math.random()}}, {from, options: {userJid: nazu?.user?.id}})
   } catch(e) {
   console.error(e);
   await reply(t.b.erro());
   };
   break
   
   case 'gay': case 'burro': case 'inteligente': case 'otaku': case 'fiel': case 'infiel': case 'corno':  case 'gado': case 'gostoso': case 'feio': case 'rico': case 'pobre': case 'pirocudo': case 'pirokudo': case 'nazista': case 'ladrao': case 'safado': case 'vesgo': case 'bebado': case 'machista': case 'homofobico': case 'racista': case 'chato': case 'sortudo': case 'azarado': case 'forte': case 'fraco': case 'pegador': case 'otario': case 'macho': case 'bobo': case 'nerd': case 'preguicoso': case 'trabalhador': case 'brabo': case 'lindo': case 'malandro': case 'simpatico': case 'engracado': case 'charmoso': case 'misterioso': case 'carinhoso': case 'desumilde': case 'humilde': case 'ciumento': case 'corajoso': case 'covarde': case 'esperto': case 'talarico': case 'chorao': case 'brincalhao': case 'bolsonarista': case 'petista': case 'comunista': case 'lulista': case 'traidor': case 'bandido': case 'cachorro': case 'vagabundo': case 'pilantra': case 'mito': case 'padrao': case 'comedia': case 'psicopata': case 'fortao': case 'magrelo': case 'bombado': case 'chefe': case 'presidente': case 'rei': case 'patrao': case 'playboy': case 'zueiro': case 'gamer': case 'programador': case 'visionario': case 'billionario': case 'poderoso': case 'vencedor': case 'senhor': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isModoBn) return reply('❌ O modo brincadeira não esta ativo nesse grupo');
    let gamesData = fs.existsSync(__dirname + '/funcs/json/games.json') ? JSON.parse(fs.readFileSync(__dirname + '/funcs/json/games.json')) : { games: {} };
    const target = menc_os2 ? menc_os2 : sender;
    const targetName = `@${target.split('@')[0]}`;
    const level = Math.floor(Math.random() * 101);
    let responses = fs.existsSync(__dirname + '/funcs/json/gamestext.json') ? JSON.parse(fs.readFileSync(__dirname + '/funcs/json/gamestext.json')) : {};
    const responseText = responses[command].replaceAll('#nome#', targetName).replaceAll('#level#', level) || `📊 ${targetName} tem *${level}%* de ${command}! 🔥`;
    const media = gamesData.games[command]
    if (media?.image) {
        await nazu.sendMessage(from, { image: media.image, caption: responseText, mentions: [target] });
    } else if (media?.video) {
        await nazu.sendMessage(from, { video: media.video, caption: responseText, mentions: [target], gifPlayback: true});
    } else {
        await nazu.sendMessage(from, {text: responseText, mentions: [target]});
    };
} catch(e) {
console.error(e);
await reply(t.b.erro());
};
break;

   case 'lesbica': case 'burra': case 'inteligente': case 'otaku': case 'fiel': case 'infiel': case 'corna': case 'gado': case 'gostosa': case 'feia': case 'rica': case 'pobre': case 'bucetuda': case 'nazista': case 'ladra': case 'safada': case 'vesga': case 'bebada': case 'machista': case 'homofobica': case 'racista': case 'chata': case 'sortuda': case 'azarada': case 'forte': case 'fraca': case 'pegadora': case 'otaria': case 'boba': case 'nerd': case 'preguicosa': case 'trabalhadora': case 'braba': case 'linda': case 'malandra': case 'simpatica': case 'engracada': case 'charmosa': case 'misteriosa': case 'carinhosa': case 'desumilde': case 'humilde': case 'ciumenta': case 'corajosa': case 'covarde': case 'esperta': case 'talarica': case 'chorona': case 'brincalhona': case 'bolsonarista': case 'petista': case 'comunista': case 'lulista': case 'traidora': case 'bandida': case 'cachorra': case 'vagabunda': case 'pilantra': case 'mito': case 'padrao': case 'comedia': case 'psicopata': case 'fortona': case 'magrela': case 'bombada': case 'chefe': case 'presidenta': case 'rainha': case 'patroa': case 'playboy': case 'zueira': case 'gamer': case 'programadora': case 'visionaria': case 'bilionaria': case 'poderosa': case 'vencedora': case 'senhora': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isModoBn) return reply('❌ O modo brincadeira não esta ativo nesse grupo');
    let gamesData = fs.existsSync(__dirname + '/funcs/json/games.json') ? JSON.parse(fs.readFileSync(__dirname + '/funcs/json/games.json')) : { games: {} };
    const target = menc_os2 ? menc_os2 : sender;
    const targetName = `@${target.split('@')[0]}`;
    const level = Math.floor(Math.random() * 101);
    let responses = fs.existsSync(__dirname + '/funcs/json/gamestext2.json') ? JSON.parse(fs.readFileSync(__dirname + '/funcs/json/gamestext2.json')) : {};
    const responseText = responses[command].replaceAll('#nome#', targetName).replaceAll('#level#', level) || `📊 ${targetName} tem *${level}%* de ${command}! 🔥`;
    const media = gamesData.games[command]
    if (media?.image) {
        await nazu.sendMessage(from, { image: media.image, caption: responseText, mentions: [target] });
    } else if (media?.video) {
        await nazu.sendMessage(from, { video: media.video, caption: responseText, mentions: [target], gifPlayback: true});
    } else {
        await nazu.sendMessage(from, {text: responseText, mentions: [target]});
    };
} catch(e) {
console.error(e);
await reply(t.b.erro());
};
break;

case 'rankgay': case 'rankburro': case 'rankinteligente': case 'rankotaku': case 'rankfiel': case 'rankinfiel': case 'rankcorno': case 'rankgado': case 'rankgostoso': case 'rankrico': case 'rankpobre': case 'rankforte': case 'rankpegador': case 'rankmacho': case 'ranknerd': case 'ranktrabalhador': case 'rankbrabo': case 'ranklindo': case 'rankmalandro': case 'rankengracado': case 'rankcharmoso': case 'rankvisionario': case 'rankpoderoso': case 'rankvencedor':case 'rankgays': case 'rankburros': case 'rankinteligentes': case 'rankotakus': case 'rankfiels': case 'rankinfieis': case 'rankcornos': case 'rankgados': case 'rankgostosos': case 'rankricos': case 'rankpobres': case 'rankfortes': case 'rankpegadores': case 'rankmachos': case 'ranknerds': case 'ranktrabalhadores': case 'rankbrabos': case 'ranklindos': case 'rankmalandros': case 'rankengracados': case 'rankcharmosos': case 'rankvisionarios': case 'rankpoderosos': case 'rankvencedores': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isModoBn) return reply('❌ O modo brincadeira não está ativo nesse grupo.');
    let path = __dirname + '/../database/grupos/' + from + '.json';
    let gamesData = fs.existsSync(__dirname + '/funcs/json/games.json') ? JSON.parse(fs.readFileSync(__dirname + '/funcs/json/games.json')) : { ranks: {} };
    let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : { mark: {} };
    let membros = AllgroupMembers.filter(m => !['0', 'marca'].includes(data.mark[m]));
    if (membros.length < 5) return reply('❌ Membros insuficientes para formar um ranking.');
    let top5 = membros.sort(() => Math.random() - 0.5).slice(0, 5);
    let cleanedCommand = command.endsWith('s') ? command.slice(0, -1) : command;
    let ranksData = fs.existsSync(__dirname + '/funcs/json/ranks.json') ? JSON.parse(fs.readFileSync(__dirname + '/funcs/json/ranks.json')) : { ranks: {} };
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
} catch(e) {
console.error(e);
await reply(t.b.erro());
};
break;

case 'ranklesbica': case 'rankburra': case 'rankinteligente': case 'rankotaku': case 'rankfiel': case 'rankinfiel': case 'rankcorna': case 'rankgada': case 'rankgostosa': case 'rankrica': case 'rankpobre': case 'rankforte': case 'rankpegadora': case 'ranknerd': case 'ranktrabalhadora': case 'rankbraba': case 'ranklinda': case 'rankmalandra': case 'rankengracada': case 'rankcharmosa': case 'rankvisionaria': case 'rankpoderosa': case 'rankvencedora':case 'ranklesbicas': case 'rankburras': case 'rankinteligentes': case 'rankotakus': case 'rankfiels': case 'rankinfieis': case 'rankcornas': case 'rankgads': case 'rankgostosas': case 'rankricas': case 'rankpobres': case 'rankfortes': case 'rankpegadoras': case 'ranknerds': case 'ranktrabalhadoras': case 'rankbrabas': case 'ranklindas': case 'rankmalandras': case 'rankengracadas': case 'rankcharmosas': case 'rankvisionarias': case 'rankpoderosas': case 'rankvencedoras': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isModoBn) return reply('❌ O modo brincadeira não está ativo nesse grupo.');
    let path = __dirname + '/../database/grupos/' + from + '.json';
    let gamesData = fs.existsSync(__dirname + '/funcs/json/games.json') ? JSON.parse(fs.readFileSync(__dirname + '/funcs/json/games.json')) : { ranks: {} };
    let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : { mark: {} };
    let membros = AllgroupMembers.filter(m => !['0', 'marca'].includes(data.mark[m]));
    if (membros.length < 5) return reply('❌ Membros insuficientes para formar um ranking.');
    let top5 = membros.sort(() => Math.random() - 0.5).slice(0, 5);
    let cleanedCommand = command.endsWith('s') ? command.slice(0, -1) : command;
    let ranksData = fs.existsSync(__dirname + '/funcs/json/ranks.json') ? JSON.parse(fs.readFileSync(__dirname + '/funcs/json/ranks.json')) : { ranks: {} };
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
} catch(e) {
console.error(e);
await reply(t.b.erro());
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






//SITEMA DE RPG EM TESTE
        case 'rg': // Registro
            if (await rpg(sender)) return reply('⚠️ Já registrado!');
            if (!args[0]) return reply('⚠️ Dê um nome! Ex: !rg Herói');
            return reply(await rpg.rg(sender, args.join(' ')));

        case 'fight': // Batalhar
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha inimigo! Ex: !fight goblin');
            return reply(await rpg.batalhar(sender, normalizarTexto(args.join(' '))));

        case 'dungeon': // Masmorra
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha masmorra! Ex: !dungeon caverna');
            return reply(await rpg.explorarMasmorra(sender, normalizarTexto(args.join(' '))));

        case 'craft': // Craftar
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha item! Ex: !craft espada');
            return reply(await rpg.craftar(sender, normalizarTexto(args.join(' '))));

        case 'upforge': // Melhorar Forja
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            return reply(await rpg.melhorarForja(sender));

        case 'upalchemy': // Melhorar Alquimia
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            return reply(await rpg.melhorarAlquimia(sender));

        case 'buyprop': // Comprar Propriedade
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha propriedade! Ex: !buyprop casa');
            return reply(await rpg.comprarPropriedade(sender, normalizarTexto(args[0])));

        case 'collect': // Coletar Produção
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            return reply(await rpg.coletarProducao(sender));

        case 'upprop': // Melhorar Propriedade
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0] || !args[1]) return reply('⚠️ Escolha propriedade e upgrade! Ex: !upprop casa jardim');
            return reply(await rpg.melhorarPropriedade(sender, normalizarTexto(args[0]), normalizarTexto(args[1])));

        case 'guild': // Criar Guilda
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Dê um nome! Ex: !guild Legião');
            return reply(await rpg.criarGuilda(sender, args.join(' ')));

        case 'invite': // Convidar pra Guilda
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!menc_os2) return reply('⚠️ Escolha jogador! Ex: !invite @user');
            return reply(await rpg.guildaConvidar(sender, menc_os2));

        case 'join': // Aceitar Convite de Guilda
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha guilda! Ex: !join Legião');
            return reply(await rpg.guildaAceitar(sender, normalizarTexto(args.join(' '))));

        case 'gquest': // Missão da Guilda
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha missão! Ex: !gquest caça');
            return reply(await rpg.guildaMissão(sender, normalizarTexto(args.join(' '))));

        case 'war': // Declarar Guerra
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha guilda! Ex: !war Império');
            return reply(await rpg.declararGuerra(sender, args.join(' ')));

        case 'battle': // Guerrear
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha inimigo! Ex: !battle goblin');
            return reply(await rpg.guerrear(sender, normalizarTexto(args.join(' '))));

        case 'pvp': // Desafiar na Arena
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha oponente! Ex: !pvp @user');
            return reply(await rpg.desafiarArena(sender, args[0].replace('@', '')));

        case 'kingdom': // Fundar Reino
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Dê um nome! Ex: !kingdom Valhalla');
            return reply(await rpg.fundarReino(sender, args.join(' ')));

        case 'tax': // Coletar Impostos
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            return reply(await rpg.coletarImpostos(sender));

        case 'upkingdom': // Melhorar Reino
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha upgrade! Ex: !upkingdom muralhas');
            return reply(await rpg.melhorarReino(sender, normalizarTexto(args[0])));

        case 'portal': // Abrir Portal
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha destino! Ex: !portal sombras');
            return reply(await rpg.abrirPortal(sender, normalizarTexto(args.join(' '))));

        case 'explore': // Explorar Portal
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            return reply(await rpg.explorarPortal(sender));

        case 'event': // Iniciar Evento Global
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            return reply(await rpg.eventos.iniciarEventoGlobal());

        case 'joinvent': // Participar de Evento
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha inimigo! Ex: !joinvent goblin');
            return reply(await rpg.eventos.participarEvento(sender, normalizarTexto(args.join(' '))));

        case 'pet': // Adotar Pet
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0] || !args[1]) return reply('⚠️ Escolha tipo e nome! Ex: !pet lobo Fenrir');
            return reply(await rpg.adotarPet(sender, normalizarTexto(args[0]), args.slice(1).join(' ')));

        case 'evopet': // Evoluir Pet
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            return reply(await rpg.evoluirPet(sender));

        case 'train': // Treinar Pet
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            return reply(await rpg.treinarPet(sender));

        case 'learn': // Aprender Magia
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha feitiço! Ex: !learn fogo');
            return reply(await rpg.aprenderMagia(sender, normalizarTexto(args.join(' '))));

        case 'cast': // Usar Magia
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha feitiço! Ex: !cast fogo');
            return reply(await rpg.usarMagia(sender, normalizarTexto(args.join(' '))));

        case 'faction': // Entrar em Facção
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha facção! Ex: !faction ordem');
            return reply(await rpg.entrarFacção(sender, normalizarTexto(args.join(' '))));

        case 'black': // Comprar no Mercado Negro
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha item! Ex: !black adaga');
            return reply(await rpg.comprarMercadoNegro(sender, normalizarTexto(args.join(' '))));

        case 'pray': // Orar
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha deus! Ex: !pray zeus');
            return reply(await rpg.orar(sender, normalizarTexto(args.join(' '))));

        case 'caravan': // Criar Caravana
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha destino! Ex: !caravan montanhas');
            return reply(await rpg.criarCaravana(sender, args.join(' ')));

        case 'getcaravan': // Coletar Caravana
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            return reply(await rpg.coletarCaravana(sender));

        case 'xp': // Ganhar XP
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Dê uma quantia! Ex: !xp 100');
            return reply(await rpg.ganharXP(sender, parseInt(args[0])));

        case 'stats': // Distribuir Pontos
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0] || !args[1]) return reply('⚠️ Escolha atributo e pontos! Ex: !stats força 5');
            return reply(await rpg.distribuirPontos(sender, normalizarTexto(args[0]), parseInt(args[1])));

        case 'achieve': // Verificar Conquistas
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            return reply(await rpg.verificarConquistas(sender) || '⚠️ Sem novas conquistas!');

        case 'work': // Trabalhar
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            return reply(await rpg.trabalhar(sender));

        case 'job': // Escolher Emprego
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha emprego! Ex: !job ferreiro');
            return reply(await rpg.escolherEmprego(sender, normalizarTexto(args.join(' '))));

        case 'jobs': // Lista de Empregos
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            return reply(await rpg.listarEmpregos());

        case 'buy': // Comprar na Loja
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha item! Ex: !buy espada');
            return reply(await rpg.comprarLoja(sender, normalizarTexto(args.join(' '))));

        case 'sell': // Vender Item
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha item! Ex: !sell potion');
            return reply(await rpg.venderItem(sender, normalizarTexto(args.join(' '))));

        case 'equip': // Equipar Item
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Escolha item! Ex: !equip espada');
            return reply(await rpg.equiparItem(sender, normalizarTexto(args.join(' '))));

        case 'inv': // Inventário
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            const user2 = await rpg(sender);
            return reply(`🎒 *Inventário de ${user2.nome}*\n${Object.entries(user2.inventario).map(([item, qtd]) => `${item}: ${qtd}`).join('\n') || 'Vazio!'}`);

        case 'dep': // Depositar no Banco
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Dê uma quantia! Ex: !dep 500');
            return reply(await rpg.depositarBanco(sender, parseInt(args[0])));

        case 'withdraw': // Sacar do Banco
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0]) return reply('⚠️ Dê uma quantia! Ex: !withdraw 500');
            return reply(await rpg.sacarBanco(sender, parseInt(args[0])));

        case 'send': // Transferir Dinheiro
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            if (!args[0] || !args[1]) return reply('⚠️ Escolha jogador e quantia! Ex: !send @user 1000');
            return reply(await rpg.transferirDinheiro(sender, args[0].replace('@', ''), parseInt(args[1])));

        case 'rank': // Ranking Global
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            return reply(await rpg.rankingGlobal());

        case 'spells': // Lista de Feitiços
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            return reply(await rpg.listarFeitiços());

        case 'shop': // Lista da Loja
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            return reply(await rpg.listarLoja());

        case 'blackmarket': // Lista do Mercado Negro
            if (!await rpg(sender)) return reply('⚠️ Registre-se com !rg!');
            return reply(await rpg.listarMercadoNegro());

        case 'me': // Perfil
    const user = await rpg(sender);
    if (!user) return reply('⚠️ Registre-se com !rg!');
    return reply(`
✨ *${user.nome}* ──── Nv.${user.nivel} ✨
━━━━━━━━━━━━━━━━━
⚔️ *ATRIBUTOS* ⚔️
🔹 Força: ${user.atributos.forca} 
🔸 Agilidade: ${user.atributos.agilidade} 
🔹 Inteligência: ${user.atributos.inteligencia} 
🔸 Vitalidade: ${user.atributos.vitalidade} 
🔹 Sorte: ${user.atributos.sorte} 
🔸 Carisma: ${user.atributos.carisma} 
🔹 Resistência: ${user.atributos.resistencia}

💰 *ECONOMIA* 💰
💳 Banco: ${user.saldo.banco}
💵 Carteira: ${user.saldo.carteira}
🪙 Moedas: ${Object.entries(user.moedas).map(([k, v]) => `${rpg.MOEDAS[k]} - ${v}`).join(', ')}

🎮 *EQUIPAMENTOS* 🛡️
🗡️ Arma: ${user.equipamento.arma?.nome || 'Nenhuma'}
🛡️ Armadura: ${user.equipamento.armadura?.nome || 'Nenhuma'}
💍 Acessório: ${user.equipamento.acessorio?.nome || 'Nenhum'}
💎 Anel: ${user.equipamento.anel?.nome || 'Nenhum'}

🔨 *OFÍCIOS* 🧪
⚒️ Forja: Nv.${user.forja.nivel} (+${user.forja.bonus}%)
🧪 Alquimia: Nv.${user.alquimia.nivel} (+${user.alquimia.bonus}%)

🏰 *SOCIAL* 🌐
🏰 Reino: ${user.reino ? `${user.reino.nome} (Nv.${user.reino.nivel})` : 'Nenhum'}
⚜️ Guilda: ${user.guilda ? user.guilda.nome : 'Nenhuma'}
🐾 Pet: ${user.pet ? `${user.pet.nome} (${user.pet.tipo}, Nv.${user.pet.nivel})` : 'Nenhum'}

🏆 *CONQUISTAS* 🎖️
📜 Títulos: ${user.titulos.length > 0 ? user.titulos.join(', ') : 'Nenhum'}
📊 XP: ${user.experiencia}/${user.nivel * 400 + Math.pow(user.nivel, 2) * 200}
━━━━━━━━━━━━━━━━━
✨ *Boa jornada, ${user.nome}!* ✨`);

        case 'helprpgtest': // Ajuda
            return reply(`
🌌 *RPG V2 - Comandos* 🌌
!rg [nome] - Registro
!fight [inimigo] - Lutar
!dungeon [nome] - Masmorra
!craft [item] - Forjar
!upforge - Melhorar forja
!upalchemy - Melhorar alquimia
!buyprop [nome] - Comprar propriedade
!collect - Coletar produção
!upprop [nome] [upgrade] - Melhorar propriedade
!guild [nome] - Criar guilda
!invite [@user] - Convidar pra guilda
!join [nome] - Entrar na guilda
!gquest [tipo] - Missão da guilda
!war [guilda] - Declarar guerra
!battle [inimigo] - Guerrear
!pvp [@user] - Desafiar na arena
!kingdom [nome] - Criar reino
!tax - Coletar impostos
!upkingdom [upgrade] - Melhorar reino
!portal [destino] - Abrir portal
!explore - Explorar portal
!event - Iniciar evento
!joinvent [inimigo] - Participar evento
!pet [tipo] [nome] - Adotar pet
!evopet - Evoluir pet
!train - Treinar pet
!learn [feitiço] - Aprender magia
!cast [feitiço] - Usar magia
!faction [nome] - Entrar em facção
!black [item] - Comprar no mercado negro
!pray [deus] - Orar
!caravan [destino] - Enviar caravana
!getcaravan - Coletar caravana
!xp [quantia] - Ganhar XP
!stats [atributo] [pontos] - Distribuir pontos
!achieve - Ver conquistas
!work - Trabalhar
!job [nome] - Escolher emprego
!jobs - Lista de empregos
!buy [item] - Comprar na loja
!sell [item] - Vender item
!equip [item] - Equipar item
!inv - Ver inventário
!dep [quantia] - Depositar
!withdraw [quantia] - Sacar
!send [@user] [quantia] - Transferir
!rank - Ranking
!spells - Lista de feitiços
!shop - Lista da loja
!blackmarket - Lista do mercado negro
!me - Perfil
!help - Esta lista
            `);
  
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