const web3 = require('./web3')
const Contracts = require('./contracts')

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

const transfer = async(token,amount,sender,reciever)=>{
    //const account = web3.eth.accounts.privateKeyToAccount(sender.privateKey)
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
        if(txReceipt.status)
            return {status:true,msg:"Transaction Completed!"}
    }
    catch{
        return {status:false,msg:"Insufficient funds!"}
    }
}
module.exports = transfer