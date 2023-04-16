const Contracts = require('./contracts')

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
    } catch {
        console.log("error");
        return 0
    }
    balance = parseInt(balance)
    console.log(balance,typeof balance)
    return balance? (balance/1000000000000000000) : 0
}

module.exports = getBalance