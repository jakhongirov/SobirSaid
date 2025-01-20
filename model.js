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
const addUser = (chatId, name) => {
   const QUERY = `
      INSERT INTO
         users (
            chat_id,
            name
         ) VALUES (
            $1,
            $2
         ) RETURNING *;
   `;

   return fetch(QUERY, chatId, name)
}

module.exports = {
   foundUser,
   addUser
}