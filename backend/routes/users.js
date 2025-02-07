const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// Get user balance and transactions
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const transactions = await Transaction.find({ userId: req.user.userId })
      .sort({ date: -1 })
      .limit(10);
    res.json({ 
      balance: user.balance,
      transactions: transactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Deposit money
router.post('/deposit', auth, async (req, res) => {
  try {
    const { amount, description } = req.body;
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.balance += Number(amount);
    await user.save();

    const transaction = new Transaction({
      userId: req.user.userId,
      type: 'deposit',
      amount: Number(amount),
      description: description || 'Deposit'
    });
    await transaction.save();

    res.json({ 
      balance: user.balance,
      transaction: transaction 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Withdraw money
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount, description } = req.body;
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }
    user.balance -= Number(amount);
    await user.save();

    const transaction = new Transaction({
      userId: req.user.userId,
      type: 'withdraw',
      amount: Number(amount),
      description: description || 'Withdrawal'
    });
    await transaction.save();

    res.json({ 
      balance: user.balance,
      transaction: transaction 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get transaction history
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId })
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add this at the top of your user routes
router.post('/create-account', auth, async (req, res) => {
  try {
    let user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      user = new User({
        userId: req.user.userId,
        balance: 0
      });
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 