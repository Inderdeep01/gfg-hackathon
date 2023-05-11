const mongoose = require('mongoose')

const resetSchema = new mongoose.Schema({
    user:{
        type: String,
        required: true
    },
    secret: {
        type: String,
        required: true
    }
})

module.exports = new mongoose.model('ResetPass',resetSchema)