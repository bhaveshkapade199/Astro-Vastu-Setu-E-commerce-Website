const mongoose = require('mongoose');

const numerologyOrderSchema = new mongoose.Schema({
    reportId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    customer: {
        name: { type: String, required: true, trim: true },
        dob: { type: String, required: true }, // YYYY-MM-DD or DD/MM/YYYY
        whatsapp: { type: String, required: true, trim: true },
        email: { type: String, default: '', trim: true },
        purpose: { type: String, required: true } // Wealth, Career, Love, Peace, Protection, Well-being
    },
    numerology: {
        mulank: { type: Number, required: true }, // 1-9
        bhagyank: { type: Number, required: true }, // 1-9
        rulingPlanet: { type: String, default: '' },
        friendlyNumbers: { type: [Number], default: [] },
        luckyColor: { type: String, default: '' },
        analysisText: { type: String, default: '' }
    },
    recommendation: {
        braceletId: { type: Number, default: 1 },
        braceletName: { type: String, required: true },
        braceletImage: { type: String, default: '' },
        braceletPrice: { type: Number, default: 699 },
        reason: { type: String, default: '' },
        benefits: { type: [String], default: [] },
        wearingInstructions: { type: String, default: '' }
    },
    payment: {
        amount: { type: Number, default: 51 },
        status: { type: String, enum: ['Paid', 'Pending'], default: 'Paid' },
        paymentMethod: { type: String, default: 'Online / UPI' },
        transactionId: { type: String, default: '' }
    },
    reportStatus: {
        type: String,
        enum: ['Generated', 'Sent on WhatsApp', 'Completed'],
        default: 'Generated'
    },
    braceletOrdered: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('NumerologyOrder', numerologyOrderSchema);
