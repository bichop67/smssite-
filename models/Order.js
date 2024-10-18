const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: String, required: true },
    country: { type: String, required: true },
    number:  { type: String },
    status:  { type: String, enum: ['pending', 'received', 'expired', 'cancelled'], default: 'pending' },
    smsCode: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
