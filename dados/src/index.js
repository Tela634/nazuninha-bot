// index.js - Bot Nazuninha
// Sistema único e robusto para WhatsApp
// Criador: Hiudy
// Deixe os créditos, por favor! <3

const {
  downloadContentFromMessage,
  Mimetype,
  generateWAMessageFromContent,
} = require('baileys');
const { exec } = require('child_process');
const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');
const {
  reportError,
  youtube,
  tiktok,
  pinterest,
  igdl,
  sendSticker,
  FilmesDL,
  styleText,
  emojiMix,
  upload,
  mcPlugin,
  tictactoe,
  rpg,
  toolsJson,
  vabJson,
  apkMod,
  google,
} = require(path.join(__dirname, '/funcs/exports.js'));

// Função principal do bot
async function NazuninhaBotExec(nazu, info) {
  // Configurações
  const configPath = path.join(__dirname, '/config.json');
  const { numerodono, nomedono, nomebot, prefixo: prefix, debug } = JSON.parse(
    await fs.readFile(configPath, 'utf-8')
  );
  const settings = JSON.parse(await fs.readFile(configPath, 'utf-8'));
  const template = settings.template || 'nazu-default';
  const { menu, menudown, menuadm, menubn, menuDono, menuMembros, menuFerramentas, menuSticker, menuIa, menuRpg } = require(
    path.join(__dirname, `/templates/${template}/menus/index.js`)
  );
  const t = require(path.join(__dirname, `/templates/${template}/texts/index.js`));

  try {
    // Contexto da mensagem
    const from = info.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = isGroup
      ? info.key.participant.includes(':')
        ? `${info.key.participant.split(':')[0]}@s.whatsapp.net`
        : info.key.participant
      : info.key.remoteJid;
    const isStatus = from.endsWith('@broadcast');
    const nmrdn = numerodono.replace(/[\(\)+-\/ ]/g, '') + '@s.whatsapp.net';
    const isOwner = sender === nmrdn || info.key.fromMe;
    const pushname = info.pushName || 'Usuário';
    const { getContentType } = require('baileys');
    const type = getContentType(info.message);

    // Tipos de mídia
    const isImage = type === 'imageMessage';
    const isVideo = type === 'videoMessage';
    const isVisuU = type === 'viewOnceMessage';
    const isVisuU2 = type === 'viewOnceMessageV2';

    // Extração do texto da mensagem
    const body = extractMessageText(info, type) || '';
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(' ');
    const budy2 = body.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const isCmd = body.trim().startsWith(prefix);
    const command = isCmd
      ? budy2
          .trim()
          .slice(1)
          .split(/ +/)
          .shift()
          .toLowerCase()
          .trim()
          .replace(/\s/g, '')
      : null;

    // Mencões
    const menc_prt = info.message?.extendedTextMessage?.contextInfo?.participant;
    const menc_jid = args.join(' ').replace('@', '') + '@s.whatsapp.net';
    const menc_jid2 = info.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const menc_os2 = q.includes('@') ? menc_jid : menc_prt;
    const sender_ou_n = q.includes('@') ? menc_jid : menc_prt || sender;

    // Inicialização de diretórios
    await initializeDirectories();

    // Sistema de premium
    const premiumPath = path.join(__dirname, '/../database/dono/premium.json');
    let premiumList = await loadJson(premiumPath, {});
    const isPremium = premiumList[sender] || premiumList[from] || isOwner;

    // Sistema de ban em grupos
    const banGpPath = path.join(__dirname, '/../database/dono/bangp.json');
    const banGpIds = await loadJson(banGpPath, {});
    if (banGpIds[from] && !isOwner && !isPremium) return;

    // Informações do grupo
    const groupInfo = await getGroupInfo(nazu, from, isGroup);
    const { groupMetadata, groupName, groupMembers, groupAdmins, isGroupAdmin, isBotAdmin, groupData } = groupInfo;

    // Configurações do grupo
    const isModoBn = groupData.modobrincadeira || false;
    const isOnlyAdmin = groupData.soadm || false;
    const isAntiPorn = groupData.antiporn || false;
    const isMuted = groupData.mutedUsers?.[sender] || false;
    const isAntiLinkGp = groupData.antilinkgp || false;
    const isModoRpg = isGroup && groupData.modorpg || false;

    // Bloqueio de comandos por administradores
    if (isGroup && !isGroupAdmin && isOnlyAdmin) return;
    if (isGroup && !isGroupAdmin && isCmd && groupData.blockedCommands?.[command]) {
      return nazu.reply(from, t.blockedCommand(), info);
    }

    // Banir usuários mutados
    if (isGroup && isMuted) {
      await handleMutedUser(nazu, from, sender, info, groupData);
      return;
    }

    // Contador de mensagens
    if (isGroup) {
      await updateMessageCounter(groupData, sender, isCmd, type, pushname, from);
    }

    // Funções utilitárias
    nazu.reply = async (text, options = { mentions: [] }) => {
      return await nazu.sendMessage(
        from,
        { text: text.trim(), mentions: options.mentions },
        { quoted: info, sendEphemeral: true, contextInfo: { forwardingScore: 50, isForwarded: true } }
      );
    };

    nazu.react = async (emoji) => {
      if (typeof emoji === 'string') {
        await nazu.sendMessage(from, { react: { text: emoji, key: info.key } });
      } else if (Array.isArray(emoji)) {
        for (const e of emoji) {
          await nazu.sendMessage(from, { react: { text: e, key: info.key } });
          await new Promise((res) => setTimeout(res, 500));
        }
      }
    };

    nazu.sendAlbum = async (jid, medias, options = {}) => {
      options = { ...options, caption: options.text || options.caption || '' };
      const album = generateWAMessageFromContent(
        jid,
        {
          albumMessage: {
            expectedImageCount: medias.filter((m) => m.type === 'image').length,
            expectedVideoCount: medias.filter((m) => m.type === 'video').length,
            ...(options.quoted
              ? {
                  contextInfo: {
                    remoteJid: options.quoted.key.remoteJid,
                    fromMe: options.quoted.key.fromMe,
                    stanzaId: options.quoted.key.id,
                    participant: options.quoted.key.participant || options.quoted.key.remoteJid,
                    quotedMessage: options.quoted.message,
                  },
                }
              : {}),
          },
        },
        { quoted: info }
      );
      await nazu.relayMessage(album.key.remoteJid, album.message, { messageId: album.key.id });
      await Promise.all(
        medias.map(async (media, index) => {
          const { type, data } = media;
          const msg = await generateWAMessage(
            album.key.remoteJid,
            { [type]: data, ...(index === 0 ? { caption: options.caption } : {}) },
            { upload: nazu.waUploadToServer }
          );
          msg.message.messageContextInfo = { messageAssociation: { associationType: 1, parentMessageKey: album.key } };
          await nazu.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
        })
      );
      return album;
    };

    const getFileBuffer = async (media, mediaType) => {
      const stream = await downloadContentFromMessage(media, mediaType);
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }
      return buffer;
    };

    // Sistema anti-pornografia
    if (isGroup && isAntiPorn && (isImage || isVisuU || isVisuU2)) {
      await handleAntiPorn(nazu, from, sender, info, isGroupAdmin, getFileBuffer, upload);
    }

    // Verificação de mensagens citadas
    const quoted = checkQuotedMessage(info, type);

    // Comandos de execução para dono
    if (body.startsWith('$') && isOwner) {
      exec(q, (err, stdout) => {
        if (err) return nazu.reply(t.error(err));
        if (stdout) nazu.reply(stdout);
      });
    }

    if (body.startsWith('>>') && isOwner) {
      try {
        const code = body.slice(2).trim().split('\n');
        code[code.length - 1] = `return ${code[code.length - 1]}`;
        const result = await eval(`(async () => { ${code.join('\n')} })()`);
        const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
        nazu.reply(output);
      } catch (e) {
        nazu.reply(t.error(e));
      }
    }

    // Sistema anti-link de grupos
    if (isGroup && isAntiLinkGp && !isGroupAdmin && budy2.includes('chat.whatsapp.com')) {
      await handleAntiLink(nazu, from, sender, groupMembers, info);
    }

    // Logs
    console.log(
      `=========================================\n` +
        `${isCmd ? '⚒️ Comando' : '🗨️ Mensagem'} ${isGroup ? 'em grupo 👥' : 'no privado 👤'}\n` +
        `${isCmd ? '⚒️ Comando' : '🗨️ Mensagem'}: "${isCmd ? prefix + command : budy2.slice(0, 12) + '...'}"\n` +
        `${isGroup ? '👥 Grupo' : '👤 Usuário'}: "${isGroup ? groupName : pushname}"\n` +
        `${isGroup ? '👤 Usuário' : '📲 Número'}: "${isGroup ? pushname : sender.split('@')[0]}"\n` +
        `=========================================`
    );

    // Jogo da Velha
    if (isGroup) {
      await handleTicTacToe(nazu, from, sender, budy2, tictactoe, isGroupAdmin, t);
    }

    // Verificação de usuários bloqueados (grupo)
    if (isGroup && groupData.blockedUsers?.[sender] && isCmd) {
      return nazu.reply(t.blockedUser(groupData.blockedUsers[sender].reason));
    }

    // Verificação de bloqueios globais
    const globalBlocksPath = path.join(__dirname, '/../database/globalBlocks.json');
    const globalBlocks = await loadJson(globalBlocksPath, { commands: {}, users: {} });
    if (globalBlocks.users?.[sender.split('@')[0]] && isCmd) {
      return nazu.reply(t.blockedUser(globalBlocks.users[sender.split('@')[0]].reason));
    }
    if (isCmd && globalBlocks.commands?.[command]) {
      return nazu.reply(t.blockedCommand(globalBlocks.commands[command].reason));
    }

    // Bot desligado
    const botStatePath = path.join(__dirname, '/../database/botState.json');
    const botState = await loadJson(botStatePath, { status: 'on' });
    if (botState.status === 'off' && !isOwner) return;

    // Comandos
    switch (command) {
      // Inteligência Artificial
      case 'nazu':
      case 'nazuninha':
      case 'ai':
        await handleAICommand(nazu, q, sender, 'nazuninha', t);
        break;

      case 'gpt':
      case 'gpt4':
      case 'chatgpt':
        await handleAICommand(nazu, q, sender, 'gpt', t);
        break;

      case 'llama':
      case 'llama3':
      case 'llamachat':
        await handleAICommand(nazu, q, sender, 'llama', t);
        break;

      case 'cognimai':
      case 'cog':
        await handleAICommand(nazu, q, sender, 'cognimai', t);
        break;

      case 'qwen':
      case 'qwen2':
      case 'qwenchat':
        await handleAICommand(nazu, q, sender, 'qwen', t);
        break;

      case 'gemma':
      case 'gemma2':
      case 'gecko':
        await handleAICommand(nazu, q, sender, 'gemma', t);
        break;

      case 'imagine':
      case 'img':
        await handleImageGeneration(nazu, from, q, prefix, t, info);
        break;

      case 'code-gen':
        if (!isPremium) return nazu.reply(t.onlyPremium());
        if (!q) return nazu.reply(t.digitarPrompt());
        await nazu.react('✅');
        try {
          const response = await axios.get(
            `https://api.cognima.com.br/api/ia/code-gen?key=CognimaTeamFreeKey&q=${encodeURIComponent(q)}`,
            { responseType: 'arraybuffer' }
          );
          const mimeType = response.headers['content-type'];
          let fileName = response.headers['content-disposition']?.match(/filename="?([^"]+)"?/)?.[1] || `${Date.now()}`;
          const extensions = {
            'application/json': 'json',
            'text/plain': 'txt',
            'application/javascript': 'js',
            'application/zip': 'zip',
            'application/pdf': 'pdf',
          };
          if (!fileName.includes('.')) {
            fileName += '.' + (extensions[mimeType] || 'bin');
          }
          await nazu.sendMessage(
            from,
            { document: response.data, mimetype: mimeType, fileName },
            { quoted: info }
          );
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      // Ferramentas
      case 'encurtalink':
      case 'tinyurl':
        if (!q) return nazu.reply(t.formatoEspecifico('Link', `${prefix}${command} https://example.com`));
        try {
          const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(q)}`);
          await nazu.reply(data);
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'nick':
      case 'gerarnick':
        if (!q) return nazu.reply(t.digitarTexto());
        try {
          const styled = await styleText(q);
          await nazu.reply(styled.join('\n'));
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'printsite':
      case 'ssweb':
        if (!q) return nazu.reply(t.digitarLink());
        await nazu.react('✅');
        try {
          await nazu.sendMessage(
            from,
            { image: { url: `https://image.thum.io/get/fullpage/${encodeURIComponent(q)}` } },
            { quoted: info }
          );
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'upload':
      case 'imgpralink':
      case 'videopralink':
      case 'gerarlink':
        if (!quoted.isQuotedImage && !quoted.isQuotedVideo && !quoted.isQuotedDocument && !quoted.isQuotedAudio) {
          return nazu.reply(t.marcarMidia());
        }
        try {
          const mediaType = quoted.isQuotedImage
            ? 'image'
            : quoted.isQuotedVideo
            ? 'video'
            : quoted.isQuotedDocument
            ? 'document'
            : 'audio';
          const mediaData = quoted.isQuotedImage
            ? info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage
            : quoted.isQuotedVideo
            ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage
            : quoted.isQuotedDocument
            ? info.message.extendedTextMessage.contextInfo.quotedMessage.documentMessage
            : info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage;
          const buffer = await getFileBuffer(mediaData, mediaType);
          const link = await upload(buffer);
          await nazu.reply(link);
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      // Downloads
      case 'assistir':
        if (!q) return nazu.reply(t.digitarFilme());
        await nazu.reply(t.buscandoFilme());
        try {
          const data = await FilmesDL(q);
          if (!data?.url) return nazu.reply(t.filmeNaoEncontrado());
          const { data: shortLink } = await axios.get(
            `https://tinyurl.com/api-create.php?url=${encodeURIComponent(data.url)}`
          );
          await nazu.sendMessage(
            from,
            {
              image: { url: data.img },
              caption: t.filmeEncontrado(data.name, shortLink),
            },
            { quoted: info }
          );
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'apkmod':
      case 'mod':
        if (!q) return nazu.reply(t.digitarApp());
        try {
          const data = await apkMod(q);
          if (data.error) return nazu.reply(data.error);
          const { data: shortLink } = await axios.get(
            `https://tinyurl.com/api-create.php?url=${encodeURIComponent(data.download)}`
          );
          await nazu.sendMessage(
            from,
            {
              image: { url: data.image },
              caption: t.apkInfo(data, shortLink),
            },
            { quoted: info }
          );
          await nazu.sendMessage(
            from,
            {
              document: { url: data.download },
              mimetype: 'application/vnd.android.package-archive',
              fileName: `${data.details.name}.apk`,
              caption: t.apkInstallWarning(),
            },
            { quoted: info }
          );
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'google':
        if (!q) return nazu.reply(t.formatoEspecifico('Texto', `${prefix}${command} Os Simpsons`));
        try {
          const result = await google.search(q);
          if (!result.ok) return nazu.reply(t.error());
          await nazu.sendMessage(
            from,
            { image: { url: result.image }, caption: result.text },
            { quoted: info }
          );
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'mcplugin':
      case 'mcplugins':
        if (!q) return nazu.reply(t.digitarPlugin());
        await nazu.react('🔍');
        try {
          const data = await mcPlugin(q);
          if (!data.ok) return nazu.reply(data.msg);
          await nazu.sendMessage(
            from,
            {
              image: { url: data.image },
              caption: t.pluginEncontrado(data),
            },
            { quoted: info }
          );
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'play':
      case 'ytmp3':
        await handleYouTubeAudio(nazu, from, q, youtube, prefix, nomebot, t, info);
        break;

      case 'playvid':
      case 'ytmp4':
        await handleYouTubeVideo(nazu, from, q, youtube, prefix, nomebot, t, info);
        break;

      case 'play2':
      case 'ytmp32':
        await handleYouTubeAudio(nazu, from, q, youtube, prefix, nomebot, t, info, true);
        break;

      case 'playvid2':
      case 'ytmp42':
        await handleYouTubeVideo(nazu, from, q, youtube, prefix, nomebot, t, info, true);
        break;

      case 'tiktok':
      case 'tiktokaudio':
      case 'tiktokvideo':
      case 'tiktoks':
      case 'tiktoksearch':
      case 'ttk':
      case 'tkk':
        if (!q) return nazu.reply(t.formatoEspecifico('Link ou Nome', `${prefix}${command} Gato`));
        await nazu.react(['💖']);
        try {
          const isTikTokUrl = /^https?:\/\/(?:www\.|m\.|vm\.|t\.)?tiktok\.com\//.test(q);
          const data = await (isTikTokUrl ? tiktok.dl(q) : tiktok.search(q));
          if (!data.ok) return nazu.reply(data.msg);
          const medias = data.urls.map((url) => ({ type: data.type, data: { url } }));
          await nazu.sendAlbum(from, medias, { quoted: info });
          if (data.audio) {
            await nazu.sendMessage(
              from,
              { audio: { url: data.audio }, mimetype: 'audio/mp4' },
              { quoted: info }
            );
          }
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'instagram':
      case 'igdl':
      case 'ig':
      case 'instavideo':
        if (!q) return nazu.reply(t.formatoEspecifico('Link', `${prefix}${command} https://instagram.com/reel/123`));
        await nazu.react(['📌']);
        try {
          const data = await igdl.dl(q);
          if (!data.ok) return nazu.reply(data.msg);
          const medias = data.data.map((item) => ({ type: item.type, data: item.buff }));
          await nazu.sendAlbum(from, medias, { quoted: info });
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'pinterest':
      case 'pin':
      case 'pinterestdl':
      case 'pinterestsearch':
        if (!q) return nazu.reply(t.formatoEspecifico('Link ou Nome', `${prefix}${command} Gatos`));
        await nazu.react(['📌']);
        try {
          const isPinterestUrl = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)?pinterest\.\w{2,6}(?:\.\w{2})?\/pin\/\d+|https?:\/\/pin\.it\/[a-zA-Z0-9]+/.test(q);
          const data = await (isPinterestUrl ? pinterest.dl(q) : pinterest.search(q));
          if (!data.ok) return nazu.reply(data.msg);
          for (const url of data.urls) {
            await nazu.sendMessage(
              from,
              { [data.type]: { url }, mimetype: data.mime },
              { quoted: info }
            );
          }
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      // Menus
      case 'menu':
      case 'help':
        await sendMenu(nazu, from, fs, menu, prefix, nomebot, pushname, t, info);
        break;

      case 'rpg':
      case 'menurpg':
        await sendMenu(nazu, from, fs, menuRpg, prefix, nomebot, pushname, t, info);
        break;

      case 'menuia':
      case 'aimenu':
      case 'menuias':
        await sendMenu(nazu, from, fs, menuIa, prefix, nomebot, pushname, t, info);
        break;

      case 'menubn':
      case 'menubrincadeira':
      case 'menubrincadeiras':
        await sendMenu(nazu, from, fs, menubn, prefix, nomebot, pushname, t, info);
        break;

      case 'menudown':
      case 'menudownload':
      case 'menudownloads':
        await sendMenu(nazu, from, fs, menudown, prefix, nomebot, pushname, t, info);
        break;

      case 'ferramentas':
      case 'menuferramentas':
      case 'menuferramenta':
        await sendMenu(nazu, from, fs, menuFerramentas, prefix, nomebot, pushname, t, info);
        break;

      case 'menuadm':
      case 'menuadmin':
      case 'menuadmins':
        await sendMenu(nazu, from, fs, menuadm, prefix, nomebot, pushname, t, info);
        break;

      case 'menumembros':
      case 'menumemb':
      case 'menugeral':
        await sendMenu(nazu, from, fs, menuMembros, prefix, nomebot, pushname, t, info);
        break;

      case 'menudono':
      case 'ownermenu':
        await sendMenu(nazu, from, fs, menuDono, prefix, nomebot, pushname, t, info);
        break;

      case 'stickermenu':
      case 'menusticker':
      case 'menufig':
        await sendMenu(nazu, from, fs, menuSticker, prefix, nomebot, pushname, t, info);
        break;

      // Comandos de dono
      case 'boton':
      case 'botoff':
        if (!isOwner) return nazu.reply(t.dono());
        await handleBotState(nazu, command, botStatePath, t);
        break;

      case 'blockcmdg':
        if (!isOwner) return nazu.reply(t.dono());
        await handleBlockCommandGlobal(nazu, q, globalBlocksPath, t);
        break;

      case 'unblockcmdg':
        if (!isOwner) return nazu.reply(t.dono());
        await handleUnblockCommandGlobal(nazu, q, globalBlocksPath, t);
        break;

      case 'blockuserg':
        if (!isOwner) return nazu.reply(t.dono());
        await handleBlockUserGlobal(nazu, q, menc_os2, globalBlocksPath, t);
        break;

      // Comandos de administração de grupo
      case 'fotobv':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!isGroupAdmin) return nazu.reply(t.admin());
        if (!isQuotedImage && !isImage) return nazu.reply(t.marcarImagem());
        try {
          const media = await getFileBuffer(
            isQuotedImage
              ? info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage
              : info.message.imageMessage,
            'image'
          );
          const uploadResult = await upload(media);
          if (!uploadResult) throw new Error('Falha ao fazer upload da imagem');
          groupData.welcome = groupData.welcome || {};
          groupData.welcome.image = uploadResult;
          await fs.writeFile(
            path.join(__dirname, `/../database/grupos/${from}.json`),
            JSON.stringify(groupData, null, 2)
          );
          await nazu.reply(t.fotoBvConfigurada());
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'fotosaiu':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!isGroupAdmin) return nazu.reply(t.admin());
        if (!isQuotedImage && !isImage) return nazu.reply(t.marcarImagem());
        try {
          const media = await getFileBuffer(
            isQuotedImage
              ? info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage
              : info.message.imageMessage,
            'image'
          );
          const uploadResult = await upload(media);
          if (!uploadResult) throw new Error('Falha ao fazer upload da imagem');
          groupData.exit = groupData.exit || {};
          groupData.exit.image = uploadResult;
          await fs.writeFile(
            path.join(__dirname, `/../database/grupos/${from}.json`),
            JSON.stringify(groupData, null, 2)
          );
          await nazu.reply(t.fotoSaidaConfigurada());
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'configsaida':
      case 'textsaiu':
      case 'legendasaiu':
      case 'exitmsg':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!isGroupAdmin) return nazu.reply(t.admin());
        if (!q) return nazu.reply(t.configSaidaHelp(prefix, command));
        try {
          groupData.exit = groupData.exit || {};
          groupData.exit.enabled = true;
          groupData.exit.text = q;
          await fs.writeFile(
            path.join(__dirname, `/../database/grupos/${from}.json`),
            JSON.stringify(groupData, null, 2)
          );
          await nazu.reply(t.saidaConfigurada(q));
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'saida':
      case 'exit':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!isGroupAdmin) return nazu.reply(t.admin());
        try {
          groupData.exit = groupData.exit || {};
          groupData.exit.enabled = !groupData.exit.enabled;
          await fs.writeFile(
            path.join(__dirname, `/../database/grupos/${from}.json`),
            JSON.stringify(groupData, null, 2)
          );
          await nazu.reply(groupData.exit.enabled ? t.saidaAtivada() : t.saidaDesativada());
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'modorpg':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!isGroupAdmin) return nazu.reply(t.admin());
        try {
          groupData.modorpg = !groupData.modorpg;
          await fs.writeFile(
            path.join(__dirname, `/../database/grupos/${from}.json`),
            JSON.stringify(groupData, null, 2)
          );
          await nazu.reply(groupData.modorpg ? t.rpgAtivado() : t.rpgDesativado());
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'soadm':
      case 'onlyadm':
      case 'soadmin':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!isGroupAdmin) return nazu.reply(t.admin());
        try {
          groupData.soadm = !groupData.soadm;
          await fs.writeFile(
            path.join(__dirname, `/../database/grupos/${from}.json`),
            JSON.stringify(groupData, null, 2)
          );
          await nazu.reply(groupData.soadm ? t.onlyAdminAtivado() : t.onlyAdminDesativado());
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'antilinkgp':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!isGroupAdmin) return nazu.reply(t.admin());
        if (!isBotAdmin) return nazu.reply(t.botAdm());
        try {
          groupData.antilinkgp = !groupData.antilinkgp;
          await fs.writeFile(
            path.join(__dirname, `/../database/grupos/${from}.json`),
            JSON.stringify(groupData, null, 2)
          );
          await nazu.reply(groupData.antilinkgp ? t.antiLinkAtivado() : t.antiLinkDesativado());
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'antiporn':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!isGroupAdmin) return nazu.reply(t.admin());
        if (!isBotAdmin) return nazu.reply(t.botAdm());
        try {
          groupData.antiporn = !groupData.antiporn;
          await fs.writeFile(
            path.join(__dirname, `/../database/grupos/${from}.json`),
            JSON.stringify(groupData, null, 2)
          );
          await nazu.reply(groupData.antiporn ? t.antiPornAtivado() : t.antiPornDesativado());
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'antigore':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!isGroupAdmin) return nazu.reply(t.admin());
        if (!isBotAdmin) return nazu.reply(t.botAdm());
        try {
          groupData.antigore = !groupData.antigore;
          await fs.writeFile(
            path.join(__dirname, `/../database/grupos/${from}.json`),
            JSON.stringify(groupData, null, 2)
          );
          await nazu.reply(groupData.antigore ? t.antiGoreAtivado() : t.antiGoreDesativado());
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'modonsfw':
      case 'modo+18':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!isGroupAdmin) return nazu.reply(t.admin());
        try {
          groupData.nsfwMode = !groupData.nsfwMode;
          await fs.writeFile(
            path.join(__dirname, `/../database/grupos/${from}.json`),
            JSON.stringify(groupData, null, 2)
          );
          await nazu.reply(groupData.nsfwMode ? t.nsfwAtivado() : t.nsfwDesativado());
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'legendabv':
      case 'textbv':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!isGroupAdmin) return nazu.reply(t.admin());
        if (!q) return nazu.reply(t.configBvHelp(prefix));
        try {
          groupData.textbv = q;
          await fs.writeFile(
            path.join(__dirname, `/../database/grupos/${from}.json`),
            JSON.stringify(groupData, null, 2)
          );
          await nazu.reply(t.bvConfigurada(q));
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'mute':
      case 'mutar':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!isGroupAdmin) return nazu.reply(t.admin());
        if (!isBotAdmin) return nazu.reply(t.botAdm());
        if (!menc_os2) return nazu.reply(t.marcarAlguem());
        try {
          groupData.mutedUsers = groupData.mutedUsers || {};
          groupData.mutedUsers[menc_os2] = true;
          await fs.writeFile(
            path.join(__dirname, `/../database/grupos/${from}.json`),
            JSON.stringify(groupData, null, 2)
          );
          await nazu.sendMessage(
            from,
            { text: t.userMutado(menc_os2.split('@')[0]), mentions: [menc_os2] },
            { quoted: info }
          );
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'desmute':
      case 'desmutar':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!isGroupAdmin) return nazu.reply(t.admin());
        if (!menc_os2) return nazu.reply(t.marcarAlguem());
        try {
          groupData.mutedUsers = groupData.mutedUsers || {};
          if (groupData.mutedUsers[menc_os2]) {
            delete groupData.mutedUsers[menc_os2];
            await fs.writeFile(
              path.join(__dirname, `/../database/grupos/${from}.json`),
              JSON.stringify(groupData, null, 2)
            );
            await nazu.sendMessage(
              from,
              { text: t.userDesmutado(menc_os2.split('@')[0]), mentions: [menc_os2] },
              { quoted: info }
            );
          } else {
            await nazu.reply(t.userNaoMutado());
          }
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'blockcmd':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!isGroupAdmin) return nazu.reply(t.admin());
        if (!q) return nazu.reply(t.digitarComando());
        try {
          groupData.blockedCommands = groupData.blockedCommands || {};
          groupData.blockedCommands[
            q.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(prefix, '')
          ] = true;
          await fs.writeFile(
            path.join(__dirname, `/../database/grupos/${from}.json`),
            JSON.stringify(groupData, null, 2)
          );
          await nazu.reply(t.comandoBloqueado(q));
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'unblockcmd':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!isGroupAdmin) return nazu.reply(t.admin());
        if (!q) return nazu.reply(t.digitarComando());
        try {
          groupData.blockedCommands = groupData.blockedCommands || {};
          const cmd = q.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(prefix, '');
          if (groupData.blockedCommands[cmd]) {
            delete groupData.blockedCommands[cmd];
            await fs.writeFile(
              path.join(__dirname, `/../database/grupos/${from}.json`),
              JSON.stringify(groupData, null, 2)
            );
            await nazu.reply(t.comandoDesbloqueado(q));
          } else {
            await nazu.reply(t.comandoNaoBloqueado());
          }
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      // Jogo da Velha
      case 'ttt':
      case 'jogodavelha':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!menc_os2) return nazu.reply(t.marcarAlguem());
        const tttResult = await tictactoe.invitePlayer(from, sender, menc_os2);
        await nazu.sendMessage(from, { text: tttResult.message, mentions: tttResult.mentions }, { quoted: info });
        break;

      // Brincadeiras
      case 'eununca':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!isModoBn) return nazu.reply(t.modoBrincadeiraDesativado());
        try {
          await nazu.sendMessage(
            from,
            {
              poll: {
                name: toolsJson.iNever[Math.floor(Math.random() * toolsJson.iNever.length)],
                values: ['Eu nunca', 'Eu já'],
                selectableCount: 1,
              },
              messageContextInfo: { messageSecret: Math.random() },
            },
            { options: { userJid: nazu?.user?.id } }
          );
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'vab':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!isModoBn) return nazu.reply(t.modoBrincadeiraDesativado());
        try {
          const vab = vabJson[Math.floor(Math.random() * vabJson.length)];
          await nazu.sendMessage(
            from,
            {
              poll: {
                name: t.vabPergunta(),
                values: [vab.option1, vab.option2],
                selectableCount: 1,
              },
              messageContextInfo: { messageSecret: Math.random() },
            },
            { options: { userJid: nazu?.user?.id } }
          );
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      case 'gay':
      case 'burro':
      case 'inteligente':
      case 'otaku':
      case 'fiel':
      case 'infiel':
      case 'corno':
      case 'gado':
      case 'gostoso':
      case 'feio':
      case 'rico':
      case 'pobre':
      case 'pirocudo':
      case 'pirokudo':
      case 'nazista':
      case 'ladrao':
      case 'safado':
      case 'vesgo':
      case 'bebado':
      case 'machista':
      case 'homofobico':
      case 'racista':
      case 'chato':
      case 'sortudo':
      case 'azarado':
      case 'forte':
      case 'fraco':
      case 'pegador':
      case 'otario':
      case 'macho':
      case 'bobo':
      case 'nerd':
      case 'preguicoso':
      case 'trabalhador':
      case 'brabo':
      case 'lindo':
      case 'malandro':
      case 'simpatico':
      case 'engracado':
      case 'charmoso':
      case 'misterioso':
      case 'carinhoso':
      case 'desumilde':
      case 'humilde':
      case 'ciumento':
      case 'corajoso':
      case 'covarde':
      case 'esperto':
      case 'talarico':
      case 'chorao':
      case 'brincalhao':
      case 'bolsonarista':
      case 'petista':
      case 'comunista':
      case 'lulista':
      case 'traidor':
      case 'bandido':
      case 'cachorro':
      case 'vagabundo':
      case 'pilantra':
      case 'mito':
      case 'padrao':
      case 'comedia':
      case 'psicopata':
      case 'fortao':
      case 'magrelo':
      case 'bombado':
      case 'chefe':
      case 'presidente':
      case 'rei':
      case 'patrao':
      case 'playboy':
      case 'zueiro':
      case 'gamer':
      case 'programador':
      case 'visionario':
      case 'billionario':
      case 'poderoso':
      case 'vencedor':
      case 'senhor':
        await handleGameCommand(nazu, from, command, sender, menc_os2, isGroup, isModoBn, t);
        break;

      case 'lesbica':
      case 'burra':
      case 'inteligente':
      case 'otaku':
      case 'fiel':
      case 'infiel':
      case 'corna':
      case 'gada':
      case 'gostosa':
      case 'feia':
      case 'rica':
      case 'pobre':
      case 'bucetuda':
      case 'nazista':
      case 'ladra':
      case 'safada':
      case 'vesga':
      case 'bebada':
      case 'machista':
      case 'homofobica':
      case 'racista':
      case 'chata':
      case 'sortuda':
      case 'azarada':
      case 'forte':
      case 'fraca':
      case 'pegadora':
      case 'otaria':
      case 'boba':
      case 'nerd':
      case 'preguicosa':
      case 'trabalhadora':
      case 'braba':
      case 'linda':
      case 'malandra':
      case 'simpatica':
      case 'engracada':
      case 'charmosa':
      case 'misteriosa':
      case 'carinhosa':
      case 'desumilde':
      case 'humilde':
      case 'ciumenta':
      case 'corajosa':
      case 'covarde':
      case 'esperta':
      case 'talarica':
      case 'chorona':
      case 'brincalhona':
      case 'bolsonarista':
      case 'petista':
      case 'comunista':
      case 'lulista':
      case 'traidora':
      case 'bandida':
      case 'cachorra':
      case 'vagabunda':
      case 'pilantra':
      case 'mito':
      case 'padrao':
      case 'comedia':
      case 'psicopata':
      case 'fortona':
      case 'magrela':
      case 'bombada':
      case 'chefe':
      case 'presidenta':
      case 'rainha':
      case 'patroa':
      case 'playboy':
      case 'zueira':
      case 'gamer':
      case 'programadora':
      case 'visionaria':
      case 'bilionaria':
      case 'poderosa':
      case 'vencedora':
      case 'senhora':
        await handleGameCommand(nazu, from, command, sender, menc_os2, isGroup, isModoBn, t, true);
        break;

      case 'rankgay':
      case 'rankburro':
      case 'rankinteligente':
      case 'rankotaku':
      case 'rankfiel':
      case 'rankinfiel':
      case 'rankcorno':
      case 'rankgado':
      case 'rankgostoso':
      case 'rankrico':
      case 'rankpobre':
      case 'rankforte':
      case 'rankpegador':
      case 'rankmacho':
      case 'ranknerd':
      case 'ranktrabalhador':
      case 'rankbrabo':
      case 'ranklindo':
      case 'rankmalandro':
      case 'rankengracado':
      case 'rankcharmoso':
      case 'rankvisionario':
      case 'rankpoderoso':
      case 'rankvencedor':
      case 'rankgays':
      case 'rankburros':
      case 'rankinteligentes':
      case 'rankotakus':
      case 'rankfiels':
      case 'rankinfieis':
      case 'rankcornos':
      case 'rankgados':
      case 'rankgostosos':
      case 'rankricos':
      case 'rankpobres':
      case 'rankfortes':
      case 'rankpegadores':
      case 'rankmachos':
      case 'ranknerds':
      case 'ranktrabalhadores':
      case 'rankbrabos':
      case 'ranklindos':
      case 'rankmalandros':
      case 'rankengracados':
      case 'rankcharmosos':
      case 'rankvisionarios':
      case 'rankpoderosos':
      case 'rankvencedores':
        await handleRankCommand(nazu, from, command, groupMembers, isGroup, isModoBn, t);
        break;

      case 'ranklesbica':
      case 'rankburra':
      case 'rankinteligente':
      case 'rankotaku':
      case 'rankfiel':
      case 'rankinfiel':
      case 'rankcorna':
      case 'rankgada':
      case 'rankgostosa':
      case 'rankrica':
      case 'rankpobre':
      case 'rankforte':
      case 'rankpegadora':
      case 'ranknerd':
      case 'ranktrabalhadora':
      case 'rankbraba':
      case 'ranklinda':
      case 'rankmalandra':
      case 'rankengracada':
      case 'rankcharmosa':
      case 'rankvisionaria':
      case 'rankpoderosa':
      case 'rankvencedora':
      case 'ranklesbicas':
      case 'rankburras':
      case 'rankinteligentes':
      case 'rankotakus':
      case 'rankfiels':
      case 'rankinfieis':
      case 'rankcornas':
      case 'rankgads':
      case 'rankgostosas':
      case 'rankricas':
      case 'rankpobres':
      case 'rankfortes':
      case 'rankpegadoras':
      case 'ranknerds':
      case 'ranktrabalhadoras':
      case 'rankbrabas':
      case 'ranklindas':
      case 'rankmalandras':
      case 'rankengracadas':
      case 'rankcharmosas':
      case 'rankvisionarias':
      case 'rankpoderosas':
      case 'rankvencedoras':
        await handleRankCommand(nazu, from, command, groupMembers, isGroup, isModoBn, t, true);
        break;

      case 'chute':
      case 'chutar':
      case 'tapa':
      case 'soco':
      case 'socar':
      case 'beijo':
      case 'beijar':
      case 'beijob':
      case 'beijarb':
      case 'abraco':
      case 'abracar':
      case 'mata':
      case 'matar':
      case 'tapar':
      case 'goza':
      case 'gozar':
      case 'mamar':
      case 'mamada':
      case 'cafune':
      case 'morder':
      case 'mordida':
      case 'lamber':
      case 'lambida':
      case 'explodir':
        if (!isGroup) return nazu.reply(t.grupo());
        if (!isModoBn) return nazu.reply(t.modoBrincadeiraDesativado());
        if (!menc_os2) return nazu.reply(t.marcarAlguem());
        try {
          const gamesData = await loadJson(path.join(__dirname, '/funcs/json/games.json'), { games2: {} });
          const markGameData = await loadJson(path.join(__dirname, '/funcs/json/markgame.json'), { ranks: {} });
          const responseText =
            markGameData[command]?.replaceAll('#nome#', `@${menc_os2.split('@')[0]}`) ||
            t.acaoRealizada(command, menc_os2.split('@')[0]);
          const media = gamesData.games2[command];
          if (media?.image) {
            await nazu.sendMessage(
              from,
              { image: media.image, caption: responseText, mentions: [menc_os2] },
              { quoted: info }
            );
          } else if (media?.video) {
            await nazu.sendMessage(
              from,
              { video: media.video, caption: responseText, mentions: [menc_os2], gifPlayback: true },
              { quoted: info }
            );
          } else {
            await nazu.sendMessage(
              from,
              { text: responseText, mentions: [menc_os2] },
              { quoted: info }
            );
          }
        } catch (e) {
          console.error(e);
          await nazu.reply(t.error());
        }
        break;

      // Sistema de RPG
      case 'rg':
        if (await rpg(sender)) return nazu.reply(t.rpgJaRegistrado());
        if (!args[0]) return nazu.reply(t.rpgDigiteNome());
        await nazu.reply(await rpg.rg(sender, args.join(' ')));
        break;

      case 'fight':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaInimigo());
        await nazu.reply(await rpg.batalhar(sender, normalizarTexto(args.join(' '))));
        break;

      case 'dungeon':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaMasmorra());
        await nazu.reply(await rpg.explorarMasmorra(sender, normalizarTexto(args.join(' '))));
        break;

      case 'craft':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaItem());
        await nazu.reply(await rpg.craftar(sender, normalizarTexto(args.join(' '))));
        break;

      case 'upforge':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        await nazu.reply(await rpg.melhorarForja(sender));
        break;

      case 'upalchemy':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        await nazu.reply(await rpg.melhorarAlquimia(sender));
        break;

      case 'buyprop':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaPropriedade());
        await nazu.reply(await rpg.comprarPropriedade(sender, normalizarTexto(args[0])));
        break;

      case 'collect':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        await nazu.reply(await rpg.coletarProducao(sender));
        break;

      case 'upprop':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0] || !args[1]) return nazu.reply(t.rpgEscolhaPropriedadeEUpgrade());
        await nazu.reply(await rpg.melhorarPropriedade(sender, normalizarTexto(args[0]), normalizarTexto(args[1])));
        break;

      case 'guild':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgDigiteNomeGuilda());
        await nazu.reply(await rpg.criarGuilda(sender, args.join(' ')));
        break;

      case 'invite':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!menc_os2) return nazu.reply(t.rpgEscolhaJogador());
        await nazu.reply(await rpg.guildaConvidar(sender, menc_os2));
        break;

      case 'join':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaGuilda());
        await nazu.reply(await rpg.guildaAceitar(sender, normalizarTexto(args.join(' '))));
        break;

      case 'gquest':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaMissao());
        await nazu.reply(await rpg.guildaMissão(sender, normalizarTexto(args.join(' '))));
        break;

      case 'war':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaGuilda());
        await nazu.reply(await rpg.declararGuerra(sender, args.join(' ')));
        break;

      case 'battle':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaInimigo());
        await nazu.reply(await rpg.guerrear(sender, normalizarTexto(args.join(' '))));
        break;

      case 'pvp':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaOponente());
        await nazu.reply(await rpg.desafiarArena(sender, args[0].replace('@', '')));
        break;

      case 'kingdom':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgDigiteNomeReino());
        await nazu.reply(await rpg.fundarReino(sender, args.join(' ')));
        break;

      case 'tax':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        await nazu.reply(await rpg.coletarImpostos(sender));
        break;

      case 'upkingdom':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaUpgrade());
        await nazu.reply(await rpg.melhorarReino(sender, normalizarTexto(args[0])));
        break;

      case 'portal':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaDestino());
        await nazu.reply(await rpg.abrirPortal(sender, normalizarTexto(args.join(' '))));
        break;

      case 'explore':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        await nazu.reply(await rpg.explorarPortal(sender));
        break;

      case 'event':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        await nazu.reply(await rpg.eventos.iniciarEventoGlobal());
        break;

      case 'joinvent':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaInimigo());
        await nazu.reply(await rpg.eventos.participarEvento(sender, normalizarTexto(args.join(' '))));
        break;

      case 'pet':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0] || !args[1]) return nazu.reply(t.rpgEscolhaTipoENome());
        await nazu.reply(await rpg.adotarPet(sender, normalizarTexto(args[0]), args.slice(1).join(' ')));
        break;

      case 'evopet':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        await nazu.reply(await rpg.evoluirPet(sender));
        break;

      case 'train':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        await nazu.reply(await rpg.treinarPet(sender));
        break;

      case 'learn':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaFeitico());
        await nazu.reply(await rpg.aprenderMagia(sender, normalizarTexto(args.join(' '))));
        break;

      case 'cast':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaFeitico());
        await nazu.reply(await rpg.usarMagia(sender, normalizarTexto(args.join(' '))));
        break;

      case 'faction':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaFaccao());
        await nazu.reply(await rpg.entrarFacção(sender, normalizarTexto(args.join(' '))));
        break;

      case 'black':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaItem());
        await nazu.reply(await rpg.comprarMercadoNegro(sender, normalizarTexto(args.join(' '))));
        break;

      case 'pray':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaDeus());
        await nazu.reply(await rpg.orar(sender, normalizarTexto(args.join(' '))));
        break;

      case 'caravan':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaDestino());
        await nazu.reply(await rpg.criarCaravana(sender, args.join(' ')));
        break;

      case 'getcaravan':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        await nazu.reply(await rpg.coletarCaravana(sender));
        break;

      case 'xp':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgDigiteQuantia());
        await nazu.reply(await rpg.ganharXP(sender, parseInt(args[0])));
        break;

      case 'stats':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0] || !args[1]) return nazu.reply(t.rpgEscolhaAtributoEPontos());
        await nazu.reply(await rpg.distribuirPontos(sender, normalizarTexto(args[0]), parseInt(args[1])));
        break;

      case 'achieve':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        await nazu.reply((await rpg.verificarConquistas(sender)) || t.rpgSemConquistas());
        break;

      case 'work':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        await nazu.reply(await rpg.trabalhar(sender));
        break;

      case 'job':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaEmprego());
        await nazu.reply(await rpg.escolherEmprego(sender, normalizarTexto(args.join(' '))));
        break;

      case 'jobs':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        await nazu.reply(await rpg.listarEmpregos());
        break;

      case 'buy':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaItem());
        await nazu.reply(await rpg.comprarLoja(sender, normalizarTexto(args.join(' '))));
        break;

      case 'sell':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaItem());
        await nazu.reply(await rpg.venderItem(sender, normalizarTexto(args.join(' '))));
        break;

      case 'equip':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgEscolhaItem());
        await nazu.reply(await rpg.equiparItem(sender, normalizarTexto(args.join(' '))));
        break;

      case 'inv':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        const user2 = await rpg(sender);
        await nazu.reply(t.rpgInventario(user2.nome, user2.inventario));
        break;

      case 'dep':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgDigiteQuantia());
        await nazu.reply(await rpg.depositarBanco(sender, parseInt(args[0])));
        break;

      case 'withdraw':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0]) return nazu.reply(t.rpgDigiteQuantia());
        await nazu.reply(await rpg.sacarBanco(sender, parseInt(args[0])));
        break;

      case 'send':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        if (!args[0] || !args[1]) return nazu.reply(t.rpgEscolhaJogadorEQuantia());
        await nazu.reply(await rpg.transferirDinheiro(sender, args[0].replace('@', ''), parseInt(args[1])));
        break;

      case 'rank':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        await nazu.reply(await rpg.rankingGlobal());
        break;

      case 'spells':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        await nazu.reply(await rpg.listarFeitiços());
        break;

      case 'shop':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        await nazu.reply(await rpg.listarLoja());
        break;

      case 'blackmarket':
        if (!await rpg(sender)) return nazu.reply(t.rpgNaoRegistrado());
        await nazu.reply(await rpg.listarMercadoNegro());
        break;

      case 'me':
        const user = await rpg(sender);
        if (!user) return nazu.reply(t.rpgNaoRegistrado());
        await nazu.reply(t.rpgPerfil(user));
        break;

      case 'helprpgtest':
        await nazu.reply(t.rpgHelp());
        break;

      default:
        if (isCmd) await nazu.react('❌');
    }
  } catch (e) {
    console.error(e);
    const { version } = JSON.parse(await fs.readFile(path.join(__dirname, '/../../package.json'), 'utf-8'));
    if (debug) reportError(e, version);
  }
}

// Funções auxiliares
function normalizarTexto(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function initializeDirectories() {
  const dirs = [
    path.join(__dirname, '/../database/grupos'),
    path.join(__dirname, '/../database/users'),
    path.join(__dirname, '/../database/dono'),
  ];
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function loadJson(filePath, defaultValue) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf-8'));
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
}

async function getGroupInfo(nazu, from, isGroup) {
  const groupFile = path.join(__dirname, `/../database/grupos/${from}.json`);
  const groupMetadata = isGroup ? await nazu.groupMetadata(from) : {};
  const groupName = isGroup && groupMetadata.subject ? groupMetadata.subject : '';
  const groupMembers = isGroup ? groupMetadata.participants.map((p) => p.id) : [];
  const groupAdmins = isGroup ? groupMetadata.participants.filter((p) => p.admin).map((p) => p.id) : [];
  const botNumber = nazu.user.id.split(':')[0] + '@s.whatsapp.net';
  const isGroupAdmin = isGroup ? groupAdmins.includes(nazu.user.id) : false;
  const isBotAdmin = isGroup ? groupAdmins.includes(botNumber) : false;

  if (isGroup) {
    await fs.access(groupFile).catch(() =>
      fs.writeFile(groupFile, JSON.stringify({ mark: {} }, null, 2))
    );
  }

  const groupData = await loadJson(groupFile, { mark: {} });
  return { groupMetadata, groupName, groupMembers, groupAdmins, isGroupAdmin, isBotAdmin, groupData };
}

async function updateMessageCounter(groupData, sender, isCmd, type, pushname, from) {
  groupData.contador = groupData.contador || [];
  const index = groupData.contador.findIndex((c) => c.id === sender);
  if (index !== -1) {
    const counter = groupData.contador[index];
    if (isCmd) counter.cmd = (counter.cmd || 0) + 1;
    else if (type === 'stickerMessage') counter.figu = (counter.figu || 0) + 1;
    else counter.msg = (counter.msg || 0) + 1;
    if (pushname && counter.pushname !== pushname) counter.pushname = pushname;
  } else {
    groupData.contador.push({
      id: sender,
      msg: isCmd ? 0 : 1,
      cmd: isCmd ? 1 : 0,
      figu: type === 'stickerMessage' ? 1 : 0,
      pushname: pushname || 'Unknown User',
    });
  }
  await fs.writeFile(
    path.join(__dirname, `/../database/grupos/${from}.json`),
    JSON.stringify(groupData, null, 2)
  );
}

async function handleMutedUser(nazu, from, sender, info, groupData) {
  await nazu.sendMessage(
    from,
    {
      text: t.userMutadoBanido(sender.split('@')[0]),
      mentions: [sender],
    },
    { quoted: info }
  );
  await nazu.sendMessage(from, {
    delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender },
  });
  await nazu.groupParticipantsUpdate(from, [sender], 'remove');
  delete groupData.mutedUsers[sender];
  await fs.writeFile(
    path.join(__dirname, `/../database/grupos/${from}.json`),
    JSON.stringify(groupData, null, 2)
  );
}

async function handleAntiPorn(nazu, from, sender, info, isGroupAdmin, getFileBuffer, upload) {
  const media =
    info.message?.imageMessage ||
    info.message?.viewOnceMessageV2?.message?.imageMessage ||
    info.message?.viewOnceMessage?.message?.imageMessage ||
    info.message?.videoMessage ||
    info.message?.stickerMessage ||
    info.message?.viewOnceMessageV2?.message?.videoMessage ||
    info.message?.viewOnceMessage?.message?.videoMessage;
  if (!media) return;
  try {
    const buffer = await getFileBuffer(media, 'image');
    const mediaURL = await upload(buffer, true);
    if (!mediaURL) return;
    const { data } = await axios.get(`https://nsfw-demo.sashido.io/api/image/classify?url=${mediaURL}`);
    const { Porn, Hentai } = data.reduce((acc, item) => ({ ...acc, [item.className]: item.probability }), {});
    if (Porn > 0.8 || Hentai > 0.8) {
      if (!isGroupAdmin) {
        await nazu.sendMessage(from, { delete: info.key });
        await nazu.sendMessage(
          from,
          {
            text: t.conteudoAdultoBanido(sender.split('@')[0], data[0].className, data[0].probability.toFixed(2)),
            mentions: [sender],
          },
          { quoted: info }
        );
        await nazu.groupParticipantsUpdate(from, [sender], 'remove');
      } else {
        await nazu.sendMessage(from, { delete: info.key });
        await nazu.reply(t.conteudoAdultoAdmin());
      }
    }
  } catch (e) {
    console.error(e);
  }
}

function checkQuotedMessage(info, type) {
  const content = JSON.stringify(info.message);
  return {
    isQuotedMsg: type === 'extendedTextMessage' && content.includes('conversation'),
    isQuotedMsg2: type === 'extendedTextMessage' && content.includes('text'),
    isQuotedImage: type === 'extendedTextMessage' && content.includes('imageMessage'),
    isQuotedVisuU: type === 'extendedTextMessage' && content.includes('viewOnceMessage'),
    isQuotedVisuU2: type === 'extendedTextMessage' && content.includes('viewOnceMessageV2'),
    isQuotedVideo: type === 'extendedTextMessage' && content.includes('videoMessage'),
    isQuotedDocument: type === 'extendedTextMessage' && content.includes('documentMessage'),
    isQuotedDocW: type === 'extendedTextMessage' && content.includes('documentWithCaptionMessage'),
    isQuotedAudio: type === 'extendedTextMessage' && content.includes('audioMessage'),
    isQuotedSticker: type === 'extendedTextMessage' && content.includes('stickerMessage'),
    isQuotedContact: type === 'extendedTextMessage' && content.includes('contactMessage'),
    isQuotedLocation: type === 'extendedTextMessage' && content.includes('locationMessage'),
    isQuotedProduct: type === 'extendedTextMessage' && content.includes('productMessage'),
  };
}

async function handleAntiLink(nazu, from, sender, groupMembers, info) {
  if (!groupMembers.includes(sender)) return;
  const link_dgp = await nazu.groupInviteCode(from);
  if (budy2.match(link_dgp)) return;
  await nazu.sendMessage(from, {
    delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender },
  });
  await nazu.groupParticipantsUpdate(from, [sender], 'remove');
}

async function handleTicTacToe(nazu, from, sender, budy2, tictactoe, isGroupAdmin, t) {
  if (tictactoe.hasPendingInvitation(from)) {
    const normalizedResponse = budy2.toLowerCase().trim();
    const result = tictactoe.processInvitationResponse(from, sender, normalizedResponse);
    if (result.success) {
      await nazu.sendMessage(from, { text: result.message, mentions: result.mentions || [] });
    }
  }

  const game = tictactoe.getGame(from);
  if (game && game.status === 'playing' && budy2.match(/^[1-9]$/)) {
    const position = parseInt(budy2);
    const result = tictactoe.makeMove(from, sender, position);
    if (result.success) {
      await nazu.sendMessage(from, { text: result.message, mentions: result.mentions || [] });
    }
  }

  if (game && budy2.toLowerCase().trim() === 'desistir' && isGroupAdmin) {
    const result = tictactoe.endGame(from);
    await nazu.sendMessage(from, { text: result.message, mentions: result.mentions || [] });
  }
}

async function handleAICommand(nazu, q, sender, model, t) {
  if (!q) return nazu.reply(t.digitarPrompt());
  await nazu.react('✅');
  try {
    const response = await axios.post(
      'https://api.cognima.com.br/api/ia/chat',
      { prompt: q, model, user: sender.split('@')[0] },
      { headers: { Authorization: 'Bearer CognimaTeamFreeKey' } }
    );
    await nazu.reply(response.data.message);
  } catch (e) {
    console.error(e);
    await nazu.reply(t.error());
  }
}

async function handleImageGeneration(nazu, from, q, prefix, t, info) {
  if (!q) return nazu.reply(t.formatoEspecifico('Prompt', `${prefix}imagine Um gato astronauta`));
  await nazu.react('🎨');
  try {
    const response = await axios.get(
      `https://api.cognima.com.br/api/ia/imagine?prompt=${encodeURIComponent(q)}`,
      { responseType: 'arraybuffer' }
    );
    await nazu.sendMessage(
      from,
      { image: response.data, caption: t.imagemGerada(q) },
      { quoted: info }
    );
  } catch (e) {
    console.error(e);
    await nazu.reply(t.error());
  }
}

async function handleYouTubeAudio(nazu, from, q, youtube, prefix, nomebot, t, info, isAlternative = false) {
  if (!q) return nazu.reply(t.formatoEspecifico('Nome ou Link', `${prefix}play ${nomebot}`));
  await nazu.react('🎵');
  try {
    const data = await youtube[isAlternative ? 'play2' : 'play'](q);
    if (!data.ok) return nazu.reply(data.msg);
    await nazu.sendMessage(
      from,
      {
        audio: { url: data.url },
        mimetype: 'audio/mp4',
        ptt: false,
        contextInfo: {
          externalAdReply: {
            title: data.title,
            body: t.audioBaixado(nomebot),
            thumbnailUrl: data.thumb,
            mediaType: 2,
            mediaUrl: data.url,
            sourceUrl: data.url,
          },
        },
      },
      { quoted: info }
    );
  } catch (e) {
    console.error(e);
    await nazu.reply(t.error());
  }
}

async function handleYouTubeVideo(nazu, from, q, youtube, prefix, nomebot, t, info, isAlternative = false) {
  if (!q) return nazu.reply(t.formatoEspecifico('Nome ou Link', `${prefix}playvid ${nomebot}`));
  await nazu.react('🎥');
  try {
    const data = await youtube[isAlternative ? 'play2' : 'play'](q, true);
    if (!data.ok) return nazu.reply(data.msg);
    await nazu.sendMessage(
      from,
      {
        video: { url: data.url },
        caption: t.videoBaixado(data.title),
        contextInfo: {
          externalAdReply: {
            title: data.title,
            body: t.videoBaixado(nomebot),
            thumbnailUrl: data.thumb,
            mediaType: 2,
            mediaUrl: data.url,
            sourceUrl: data.url,
          },
        },
      },
      { quoted: info }
    );
  } catch (e) {
    console.error(e);
    await nazu.reply(t.error());
  }
}

async function sendMenu(nazu, from, fs, menuFunc, prefix, nomebot, pushname, t, info) {
  try {
    const menuText = await menuFunc(prefix, nomebot, pushname);
    await nazu.sendMessage(
      from,
      { image: { url: './src/nazuninha.jpg' }, caption: menuText },
      { quoted: info }
    );
  } catch (e) {
    console.error(e);
    await nazu.reply(t.error());
  }
}

async function handleBotState(nazu, command, botStatePath, t) {
  const botState = await loadJson(botStatePath, { status: 'on' });
  botState.status = command === 'boton' ? 'on' : 'off';
  await fs.writeFile(botStatePath, JSON.stringify(botState, null, 2));
  await nazu.reply(botState.status === 'on' ? t.botAtivado() : t.botDesativado());
}

async function handleBlockCommandGlobal(nazu, q, globalBlocksPath, t) {
  if (!q) return nazu.reply(t.digitarComando());
  const globalBlocks = await loadJson(globalBlocksPath, { commands: {}, users: {} });
  globalBlocks.commands[q.toLowerCase().trim()] = { reason: 'Bloqueado globalmente pelo dono' };
  await fs.writeFile(globalBlocksPath, JSON.stringify(globalBlocks, null, 2));
  await nazu.reply(t.comandoBloqueadoGlobal(q));
}

async function handleUnblockCommandGlobal(nazu, q, globalBlocksPath, t) {
  if (!q) return nazu.reply(t.digitarComando());
  const globalBlocks = await loadJson(globalBlocksPath, { commands: {}, users: {} });
  if (globalBlocks.commands[q.toLowerCase().trim()]) {
    delete globalBlocks.commands[q.toLowerCase().trim()];
    await fs.writeFile(globalBlocksPath, JSON.stringify(globalBlocks, null, 2));
    await nazu.reply(t.comandoDesbloqueadoGlobal(q));
  } else {
    await nazu.reply(t.comandoNaoBloqueado());
  }
}

async function handleBlockUserGlobal(nazu, q, menc_os2, globalBlocksPath, t) {
  if (!q) return nazu.reply(t.digitarMotivo());
  if (!menc_os2) return nazu.reply(t.marcarAlguem());
  const globalBlocks = await loadJson(globalBlocksPath, { commands: {}, users: {} });
  globalBlocks.users[menc_os2.split('@')[0]] = { reason: q };
  await fs.writeFile(globalBlocksPath, JSON.stringify(globalBlocks, null, 2));
  await nazu.reply(t.userBloqueadoGlobal(menc_os2.split('@')[0], q));
}

async function handleGameCommand(nazu, from, command, sender, menc_os2, isGroup, isModoBn, t, isFemale = false) {
  if (!isGroup) return nazu.reply(t.grupo());
  if (!isModoBn) return nazu.reply(t.modoBrincadeiraDesativado());
  try {
    const target = menc_os2 || sender;
    const percentage = Math.floor(Math.random() * 101);
    const gameKey = isFemale ? command : command.replace('rank', '');
    const message = t.jogoPorcentagem(
      gameKey,
      target.split('@')[0],
      percentage,
      percentage >= 50 ? 'alta' : 'baixa'
    );
    await nazu.sendMessage(
      from,
      { text: message, mentions: [target] },
      { quoted: info }
    );
  } catch (e) {
    console.error(e);
    await nazu.reply(t.error());
  }
}

async function handleRankCommand(nazu, from, command, groupMembers, isGroup, isModoBn, t, isFemale = false) {
  if (!isGroup) return nazu.reply(t.grupo());
  if (!isModoBn) return nazu.reply(t.modoBrincadeiraDesativado());
  try {
    const gameKey = isFemale ? command.replace('rank', '') : command.replace('rank', '');
    const rankings = groupMembers
      .map((member) => ({
        id: member,
        percentage: Math.floor(Math.random() * 101),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);
    const message = t.rankingJogo(
      gameKey,
      rankings.map((r, i) => ({
        position: i + 1,
        name: r.id.split('@')[0],
        percentage: r.percentage,
      }))
    );
    await nazu.sendMessage(
      from,
      { text: message, mentions: rankings.map((r) => r.id) },
      { quoted: info }
    );
  } catch (e) {
    console.error(e);
    await nazu.reply(t.error());
  }
}

function extractMessageText(info, type) {
  if (type === 'conversation') return info.message.conversation;
  if (type === 'imageMessage') return info.message.imageMessage?.caption;
  if (type === 'videoMessage') return info.message.videoMessage?.caption;
  if (type === 'extendedTextMessage') return info.message.extendedTextMessage?.text;
  if (type === 'buttonsResponseMessage') return info.message.buttonsResponseMessage?.selectedButtonId;
  if (type === 'listResponseMessage') return info.message.listResponseMessage?.singleSelectReply?.selectedRowId;
  if (type === 'templateButtonReplyMessage') return info.message.templateButtonReplyMessage?.selectedId;
  if (type === 'messageContextInfo') return '';
  if (type === 'viewOnceMessage') {
    const vOnce = info.message.viewOnceMessage.message;
    return vOnce.imageMessage?.caption || vOnce.videoMessage?.caption;
  }
  if (type === 'viewOnceMessageV2') {
    const vOnceV2 = info.message.viewOnceMessageV2.message;
    return vOnceV2.imageMessage?.caption || vOnceV2.videoMessage?.caption;
  }
  return '';
}

// Exporta a função principal
module.exports = { NazuninhaBotExec };