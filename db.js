const mysql = require('mysql2/promise'); // Importeer de MySQL-promise-driver
require('dotenv').config(); 

// Maakt een connectiepool aan
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

//verbinding testen
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('db is geconnecteerd!');
    connection.release(); // Sluit de connectie af
  } catch (err) {
    console.error('Error met connectie naar db:', err.message);
  }
})();



module.exports = pool;