const Contracts = require('./contracts')

/* getBalance utility function
-> This function returns the amount of tokens held by a user
-> Acepts 2 parameters:
1. token: The currency/token to acquire the balance of
2. user: An object containing user credentials
*/

const getBalance = async (token,user)=>{
    const contract = Contracts.instances[token]
    const balance = await contract.methods.balanceOf(user.address).call()
    return balance/1000000000000000000
}

module.exports = getBalance