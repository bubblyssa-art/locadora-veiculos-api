require('dotenv').config();
const mysql = require('mysql');

const conexao = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'locadora_veiculos'
});

module.exports = conexao;
