// Created By Hiudy (não remova nem edite essa linha)

const { Boom } = require('@hapi/boom');
const { makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, DisconnectReason } = require('baileys');

const readline = require('readline');
const { execSync } = require('child_process');
const pino = require('pino');
const fs = require('fs');
const NodeCache = require("node-cache");

const logger = pino({ level: 'silent' });
const AUTH_DIR = 'dados/database/qr-code';
const msgRetryCounterCache = new NodeCache();

const { prefixo, nomebot, nomedono, numerodono, aviso } = require('./config.json');

const ask = (question) => {
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
return new Promise(resolve => rl.question(question, (answer) => { rl.close(); resolve(answer.trim());}));
};

async function startNazu(retryCount = 0) {
 const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
 const { version } = await fetchLatestBaileysVersion();
 
 async function getMessage(key) {
  if (store) {
    try {
      const msg = await store.loadMessage(key.remoteJid, key.id);
      return msg?.message || undefined;
    } catch (error) {
      console.error("Erro ao carregar a mensagem:", error);
      return undefined;
    };
  };
  return Promise.resolve({});
 };
 
 let nazu = makeWASocket({version,auth: {creds: state.creds,keys: makeCacheableSignalKeyStore(state.keys, logger),},printQRInTerminal: !process.argv.includes('--code'),syncFullHistory: false,markOnlineOnConnect: false,fireInitQueriesEarly: true,msgRetryCounterCache,connectTimeoutMs: 180000,defaultQueryTimeoutMs: 10000,keepAliveIntervalMs: 10000,retryRequestDelayMs: 5000,generateHighQualityLinkPreview: true, logger, patchMessageBeforeSending: (message) => {const requiresPatch = !!(message?.interactiveMessage);if (requiresPatch) {message = {viewOnceMessage: {message: {messageContextInfo: {deviceListMetadataVersion: 2,deviceListMetadata: {},},...message,},},};}return message;}, getMessage});
 
 if (process.argv.includes('--code') && !nazu.authState.creds.registered) {
  try {
    let phoneNumber = await ask('📞 Digite seu número (com DDD e DDI): ');
    phoneNumber = phoneNumber.replace(/\D/g, '');
    if (!/^\d{10,15}$/.test(phoneNumber)) return console.log('❌ Número inválido! Tente novamente.');
    const code = await nazu.requestPairingCode(phoneNumber);
    console.log(`🔢 Seu código de pareamento: ${code}`);
    console.log('📲 No WhatsApp, vá em "Aparelhos Conectados" -> "Conectar com Número de Telefone" e insira o código.');
  } catch (err) {
    console.error('❌ Erro ao solicitar código:', err.message || err);
    console.error('📌 Resposta completa do erro:', err);
  };
 };
 
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
   if(jsonGp.imgbv) {
   
   } else {
    const textBv = jsonGp.textbv && jsonGp.textbv.length > 1 ? jsonGp.textbv : 'Seja bem vindo(a) #numerodele# ao #nomedogp#!\nVocê é nosso membro número: *#membros#*!';
    await nazu.sendMessage(from, {text: textBv.replaceAll('#numerodele#', `@${sender.split('@')[0]}`).replaceAll('#nomedogp#', GroupMetadata.subject).replaceAll('#desc#', await GroupMetadata.desc).replaceAll('#membros#', GroupMetadata.participants.length), mentions: [sender]});
   };
   };
 });
 
 nazu.ev.on('connection.update', async (update) => {
   const { connection, lastDisconnect, qr } = update;
   if (connection === 'close') {
     const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
     console.log(`⚠️ Conexão fechada, motivo: ${reason}`);
     if (reason === DisconnectReason.loggedOut || reason === 401) {
       console.log('🗑️ Sessão inválida, excluindo autenticação...');
       execSync(`rm -rf ${AUTH_DIR}`);
     };
     if (retryCount < 999) {
       console.log(`🔄 Tentando reconectar em 5 segundos... (${retryCount + 1}/3)`);
       setTimeout(() => startNazu(retryCount + 1), 5000);
     } else {
       console.log('❌ Muitas falhas na conexão. Verifique seu número ou tente mais tarde.');
     }
     }
   if (connection === 'open') {
     console.log(`============================================\nBot: ${nomebot}\nPrefix: ${prefixo}\nDono: ${nomedono}\nCriador: Hiudy\n============================================\n    ✅ BOT INICIADO COM SUCESSO\n============================================`);
     if(aviso) await nazu.sendMessage(numerodono+'@s.whatsapp.net', {text: 'Bot conectado ✅'});
   }
 });

 nazu.ev.on('messages.upsert', async (m) => {
  try {
    if (!m.messages || !Array.isArray(m.messages)) return;
    for (const info of m.messages) {
    if(!info.message) return;
    if(m.type == "append") return;  
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
};

// Inicia o bot
startNazu();