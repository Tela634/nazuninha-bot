/*
 *****NÃO MEXA EM NADA AQUI SE NÃO SOUBER O QUE TA FAZENDO*****
*/
//Criador: hiudy
//Versão: 0.0.1
//Esse arquivo contem direitos autorais, caso meus creditos sejam tirados poderei tomar medidas jurídicas.


//downloads
const youtube = require(__dirname+'/downloads/youtube.js');
const tiktok = require(__dirname+'/downloads/tiktok.js');
const pinterest = require(__dirname+'/downloads/pinterest.js');
const igdl = require(__dirname+'/downloads/igdl.js');
const mcPlugin = require(__dirname+'/downloads/mcplugins.js');
const FilmesDL = require(__dirname+'/downloads/filmes.js');

//utils
const reportError = require(__dirname+'/utils/debug.js');
const styleText = require(__dirname+'/utils/gerarnick.js');
const emojiMix = require(__dirname+'/utils/emojimix.js');
const upload = require(__dirname+'/utils/upload.js');
const { sendSticker } = require(__dirname+'/utils/sticker.js');

//jogos 
const tictactoe = require(__dirname+'/games/tictactoe.js');

//exports
module.exports = { reportError, youtube, tiktok, pinterest, igdl, sendSticker, FilmesDL, styleText, emojiMix, upload, mcPlugin, tictactoe };