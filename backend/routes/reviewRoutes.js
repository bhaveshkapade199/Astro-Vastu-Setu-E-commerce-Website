const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { authenticateAdmin } = require('../middleware/auth');

// GET all reviews (Protected - for Admin)
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews: ' + err.message });
    }
});

// GET reviews for a specific product (Public)
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ 
            productId: Number(req.params.productId),
            isApproved: true 
        }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST submit feedback/review for a product (Public - from website)
router.post('/', async (req, res) => {
    try {
        const { productId, productName, userName, rating, comment } = req.body;

        if (!productId || !userName || !comment) {
            return res.status(400).json({ error: 'Product ID, Your Name, and Feedback Comment are required.' });
        }

        // Get product name if not passed
        let finalProdName = productName;
        if (!finalProdName) {
            const p = await Product.findOne({ id: Number(productId) });
            if (p) finalProdName = p.name;
        }

        const newReview = new Review({
            productId: Number(productId),
            productName: finalProdName || 'Product #' + productId,
            userName: userName.trim(),
            rating: Number(rating) || 5,
            comment: comment.trim(),
            isApproved: true
        });

        await newReview.save();

        // Increment reviews count on product
        await Product.findOneAndUpdate(
            { id: Number(productId) },
            { $inc: { reviews: 1 } }
        );

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully! Thank you for your review.',
            review: newReview
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save review: ' + err.message });
    }
});

// DELETE review (Protected - Admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const result = await Review.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json({ success: true, message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
