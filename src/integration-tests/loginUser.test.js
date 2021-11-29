const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const mongoDBMock = require('./connectionMock');
const { validateToken } = require('../helpers/jwtValidation');
const app = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /login', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await mongoDBMock.connection();

    sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);
    
    await chai.request(app)
    .post('/users')
    .send({
      name: 'Usuário Teste',
      email: 'usuario@teste.com',
      password: 'senha123',
    });
  });

  after(async () => {
    MongoClient.connect.restore();
    const db = await connectionMock.db('Cookmaster');
    const users = await db.collection('users');
    const recipes = await db.collection('recipes');
    await users.deleteMany({});
    await recipes.deleteMany({});
  });

  describe('Quando o campo "email" não vem na requisição', () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .post('/login')
        .send({
          email: '',
          password: 'senha123',
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

    it('a propriedade "message" possui o texto "All fields must be filled"', () => {
      expect(response.body.message).to.be.equal('All fields must be filled');
    });
  });

  describe('Quando o campo "password" não vem na requisição', () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .post('/login')
        .send({
          email: 'usuario@teste.com',
          password: '',
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

    it('a propriedade "message" possui o texto "All fields must be filled"', () => {
      expect(response.body.message).to.be.equal('All fields must be filled');
    });
  });

  describe('Quando o campo "email" não é válido', () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .post('/login')
        .send({
          email: 'usuario@teste',
          password: 'senha123',
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

    it('a propriedade "message" possui o texto "Incorrect username or password"', () => {
      expect(response.body.message).to.be.equal('Incorrect username or password');
    });
  });

  describe('Quando o campo "password" não é válido', () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .post('/login')
        .send({
          email: 'usuario@teste.com',
          password: 'senha',
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

    it('a propriedade "message" possui o texto "Incorrect username or password"', () => {
      expect(response.body.message).to.be.equal('Incorrect username or password');
    });
  });

  describe('Quando a requisição vem correta', () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .post('/login')
        .send({
          email: 'usuario@teste.com',
          password: 'senha123',
        });
    });

    it('retorna o código de status 200', () => {
      expect(response).to.have.status(200);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade "token"', () => {
      expect(response.body).to.have.property('token');
    });

    it('a propriedade "token" é uma string', () => {
      expect(response.body.token).to.be.a('string');
    });

    it('o token é válido', () => {
      const data = validateToken(response.body.token);
      expect(data).to.be.an('object');
    });
  });
});