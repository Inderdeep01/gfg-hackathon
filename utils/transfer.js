const web3 = require('./web3')
const Contracts = require('./contracts')
const User = require('../models/userModel')
const Merchant = require('../models/merchantModel')
const mongoose = require('mongoose')

// This function is invoked when user intends to settle in same currency
/*
Accepts 4 parameters :
1. token : currency intended to settle payment in
2. amount: amount for settlement
3. sender: account object of sender
    {
        address: '0xabcsderw23423',
        privateKey: 'private-key'
    }
4. reciever: address of the recipient
 */

const transfer = async(token,amount,sender,reciever,card=null,isMerchant = false)=>{
    //const account = web3.eth.accounts.privateKeyToAccount(sender.privateKey)
    let user = await User.findOne({accountNo:reciever})
    if(!user && !isMerchant)
        return {status:false,message:'Please check the account Number',to:new mongoose.Types.ObjectId(Buffer.alloc(12,0)),settledAmount:'0'}
    if(isMerchant)
        user = await Merchant.find({accountNo:reciever})
    const contract = Contracts.instances[token]
    const data = contract.methods.transfer(reciever,`${amount}000000000000000000`)
    const tx = {
        from: sender.address,
        to: Contracts.addresses[token],
        gas: 1000000,
        data:data.encodeABI()
    }
    try{
        const signedTx = await web3.eth.accounts.signTransaction(tx,sender.privateKey)
        const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        if(txReceipt.status){
            if(!isMerchant && !user.currencies.includes(token)){
                user.currencies.push(token)
                await user.save()
            }
            return {status:true,message:"Transaction Completed!", txReceipt:txReceipt, to:user._id, card:card, settledAmount: amount}
        }
    }
    catch{
        return {status:false,message:"Insufficient funds!", to:user._id, card:card, settledAmount:'0' }
    }
}
module.exports = transfer