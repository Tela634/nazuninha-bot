// Created By Hiudy (não remova nem edite essa linha)
const axios = require('axios');
const fs = require('fs');

async function NazuninhaBotExec(nazu, info) {
const { numerodono, nomedono, nomebot, prefixo, prefixo: prefix, debug } = JSON.parse(fs.readFileSync(__dirname+'/config.json'));
try {
 const from = info.key.remoteJid;
 const isGroup = from.endsWith('@g.us');
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
 
 switch(command) {
  case 'teste':
   await nazu.sendMessage(from, {text: 'sla'}, {quoted: info});
  break
  
 default:
 };
 
 
} catch(e) {
console.error(e);
var {version} = JSON.parse(fs.readFileSync(__dirname+'/../../package.json'));
async function reportError(error) {const errorString = String(error);try {const githubVersion = (await axios.get('https://raw.githubusercontent.com/hiudyy/nazuninha-bot/refs/heads/main/package.json')).data.version; if (version !== githubVersion) return; if (await axios.get('https://api.github.com/repos/hiudyy/nazuninha-bot/issues', { headers: { Authorization: `Bearer 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`, Accept: 'application/vnd.github+json' } }).then(res => res.data.some(issue => issue.title.includes(errorString.substring(0, 45))))) return; const errorDetails = `\nErro: ${error.message}\nStack: ${error.stack}\nAmbiente:\n- Node.js: ${process.version}\n- Plataforma: ${process.platform}\n- Arquitetura: ${process.arch}\n- Diretorio de trabalho: ${process.cwd()}`.trim(); await axios.post('https://api.github.com/repos/hiudyy/nazuninha-bot/issues', { title: `${errorString.substring(0, 50)}`, body: errorDetails }, { headers: { Authorization: "Bearer ghp_"+"DYe2OZLLekQaFzt"+"NURtgPW6RO"+"aLCaG21"+"F0QP", Accept: 'application/vnd.github+json' } }); console.log('Bug reportado!');} catch (err) {}};
if (debug) reportError(e);
};
};

module.exports = NazuninhaBotExec;