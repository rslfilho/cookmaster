const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const mongoDBMock = require('./connectionMock');
const app = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /users', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await mongoDBMock.connection();

    sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
    const db = await connectionMock.db('Cookmaster');
    const users = await db.collection('users');
    await users.deleteMany({});
  });

  describe('Quando o campo "name" não vem na requisição', () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .post('/users')
        .send({
          name: '',
          email: 'email@email.com',
          password: 'senha123',
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

    it('a propriedade "message" possui o texto "Invalid entries. Try again."',
      () => {
        expect(response.body.message)
          .to.be.equal('Invalid entries. Try again.');
      });
  });

  describe('Quando o campo "email" não vem na requisição', () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .post('/users')
        .send({
            name: 'Usuário',
            email: '',
            password: 'senha123',
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

    it('a propriedade "message" possui o texto "Invalid entries. Try again."',
      () => {
        expect(response.body.message)
          .to.be.equal('Invalid entries. Try again.');
      });
  });

  describe('Quando o campo "email" não é válido', () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .post('/users')
        .send({
            name: 'Teste',
            email: 'email@email',
            password: 'senha123',
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

    it('a propriedade "message" possui o texto "Invalid entries. Try again."',
      () => {
        expect(response.body.message)
          .to.be.equal('Invalid entries. Try again.');
      });
  });

  describe('Quando o campo "password" não vem na requisição', () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .post('/users')
        .send({
            name: '',
            email: 'email@email.com',
            password: '',
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

    it('a propriedade "message" possui o texto "Invalid entries. Try again."',
      () => {
        expect(response.body.message)
          .to.be.equal('Invalid entries. Try again.');
      });
  });

  describe('Quando o campo "email" não é único', () => {
    let response = {};

    before(async () => {
      await chai.request(app)
        .post('/users')
        .send({
            name: 'Usuário',
            email: 'email@email.com',
            password: 'senha123',
        });

      response = await chai.request(app)
        .post('/users')
        .send({
            name: 'Usuário',
            email: 'email@email.com',
            password: 'senha123',
        });
    });

    it('retorna o código de status 409', () => {
      expect(response).to.have.status(409);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('a propriedade "message" possui o texto "Email already registered"',
      () => {
        expect(response.body.message)
          .to.be.equal('Email already registered');
      });
  });

  describe('Quando a requisição vem correta', () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .post('/users')
        .send({
            name: 'Roberval Filho',
            email: 'rslfilho@teste.ocm',
            password: 'senha123',
        });
    });

    it('retorna o código de status 201', () => {
      expect(response).to.have.status(201);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade "user"', () => {
      expect(response.body).to.have.property('user');
    });

    it('a propriedade "user" é um objeto', () => {
      expect(response.body.user).to.be.an('object');
    });

    it('o objecto "user" possui as chaves "_id", "name", "email", "role"', () => {
      expect(response.body.user).to.have.all.keys('_id', 'name', 'email', 'role');
    });
  });
});