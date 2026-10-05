require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const specialBraceletRoutes = require('./routes/specialBraceletRoutes');
const contactRoutes = require('./routes/contactRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folders
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));
app.use('/Images/uploads', express.static(uploadsPath));

// API Routes
app.use('/api', authRoutes); // allows POST /api/login directly
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/special-bracelets', specialBraceletRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        database: 'MongoDB',
        timestamp: new Date().toISOString()
    });
});

// Serve Admin Panel statically
const adminPath = path.join(__dirname, '..', 'admin');
app.use('/admin', express.static(adminPath));

// Serve Website statically
const websitePath = path.join(__dirname, '..', 'website');
app.use(express.static(websitePath));

// Fallback for admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(adminPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(` Astro Vastu Setu Server running on port ${PORT}`);
    console.log(` Website URL:      http://localhost:${PORT}`);
    console.log(`  Admin Panel URL:  http://localhost:${PORT}/admin`);
    console.log(`  Database:         MongoDB (Connected)`);
    console.log(`===============================================`);
});
