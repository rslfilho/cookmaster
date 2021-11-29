const express = require('express');

const recipe = require('./index');

const router = express.Router();

router.post('/', recipe.create);
router.get('/', recipe.getAll);

module.exports = router;
