var express = require('express');
var router = express.Router();
//CONFIG FILE...
var config = require('../config');

const Captcha = require("@haileybot/captcha-generator");

const TelegramBot = require('node-telegram-bot-api');
const token = config.telegram.token;
const bot = new TelegramBot(token, {polling: true});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

bot.onText(/\/verifyme/, (msg, match) => {
  let captcha = new Captcha();

  console.log(captcha);

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
