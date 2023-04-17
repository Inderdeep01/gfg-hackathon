const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        required: true
    },
    expiryDate: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        required: true
    },
    pin: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    user: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
    purpose: {
        type: String,
        default: 'Debit Card'
    },
    network: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default: false
    },
    limit: {
        type: Number,
        default: 100000
    },
    internationalLimit: {
        type: Number,
        default: 10000
    }
})

module.exports = mongoose.model('Card',cardSchema)