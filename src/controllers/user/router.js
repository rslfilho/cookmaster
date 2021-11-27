const express = require('express');
const user = require('./index');

const router = express.Router();

router.post('/', user.create);

module.exports = router;
