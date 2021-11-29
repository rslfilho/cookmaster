const express = require('express');

const recipe = require('./index');

const router = express.Router();

router.post('/', recipe.create);

module.exports = router;
