const express = require('express');
const router = express.Router();
const db = require('../model/db');
const isAuthenticated = require('../controllers/auth');

router.post('/get', isAuthenticated, async (req, res, next) => {});

module.exports = router;
