const express = require('express');
const { getAllTransactions, addTransaction, deleteTransaction }
    = require('../Controllers/ExpenseController');
const router = express.Router();

router.get('/', getAllTransactions);
router.post('/', addTransaction);
router.delete('/:expenseId', deleteTransaction);

module.exports = router;