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
    INR:'0x4261D524bc701dA4AC49339e5F8b299977045eA5',
    USD:'0x2114De86c8Ea1FD8144C2f1e1e94C74E498afB1b',
    AED:'0x611c777fC85c8a4e4952b6c6800c90EFB7CD51e8',
    CAD:'0xc411e80F5B474aF3a970378cD1d8a225651A359e',
    EUR:'0xa4b1F4eBA08Bd7afFA913Fd1C348bfb5462CBB9a',
    JPY:'0xF033602321024cEd81aaA111Ad467921c303DE2A',
    RUB:'0x4D21B114B4a76EC55534925C4E9FE1E8cAD1C91A'
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