const { fetch, fetchALL } = require('../../lib/postgres')

const addTransaction = (
   click_trans_id,
   amount,
   param2,
   merchant_trans_id,
   error,
   error_note,
   tarif,
   status
) => {
   const QUERY = `
      INSERT INTO
         transactions (
            click_id,
            amount,
            chat_id,
            merchant_id,
            error,
            error_note,
            tarif,
            status
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      click_trans_id,
      amount,
      param2,
      merchant_trans_id,
      error,
      error_note,
      tarif,
      status
   )
}
const foundTrans = (click_trans_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         transactions
      WHERE
         click_id = $1;
   `;

   return fetch(QUERY, click_trans_id)
}
const editTrans = (click_trans_id, status) => {
   const QUERY = `
      UPDATE
         transactions
      SET
         status = $2
      WHERE
         click_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, click_trans_id, status)
}
const userPaid = (chat_id) => {
   const QUERY = `
      UPDATE
         users
      SET
         paid = true
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chat_id)
}

module.exports = {
   addTransaction,
   foundTrans,
   editTrans,
   userPaid
}