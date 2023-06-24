const web3 = require('./web3')
const inr_abi = require('../assets/inr-abi')
const usd_abi = require('../assets/usd-abi')
const aed_abi = require('../assets/aed-abi')
const cad_abi = require('../assets/cad-abi')
const eur_abi = require('../assets/eur-abi')
const jpy_abi = require('../assets/jpy-abi')
const rub_abi = require('../assets/rub-abi')
//This file contains 'contract addresses' as well as the 'contract instaces' of all the tokens/currencies

const addresses = {
    INR:'0x9ab7CA8a88F8e351f9b0eEEA5777929210199295',
    USD:'0x664D6EbAbbD5cf656eD07A509AFfBC81f9615741',
    AED:'0xfeae27388A65eE984F452f86efFEd42AaBD438FD',
    CAD:'0xe135783649BfA7c9c4c6F8E528C7f56166efC8a6',
    EUR:'0xC9Bc439c8723c5c6fdbBE14E5fF3a1224f8A0f7C',
    JPY:'0xDE87AF9156a223404885002669D3bE239313Ae33',
    RUB:'0x686AfD6e502A81D2e77f2e038A23C0dEf4949A20'
}

const instances = {
    INR: new web3.eth.Contract(inr_abi,addresses.INR),
    USD: new web3.eth.Contract(usd_abi,addresses.USD),
    AED: new web3.eth.Contract(aed_abi,addresses.AED),
    CAD: new web3.eth.Contract(cad_abi,addresses.CAD),
    EUR: new web3.eth.Contract(eur_abi,addresses.EUR),
    JPY: new web3.eth.Contract(jpy_abi,addresses.JPY),
    RUB: new web3.eth.Contract(rub_abi,addresses.RUB)
}

module.exports = {
    addresses:addresses,
    instances:instances
}