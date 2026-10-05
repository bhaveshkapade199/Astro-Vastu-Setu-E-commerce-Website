const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    id: { type: Number },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, default: 1 },
    image: { type: String, default: '' },
    emoji: { type: String, default: '📦' }
});

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    customer: {
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        email: { type: String, default: '' },
        address: { type: String, required: true },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        pincode: { type: String, default: '' }
    },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    deliveryMethod: { type: String, default: 'Standard' },
    paymentMethod: { type: String, default: 'Razorpay / Online' },
    paymentId: { type: String, default: '' },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Pending', 'Failed', 'COD'],
        default: 'Paid'
    },
    orderStatus: {
        type: String,
        enum: ['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Placed'
    },
    trackingNumber: { type: String, default: '' },
    adminNotes: { type: String, default: '' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
