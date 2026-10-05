const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authenticateAdmin } = require('../middleware/auth');

// GET all orders (Protected - for Admin Panel)
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders: ' + err.message });
    }
});

// GET single order by orderId
router.get('/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create new order (Public - called from website checkout)
router.post('/', async (req, res) => {
    try {
        const { customer, items, subtotal, discount, shipping, total, deliveryMethod, paymentMethod, paymentId } = req.body;

        if (!customer || !customer.name || !customer.mobile || !customer.address) {
            return res.status(400).json({ error: 'Customer name, mobile, and address are required' });
        }

        if (!items || !items.length) {
            return res.status(400).json({ error: 'Order must contain at least one item' });
        }

        // Generate clean human-readable Order ID e.g., AVS-849201
        const orderId = 'AVS-' + Math.floor(100000 + Math.random() * 900000);

        const newOrder = new Order({
            orderId,
            customer: {
                name: customer.name,
                mobile: customer.mobile,
                email: customer.email || '',
                address: customer.address,
                city: customer.city || '',
                state: customer.state || '',
                pincode: customer.pincode || ''
            },
            items: items.map(item => ({
                id: item.id,
                name: item.name,
                price: Number(item.price),
                qty: Number(item.qty) || 1,
                image: item.image || '',
                emoji: item.emoji || '📦'
            })),
            subtotal: Number(subtotal),
            discount: Number(discount) || 0,
            shipping: Number(shipping) || 0,
            total: Number(total),
            deliveryMethod: deliveryMethod || 'Standard',
            paymentMethod: paymentMethod || 'Razorpay / Online',
            paymentId: paymentId || ('pay_' + Math.random().toString(36).substring(2, 10)),
            paymentStatus: paymentMethod === 'COD' ? 'COD' : 'Paid',
            orderStatus: 'Placed'
        });

        await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully and recorded in database',
            order: newOrder
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to place order: ' + err.message });
    }
});

// PUT update order status (Protected - Admin only)
router.put('/:orderId/status', authenticateAdmin, async (req, res) => {
    try {
        const { orderStatus, trackingNumber, adminNotes, paymentStatus } = req.body;
        const updateFields = {};
        if (orderStatus) updateFields.orderStatus = orderStatus;
        if (trackingNumber !== undefined) updateFields.trackingNumber = trackingNumber;
        if (adminNotes !== undefined) updateFields.adminNotes = adminNotes;
        if (paymentStatus) updateFields.paymentStatus = paymentStatus;

        const updated = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            { $set: updateFields },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ success: true, message: 'Order updated successfully', order: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE order (Protected - Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const result = await Order.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ success: true, message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
