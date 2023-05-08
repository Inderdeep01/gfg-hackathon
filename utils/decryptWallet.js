//const web3 = require('./web3')

/* decryptWallet utlity function
-> This function accepts 1 parammeter:
1. user: An Object containing encrypted wallet string and the password.
And returns the decrypted wallet instance for further use and application
*/

const decryptWallet = async (user)=>{
    const Web3 = require('web3')
    const web3 = new Web3('https://blockchain.interplanetarybank.org')
    const decrypted = await web3.eth.accounts.wallet.decrypt(user.wallet,user.password)
    return decrypted['0']
}

module.exports = decryptWallet
