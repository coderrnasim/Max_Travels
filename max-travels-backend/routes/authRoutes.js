const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// /api/auth/login এপিআই এন্ডপয়েন্ট
router.post('/login', login);

module.exports = router;