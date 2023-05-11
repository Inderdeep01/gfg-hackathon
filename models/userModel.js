const mongoose =require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: mongoose.Schema.Types.String,
    lastName: {type:String, default:" "},
    email: mongoose.Schema.Types.String,
    password: mongoose.Schema.Types.String,
    walletpwd: mongoose.Schema.Types.String,
    wallet: Object,
    accountNo: String,
    cards: {type:Number, default:0},
    currencies: {
        type: Array,
        default:['INR']
    },
    isVerified: {type: Boolean,default: false}
},{
    timestamps:true
})

module.exports = mongoose.model('User',userSchema);