const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// Registrasi pengguna
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Cek apakah pengguna sudah ada
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).send('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });

    try {
        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

// Login pengguna
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).send('Invalid credentials');
    }

    res.send('Login successful');
});

// Ambil semua pengguna
router.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Mengambil semua pengguna
        res.json(users); // Mengembalikan data pengguna dalam format JSON
    } catch (error) {
        res.status(500).send('Error fetching users');
    }
});

module.exports = router;
