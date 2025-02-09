// Created By Hiudy (não remova nem edite essa linha)

const { Boom } = require('@hapi/boom');
const { makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, DisconnectReason } = require('baileys');

const readline = require('readline');
const { execSync } = require('child_process');
const pino = require('pino');
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

 let nazu = makeWASocket({version, auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, logger), }, printQRInTerminal: !process.argv.includes('--code'), browser: ['Ubuntu', 'Edge', '110.0.1587.56'], syncFullHistory: false, markOnlineOnConnect: true, fireInitQueriesEarly: true, msgRetryCounterCache, connectTimeoutMs: 60000, defaultQueryTimeoutMs: 0, keepAliveIntervalMs: 10000, logger, });

 nazu.ev.on('creds.update', saveCreds);

 nazu.ev.on('connection.update', async (update) => {
   const { connection, lastDisconnect, qr } = update;
    
   if (connection === 'close') {
     const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
     console.log(`⚠️ Conexão fechada, motivo: ${reason}`);
     
     if (reason === DisconnectReason.loggedOut || reason === 401) {
       console.log('🗑️ Sessão inválida, excluindo autenticação...');
       execSync(`rm -rf ${AUTH_DIR}`);
     };
      
     if (retryCount < 3) {
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
 
    if (process.argv.includes('--code') && !nazu.authState.creds.registered) {
        try {
            console.log('🔑 Iniciando conexão por Código...');
            let phoneNumber = await ask('📞 Digite seu número (com DDD e DDI): ');
            phoneNumber = phoneNumber.replace(/\D/g, ''); // Remove caracteres não numéricos

            if (!/^\d{10,15}$/.test(phoneNumber)) {
                console.log('❌ Número inválido! Tente novamente.');
                return;
            }

            console.log('📡 Solicitando código de emparelhamento...');
            const code = await nazu.requestPairingCode(phoneNumber);
            console.log(`🔢 Seu código de pareamento: ${code}`);
            console.log('📲 No WhatsApp, vá em "Aparelhos Conectados" -> "Conectar com Número de Telefone" e insira o código.');
        } catch (err) {
            console.error('❌ Erro ao solicitar código:', err.message || err);
            console.error('📌 Resposta completa do erro:', err);
        }
    }
}

// Inicia o bot
startNazu();