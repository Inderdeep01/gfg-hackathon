const web3 = require('../utils/web3')
const account = web3.eth.accounts.privateKeyToAccount('8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63')
function fund(addr){
    console.log(account)
    const transactionObject = {
        from:account.address,
        to: addr,
        value: 1000000000000000000,
        //gasPrice:'0x0',
        gas:'21000'
    }
    return new Promise(async (resolve,reject)=> {
        console.log("Signing Txn")
        const signedTx = await web3.eth.accounts.signTransaction(transactionObject,account.privateKey)
        console.log("Sending Txn .......")
        const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        console.log(txReceipt)
        if(!txReceipt)
            reject(txReceipt)
        else
            resolve(txReceipt)
    })
}

module.exports = fund