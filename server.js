const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'super_secret_admin_key_astro'; // In a real app, use .env

app.use(cors());
app.use(express.json());
// Serve static files
app.use(express.static(__dirname));

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the SQLite database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        category TEXT,
        subcategory TEXT,
        emoji TEXT,
        image TEXT,
        price INTEGER,
        mrp INTEGER,
        discount INTEGER,
        rating REAL,
        reviews INTEGER,
        badge TEXT,
        shortDesc TEXT,
        inStock INTEGER,
        isNew INTEGER,
        isFeatured INTEGER
    )`);
});

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: './Images/uploads/',
    filename: function (req, file, cb) {
        cb(null, 'prod-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Ensure upload directory exists
const fs = require('fs');
if (!fs.existsSync('./Images/uploads/')){
    fs.mkdirSync('./Images/uploads/', { recursive: true });
}

// Admin Auth Middleware
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });
        req.user = user;
        next();
    });
};

// Login Route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // Hardcoded owner credentials.
    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ username, role: 'admin' }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

// API: Get all products
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Convert integer booleans back to true/false
        const products = rows.map(r => ({
            ...r,
            inStock: r.inStock === 1,
            isNew: r.isNew === 1,
            isFeatured: r.isFeatured === 1
        }));
        res.json(products);
    });
});

// API: Upload image (Protected)
app.post('/api/upload', authenticateAdmin, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const imageUrl = `/Images/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

// API: Add product (Protected)
app.post('/api/products', authenticateAdmin, (req, res) => {
    const { name, category, subcategory, emoji, image, price, mrp, discount, rating, reviews, badge, shortDesc, inStock, isNew, isFeatured } = req.body;
    
    const sql = `INSERT INTO products (name, category, subcategory, emoji, image, price, mrp, discount, rating, reviews, badge, shortDesc, inStock, isNew, isFeatured) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [name, category, subcategory, emoji, image, price, mrp, discount, rating || 5, reviews || 0, badge, shortDesc, inStock ? 1 : 0, isNew ? 1 : 0, isFeatured ? 1 : 0];
    
    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: 'Product added successfully' });
    });
});

// API: Update product (Protected)
app.put('/api/products/:id', authenticateAdmin, (req, res) => {
    const { name, category, subcategory, emoji, image, price, mrp, discount, badge, shortDesc, inStock, isNew, isFeatured } = req.body;
    
    const sql = `UPDATE products SET 
                 name = ?, category = ?, subcategory = ?, emoji = ?, image = ?, price = ?, mrp = ?, discount = ?, badge = ?, shortDesc = ?, inStock = ?, isNew = ?, isFeatured = ? 
                 WHERE id = ?`;
    const params = [name, category, subcategory, emoji, image, price, mrp, discount, badge, shortDesc, inStock ? 1 : 0, isNew ? 1 : 0, isFeatured ? 1 : 0, req.params.id];
    
    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Product updated successfully' });
    });
});

// API: Delete product (Protected)
app.delete('/api/products/:id', authenticateAdmin, (req, res) => {
    db.run(`DELETE FROM products WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Product deleted successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
