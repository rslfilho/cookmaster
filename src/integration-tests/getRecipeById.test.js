const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const mongoDBMock = require('./connectionMock');
const app = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /recipes/:id', () => {
  let connectionMock;
  let recipeId;
  const recipeMock1 = {
    name: 'Receita Teste 1',
    ingredients: 'Farinha, Manteiga e Açucar',
    preparation: 'Farinha + Manteiga e depois Açucar',
  };

  before(async () => {
    connectionMock = await mongoDBMock.connection();

    sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);

    await chai.request(app)
      .post('/users')
      .send({
        name: 'Teste Criação de receita',
        email: 'criareceita@teste.com',
        password: 'senha123',
      });
    
    const { body: { token } } = await chai.request(app)
      .post('/login')
      .send({
        email: 'criareceita@teste.com',
        password: 'senha123',
      });

    const { body: { recipe: { _id } } } = await chai.request(app)
      .post('/recipes')
      .set('Authorization', token)
      .send(recipeMock1);

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
  
  describe('não será possível listar uma receita pelo ID', () => {
    describe('quando a receita não existe', () => {
      let response;
      const invalidId = '507f1f77bcf86cd799439011';

      before(async () => {
        response = await chai.request(app)
          .get(`/recipes/${invalidId}`);
      });

      it('retorna o código de status 404', () => {
        expect(response).to.have.status(404);
      });
  
      it('retorna um objeto', () => {
        expect(response.body).to.be.a('object');
      });
  
      it('o objeto possui a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });
  
      it('a propriedade "message" possui o texto "recipe not found"', () => {
        expect(response.body.message).to.be.equal('recipe not found');
      });
    });
  });

  describe('será possível listar uma receita pelo ID', () => {
    describe('quando o usuário não está logado (autenticado)', () => {
      let response;
      
      before(async () => {
        response = await chai.request(app)
          .get(`/recipes/${recipeId}`);
      });

      it('retorna o código de status 200', () => {
        expect(response).to.have.status(200);
      });
  
      it('retorna um objeto', () => {
        expect(response.body).to.be.an('object');
      });
  
      it('o objeto do array ter as chaves "_id", "ingredients", "name", "preparation" e "userId"', () => {
        expect(response.body).to.have.all
          .keys('_id', 'ingredients', 'name', 'preparation', 'userId');
      });
    });

    describe('quando o usuário está logado (autenticado)', () => {
      let response;
      
      before(async () => {
        const { body: { token } } = await chai.request(app)
          .post('/login')
          .send({
            email: 'criareceita@teste.com',
            password: 'senha123',
          });
        
        response = await chai.request(app)
          .get(`/recipes/${recipeId}`)
          .set('Authorization', token)
      });

      it('retorna o código de status 200', () => {
        expect(response).to.have.status(200);
      });
  
      it('retorna um objeto', () => {
        expect(response.body).to.be.an('object');
      });
  
      it('o objeto do array ter as chaves "_id", "ingredients", "name", "preparation" e "userId"', () => {
        expect(response.body).to.have.all
          .keys('_id', 'ingredients', 'name', 'preparation', 'userId');
      });
    });
  });
});
