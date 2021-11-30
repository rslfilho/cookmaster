const express = require('express');

const user = require('./index');
const { auth, admin } = require('../../middlewares');

const router = express.Router();

router.post('/', user.create);
router.post('/admin', auth, admin, user.createAdmin);

module.exports = router;
