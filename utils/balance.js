const Contracts = require('./contracts')
const web3 = require('./web3')

/* getBalance utility function
-> This function returns the amount of tokens held by a user
-> Acepts 2 parameters:
1. token: The currency/token to acquire the balance of
2. user: An object containing user credentials
*/

const getBalance = async (token,user)=>{
    const contract = Contracts.instances[token]
    let balance = 0
    try {
        balance = await contract.methods.balanceOf(user.address).call()
    } catch(err) {
        console.log(err);
        return 0
    }
    balance = parseFloat(web3.utils.fromWei(balance)).toFixed(2)//balance.slice(0, -18);
    return balance? balance : 0
}

module.exports = getBalance