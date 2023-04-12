const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    from: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    to: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
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
    currency: {
        type: String,
        required: true
    },
    txReceipt: {
        type: Object
    },
    status: {
        type: Boolean,
        required: true
    },
    reason: String
},{
    timestamps: true
})

module.exports = mongoose.model('Tx',transactionSchema)