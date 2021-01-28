var express = require('express');
var router = express.Router();

const Captcha = require("@haileybot/captcha-generator");

const TelegramBot = require('node-telegram-bot-api');
// replace the value below with the Telegram token you receive from @BotFather
const token = '1536137663:AAFADkosDLUqzs49t_fgHTIZVFQgZOSWwaQ';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Matches "/echo [whatever]"
bot.onText(/\/verifyme/, (msg, match) => {
  let captcha = new Captcha();

  let string = captcha.dataURL;

  var regex = /^data:.+\/(.+);base64,(.*)$/;

  var matches = string.match(regex);
  var ext = matches[1];
  var data = matches[2];
  var buffer = Buffer.from(data, 'base64')

  bot.sendPhoto(msg.chat.id, buffer);

  bot.sendMessage(msg.chat.id, "Image send!");
});

module.exports = router;