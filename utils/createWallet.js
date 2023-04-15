const web3 = require('./web3')

/* createWallet utility function
-> This function returns an encrypted (new)wallet string
-> Accepts 1 parameter:
1. pass: password to encrypt the wallet with. 
*/

function createWallet(pass){
    const wallet = web3.eth.accounts.wallet.create(1)
    const encrypted = wallet.encrypt(pass)
    wallet.clear()
    return encrypted
}
module.exports = createWallet