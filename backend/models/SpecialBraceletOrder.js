const mongoose = require('mongoose');

const specialBraceletOrderSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    // Person for whom the special bracelet is energized & crafted
    personDetails: {
        fullName: { type: String, required: true, trim: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
        dob: { type: String, required: true }, // Date of Birth (YYYY-MM-DD)
        birthTime: { type: String, default: '' }, // Time of Birth (HH:MM AM/PM)
        birthPlace: { type: String, default: '' }, // Place of Birth (City/State)
        rashi: { type: String, default: '' }, // Astrological Zodiac / Rashi
        nakshatra: { type: String, default: '' }, // Nakshatra if known
        gotra: { type: String, default: '' } // Optional Gotra for Sankalp pooja
    },
    // Customization & Astrology Requirements
    customization: {
        wristSize: { type: String, required: true }, // e.g. "6.5 inches" or "Medium"
        beadSize: { type: String, default: '8mm' },
        primaryPurpose: { 
            type: String, 
            required: true 
            // e.g., 'Wealth & Prosperity', 'Career & Business Growth', 'Health & Mental Peace', 
            // 'Nazar & Evil Eye Protection', 'Love & Relationship Harmony', 'Education & Focus', 'Rahu Ketu Dosha'
        },
        preferredStones: {
            type: [String],
            default: []
            // e.g. ['7 Chakra', 'Citrine', 'Tiger Eye', 'Pyrite', 'Amethyst', 'Rudraksha']
        },
        spacerStyle: {
            type: String,
            default: 'Vedic Silver Spacers'
        },
        specialConcerns: {
            type: String,
            default: '' // Specific problem, intentions, or notes from user
        }
    },
    // Contact & Delivery details
    customer: {
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        whatsapp: { type: String, default: '' },
        email: { type: String, default: '' },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    pricing: {
        estimatedPrice: { type: Number, default: 999 },
        discount: { type: Number, default: 0 },
        finalPrice: { type: Number, default: 999 }
    },
    paymentMethod: {
        type: String,
        default: 'Cash on Delivery / UPI'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'COD'],
        default: 'Pending'
    },
    status: {
        type: String,
        enum: ['New Request', 'Kundli Analysis Done', 'In Making', 'Abhimantrit / Energized', 'Dispatched', 'Delivered', 'Cancelled'],
        default: 'New Request'
    },
    astrologerNotes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SpecialBraceletOrder', specialBraceletOrderSchema);
