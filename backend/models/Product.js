const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    subcategory: {
        type: String,
        default: ''
    },
    emoji: {
        type: String,
        default: '💎'
    },
    image: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    mrp: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 4.8
    },
    reviews: {
        type: Number,
        default: 0
    },
    badge: {
        type: String,
        default: ''
    },
    shortDesc: {
        type: String,
        default: ''
    },
    material: {
        type: String,
        default: ''
    },
    beadSize: {
        type: String,
        default: ''
    },
    braceletSize: {
        type: String,
        default: ''
    },
    weight: {
        type: String,
        default: ''
    },
    origin: {
        type: String,
        default: 'India'
    },
    suitableFor: {
        type: String,
        default: 'All Ages, Unisex'
    },
    care: {
        type: String,
        default: 'Avoid water, perfumes, and direct chemicals'
    },
    benefits: {
        type: [String],
        default: []
    },
    inStock: {
        type: Boolean,
        default: true
    },
    isNewProduct: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Getter / alias for isNew to match frontend expectation
productSchema.virtual('isNew').get(function() {
    return this.isNewProduct;
}).set(function(val) {
    this.isNewProduct = val;
});

module.exports = mongoose.model('Product', productSchema);
