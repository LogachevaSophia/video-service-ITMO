const mysql = require('mysql2');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: "sophiaVideo",
  password: "12145142Sl!",
  database: "videoServisePet",
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Access denied: check username/password');
    }
  }

  if (connection) connection.release();
});

module.exports = pool.promise();
