const express = require('express');
const router = express.Router();
const SpecialBraceletOrder = require('../models/SpecialBraceletOrder');
const { authenticateAdmin } = require('../middleware/auth');

// GET all special bracelet requests (Protected - for Admin Panel)
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        const requests = await SpecialBraceletOrder.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch special bracelet requests: ' + err.message });
    }
});

// GET single request by requestId
router.get('/:requestId', async (req, res) => {
    try {
        const request = await SpecialBraceletOrder.findOne({ requestId: req.params.requestId });
        if (!request) {
            return res.status(404).json({ error: 'Special bracelet request not found' });
        }
        res.json(request);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST submit a special bracelet request (Public)
router.post('/', async (req, res) => {
    try {
        const { personDetails, customization, customer, pricing, paymentMethod } = req.body;

        if (!personDetails || !personDetails.fullName || !personDetails.dob) {
            return res.status(400).json({ error: "Special person's Full Name and Date of Birth are required." });
        }

        if (!customization || !customization.primaryPurpose || !customization.wristSize) {
            return res.status(400).json({ error: 'Wrist size and primary purpose for the special bracelet are required.' });
        }

        if (!customer || !customer.name || !customer.mobile || !customer.address) {
            return res.status(400).json({ error: 'Customer contact name, mobile, and shipping address are required.' });
        }

        const requestId = 'SPB-' + Math.floor(100000 + Math.random() * 900000);

        const newRequest = new SpecialBraceletOrder({
            requestId,
            personDetails: {
                fullName: personDetails.fullName.trim(),
                gender: personDetails.gender || 'Male',
                dob: personDetails.dob,
                birthTime: personDetails.birthTime || '',
                birthPlace: personDetails.birthPlace || '',
                rashi: personDetails.rashi || '',
                nakshatra: personDetails.nakshatra || '',
                gotra: personDetails.gotra || ''
            },
            customization: {
                wristSize: customization.wristSize,
                beadSize: customization.beadSize || '8mm',
                primaryPurpose: customization.primaryPurpose,
                preferredStones: Array.isArray(customization.preferredStones) ? customization.preferredStones : [],
                spacerStyle: customization.spacerStyle || 'Vedic Silver Spacers',
                specialConcerns: customization.specialConcerns || ''
            },
            customer: {
                name: customer.name.trim(),
                mobile: customer.mobile.trim(),
                whatsapp: customer.whatsapp || customer.mobile,
                email: customer.email || '',
                address: customer.address.trim(),
                city: customer.city || '',
                state: customer.state || '',
                pincode: customer.pincode || ''
            },
            pricing: {
                estimatedPrice: (pricing && Number(pricing.estimatedPrice)) || 999,
                discount: (pricing && Number(pricing.discount)) || 0,
                finalPrice: (pricing && Number(pricing.finalPrice)) || 999
            },
            paymentMethod: paymentMethod || 'Cash on Delivery / UPI',
            paymentStatus: 'Pending',
            status: 'New Request'
        });

        await newRequest.save();

        res.status(201).json({
            success: true,
            message: 'Special bracelet request received and saved in database!',
            requestId: newRequest.requestId,
            order: newRequest
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit special bracelet request: ' + err.message });
    }
});

// PUT update status & astrologer notes (Protected - Admin only)
router.put('/:requestId/status', authenticateAdmin, async (req, res) => {
    try {
        const { status, astrologerNotes, finalPrice, paymentStatus } = req.body;
        const updateFields = {};
        if (status) updateFields.status = status;
        if (astrologerNotes !== undefined) updateFields.astrologerNotes = astrologerNotes;
        if (finalPrice !== undefined) updateFields['pricing.finalPrice'] = Number(finalPrice);
        if (paymentStatus) updateFields.paymentStatus = paymentStatus;

        const updated = await SpecialBraceletOrder.findOneAndUpdate(
            { requestId: req.params.requestId },
            { $set: updateFields },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Special bracelet request not found' });
        }

        res.json({ success: true, message: 'Special bracelet order updated successfully', order: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE special bracelet request (Protected - Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const result = await SpecialBraceletOrder.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.json({ success: true, message: 'Special bracelet request deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
