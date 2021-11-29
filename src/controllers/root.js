const express = require('express');

const userRouter = require('./user/router');
const loginRouter = require('./login/router');
const recipeRouter = require('./recipe/router');

const root = express.Router({ mergeParams: true });

root.use('/users', userRouter);
root.use('/login', loginRouter);
root.use('/recipes', recipeRouter);

module.exports = root;
