const web3 = require('./web3')
const inr_abi = require('../assets/inr-abi')
const usd_abi = require('../assets/usd-abi')
//This file contains 'contract addresses' as well as the 'contract instaces' of all the tokens/currencies

const addresses = {
    INR:'0x4261D524bc701dA4AC49339e5F8b299977045eA5',
    USD:'0x2114De86c8Ea1FD8144C2f1e1e94C74E498afB1b'
}

const instances = {
    INR: new web3.eth.Contract(inr_abi,addresses.INR),
    USD: new web3.eth.Contract(usd_abi,addresses.USD)
}

module.exports = {
    addresses:addresses,
    instances:instances
}