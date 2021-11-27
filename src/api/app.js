require('dotenv').config();
const express = require('express');

const root = require('../controllers/root');
const { error } = require('../middlewares');

const app = express();

app.use(express.json());

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.use('/', root);

app.use(error);

module.exports = app;
