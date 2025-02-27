const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stocksController');

router.get('/transaction/:symbol/:price/:operator', stockController.getFilteredTransactions);
router.get('/all-transactions', stockController.getAllTransactions);
router.get('/transaction/:id', stockController.getTransactionById);
router.put('/transaction/:id', stockController.updateTransaction);
router.delete('/transaction/:id', stockController.deleteTransaction);

module.exports = router;
