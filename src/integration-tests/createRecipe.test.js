const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const mongoDBMock = require('./connectionMock');
const app = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /recipes', () => {
  let token;
  let connectionMock;

  before(async () => {
    connectionMock = await mongoDBMock.connection();

    sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);

    await chai.request(app)
      .post('/users')
      .send({
        name: 'Usuário Teste',
        email: 'email@teste.com',
        password: 'senha123',
      });
    
    const response = await chai.request(app)
      .post('/login')
      .send({
        email: 'email@teste.com',
        password: 'senha123',
      });
    
    token = response.body.token;
  });

  after(async () => {
    MongoClient.connect.restore();
    const db = await connectionMock.db('Cookmaster');
    const users = await db.collection('users');
    const recipes = await db.collection('recipes');
    await users.deleteMany({});
    await recipes.deleteMany({});
  });

  describe('Quando o campo "name" não vem na requisição', () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .post('/recipes')
        .set('Authorization', token)
        .send({
          name: '',
          ingredients: 'Farinha, Manteiga e Açucar',
          preparation: 'Farinha + Manteiga e depois Açucar',
        });
    });

    it('retorna o código de status 400', () => {
      expect(response).to.have.status(400);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('a propriedade "message" possui o texto "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  describe('Quando o campo "ingredients" não vem na requisição', () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .post('/recipes')
        .set('Authorization', token)
        .send({
          name: 'Receita Teste',
          ingredients: '',
          preparation: 'Farinha + Manteiga e depois Açucar',
        });
    });

    it('retorna o código de status 400', () => {
      expect(response).to.have.status(400);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('a propriedade "message" possui o texto "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  describe('Quando o campo "preparation" não vem na requisição', () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .post('/recipes')
        .set('Authorization', token)
        .send({
          name: 'Receita Teste',
          ingredients: 'Farinha, Manteiga e Açucar',
          preparation: '',
        });
    });

    it('retorna o código de status 400', () => {
      expect(response).to.have.status(400);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('a propriedade "message" possui o texto "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  describe('Quando o "token" não é válido', () => {
    let response = {};
    const invalidToken = ')9jd0a9J9ds0fj-(J-dadf-k';

    before(async () => {
      response = await chai.request(app)
        .post('/recipes')
        .set('Authorization', invalidToken)
        .send({
          name: 'Receita Teste',
          ingredients: 'Farinha, Manteiga e Açucar',
          preparation: 'Farinha + Manteiga e depois Açucar',
        });
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

    it('a propriedade "message" possui o texto "jwt malformed"', () => {
      expect(response.body.message).to.be.equal('jwt malformed');
    });
  });

  describe('Quando a requisição vem correta', () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .post('/recipes')
        .set('Authorization', token)
        .send({
          name: 'Receita Teste',
          ingredients: 'Farinha, Manteiga e Açucar',
          preparation: 'Farinha + Manteiga e depois Açucar',
        });
    });

    it('retorna o código de status 201', () => {
      expect(response).to.have.status(201);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade "recipe"', () => {
      expect(response.body).to.have.property('recipe');
    });

    it('a propriedade "recipe" é um objeto', () => {
      expect(response.body.recipe).to.be.an('object');
    });

    it('o objecto "recipe" possui as chaves "_id", "name", "ingredients", "preparation" e "userId', () => {
      expect(response.body.recipe).to.have.all.keys('_id', 'name', 'ingredients', 'preparation', 'userId');
    });
  });
});
