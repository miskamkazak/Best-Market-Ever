const express = require('express');
const router = express.Router();

router.use('/user', require('./User'));
router.use('/product', require('./Product'));
router.use('/operation', require('./operation'));

module.exports = router;