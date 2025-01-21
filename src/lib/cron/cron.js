const model = require('./model')
const localText = require('../../../text.json')
const {
   bot
} = require('../bot')

const sendText = async () => {
   const usersList = await model.usersList()

   for (const user of usersList) {
      const text = `m=66ba0b7a9412202b2cc2e5aa;ac.user_id=${user?.chat_id};ac.tarif=Spreylarsiz%20hayot;ac.ilova=SobirSaid;a=9700000`;
      const base64Encoded = btoa(text);
      const content = localText.everyDay?.replace(/%name%/g, user?.name)
      bot.sendMessage(user?.chat_id, localText.everyDay, {
         reply_markup: {
            inline_keyboard: [
               [
                  {
                     text: localText.clickBtn,
                     url: `https://my.click.uz/services/pay?merchant_id=34135&service_id=64727&transaction_param=SobirSaid&additional_param3=${user?.chat_id}&amount=97000&additional_param4=Spreylarsiz%20hayot`
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
   }
}

module.exports = {
   sendText
}