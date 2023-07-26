const express = require('express');
const { registerUser } = require('../Controllers/AuthController');

const router = express.Router();

router.post('/register', registerUser)
module.exports = router;
