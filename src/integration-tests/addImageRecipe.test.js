const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const mongoDBMock = require('./connectionMock');
const app = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;

describe('PUT /recipes/:id/image', () => {
  let token;
  let recipeId;
  let connectionMock;
  const adminMock = {
    name: 'Admin Add Image Receita',
    email: 'adminimage@email.com',
    password: 'senha123',
    role: 'admin',
  };
  const recipeMock = {
    name: 'Receita Teste',
    ingredients: 'Farinha, Manteiga e Açucar',
    preparation: 'Farinha + Manteiga e depois Açucar',
  } 

  before(async () => {
    connectionMock = await mongoDBMock.connection();

    sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);

    await connectionMock.db('Cookmaster').collection('users').insertOne(adminMock);

    await chai.request(app)
      .post('/users')
      .send({
        name: 'Usuário Add Imagem Mensagem',
        email: 'addImagem@teste.com',
        password: 'senha123',
      });
    
    const response = await chai.request(app)
    .post('/login')
    .send({
      email: 'addImagem@teste.com',
      password: 'senha123',
    });

    token = response.body.token;

    const { body: { recipe: { _id } } } = await chai.request(app)
      .post('/recipes')
      .set('Authorization', token)
      .send(recipeMock)
    
    recipeId = _id;
  });

  after(async () => {
    MongoClient.connect.restore();
    const db = await connectionMock.db('Cookmaster');
    const users = await db.collection('users');
    const recipes = await db.collection('recipes');
    await users.deleteMany({});
    await recipes.deleteMany({});
  });

  describe('quando o usuário não tá autenticado', () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .put(`/recipes/${recipeId}/image`);
    });

    it('retorna o código de status 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('a propriedade "message" possui o texto "missing auth token"', () => {
      expect(response.body.message).to.be.equal('missing auth token');
    });
  });
});
