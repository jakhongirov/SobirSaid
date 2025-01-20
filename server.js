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

bot.onText(/\/start/, async (msg) => {
   const chatId = msg.chat.id;
   const username = msg.from.first_name;
   const foundUser = await model.foundUser(chatId)

   console.log(foundUser)

   if (foundUser) {
      console.log("bbb")

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
            ]
         }
      }).then(async () => {
         const text = `m=66ba0b7a9412202b2cc2e5aa;ac.user_id=${chatId};ac.tarif=Burun%20kursi;ac.ilova=SobirSaid;a=9700000`;
         const base64Encoded = btoa(text);
         bot.sendMessage(chatId, localText.mainText, {
            reply_markup: {
               inline_keyboard: [
                  [
                     {
                        text: localText.clickBtn,
                        url: `https://my.click.uz/services/pay?merchant_id=34135&service_id=64727&transaction_param=SobirSaid&additional_param3=${chatId}&amount=97000&additional_param4=Burun%20kursi`
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
         })
      })
   } else {
      console.log("aaa")
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
            ]
         }
      }).then(async () => {
         const text = `m=66ba0b7a9412202b2cc2e5aa;ac.user_id=${chatId};ac.tarif=Burun%20kursi;ac.ilova=SobirSaid;a=9700000`;
         const base64Encoded = btoa(text);
         bot.sendMessage(chatId, localText.mainText, {
            reply_markup: {
               inline_keyboard: [
                  [
                     {
                        text: localText.clickBtn,
                        url: `https://my.click.uz/services/pay?merchant_id=34135&service_id=64727&transaction_param=SobirSaid&additional_param3=${chatId}&amount=97000&additional_param4=Burun%20kursi`
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
            await model.addUser(chatId, username)
         })
      })
   }

})

bot.on('message', async (msg) => {
   const chatId = msg.chat.id;
   const text = msg.text;

   if (text == localText.channelBtn) {
      bot.sendMessage(chatId, localText.channelText)
   } else if (text == localText.adminBtn) {
      bot.sendMessage(chatId, localText.adminText)
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


app.listen(PORT, console.log(PORT))