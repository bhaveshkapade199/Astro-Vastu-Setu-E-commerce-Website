require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const initialProducts = [
  {
    id: 1,
    name: "7 Chakra Bracelet",
    category: "bracelets",
    subcategory: "7chakra",
    emoji: "🌈",
    image: "",
    price: 699,
    mrp: 1049,
    discount: 33,
    rating: 4.8,
    reviews: 126,
    badge: "BESTSELLER",
    material: "7 Natural Gemstones (Amethyst, Lapis, Aquamarine, Jade, Citrine, Carnelian, Red Jasper)",
    beadSize: "8 mm (approx)",
    braceletSize: "Elastic (Fits most wrists)",
    weight: "25g approx",
    origin: "India",
    suitableFor: "All Ages, Unisex",
    care: "Avoid water, perfumes, and direct sunlight",
    shortDesc: "Traditional 7 Chakra inspired bracelet designed for spiritual and wellness practices. Traditionally associated with balancing the 7 energy centers of the body.",
    benefits: [
      "Traditionally associated with balancing 7 energy chakras",
      "Used in meditation and spiritual practices",
      "Supports positive mindset and inner peace",
      "Popular for wellness and energy balancing"
    ],
    inStock: true,
    isNewProduct: false,
    isFeatured: true
  },
  {
    id: 2,
    name: "Tiger Eye Bracelet ( BHavesh)",
    category: "bracelets",
    subcategory: "tigereye",
    emoji: "🟤",
    image: "",
    price: 799,
    mrp: 1049,
    discount: 24,
    rating: 4.6,
    reviews: 87,
    badge: "NEW",
    material: "Natural Tiger Eye Gemstone",
    beadSize: "8 mm (approx)",
    braceletSize: "Elastic (Fits most wrists)",
    weight: "25g approx",
    origin: "India",
    suitableFor: "All Ages, Unisex",
    care: "Avoid water and perfumes",
    shortDesc: "Tiger Eye is traditionally associated with courage, strength and mental clarity.",
    benefits: [
      "Traditionally associated with courage and confidence",
      "Helps dispel fear and anxiety",
      "Supports mental clarity and focus"
    ],
    inStock: true,
    isNewProduct: true,
    isFeatured: true
  },
  {
    id: 3,
    name: "Citrine Bracelet",
    category: "bracelets",
    subcategory: "citrine",
    emoji: "💛",
    image: "",
    price: 699,
    mrp: 1049,
    discount: 33,
    rating: 4.7,
    reviews: 124,
    badge: "31% OFF",
    material: "Natural Citrine (Original Stone)",
    beadSize: "8 mm (approx)",
    braceletSize: "Elastic (Fits most wrists)",
    weight: "22g approx",
    origin: "Brazil / India",
    suitableFor: "All Ages, Unisex",
    care: "Avoid water, perfumes, and direct sunlight",
    shortDesc: "Citrine is traditionally associated with abundance, positivity and confidence. Believed to attract wealth.",
    benefits: [
      "Supports positivity and abundance",
      "Associated with confidence and motivation",
      "Helps balance emotions"
    ],
    inStock: true,
    isNewProduct: false,
    isFeatured: true
  },
  {
    id: 4,
    name: "8 chakra",
    category: "bracelets",
    subcategory: "ring",
    emoji: "💎",
    image: "/uploads/prod-1791136216878.webp",
    price: 500,
    mrp: 600,
    discount: 50,
    rating: 5,
    reviews: 0,
    badge: "SPECIAL",
    material: "Custom Chakra Beads",
    beadSize: "8mm",
    braceletSize: "Adjustable",
    weight: "20g",
    origin: "India",
    suitableFor: "Unisex",
    care: "Wipe with soft cloth",
    shortDesc: "Custom energized chakra bracelet.",
    benefits: ["Energy alignment", "Daily wellness"],
    inStock: true,
    isNewProduct: false,
    isFeatured: true
  },
  {
    id: 5,
    name: "Amethyst Bracelet",
    category: "bracelets",
    subcategory: "amethyst",
    emoji: "💜",
    image: "",
    price: 699,
    mrp: 1049,
    discount: 33,
    rating: 4.8,
    reviews: 98,
    badge: "POPULAR",
    material: "Natural Amethyst",
    beadSize: "8 mm (approx)",
    braceletSize: "Elastic (Fits most wrists)",
    weight: "23g approx",
    origin: "Brazil",
    suitableFor: "All Ages, Unisex",
    care: "Avoid water, perfumes, and direct sunlight",
    shortDesc: "Amethyst is traditionally known as the stone of peace and spiritual growth. Widely used in meditation.",
    benefits: [
      "Traditionally used for calmness and peace of mind",
      "Supports meditation and spiritual growth",
      "Associated with protection and positive energy"
    ],
    inStock: true,
    isNewProduct: false,
    isFeatured: true
  },
  {
    id: 6,
    name: "Pyrite Bracelet (Money Magnet)",
    category: "bracelets",
    subcategory: "pyrite",
    emoji: "✨",
    image: "",
    price: 899,
    mrp: 1499,
    discount: 40,
    rating: 4.9,
    reviews: 142,
    badge: "HOT",
    material: "Natural Golden Pyrite Mineral",
    beadSize: "8 mm (approx)",
    braceletSize: "Elastic (Fits most wrists)",
    weight: "35g approx",
    origin: "Peru",
    suitableFor: "Business Owners, Professionals",
    care: "Keep away from water and humidity",
    shortDesc: "Pyrite is widely regarded as a stone of wealth, business luck and shielding against negative vibes.",
    benefits: [
      "Known as Fool's Gold - symbol of prosperity",
      "Aids in confidence and manifestation",
      "Shields against energy drain"
    ],
    inStock: true,
    isNewProduct: true,
    isFeatured: true
  }
];

const seedDB = async () => {
    try {
        await connectDB();
        const count = await Product.countDocuments();
        if (count === 0) {
            await Product.insertMany(initialProducts);
            console.log(`✅ Seeded ${initialProducts.length} initial products into MongoDB!`);
        } else {
            console.log(`ℹ️ MongoDB already has ${count} products. Skipping initial seed.`);
        }
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seedDB();
