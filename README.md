# API de Receitas

## Índice

- [Descrição](#Descrição)
- [Como Usar Localmente](#Como-usar-no-ambiente-local)
- [Desenvolvimento](#Desenvolvimento)
- [Arquitetura](#Arquitetura)
- [Rotas](#Rotas)
- [Outros Scripts da Aplicação](#outros-scripts-configurados-na-aplicação)
- [Contato](#Contato)

## Descrição

Repositório com o código de uma **API Rest**, em Node.js com Express. O banco de dados é em MongoDB.

Esta API foi desenvolvida para o trabalho do Bloco 27 do módulo de back-end da Trybe, projeto App de Receitas.

O objetivo era criar uma aplicação para cadastros de receitas, com controle de usuário.

Foi desenvolvida a aplicação back-end para para que fosse possível fazer toda a dinâmica de:

- Login
- Criar Receita
- Listar Receita
- Listar Receita por Id
- Deletar Receita
- Atualizar Receita
- Adicionar Imagem a uma receita
- Criar Usuários
- Criar Usuário Admin

## Como usar no ambiente local

1 - Para clonar o repositório, vá até o diretório onde deseja clonar, execute o `git clone` e depois entre no diretório criado:

```bash
git clone git@github.com:rslfilho/cookmaster.git
cd cookmaster
```

2- Já dentro do diretório, instale as depedências:

```bash
npm install
```

3 - Configure um arquivo `.env` na raiz da aplicação com os seguintes dados:

```env
HOST=localhost
```

4 - Depois de instaladas as depedências, inicie a aplicação:

```bash
npm start
```

5 - A aplicação estárá rodando e acessível em `http://localhost:3000/`. A porta pode modificar se tiver uma variável `PORT` no ambiente que estiver executando.

## Desenvolvimento

A API foi desenvolvida em Node.js com Express. O banco de dados é em MongoDB.

Além disso, as dependências da aplicação são:

- `jsonwebtoken` para autenticação de acesso;
- `multer` recebimento de arquivos pelas rotas
- `node-dev` para iniciar a aplicação com reinício automático

No ambiente de desenvolvimento ainda são usadas as dependências:

- `mocha`, `chai`, `chai-http` e `sinon` para os testes;
- `nyc` para gerar os relatórios de cobertura de testes
- `eslint`, `eslint-config-trybe-backend`, para configuração do ESLint

## Arquitetura

A API está contida na pasta `/src` dentro da raiz do repositório, nela temos:

- `/api` arquivos de configuração e início da aplicação;
- `/controllers` arquivos de Controllers de todas as rotas da aplicação;
- `/helpers` funções ou dados auxiliares;
- `/integration-tests` arquivos de testes de integração;
- `/middlewares` arquivos de middlewares como o de Erro, de Autenticação e o de configuração do Multer;
- `/models` arquivos de configuração da conexão com o banco de dados e models;
- `/services` arquivos de Serviços da aplicação, de todas as rotas e de validação;
- `/uploads` arquivos enviados pela rota de `addImage`;

** A pasta `/tests` contém os testes dos requisitos de projeto da própria Trybe;

## Rotas

### `POST/users`

Body da requisição:

```javascript
{
  name: 'Usuário Teste',
  email: 'usuario@teste.com',
  password: 'senha123',
}
```

### `POST/users/admin`

Headers da requisição:

```javascript
{
  headers: {
    Authorization: 'string-token-de-admin',
  },
}
```

Body da requisição:

```javascript
{
  name: 'Usuário Admin',
  email: 'testeadmin@email.com',
  password: 'senha123',
  role: 'admin',
}
```

### `POST/login`

Body da requisição:

```javascript
{
  email: 'usuario@teste.com',
  password: 'senha123',
}
```
O login retorna um token de autenticação que precisa ser usado no headers em outras rotas.

### `POST/recipes`

Body da requisição:

```javascript
{
  name: '',
  ingredients: 'Farinha, Manteiga e Açucar',
  preparation: 'Farinha + Manteiga e depois Açucar',
}
```

### `GET/recipes`

### `GET/recipes/:id`

### `PUT/recipes/:id`

Headers da requisição:

```javascript
{
  headers: {
    Authorization: 'string-token-de-usuário-logado',
  },
}
```

Body da requisição:

```javascript
{
  name: 'Receita Teste 33',
  ingredients: 'Farinha, Manteiga e Açucar',
  preparation: 'Farinha + Manteiga e depois Açucar 123',
}
```

### `DELETE/recipes/:id`

Headers da requisição:

```javascript
{
  headers: {
    Authorization: 'string-token-de-usuário-dono-da-receita-ou-admin',
  },
}
```

### `PUT/recipes/:id/image`

Headers da requisição:

```javascript
{
  headers: {
    Authorization: 'string-token-de-usuário-dono-da-receita-ou-admin',
  },
}
```

Body da requisição deve contar um arquivo de imagem `jpg` com chave `image`

## Outros Scripts configurados na aplicação

* `npm run dev` para rodar a aplicação com Node-dev e reinício automático na atualização de qualquer arquivo;
* `npm run test` para rodar todos os testes;
* `npm run test:coverage` para rodar todos os testes e gerar o relatório de cobertura em html, acessível na pasta `/coverage`;
* `npm run test:coverage:json` para rodar todos os testes e gerar o relatório de cobertura em json, acessível na pasta `/coverage`;
* `npm run lint` para rodar o ESLint;

## Contato

Desenvolvido por Roberval Filho

Email: rslfilho@gmail.com

Github: https://github.com/rslfilho

LinkedIn: https://www.linkedin.com/in/rslfilho/
