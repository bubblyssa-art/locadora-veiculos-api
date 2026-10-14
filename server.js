require('dotenv').config();
const app = require('./app');
const porta = process.env.PORT || 3000;

app.listen(porta, () => {
  console.log(`API da Locadora de Veículos executando em http://localhost:${porta}`);
});
