const web3 = require('./web3')
function createWallet(pass){
    const wallet = web3.eth.accounts.wallet.create(1)
    const encrypted = wallet.encrypt(pass)
    wallet.clear()
    return encrypted
}
module.exports = createWallet