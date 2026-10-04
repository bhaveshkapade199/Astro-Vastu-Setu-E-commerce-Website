const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('./database.sqlite');

const products = [
  {
    name: "7 Chakra Bracelet",
    category: "bracelets",
    subcategory: "7chakra",
    emoji: "🌈",
    price: 699,
    mrp: 1049,
    discount: 33,
    rating: 4.8,
    reviews: 126,
    badge: "BESTSELLER",
    shortDesc: "Traditional 7 Chakra inspired bracelet designed for spiritual and wellness practices.",
    inStock: 1,
    isNew: 0,
    isFeatured: 1
  },
  {
    name: "Tiger Eye Bracelet",
    category: "bracelets",
    subcategory: "tigereye",
    emoji: "🟤",
    price: 799,
    mrp: 1049,
    discount: 24,
    rating: 4.6,
    reviews: 87,
    badge: "NEW",
    shortDesc: "Tiger Eye is traditionally associated with courage, strength and mental clarity.",
    inStock: 1,
    isNew: 1,
    isFeatured: 1
  }
];

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

    db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare(`INSERT INTO products (name, category, subcategory, emoji, price, mrp, discount, rating, reviews, badge, shortDesc, inStock, isNew, isFeatured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
            products.forEach(p => {
                stmt.run([p.name, p.category, p.subcategory, p.emoji, p.price, p.mrp, p.discount, p.rating, p.reviews, p.badge, p.shortDesc, p.inStock, p.isNew, p.isFeatured]);
            });
            stmt.finalize();
            console.log("Database seeded successfully with initial products!");
        } else {
            console.log("Database already contains data. Skipping seed.");
        }
    });
});
