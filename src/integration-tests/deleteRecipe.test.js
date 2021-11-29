const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const mongoDbMock = require('./connectionMock');
const app = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;

describe.only('DELETE /recipes/:id', () => {
  let token;
  let connectionMock;
  const recipeMock = {
    name: 'Receita Teste',
    ingredients: 'Farinha, Manteiga e Açucar',
    preparation: 'Farinha + Manteiga e depois Açucar',
  };

  before(async () => {
    connectionMock = await mongoDbMock.connection();

    sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);

    await chai.request(app)
      .post('/users')
      .send({
        name: 'Usuário Deleta Mensagem',
        email: 'deletamensagem@teste.com',
        password: 'senha123',
      });
    
    const response = await chai.request(app)
      .post('/login')
      .send({
        email: 'deletamensagem@teste.com',
        password: 'senha123',
      });
    
    token = response.body.token;

    await chai.request(app)
      .post('/recipes')
      .set()
  });

  after(async () => {
    MongoClient.connect.restore();
    await connectionMock.db('Cookmaster').collection('recipes').deleteMany({});
  });

  describe('quando o usuário não tá autenticado', () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .
    });
  });
});
