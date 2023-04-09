const rate = {
    USD_INR: 81,
    INR_USD: 0.12345678
}

const getConversionRate = (src,dst)=>{
    return rate[`${src}_${dst}`]
}

module.exports = getConversionRate