const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const mongoDBMock = require('./connectionMock');
const app = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;

describe('PUT /recipes/:id', () => {
  let token;
  let connectionMock;
  let recipeId;
  const recipeMock = {
    name: 'Receita Teste',
    ingredients: 'Farinha, Manteiga e Açucar',
    preparation: 'Farinha + Manteiga e depois Açucar',
  };
  const recipeUpdateMock = {
    name: 'Receita Teste 33',
    ingredients: 'Farinha, Manteiga e Açucar',
    preparation: 'Farinha + Manteiga e depois Açucar 123',
  };
  const adminMock = {
    name: 'Admin Deleta Receita',
    email: 'adminedita@email.com',
    password: 'senha123',
    role: 'admin',
  };

  before(async () => {
    connectionMock = await mongoDBMock.connection();

    sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);

    await connectionMock.db('Cookmaster').collection('users').insertOne(adminMock);
    
    await chai.request(app)
      .post('/users')
      .send({
        name: 'Usuário Edita Mensagem',
        email: 'editamensagem@teste.com',
        password: 'senha123',
      });
    
    const response = await chai.request(app)
      .post('/login')
      .send({
        email: 'editamensagem@teste.com',
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
        .put(`/recipes/${recipeId}`);
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

  describe('quando o token enviado é invalido', () => {
    let response = {};
    const invalidToken = 'Dfasdjfn;JNf;djsaf;NLkfdajf;'

    before(async () => {
      response = await chai.request(app)
        .put(`/recipes/${recipeId}`)
        .set('Authorization', invalidToken);
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

  describe('quando o usuário está autenticado e é o criador da receita', () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .put(`/recipes/${recipeId}`)
        .set('Authorization', token)
        .send(recipeUpdateMock);
    });

    it('retorna o código de status 200', () => {
      expect(response).to.have.status(200);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    });

    it('o objecto "recipe" possui as chaves "_id", "name", "ingredients", "preparation" e "userId', () => {
      expect(response.body).to.have.all.keys('_id', 'name', 'ingredients', 'preparation', 'userId');
    });
  });

  describe('quando o usuário está autenticado e é um admin', () => {
    let response = {};

    before(async () => {
      const { body: { token: adminToken } } = await chai.request(app)
        .post('/login')
        .send({
          email: 'adminedita@email.com',
          password: 'senha123',
        });
      
      response = await chai.request(app)
        .put(`/recipes/${recipeId}`)
        .set('Authorization', adminToken)
        .send(recipeUpdateMock);
    });

    it('retorna o código de status 200', () => {
      expect(response).to.have.status(200);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    });

    it('o objecto "recipe" possui as chaves "_id", "name", "ingredients", "preparation" e "userId', () => {
      expect(response.body).to.have.all.keys('_id', 'name', 'ingredients', 'preparation', 'userId');
    });
  });
});
