const express = require('express');

const login = require('./index');

const router = express.Router();

router.post('/', login.login);

module.exports = router;