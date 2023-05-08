const mongoose = require('mongoose')

const merchantSchema = new mongoose.Schema({
    name: {type: String, required:true},
    accountNo: {type: String, required:true},
    isMerchant: {type: Boolean, required:true},
    isVerified: {type: Boolean, required:true}
})

module.exports = mongoose.model('Merchant',merchantSchema)