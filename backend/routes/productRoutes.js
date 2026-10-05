const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const { authenticateAdmin } = require('../middleware/auth');

// Setup image upload with multer
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'prod-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ id: 1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products: ' + err.message });
    }
});

// GET single product by id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: Number(req.params.id) });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST upload product image
router.post('/upload', authenticateAdmin, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl, success: true });
});

// POST create product
router.post('/', authenticateAdmin, async (req, res) => {
    try {
        const body = req.body;
        // Determine next numeric ID if not provided
        let newId = body.id;
        if (!newId) {
            const maxProd = await Product.findOne().sort({ id: -1 });
            newId = (maxProd && maxProd.id) ? maxProd.id + 1 : 1;
        }

        const product = new Product({
            id: newId,
            name: body.name,
            category: body.category,
            subcategory: body.subcategory || '',
            emoji: body.emoji || '💎',
            image: body.image || '',
            price: Number(body.price),
            mrp: Number(body.mrp) || Number(body.price),
            discount: Number(body.discount) || 0,
            rating: Number(body.rating) || 5,
            reviews: Number(body.reviews) || 0,
            badge: body.badge || '',
            shortDesc: body.shortDesc || '',
            material: body.material || '',
            beadSize: body.beadSize || '',
            braceletSize: body.braceletSize || '',
            weight: body.weight || '',
            origin: body.origin || 'India',
            suitableFor: body.suitableFor || 'All Ages, Unisex',
            care: body.care || 'Avoid water and harsh chemicals',
            benefits: Array.isArray(body.benefits) ? body.benefits : [],
            inStock: body.inStock !== false && body.inStock !== 0 && body.inStock !== '0',
            isNewProduct: Boolean(body.isNew),
            isFeatured: Boolean(body.isFeatured)
        });

        await product.save();
        res.status(201).json({ success: true, message: 'Product created successfully', product });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create product: ' + err.message });
    }
});

// PUT update product
router.put('/:id', authenticateAdmin, async (req, res) => {
    try {
        const targetId = Number(req.params.id);
        const body = req.body;

        const updateData = {
            name: body.name,
            category: body.category,
            subcategory: body.subcategory,
            emoji: body.emoji,
            image: body.image,
            price: Number(body.price),
            mrp: Number(body.mrp),
            discount: Number(body.discount),
            badge: body.badge,
            shortDesc: body.shortDesc,
            inStock: body.inStock !== false && body.inStock !== 0 && body.inStock !== '0',
            isNewProduct: Boolean(body.isNew),
            isFeatured: Boolean(body.isFeatured)
        };

        if (body.material) updateData.material = body.material;
        if (body.beadSize) updateData.beadSize = body.beadSize;
        if (body.benefits) updateData.benefits = body.benefits;

        const product = await Product.findOneAndUpdate(
            { id: targetId },
            { $set: updateData },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ success: true, message: 'Product updated successfully', product });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update product: ' + err.message });
    }
});

// DELETE product
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const targetId = Number(req.params.id);
        const result = await Product.findOneAndDelete({ id: targetId });
        if (!result) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete product: ' + err.message });
    }
});

module.exports = router;
