const iins = {
    'IPBS': '1000',
    'VISA': '4',
    'Mastercard': '55',
    'RuPay': '65',
    'Amex': '37',
}
function generateCardDetails(network) {
    // Generate card number
    const iin = iins[network]
    const length = 16
    const generateCardNumber = (iin, length) => {
      const getRndInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
  
      let cardNumber = iin
      for (let i = 0; i < length - iin.length - 1; i++) {
        cardNumber += getRndInteger(0, 9).toString()
      }
  
      const calculateLuhnCheckDigit = (number) => {
        let digits = number.split('').map(d => parseInt(d, 10));
        for (let i = digits.length - 1; i >= 0; i -= 2) {
          let doubled = digits[i] * 2
          digits[i] = doubled > 9 ? doubled - 9 : doubled
        }
        let sum = digits.reduce((acc, val) => acc + val, 0)
        return (10 - (sum % 10)) % 10
      };
  
      let checkDigit = calculateLuhnCheckDigit(cardNumber)
      cardNumber += checkDigit
  
      return cardNumber
    };
  
    // Generate expiry date
    const generateExpiryDate = () => {
      const currentYear = new Date().getFullYear()
      const expiryYear = currentYear + Math.floor(Math.random() * 5) + 1// 1 to 5 years in the future
      const expiryMonth = ("0" + (Math.floor(Math.random() * 12) + 1)).slice(-2)
  
      return `${expiryMonth}/${expiryYear.toString().slice(-2)}`
    };
  
    // Generate CVV
    const generateCVV = () => {
      return Math.floor(Math.random() * 900) + 100 // Generates a random 3-digit number
    };
  
    const cardNumber = generateCardNumber(iin, length)
    const expiryDate = generateExpiryDate()
    const cvv = generateCVV()
  
    return { cardNumber, expiryDate, cvv, network };
}

module.exports = generateCardDetails
  