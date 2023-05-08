const hash = require('./hash')
const OTPGenerator = require('otp-generator')

// Generate a 6-digit OTP
const generateOTP =()=>{
    const otp = OTPGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    const hashed = hash(otp)
    return {otp:otp,hashed:hashed}
}

module.exports = generateOTP