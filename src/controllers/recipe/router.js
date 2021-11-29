const express = require('express');

const recipe = require('./index');

const router = express.Router();

router.post('/', recipe.create);
router.get('/', recipe.getAll);
router.get('/:id', recipe.getById);

module.exports = router;
