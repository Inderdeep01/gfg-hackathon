const mongoose = require('mongoose')

const verificationSchema = new mongoose.Schema({
    user: {type:mongoose.Types.ObjectId, ref: 'User', required: true},
    secret: {type: String, required: true}
},{
    timestamps: true
})

module.exports = mongoose.model('Verification',verificationSchema)