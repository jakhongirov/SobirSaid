const {
   fetchALL
} = require('../postgres')

const usersList = () => {
   const QUERY = `
      SELECT 
         * 
      FROM 
         users
      WHERE 
         paid = false
         and create_at::date = CURRENT_DATE - INTERVAL '1 day';
   `;

   return fetchALL(QUERY)
}

module.exports = {
   usersList
}