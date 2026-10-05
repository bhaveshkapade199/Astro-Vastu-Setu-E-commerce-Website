const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { authenticateAdmin } = require('../middleware/auth');

// GET all contact messages (Protected - for Admin)
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch contact messages: ' + err.message });
    }
});

// POST submit contact message (Public - from Contact Us page)
router.post('/', async (req, res) => {
    try {
        const { name, email, mobile, subject, message } = req.body;

        if (!name || !mobile || !message) {
            return res.status(400).json({ error: 'Name, Mobile Number, and Message are required.' });
        }

        const newContact = new Contact({
            name: name.trim(),
            email: email ? email.trim() : '',
            mobile: mobile.trim(),
            subject: subject ? subject.trim() : 'General Inquiry',
            message: message.trim(),
            status: 'New'
        });

        await newContact.save();

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully! Our team will contact you soon.',
            contact: newContact
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit message: ' + err.message });
    }
});

// PUT update status (Protected - Admin)
router.put('/:id/status', authenticateAdmin, async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        const updateData = {};
        if (status) updateData.status = status;
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

        const updated = await Contact.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Contact message not found' });
        }

        res.json({ success: true, message: 'Status updated', contact: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE contact message (Protected - Admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const result = await Contact.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Contact message not found' });
        }
        res.json({ success: true, message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
