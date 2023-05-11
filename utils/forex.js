const mint = require('./mint')
const burn = require('./burn')
const {getConversionRate} = require('./getConversionRate')
const User = require('../models/userModel')

/* FOREX utility function
-> This function is used for settlement in currency other than the originating currency
-> Accepts 4 parameters:
1. src: source currency
2. dst: destination currency
3. wallet: An object containing user credentials
    {
        address: '0xabcsderw23423',
        privateKey: 'private-key'
    }
4. recipient: address of the recipient

-> Execution Logic:
1. Get the conversion rate of the currency to settle trade in
2. Burn the originating tokens (refer 'burn')
3. Mint the destination tokens (refer 'mint')
4. Return the transaction reciept
*/

const forex = async (src,dst,amount,wallet,recipient,card=null)=>{
    const user = await User.findOne({accountNo:recipient})
    if(!user)
        return {status:false,message:'Please check the account Number', settledAmount:'0'}
    const rate = getConversionRate(src,dst)
    let burntx
    try{
        burntx = await burn(src,amount,wallet)
    }
    catch{
        return {status:false,message:"Insufficient Funds!",to:user._id,card:card, settledAmount:'0'}
    }
    if(burntx.status){
        let minttx
        const str = new String(amount*rate)
        try{
            minttx = await mint(dst,amount,recipient)
        }
        catch(err){
            console.log(err);
            return {status: false,message:"Unable to complete the transaction! Please check your input"}
        }
        if(minttx.status){
            if(!user.currencies.includes(dst)){
                user.currencies.push(dst)
                await user.save()
            }
            return { status:true, txReceipt: minttx, to:user._id, card:card, settledAmount:str }
        }
        else
            return {status:false,to:user._id,card:card, settledAmount:'0'}
    }
    else
        return {status: false,to:user._id,card:card, settledAmount:'0'}
}

module.exports = forex