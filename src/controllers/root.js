const express = require('express');

const userRouter = require('./user/router');

const root = express.Router({ mergeParams: true });

root.use('/users', userRouter);

module.exports = root;
