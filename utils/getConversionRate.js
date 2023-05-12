const rate = {
    USD_INR: 81,
    USD_EUR: 0.915,
    USD_AED: 3.67,
    USD_CAD: 1.34,
    USD_JPY: 134.06,
    USD_RUB: 77.41,
    RUB_AED: 0.047,
    RUB_CAD: 0.017,
    RUB_EUR: 0.012,
    RUB_INR: 1.06,
    RUB_JPY: 1.73,
    RUB_USD: 0.013,
    JPY_AED: 0.027,
    JPY_CAD: 0.010,
    JPY_EUR: 0.0068,
    JPY_INR: 0.61,
    JPY_RUB: 0.57,
    JPY_USD: 0.0075,
    INR_AED: 0.045,
    INR_CAD: 0.016,
    INR_EUR: 0.011,
    INR_JPY: 1.64,
    INR_RUB: 0.94,
    INR_USD: 0.012345678,
    EUR_AED: 4.01,
    EUR_CAD: 1.47,
    EUR_INR: 89.70,
    EUR_JPY: 146.95,
    EUR_RUB: 83.02,
    EUR_USD: 1.09,
    CAD_AED: 2.74,
    CAD_EUR: 0.68,
    CAD_INR: 61.19,
    CAD_JPY: 100.13,
    CAD_RUB: 57.32,
    CAD_USD: 0.75,
    AED_CAD: 0.37,
    AED_EUR: 0.25,
    AED_INR: 22.35,
    AED_JPY: 36.57,
    AED_RUB: 20.94,
    AED_USD: 0.27
}

const getConversionRate = (src,dst)=>{
    return rate[`${src}_${dst}`]
}

exports.list = rate

exports.getConversionRate = getConversionRate