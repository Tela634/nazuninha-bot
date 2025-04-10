/*
 *****NÃO MEXA EM NADA AQUI SE NÃO SOUBER O QUE TA FAZENDO*****
*/
//Criador: hiudy
//Versão: 0.0.1
//Esse arquivo contem direitos autorais, caso meus creditos sejam tirados poderei tomar medidas jurídicas.
const fs = require('fs');

//downloads
const youtube = require(__dirname+'/downloads/youtube.js');
const tiktok = require(__dirname+'/downloads/tiktok.js');
const pinterest = require(__dirname+'/downloads/pinterest.js');
const igdl = require(__dirname+'/downloads/igdl.js');
const mcPlugin = require(__dirname+'/downloads/mcplugins.js');
const FilmesDL = require(__dirname+'/downloads/filmes.js');
const apkMod = require(__dirname+'/downloads/apkmod.js');
//utils
const reportError = require(__dirname+'/utils/debug.js');
const styleText = require(__dirname+'/utils/gerarnick.js');
const emojiMix = require(__dirname+'/utils/emojimix.js');
const upload = require(__dirname+'/utils/upload.js');
const { sendSticker } = require(__dirname+'/utils/sticker.js');
const clearMemory = require(__dirname+'/utils/clear.js');

//jogos 
const tictactoe = require(__dirname+'/games/tictactoe.js');
const rpg = require(__dirname+'/games/rpg.js');

//Json
const toolsJson = JSON.parse(fs.readFileSync(__dirname+'/json/tools.json', 'utf-8'));
const vabJson = JSON.parse(fs.readFileSync(__dirname+'/json/vab.json', 'utf-8'));

//exports
module.exports = { reportError, youtube, tiktok, pinterest, igdl, sendSticker, FilmesDL, styleText, emojiMix, upload, mcPlugin, tictactoe, rpg, toolsJson, vabJson, apkMod };