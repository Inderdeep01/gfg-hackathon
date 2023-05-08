const mongoose = require('mongoose')

const pendingTx  = new mongoose.Schema({
    user:{ type:mongoose.Types.ObjectId, ref:'User', required:true },
    otp: { type:String, required:true },
    tx: { type:Object, required:true }
},{
    timestamps:true
})

module.exports = mongoose.model('PendingTx',pendingTx)