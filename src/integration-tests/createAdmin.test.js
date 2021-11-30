const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const mongoDBMock = require('./connectionMock');
const app = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /users/admin', () => {
  let connectionMock;
  let db;
  let users;

  const userAdminMock = {
    name: 'Usuário Admin',
    email: 'testeadmin@email.com',
    password: 'senha123',
    role: 'admin',
  };

  const newAdminMock = {
    name: 'Novo Usuário Admin',
    email: 'testeadminnovo@email.com',
    password: 'senha123',
    role: 'admin',
  }

  const userMock = {
    name: 'Usuário',
    email: 'teste@email.com',
    password: 'senha123',
    role: 'user',
  }

  before(async () => {
    connectionMock = await mongoDBMock.connection();

    sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);

    db = await connectionMock.db('Cookmaster');
    users = await db.collection('users');

    users.insertMany([userAdminMock, userMock]);
  });

  after(async () => {
    MongoClient.connect.restore();
    await users.deleteMany({});
  });

  describe('quando o usuário não é admin', () => {
    let response = {};

    before(async () => {
      const { body: { token } } = await chai.request(app)
        .post('/login')
        .send({
          email: 'teste@email.com',
          password: 'senha123',
        });
      
      response = await chai.request(app)
        .post('/users/admin')
        .set('Authorization', token)
        .send(newAdminMock)
    });

    it('retorna o código de status 403', () => {
      expect(response).to.have.status(403);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('a propriedade "message" possui o texto "Only admins can register new admins"', () => {
      expect(response.body.message).to.be.equal('Only admins can register new admins');
    });
  });

  describe('quando o usuário é admin', () => {
    let response = {};

    before(async () => {
      const { body: { token } } = await chai.request(app)
        .post('/login')
        .send({
          email: 'testeadmin@email.com',
          password: 'senha123',
        });
      
      response = await chai.request(app)
        .post('/users/admin')
        .set('Authorization', token)
        .send(newAdminMock)
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