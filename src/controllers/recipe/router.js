const express = require('express');

const recipe = require('./index');
const { auth } = require('../../middlewares');

const router = express.Router();

router.post('/', recipe.create);
router.get('/', recipe.getAll);
router.get('/:id', recipe.getById);
router.delete('/:id', auth, recipe.remove);
router.put('/:id', auth, recipe.update);

module.exports = router;
