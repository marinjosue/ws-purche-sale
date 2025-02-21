const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stocksController');


router.get('/transaction/:symbol/:price/:operator', stockController.getFilteredTransactions);
router.get('/all-transactions', stockController.getAllTransactions);

module.exports = router;
