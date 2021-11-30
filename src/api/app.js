require('dotenv').config();
const express = require('express');
const path = require('path');

const root = require('../controllers/root');
const { error } = require('../middlewares');

const app = express();

app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../uploads')));

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.use('/', root);

app.use(error);

module.exports = app;
