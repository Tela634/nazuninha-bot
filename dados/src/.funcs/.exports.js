const youtube = require(__dirname+'/.downloads/.youtube.js');
const tiktok = require(__dirname+'/.downloads/.tiktok.js');
const pinterest = require(__dirname+'/.downloads/.pinterest.js');
const reportError = require(__dirname+'/.utils/.debug.js');

module.exports = { reportError, youtube, tiktok, pinterest };