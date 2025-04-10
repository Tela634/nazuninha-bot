// Conexão do bot
// Sistema unico, diferente de qualquer outro bot
// Criador: Hiudy
// Caso for usar deixe o caralho dos créditos 
// <3

const { Boom } = require('@hapi/boom');
const { makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, DisconnectReason, proto, makeInMemoryStore } = require('baileys');
const axios = require('axios');
const readline = require('readline');
const { execSync } = require('child_process');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

const logger = pino({ level: 'silent' });
const msgRetryCounterCache = new Map();

const { prefixo, nomebot, nomedono, numerodono, aviso } = require('./config.json');

const ask = (question) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(question, (answer) => { rl.close(); resolve(answer.trim()); }));
};

// Objeto para armazenar todas as conexões ativas
const activeConnections = {};

async function createConnection(connectionId = 'default') {
    const AUTH_DIR = path.join('dados', 'database', 'qr-code', connectionId);
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
    const { version } = await fetchLatestBaileysVersion();
    
    const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
    
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
                await nazu.sendMessage(from, {image: { url: jsonGp.welcome.image },caption: welcomeText,mentions: [sender]});
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
                const indexModulePath = __dirname + '/index.js';
                delete require.cache[require.resolve(indexModulePath)];
                const indexModule = require(indexModulePath);
                if (typeof indexModule === 'function') {
                    indexModule(nazu, info, connectionId);
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
            console.log(`============================================\nBot: ${nomebot} (${connectionId})\nPrefix: ${prefixo}\nDono: ${nomedono}\nCriador: Hiudy\n============================================\n    ✅ BOT INICIADO COM SUCESSO\n============================================`);
        };
        
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            console.log(`⚠️  Conexão ${connectionId} fechada, motivo: ${reason || 'desconhecido'}`);
            const errorMessages = {
                401: '🗑️  Sessão inválida, excluindo autenticação...',
                403: '🔒  Acesso negado ao WhatsApp Web',
                404: '🔍  Sessão não encontrada',
                406: '📵  Dispositivo não conectado à internet',
                408: '⏳  A sessão sofreu um timeout, recarregando...',
                410: '🔄  Sessão expirada, recriando conexão...',
                411: '📁  O arquivo de sessão parece incorreto, estou tentando recarregar...',
                412: '📱  Versão muito antiga do WhatsApp',
                420: '🐌  Muitas tentativas, reduzindo velocidade de conexão...',
                428: '📶  Não foi possível manter a conexão com o WhatsApp, tentando de novo...',
                429: '🛑  Muitas requisições, aguardando antes de reconectar...',
                440: '👥  Existem muitas sessões do WhatsApp conectadas no meu número, feche-as...',
                500: '⚙️  A sessão parece mal configurada, estarei tentando reconectar...',
                502: '🌐  Problema no servidor intermediário',
                503: '❓  Erro desconhecido...',
                515: '🔄  Meu código será reinicializado para estabilizar a conexão...',
                521: '🚧  Servidor em manutenção',
                540: '⏱️  Tempo de resposta excedido'
            };
            if (reason === DisconnectReason.loggedOut || reason === 401) {
                console.log(errorMessages[401]);
                execSync(`rm -rf ${AUTH_DIR}`);
            } else if (errorMessages[reason]) {
                console.log(errorMessages[reason]);
            } else {
                console.log(`⚠️  Código de erro não reconhecido (${reason}), tentando reconectar...`);
            };

            await nazu.end();
            delete activeConnections[connectionId];
            console.log(`🔄  Tentando reconectar ${connectionId}...`);
            createConnection(connectionId);
        };
        
        if(connection == 'connecting') {
            console.log(`Atualizando a sessão ${connectionId} para garantir o funcionamento correto do sistema.`);
        };
    });
    
    activeConnections[connectionId] = nazu;
    return nazu;
}

async function startNazu() {
    // Função para listar conexões existentes
    const listExistingConnections = () => {
        const baseDir = path.join('dados', 'database', 'qr-code');
        if (!fs.existsSync(baseDir)) return [];
        
        return fs.readdirSync(baseDir).filter(dir => {
            return fs.statSync(path.join(baseDir, dir)).isDirectory();
        });
    };

    // Modo adicionar nova conexão
    if (process.argv.includes('--add-number')) {
        const connectionId = await ask('Digite um ID único para esta nova conexão: ');
        if (!connectionId) {
            console.log('❌ ID inválido!');
            process.exit(1);
        }
        
        const existingConnections = listExistingConnections();
        if (existingConnections.includes(connectionId)) {
            console.log('❌ Já existe uma conexão com este ID!');
            process.exit(1);
        }
        
        await createConnection(connectionId);
        console.log(`✅ Nova conexão "${connectionId}" adicionada com sucesso!`);
        return;
    }
    
    // Modo normal - inicia todas as conexões
    const existingConnections = listExistingConnections();
    
    if (existingConnections.length === 0) {
        console.log('ℹ️  Nenhuma conexão encontrada, iniciando conexão padrão...');
        await createConnection('default');
        return;
    }
    
    console.log(`🔍 Encontradas ${existingConnections.length} conexões: ${existingConnections.join(', ')}`);
    
    for (const connId of existingConnections) {
        try {
            await createConnection(connId);
            console.log(`✅ Conexão "${connId}" iniciada com sucesso!`);
        } catch (err) {
            console.error(`❌ Falha ao iniciar conexão "${connId}":`, err.message);
        }
    }
    
    console.log('🚀 Todas as conexões foram iniciadas!');
}

// Inicia o bot
startNazu().catch(async(e) => console.error(e));