const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const express = require('express');
const DB = require("../utils/DB");
const { SECRET } = require('../utils/data');

const router = express.Router();

router.use(express.json());
 

router.post('/register', async (req, res) => {
    const { login, password, confirm } = req.body;

    if (!login || !password || !confirm) {
        res.send("Fill all fields");
        return;
    }

    if (password != confirm) {
        res.send("Passwords don't match");
        return;
    }

    const user = {
        login,
        password: crypto.createHash("sha256").update(password).digest('base64'),
        wins: 0,
        defeats: 0
    }
    const result = await DB.addUser(user);
    if (result) {
        res.send("OK");
    } else {
        res.send("Users already exists");
    }
});

router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    const result = await DB.authenticateUser(login, crypto.createHash("sha256").update(password).digest('base64'));
    if (!result) {
        res.send("Incorrect login or password");
        return;
    } else {
        const token = jwt.sign(login, SECRET);
        res.cookie('token', token);
        res.send("OK");
    }
});

module.exports = router;
