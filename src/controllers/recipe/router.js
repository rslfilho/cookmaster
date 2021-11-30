const express = require('express');

const recipe = require('./index');
const { auth, addImage } = require('../../middlewares');

const router = express.Router({ mergeParams: true });

router.post('/', recipe.create);
router.get('/', recipe.getAll);
router.get('/:id', recipe.getById);
router.delete('/:id', auth, recipe.remove);
router.put('/:id', auth, recipe.update);
router.put('/:id/image', auth, addImage.single('image'), recipe.addImage);

module.exports = router;
