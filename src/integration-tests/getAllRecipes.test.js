const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const mongoDBMock = require('./connectionMock');
const app = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /recipes', () => {
  let connectionMock;
  const recipeMock1 = {
    name: 'Receita Teste 1',
    ingredients: 'Farinha, Manteiga e Açucar',
    preparation: 'Farinha + Manteiga e depois Açucar',
  };
  const recipeMock2 = {
    name: 'Receita Teste 2',
    ingredients: 'Farinha, Manteiga',
    preparation: 'Farinha + Manteiga e Fim',
  };

  before(async () => {
    connectionMock = await mongoDBMock.connection();

    sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);

    await connectionMock.db('Cookmaster').collection('recipes').deleteMany({});

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

    await chai.request(app)
      .post('/recipes')
      .set('Authorization', token)
      .send(recipeMock1);

    await chai.request(app)
      .post('/recipes')
      .set('Authorization', token)
      .send(recipeMock2);
  });

  after(async () => {
    MongoClient.connect.restore();
    const db = await connectionMock.db('Cookmaster');
    const users = await db.collection('users');
    const recipes = await db.collection('recipes');
    await users.deleteMany({});
    await recipes.deleteMany({});
  });

  describe('será possível listar todas as receitas cadastradas', () => {
    describe('quando o usuário não está logado (autenticado)', () => {
      let response;
      
      before(async () => {
        response = await chai.request(app)
          .get('/recipes');
      });

      it('retorna o código de status 200', () => {
        expect(response).to.have.status(200);
      });
  
      it('retorna um array', () => {
        expect(response.body).to.be.an('array');
      });
  
      it('o array possui 02 elementos', async () => {
        console.log(response.body);
        expect(response.body).to.have.length(2);
      });
  
      it('o primeiro elemento do array ter as chaves "_id", "ingredients", "name", "preparation" e "userId"', () => {
        expect(response.body[0]).to.have.all
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
          .get('/recipes')
          .set('Authorization', token)
      });

      it('retorna o código de status 200', () => {
        expect(response).to.have.status(200);
      });
  
      it('retorna um array', () => {
        expect(response.body).to.be.an('array');
      });
  
      it('o array possui 02 elementos', () => {
        expect(response.body).to.have.length(2);
      });
  
      it('o segundo elemento do array ter as chaves "_id", "ingredients", "name", "preparation" e "userId"', () => {
        expect(response.body[1]).to.have.all
          .keys('_id', 'ingredients', 'name', 'preparation', 'userId');
      });
    });
  });
});
