var express = require('express');
var router = express.Router();
//CONFIG FILE...
var config = require('../config');

const Captcha = require("@haileybot/captcha-generator");

const TelegramBot = require('node-telegram-bot-api');
const token = config.telegram.token;
const bot = new TelegramBot(token, {
  polling: true
});

let correctValue;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

bot.onText(/\/test/, (msg) => {
  bot.sendMessage(msg.chat.id, "I'm a test robot");
});

bot.onText(/\/verifyme/, (msg, match) => {
  try {
    let captcha = new Captcha();

    let string = captcha.dataURL;
    correctValue = captcha.value;

    let arrValues = [];
    arrValues.push(correctValue);

    for (i = 0; i < 4; i++) {
      arrValues.push(makeid(6));
    }

    shuffle(arrValues);

    var regex = /^data:.+\/(.+);base64,(.*)$/;

    var matches = string.match(regex);
    var ext = matches[1];
    var data = matches[2];
    var buffer = Buffer.from(data, 'base64')

    bot.sendPhoto(msg.chat.id, buffer);

    let arrButtons = [];
    let obj;
    for (i = 0; i < 5; i++) {
      obj = {};
      obj['text'] = arrValues[i];
      obj['callback_data'] = arrValues[i];
      arrButtons.push(obj);
    }

    const opts = {
      reply_markup: {
        inline_keyboard: [
          arrButtons
        ]
      }
    }
    bot.sendMessage(msg.chat.id, "Please choose the correct text on the photo:", opts);
  } catch (err) {
    console.log(err);
  }
});

// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
  };
  let text;

  console.log(action);
  console.log(correctValue);

  if (action === correctValue) {
    text = "Correct! You are verified!";
  }
  else {
    text = "Failed! DENIED ACCESS!";
  }

  bot.sendMessage(msg.chat.id, text);
});

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = router;