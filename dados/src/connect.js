// Conexão do bot
// Sistema unico, diferente de qualquer outro bot
// Criador: Hiudy
// Caso for usar deixe o caralho dos créditos 
// <3

const { Boom } = require('@hapi/boom');
const { makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, DisconnectReason, proto, makeInMemoryStore } = require('baileys');

const readline = require('readline');
const { execSync } = require('child_process');
const pino = require('pino');
const fs = require('fs');

const logger = pino({ level: 'silent' });
const AUTH_DIR = 'dados/database/qr-code';
const msgRetryCounterCache = new Map();

const { prefixo, nomebot, nomedono, numerodono, aviso } = require('./config.json');

const ask = (question) => {
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
return new Promise(resolve => rl.question(question, (answer) => { rl.close(); resolve(answer.trim());}));
};

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' })});

async function startNazu() {
 const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
 const { version } = await fetchLatestBaileysVersion();
 
 async function getMessage(key) {
  if (!store) return proto.Message.fromObject({});
  const msg = await store.loadMessage(key.remoteJid, key.id);
  return msg ? msg.message : undefined;
 };
 
 let nazu = makeWASocket({
    version,
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    printQRInTerminal: !process.argv.includes('--code'),
    syncFullHistory: true,
    markOnlineOnConnect: false,
    fireInitQueriesEarly: true,
    msgRetryCounterCache,
    connectTimeoutMs: 180000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 60000,
    retryRequestDelayMs: 10000,
    generateHighQualityLinkPreview: true,
    logger,
    patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(message?.interactiveMessage);
        if (requiresPatch) {
            message = {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadataVersion: 2,
                            deviceListMetadata: {},
                        },
                        ...message,
                    },
                },
            };
        }
        return message;
    },
    getMessage,
    shouldSyncHistoryMessage: () => true,
    browser: ['Ubuntu', 'Edge', '110.0.1587.56']
});
 
 if (process.argv.includes('--code') && !nazu.authState.creds.registered) {
  try {
    let phoneNumber = await ask('📞 Digite seu número (com DDD e DDI): ');
    phoneNumber = phoneNumber.replace(/\D/g, '');
    if (!/^\d{10,15}$/.test(phoneNumber)) return console.log('❌ Número inválido! Tente novamente.');
    const code = await nazu.requestPairingCode(phoneNumber, 'N4ZUN411');
    console.log(`🔢 Seu código de pareamento: ${code}`);
    console.log('📲 No WhatsApp, vá em "Aparelhos Conectados" -> "Conectar com Número de Telefone" e insira o código.');
  } catch (err) {
    console.error('❌ Erro ao solicitar código:', err.message || err);
    console.error('📌 Resposta completa do erro:', err);
  };
 };
 
 store.bind(nazu.ev);
 
 nazu.ev.on('creds.update', saveCreds);

 nazu.ev.on('group-participants.update', async (inf) => {
   const from = inf.id;
   if(inf.participants[0].startsWith(nazu.user.id.split(':')[0])) return;
   if(!fs.existsSync(__dirname + `/../database`)) return;
   if(!fs.existsSync(__dirname + `/../database/grupos`)) return;
   if(!fs.existsSync(__dirname + `/../database/grupos/${from}.json`)) return;
   var jsonGp = JSON.parse(fs.readFileSync(__dirname + `/../database/grupos/${from}.json`));
   try { var GroupMetadata = await nazu.groupMetadata(from) } catch (e) { return };
   if(inf.action === 'add') {
     if(!jsonGp.bemvindo) return;
     const sender = inf.participants[0];
     const textBv = jsonGp.textbv && jsonGp.textbv.length > 1 ? jsonGp.textbv : 'Seja bem vindo(a) #numerodele# ao #nomedogp#!\nVocê é nosso membro número: *#membros#*!';
     const welcomeText = textBv.replaceAll('#numerodele#', `@${sender.split('@')[0]}`).replaceAll('#nomedogp#', GroupMetadata.subject).replaceAll('#desc#', GroupMetadata.desc || '').replaceAll('#membros#', GroupMetadata.participants.length);

     if(jsonGp.welcome && jsonGp.welcome.image) {
       if(jsonGp.welcome.image === 'gif') {
       bah = JSON.parse(fs.readFileSync(__dirname+'/../database/pushname.json'));
       await nazu.sendMessage(from, {video: { url: `https://api.cognima.com.br/api/welcome-gif?key=CognimaTeamFreeKey&name=${bah[sender] ? bah[sender] : 'user'}` }, gifPlayback: true, caption: welcomeText,mentions: [sender]});
       } else {
       await nazu.sendMessage(from, {image: { url: jsonGp.welcome.image },caption: welcomeText,mentions: [sender]});
       };
     } else {
       await nazu.sendMessage(from, {text: welcomeText,mentions: [sender]});
     };
   } else if(inf.action === 'remove') {
     if(!jsonGp.exit || !jsonGp.exit.enabled) return;
     const sender = inf.participants[0];
     const exitText = jsonGp.exit.text && jsonGp.exit.text.length > 1 ? jsonGp.exit.text : 'Adeus #numerodele#! 👋\nO grupo *#nomedogp#* agora tem *#membros#* membros.';
     const formattedText = exitText.replaceAll('#numerodele#', `@${sender.split('@')[0]}`).replaceAll('#nomedogp#', GroupMetadata.subject).replaceAll('#desc#', GroupMetadata.desc || '').replaceAll('#membros#', GroupMetadata.participants.length);

     if(jsonGp.exit && jsonGp.exit.image) {
       await nazu.sendMessage(from, {image: { url: jsonGp.exit.image },caption: formattedText,mentions: [sender]});
     } else {
       await nazu.sendMessage(from, {text: formattedText,mentions: [sender]});
     };
   };
 });
 
 nazu.ev.on('messages.upsert', async (m) => {
  try {
    if (!m.messages || !Array.isArray(m.messages)) return;
    for (const info of m.messages) {
    if(!info.message) return;
    if(m.type == "append") return;  
    fs.existsSync(__dirname+'/../database/pushname.json') || fs.writeFileSync(__dirname+'/../database/pushname.json', JSON.stringify({})); bah = JSON.parse(fs.readFileSync(__dirname+'/../database/pushname.json')); bah[info.key.remoteJid.endsWith('@g.us') ? (info.key.participant.includes(':') ? info.key.participant.split(':')[0] + '@s.whatsapp.net' : info.key.participant) : info.key.remoteJid] = info.pushName || 'user'; fs.writeFileSync(__dirname+'/../database/pushname.json', JSON.stringify(bah));
    const indexModulePath = __dirname + '/index.js';
    delete require.cache[require.resolve(indexModulePath)];
    const indexModule = require(indexModulePath);
    if (typeof indexModule === 'function') {
        indexModule(nazu, info);
    } else {
        console.error('O módulo index.js não exporta uma função.');
      }
    }
  } catch (err) {
    console.error('Erro ao processar mensagens:', err);
  }
 });
 
 nazu.ev.on('connection.update', async (update) => {
   const { connection, lastDisconnect, qr } = update;
   if (connection === 'open') {
     console.log(`============================================\nBot: ${nomebot}\nPrefix: ${prefixo}\nDono: ${nomedono}\nCriador: Hiudy\n============================================\n    ✅ BOT INICIADO COM SUCESSO\n============================================`);
     if(aviso) await nazu.sendMessage(numerodono+'@s.whatsapp.net', {text: 'Bot conectado ✅'});
   };
   
   if (connection === 'close') {
     const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
     console.log(`⚠️ Conexão fechada, motivo: ${reason}`);
     if (reason === DisconnectReason.loggedOut || reason === 401) {
       console.log('🗑️ Sessão inválida, excluindo autenticação...');
       execSync(`rm -rf ${AUTH_DIR}`);
      } else if(reason == 408) {
       console.log('A sessão sofreu um timeout, recarregando...');
      } else if(reason == 411) {
       console.log('O arquivo de sessão parece incorreto, estou tentando recarregar...');
      } else if(reason == 428) {
       console.log('Não foi possível manter a conexão com o WhatsApp, tentando de novo...');
      } else if(reason == 440) {
       console.log('Existem muitas sessões do WhatsApp conectadas no meu número, feche-as...');
      } else if(reason == 500) {
       console.log('A sessão parece mal configurada, estarei tentando reconectar...');
      } else if(reason == 503) {
       console.log('Erro desconhecido...');
      } else if(reason == 515) {
       console.log('Meu código será reinicializado para estabilizar a conexão...');
      };
      await nazu.end();
      console.log(`🔄 Tentando reconectar...`);
      startNazu();
     };
   if(connection == 'connecting') {
     console.log('Atualizando a sessão para garantir o funcionamento correto do sistema.');
   };
 });
};

// Inicia o bot
startNazu().catch(async(e) => console.error(e));
