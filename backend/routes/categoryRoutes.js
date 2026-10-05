const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { authenticateAdmin } = require('../middleware/auth');

// Default initial categories
const defaultCategories = [
    { name: 'Bracelets', slug: 'bracelets', icon: '💎', description: 'Vedic Healing and Energy Bracelets' },
    { name: 'Rudraksha', slug: 'rudraksha', icon: '📿', description: 'Sacred Himalayan Rudraksha Beads' },
    { name: 'Dhanyog', slug: 'dhanyog', icon: '✨', description: 'Wealth and Prosperity Spiritual Items' },
    { name: 'Lakshmi Potli', slug: 'lakshmipotli', icon: '🪔', description: 'Auspicious Diwali & Prosperity Potlis' }
];

// Helper to seed categories if empty
const ensureDefaultCategories = async () => {
    try {
        const count = await Category.countDocuments();
        if (count === 0) {
            await Category.insertMany(defaultCategories);
            console.log('Seeded default categories in MongoDB');
        }
    } catch (e) {
        console.error('Error ensuring default categories:', e.message);
    }
};
ensureDefaultCategories();

// GET all categories (Public)
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ createdAt: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch categories: ' + err.message });
    }
});

// POST add new category (Protected - Admin / Developer)
router.post('/', authenticateAdmin, async (req, res) => {
    try {
        const { name, slug, icon, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const generatedSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]/g, '-');

        const existing = await Category.findOne({ $or: [{ name }, { slug: generatedSlug }] });
        if (existing) {
            return res.status(400).json({ error: 'Category with this name or slug already exists' });
        }

        const newCategory = new Category({
            name: name.trim(),
            slug: generatedSlug,
            icon: icon || '💎',
            description: description || ''
        });

        await newCategory.save();
        res.status(201).json({ success: true, message: 'Category added successfully', category: newCategory });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create category: ' + err.message });
    }
});

// DELETE category (Protected - Admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const result = await Category.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ success: true, message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
