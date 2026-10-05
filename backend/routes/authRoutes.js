const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    const secret = process.env.JWT_SECRET || 'super_secret_admin_key_astro_2026';

    if (username === adminUser && password === adminPass) {
        const token = jwt.sign({ username, role: 'admin' }, secret, { expiresIn: '7d' });
        return res.json({ token, success: true, message: 'Logged in successfully' });
    }

    return res.status(401).json({ error: 'Invalid username or password' });
});

module.exports = router;
