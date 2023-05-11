const web3 = require('./web3')
const Contracts = require('./contracts')

/* BURN utility function
-> This function solves the major problem of double spending
-> It renders the tokens unusable once they are sent for burning
-> burn function is invoked when user intends to settle in different currencies
-> It accepts 3 parameters:
1. token: Token to burn
2. quantity: amount of tokens to burn
3. user: an object containing credentials of user(owner)
*/

const burn = async(token,quantity,user)=>{
    //load the instance of the token contract
    const contract = Contracts.instances[token]
    const data = contract.methods.burn(web3.utils.toWei(quantity))
    const tx = {
        from: user.address,
        to: Contracts.addresses[token],
        gas: 100000,
        data:data.encodeABI()
    }
    const signedTx = await web3.eth.accounts.signTransaction(tx,user.privateKey)
    const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    return txReceipt
}
module.exports = burn