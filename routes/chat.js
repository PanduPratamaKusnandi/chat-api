const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Kirim pesan
router.post('/send', async (req, res) => {
    const { sender, receiver, content } = req.body;

    const message = new Message({ sender, receiver, content });

    try {
        await message.save();
        res.status(201).send('Message sent');
    } catch (error) {
        res.status(500).send('Error sending message');
    }
});

// Ambil pesan antara dua pengguna
router.get('/messages/:user1/:user2', async (req, res) => {
    const { user1, user2 } = req.params;

    try {
        const messages = await Message.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 }
            ]
        });
        res.json(messages);
    } catch (error) {
        res.status(500).send('Error fetching messages');
    }
});

module.exports = router;
