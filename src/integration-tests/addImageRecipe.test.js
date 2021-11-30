const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const fs = require('fs');

const mongoDBMock = require('./connectionMock');
const app = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;

describe('PUT /recipes/:id/image', () => {
  let token;
  let recipeId;
  let connectionMock;
  let db;

  const adminMock = {
    name: 'Admin Add Image Receita',
    email: 'adminimage@email.com',
    password: 'senha123',
    role: 'admin',
  };

  const userMock = {
    name: 'Usuário Add Imagem Mensagem',
    email: 'addImagem@teste.com',
    password: 'senha123',
    role: 'user',
  };

  const anotherUserMock = {
    name: 'Usuário Não Criador',
    email: 'notAddImagem@teste.com',
    password: 'senha123',
    role: 'user',
  };
  
  const recipeMock = {
    name: 'Receita Teste',
    ingredients: 'Farinha, Manteiga e Açucar',
    preparation: 'Farinha + Manteiga e depois Açucar',
  };

  before(async () => {
    connectionMock = await mongoDBMock.connection();

    sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);

    db = await connectionMock.db('Cookmaster');

    await db.collection('users').insertMany([userMock, anotherUserMock, adminMock]);
    
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

  describe('quando o usuário não é o criador da imagem', () => {
    let response = {};

    before(async () => {
      const { body: { token: wrongUserToken } } = await chai.request(app)
      .post('/login')
      .send({
        email: 'notAddImagem@teste.com',
        password: 'senha123',
      });

      response = await chai.request(app)
        .put(`/recipes/${recipeId}/image`)
        .set('Authorization', wrongUserToken)
        .attach('image', fs.createReadStream('./src/uploads/ratinho.jpg'), 'ratinho.jpg');
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

    it('a propriedade "message" possui o texto "user is not the creator of recipe or admin"', () => {
      expect(response.body.message).to.be.equal('user is not the creator of recipe or admin');
    });
  });

  describe('quando o usuário é o criador da imagem', () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .put(`/recipes/${recipeId}/image`)
        .set('Authorization', token)
        .attach('image', fs.createReadStream('./src/uploads/ratinho.jpg'), 'ratinho.jpg');
    });

    it('retorna o código de status 200', () => {
      expect(response).to.have.status(200);
    });

    it('a propriedade "recipe" é um objeto', () => {
      expect(response.body).to.be.an('object');
    });

    it('o objecto "recipe" possui as chaves "_id", "name", "ingredients", "preparation", "userId" e "image"', () => {
      expect(response.body).to.have.all.keys('_id', 'name', 'ingredients', 'preparation', 'userId', 'image');
    });
  });

  describe('quando o usuário é admin', () => {
    let response = {};

    before(async () => {
      const { body: { token: adminToken } } = await chai.request(app)
      .post('/login')
      .send({
        email: 'adminimage@email.com',
        password: 'senha123',
      });

      response = await chai.request(app)
        .put(`/recipes/${recipeId}/image`)
        .set('Authorization', adminToken)
        .attach('image', fs.createReadStream('./src/uploads/ratinho.jpg'), 'ratinho.jpg');
    });

    it('retorna o código de status 200', () => {
      expect(response).to.have.status(200);
    });

    it('a propriedade "recipe" é um objeto', () => {
      expect(response.body).to.be.an('object');
    });

    it('o objecto "recipe" possui as chaves "_id", "name", "ingredients", "preparation", "userId" e "image"', () => {
      expect(response.body).to.have.all.keys('_id', 'name', 'ingredients', 'preparation', 'userId', 'image');
    });
  });
});
