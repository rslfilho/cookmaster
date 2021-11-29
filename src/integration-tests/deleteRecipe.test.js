const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const mongoDBMock = require('./connectionMock');
const app = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;

describe('DELETE /recipes/:id', () => {
  let token;
  let connectionMock;
  let recipeId;
  let recipeId2;
  const recipeMock = {
    name: 'Receita Teste',
    ingredients: 'Farinha, Manteiga e Açucar',
    preparation: 'Farinha + Manteiga e depois Açucar',
  };
  const adminMock = {
    name: 'Admin Deleta Receita',
    email: 'admindeleta@email.com',
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

    const { body: { recipe: { _id } } } = await chai.request(app)
      .post('/recipes')
      .set('Authorization', token)
      .send(recipeMock)
    
    recipeId = _id;

    const { body: { recipe: { _id: _id2 } } } = await chai.request(app)
      .post('/recipes')
      .set('Authorization', token)
      .send(recipeMock)
    
    recipeId2 = _id2;
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
        .delete(`/recipes/${recipeId}`);
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

  describe('quando o usuário está autenticado e é o criador da receita', () => {
    let response = {};
    let response2 = {};

    before(async () => {
      response = await chai.request(app)
        .delete(`/recipes/${recipeId}`)
        .set('Authorization', token);

      response2 = await chai.request(app)
        .get(`/recipes/${recipeId}`);
    });

    // after(async () => {
    //   await connectionMock.db('Cookmaster').collection('users').deleteMany({});
    // })

    it('retorna o código de status 204', () => {
      expect(response).to.have.status(204);
    });

    it('a receita não está mais no banco de dados', () => {
      expect(response2).to.have.status(404);
    });
  });

  describe('quando o usuário está autenticado e é um admin', () => {
    let response = {};
    let response2 = {};

    before(async () => {
      // console.log(await connectionMock.db('Cookmaster').collection('recipes').find().toArray());
      // console.log(await connectionMock.db('Cookmaster').collection('users').find().toArray());
      const { body: { token: adminToken } } = await chai.request(app)
        .post('/login')
        .send({
          email: 'admindeleta@email.com',
          password: 'senha123',
        });
      
      response = await chai.request(app)
        .delete(`/recipes/${recipeId2}`)
        .set('Authorization', adminToken);

      response2 = await chai.request(app)
        .get(`/recipes/${recipeId}`);
    });

    it('retorna o código de status 204', () => {
      expect(response).to.have.status(204);
    });

    it('a receita não está mais no banco de dados', () => {
      expect(response2).to.have.status(404);
    });
  });
});
