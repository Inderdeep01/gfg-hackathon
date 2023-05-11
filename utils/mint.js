const web3 = require('./web3')
const Contracts = require('./contracts')

/* MINT utility function
-> This function accepts 3 parameters:
1. token: token to mint
2. quantity: amount of tokens to mint
3. reciever: address of the recipient
-> It is an owner only contract and hence require us to import the account from private key of the owner.
*/

const mint = async(token,quantity,reciever)=>{
    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)
    const contract = Contracts.instances[token]
    //convert? true : quantity = `${quantity}000000000000000000`
    quantity = web3.utils.toWei(quantity)
    const data = contract.methods.mint(reciever,quantity)
    const tx = {
        from: account.address,
        to: Contracts.addresses[token],
        gas: 1000000,
        data:data.encodeABI()
    }
    const signedTx = await web3.eth.accounts.signTransaction(tx,account.privateKey)
    const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    return txReceipt
}
module.exports = mint