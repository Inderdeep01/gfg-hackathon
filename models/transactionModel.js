const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    from: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    to: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    merchant: {
        type: mongoose.Types.ObjectId,
        ref: 'Merchant'
    },
    card:{
        type: mongoose.Types.ObjectId,
        ref: 'Card'
    },
    purpose: {
        type: String
    },
    amount: {
        type: String,
        required: true
    },
    settledAmount: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    settlement: {
        type: String
    },
    txReceipt: {
        type: Object
    },
    status: {
        type: Boolean,
        required: true
    },
    reason: String,
    type: String
},{
    timestamps: true
})

module.exports = mongoose.model('Tx',transactionSchema)