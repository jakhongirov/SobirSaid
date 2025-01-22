require('dotenv').config()
const express = require("express");
const cors = require("cors");
const path = require('path')
const fs = require('fs');
const app = express();
const router = require("./src/modules");
const { PORT } = require('./src/config')
const localText = require('./text.json')
const model = require('./model')
const { bot } = require('./src/lib/bot');
const {
   CronJob
} = require('cron');
const {
   sendText
} = require('./src/lib/cron/cron');

const processedMessages = new Set();

bot.onText(/\/start/, async (msg) => {
   const chatId = msg.chat.id;
   const username = msg.from.first_name;
   const messageId = msg.message_id;
   const foundUser = await model.foundUser(chatId)

   if (processedMessages.has(messageId)) return;
   processedMessages.add(messageId);

   bot.copyMessage(chatId, process.env.CHANNEL_ID, 8, {
      reply_markup: {
         keyboard: [
            [
               {
                  text: localText.channelBtn
               }
            ], [
               {
                  text: localText.adminBtn
               }
            ]
         ],
         resize_keyboard: true
      }
   }).then(async () => {
      const text = `m=66ba0b7a9412202b2cc2e5aa;ac.user_id=${chatId};ac.tarif=Spreylarsiz%20hayot;ac.ilova=SobirSaid;a=9700000`;
      const base64Encoded = btoa(text);
      bot.sendMessage(chatId, localText.mainText, {
         parse_mode: "HTML",
         reply_markup: {
            inline_keyboard: [
               [
                  {
                     text: localText.clickBtn,
                     url: `https://my.click.uz/services/pay?merchant_id=28389&service_id=64885&transaction_param=SobirSaid&additional_param3=${chatId}&amount=97000&additional_param4=Spreylarsiz%20hayot`
                  }
               ],
               [
                  {
                     text: localText.paymeBtn,
                     url: `https://checkout.paycom.uz/${base64Encoded}`
                  }
               ]
            ]
         }
      }).then(async () => {
         if (!foundUser) {
            await model.addUser(chatId, username)
         }
      })
   })
})

bot.on('message', async (msg) => {
   const chatId = msg.chat.id;
   const text = msg.text;

   if (text == localText.channelBtn) {
      bot.sendMessage(chatId, localText.channelText, {
         parse_mode: "HTML",
      })
   } else if (text == localText.adminBtn) {
      bot.sendMessage(chatId, localText.adminText, {
         parse_mode: "HTML",
      })
   }
})

app.use(cors({
   origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({
   extended: true
}));
app.use('/file', express.static(path.resolve(__dirname, 'file')))
app.use("/api/v1", router);

const job = new CronJob('0 16 * * *', async () => {
   await sendText();
});

// Start the job
job.start();

app.listen(PORT, console.log(PORT))