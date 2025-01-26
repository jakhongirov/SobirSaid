const model = require('./model')
const localText = require('../../../text.json')
const {
   bot,
   botPayment
} = require('../bot')

const sendText = async () => {
   const usersList = await model.usersList()

   for (const user of usersList) {
      const text = `m=678e23fe1a1e9b19f9dcfb4e;ac.user_id=${user?.chat_id};ac.tarif=Spreylarsiz hayot;ac.ilova=SobirSaid;a=9700000`;
      const base64Encoded = btoa(text);
      const content = localText.everyDay?.replace(/%name%/g, user?.name)
      bot.sendMessage(user?.chat_id, content, {
         reply_markup: {
            inline_keyboard: [
               [
                  {
                     text: localText.clickBtn,
                     url: `https://my.click.uz/services/pay?merchant_id=28389&service_id=64885&transaction_param=SobirSaid&additional_param3=${user?.chat_id}&amount=97000&additional_param4=Spreylarsiz%20hayot`
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

const sendUserCount = async () => {
   const userCount = await model.userCount()
   const content = `User count: ${userCount?.count}`

   botPayment.sendMessage(1373142208, content)
   botPayment.sendMessage(634041736, content)
   botPayment.sendMessage(772457382, content)
}

module.exports = {
   sendText,
   sendUserCount
}