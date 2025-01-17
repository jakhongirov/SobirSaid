const { fetch, fetchALL } = require('../../lib/postgres')

const foundUser = (chat_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         chat_id = $1
   `;

   return fetch(QUERY, chat_id)
}
const foundTransaction = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         payme
      WHERE
         transaction = $1;
   `;

   return fetch(QUERY, id)
};
const updateTransaction = (id, state, reason) => {
   const QUERY = `
      UPDATE
         payme
      SET
         state = $2,
         reason = $3
      WHERE
         transaction = $1
      RETURNING *;
   `;

   return fetch(QUERY, id, state, reason)
}
const addTransaction = (
   chat_id,
   tarif,
   state,
   amount,
   id,
   time
) => {
   const QUERY = `
      INSERT INTO
         payme (
            chat_id,
            payment,
            state,
            amount,
            transaction,
            create_time
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      chat_id,
      tarif,
      state,
      amount,
      id,
      time
   )
};
const updateTransactionPerform = (
   id,
   state,
   reason,
   currentTime
) => {
   const QUERY = `
      UPDATE
         payme
      SET
         state = $2,
         reason = $3,
         cancel_time = $4
      WHERE
         transaction = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      id,
      state,
      reason,
      currentTime
   )
}
const updateTransactionPaid = (
   id,
   state,
   currentTime
) => {
   const QUERY = `
      UPDATE
         payme
      SET
         state = $2,
         perform_time = $3
      WHERE
         transaction = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      id,
      state,
      currentTime
   )
}
const updateTransactionState = (
   id,
   state,
   reason,
   currentTime
) => {
   const QUERY = `
      UPDATE
         payme
      SET
         state = $2,
         reason = $3,
         cancel_time = $4
      WHERE
         transaction = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      id,
      state,
      reason,
      currentTime
   )
};
const foundTransactionList = (from, to) => {
   const QUERY = `
      SELECT
         *
      FROM
         payme
      WHERE
         create_time >= $1 AND create_time <= $2;
   `;

   return fetchALL(QUERY, from, to)
}

module.exports = {
   foundUser,
   foundTransaction,
   updateTransaction,
   addTransaction,
   updateTransactionPerform,
   updateTransactionPaid,
   updateTransactionState,
   foundTransactionList
}