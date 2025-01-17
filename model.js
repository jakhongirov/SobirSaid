const { fetch } = require('./src/lib/postgres')

const foundUser = (chatId) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         chat_id = $1
   `;

   return fetch(QUERY, chatId)
}
const addUser = (chatId, phoneNumber, name) => {
   const QUERY = `
      INSERT INTO
         users (
            chat_id,
            phone_number,
            name
         ) VALUES (
            $1,
            $2,
            $3
         ) RETURNING *;
   `;

   return fetch(QUERY, chatId, phoneNumber, name)
}

module.exports = {
   foundUser,
   addUser
}