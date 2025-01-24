require('dotenv').config();
const model = require('./model')
const { bot, botPayment } = require('../../lib/bot')
const localText = require('../../../text.json')

module.exports = {
   PAYMENT: async (req, res) => {
      try {
         const { method, params, id } = req.body;

         if (method == "CheckPerformTransaction") {
            console.log("CheckPerformTransaction", req.body)
            const foundUser = await model.foundUser(params?.account?.user_id)

            if (params?.amount == 9700000) {
               console.log(foundUser, params?.amount)
               if (foundUser) {
                  return res.status(200).json({
                     result: {
                        allow: true
                     }
                  })
               } else {
                  return res.json({
                     error: {
                        name: "UserNotFound",
                        code: -31099,
                        message: {
                           uz: "Biz sizning hisobingizni topolmadik.",
                           ru: "Мы не нашли вашу учетную запись",
                           en: "We couldn't find your account",
                        }
                     },
                     id: id
                  })
               }
            } else {
               return res.json({
                  error: {
                     name: "InvalidAmount",
                     code: -31001,
                     message: {
                        uz: "Noto'g'ri summa.",
                        ru: "Неверная сумма.",
                        en: "Incorrect amount.",
                     }
                  },
                  id: id
               });
            }

         } else if (method == "CreateTransaction") {
            console.log("CreateTransaction", req.body)

            let { amount } = params;
            amount = Math.floor(amount / 100);

            const transaction = await model.foundTransaction(params.id);
            const foundUser = await model.foundUser(params?.account?.user_id)
            if (transaction) {
               if (transaction.state !== 1) {
                  return res.json({
                     error: {
                        name: "CantDoOperation",
                        code: -31008,
                        message: {
                           uz: "Biz operatsiyani bajara olmaymiz",
                           ru: "Мы не можем сделать операцию",
                           en: "We can't do operation",
                        }
                     },
                     id: id
                  });
               }

               const currentTime = Date.now();
               const expirationTime = (currentTime - transaction.create_time) / 60000 < 12; // 12m
               if (!expirationTime) {
                  await model.updateTransaction(params.id, -1, 4,);
                  return res.json({
                     error: {
                        name: "CantDoOperation",
                        code: -31008,
                        message: {
                           uz: "Biz operatsiyani bajara olmaymiz",
                           ru: "Мы не можем сделать операцию",
                           en: "We can't do operation",
                        },
                     },
                     id: id
                  });
               }

               return res.json({
                  result: {
                     create_time: Number(transaction.create_time),
                     transaction: transaction.id,
                     state: 1,
                  }
               });
            }

            if (foundUser) {
               const newTransaction = await model.addTransaction(
                  params?.account?.user_id,
                  params?.account?.tarif,
                  1,
                  amount,
                  params.id,
                  params?.time
               );

               console.log(newTransaction)

               return res.json({
                  result: {
                     transaction: newTransaction.id,
                     state: 1,
                     create_time: Number(newTransaction.create_time),
                     receivers: null
                  }
               })
            } else {
               return res.json({
                  error: {
                     name: "UserNotFound",
                     code: -31099,
                     message: {
                        uz: "Biz sizning hisobingizni topolmadik.",
                        ru: "Мы не нашли вашу учетную запись",
                        en: "We couldn't find your account",
                     }
                  },
                  id: id
               })
            }

         } else if (method == "PerformTransaction") {
            console.log("PerformTransaction", req.body)

            const currentTime = Date.now();
            const transaction = await model.foundTransaction(params.id);
            if (!transaction) {
               return res.json({
                  error: {
                     name: "TransactionNotFound",
                     code: -31003,
                     message: {
                        uz: "Tranzaktsiya topilmadi",
                        ru: "Транзакция не найдена",
                        en: "Transaction not found",
                     }
                  },
                  id: id
               })
            }

            if (transaction.state !== 1) {
               if (transaction.state !== 2) {
                  return res.json({
                     error: {
                        name: "CantDoOperation",
                        code: -31008,
                        message: {
                           uz: "Biz operatsiyani bajara olmaymiz",
                           ru: "Мы не можем сделать операцию",
                           en: "We can't do operation",
                        }
                     },
                     id: id
                  })
               }

               return res.json({
                  result: {
                     perform_time: Number(transaction.perform_time),
                     transaction: transaction.id,
                     state: 2,
                  }
               });
            }

            const expirationTime = (currentTime - Number(transaction.create_time)) / 60000 < 12;

            if (!expirationTime) {
               await model.updateTransactionPerform(
                  params.id,
                  -1,
                  4,
                  currentTime,
               );

               return res.json({
                  error: {
                     name: "CantDoOperation",
                     code: -31008,
                     message: {
                        uz: "Biz operatsiyani bajara olmaymiz",
                        ru: "Мы не можем сделать операцию",
                        en: "We can't do operation",
                     }
                  },
                  id: id
               })
            }

            await model.updateTransactionPaid(
               params.id,
               2,
               currentTime,
            );


            if (transaction?.payment == "Spreylarsiz hayot") {
               await model.userPaid(transaction?.chat_id)
               bot.sendMessage(transaction?.chat_id, localText.lessonLink, {
                  parse_mode: "HTML",
               }).then(async () => {
                  await botPayment.sendMessage(1373142208, `PAYME:\n\nChat_id:${transaction?.chat_id}\nTarif:${transaction?.payment}\nAmount:${transaction?.amount}`)
                  await botPayment.sendMessage(634041736, `PAYME:\n\nChat_id:${transaction?.chat_id}\nTarif:${transaction?.payment}\nAmount:${transaction?.amount}`)
                  await botPayment.sendMessage(772457382, `PAYME:\n\nChat_id:${transaction?.chat_id}\nTarif:${transaction?.payment}\nAmount:${transaction?.amount}`)
               })
            }

            return res.json({
               result: {
                  perform_time: Number(currentTime),
                  transaction: transaction.id,
                  state: 2,
               }
            })


         } else if (method == "CancelTransaction") {
            console.log("CancelTransaction", req.body)

            const transaction = await model.foundTransaction(params.id);
            if (!transaction) {
               return res.json({
                  error: {
                     name: "TransactionNotFound",
                     code: -31003,
                     message: {
                        uz: "Tranzaktsiya topilmadi",
                        ru: "Транзакция не найдена",
                        en: "Transaction not found",
                     }
                  },
                  id: id
               })
            }

            const currentTime = Date.now();

            if (transaction.state > 0) {
               await model.updateTransactionState(
                  params.id,
                  -Math.abs(transaction.state),
                  params.reason,
                  currentTime,
               );
            }

            return res.json({
               result: {
                  cancel_time: Number(transaction.cancel_time) || Number(currentTime),
                  transaction: transaction.id,
                  state: -Math.abs(transaction.state),
               }
            })

         } else if (method == "CheckTransaction") {
            console.log("CheckTransaction", req.body)

            const transaction = await model.foundTransaction(params.id);
            if (!transaction) {
               return res.json({
                  error: {
                     name: "TransactionNotFound",
                     code: -31003,
                     message: {
                        uz: "Tranzaktsiya topilmadi",
                        ru: "Транзакция не найдена",
                        en: "Transaction not found",
                     },
                  },
                  id: id
               });
            }

            return res.status(200).json({
               result: {
                  create_time: transaction.create_time ? Number(transaction.create_time) : 0,
                  perform_time: transaction.perform_time ? Number(transaction.perform_time) : 0,
                  cancel_time: transaction.cancel_time ? Number(transaction.cancel_time) : 0,
                  transaction: transaction.id,
                  state: transaction.state,
                  reason: transaction.reason,
               }
            });
         } else if (method == "GetStatement") {
            console.log("GetStatement", req.body)
            const foundTransactionList = await model.foundTransactionList(params?.from, params?.to)

            if (foundTransactionList?.length > 0) {
               return res.json({
                  result: {
                     transactions: foundTransactionList.map((transaction) => {
                        return {
                           id: transaction.id,
                           time: new Date(transaction.transaction_create_at).getTime(),
                           amount: Number(transaction.amount * 1000),
                           account: {
                              user_id: transaction.chat_id,
                              tarif: transaction.payment,
                           },
                           create_time: Number(transaction.create_time) || 0,
                           perform_time: Number(transaction.perform_time) || 0,
                           cancel_time: Number(transaction.cancel_time) || 0,
                           transaction: transaction.transaction,
                           state: transaction.state,
                           reason: transaction.reason || null,
                        };
                     })
                  }
               })
            } else {
               return res.json({
                  result: {
                     transactions: []
                  }
               })
            }

         }

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },
}