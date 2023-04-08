const web3 = require('./web3')
const Contracts = require('./contracts')

const mint = async(token,quantity,reciever)=>{
    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)
    const contract = Contracts.instances[token]
    const data = contract.methods.mint(reciever,`${quantity}000000000000000000`)
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