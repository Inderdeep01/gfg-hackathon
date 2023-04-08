const web3 = require('./web3')
const inr_abi = require('../assets/inr-abi')

const addresses = {
    INR:'0x4261D524bc701dA4AC49339e5F8b299977045eA5'
}

const instances = {
    INR: new web3.eth.Contract(inr_abi,addresses.INR)
}

module.exports = {
    addresses:addresses,
    instances:instances
}