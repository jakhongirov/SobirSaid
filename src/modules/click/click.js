const model = require('./model')
const iconv = require('iconv-lite');
const { bot, botPayment } = require('../../lib/bot')
const axios = require("axios")
const localText = require('../../../text.json')

module.exports = {
   Prepare: async (req, res) => {
      try {
         const { click_trans_id, amount, param2, param3, merchant_trans_id, error, error_note } = req.body
         let code = '';

         console.log(req.body)


         const makeCode = (length) => {
            let characters = '0123456789';
            let charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
               code += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
         }

         if (error_note === 'Success') {
            if (merchant_trans_id == "SobirSaid") {
               console.log(amount)
               if (Number(amount) == 97000) {
                  await model.addTransaction(click_trans_id, amount, param2, merchant_trans_id, error, error_note, param3, "prepare")
               } else {
                  console.log(amount)
                  return res.json({
                     error_code: 400,
                     error_note: "Неверная сумма."
                  })
               }
            }
         }

         makeCode(4)

         return res.status(200).json({
            merchant_prepare_id: code,
            merchant_trans_id: merchant_trans_id,
            click_trans_id: click_trans_id,
            error: error,
            error_note: error_note
         })

      } catch (error) {
         console.log(error)
         res.status(500).json({
            status: 500,
            message: "Internal Server Error",
         })
      }
   },

   Complete: async (req, res) => {
      try {
         const { click_trans_id, merchant_trans_id, amount, param2, param3, error, error_note } = req.body

         if (error_note === 'Success') {
            if (merchant_trans_id == "SobirSaid") {
               await model.editTrans(click_trans_id, 'paid')

               if (param3 == "Spreylarsiz hayot") {
                  await model.userPaid(param2)
                  bot.sendMessage(param2, localText.lessonLink, {
                     parse_mode: "HTML",
                  }).then(async () => {
                     await botPayment.sendMessage(1373142208, `CLICK:\n\nChat_id:${param2}\nTarif:${param3}\nAmount:${amount}`)
                     await botPayment.sendMessage(634041736, `CLICK:\n\nChat_id:${param2}\nTarif:${param3}\nAmount:${amount}`)
                     await botPayment.sendMessage(772457382, `CLICK:\n\nChat_id:${param2}\nTarif:${param3}\nAmount:${amount}`)
                  })
               }

            } else {
               const url = 'http://185.217.131.150:777/api/v1/invoice'; // The API endpoint
               const data = {
                  userId: param2,
                  botId: merchant_trans_id,
                  amount: amount,
                  tariffId: param3
               }; // The data you want to send

               axios.post(url, data)
                  .then(response => {
                     console.log('Response Data:', response.data);
                  })
                  .catch(error => {
                     console.error('Error:', error);
                  });
            }
         }

         return res.status(200).json({
            merchant_prepare_id: 5,
            merchant_trans_id: merchant_trans_id,
            click_trans_id: click_trans_id,
            merchant_confirm_id: null,
            error: error,
            error_note: error_note
         })
      } catch (error) {
         console.log(error)
         res.status(500).json({
            status: 500,
            message: "Internal Server Error",
         })
      }
   }
}