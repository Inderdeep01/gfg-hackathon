const numberToWords = require('number-to-words')
function capitalizeWords(str) {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
}
function inWords(amount, currency) {

  const currencyMap = {
    INR: { name: 'Rupees', subunit: 'Paise' },
    USD: { name: 'Dollars', subunit: 'Cents' },
    CAD: { name: 'Canadian Dollars', subunit: 'Cents' },
    EUR: { name: 'Euros', subunit: 'Cents' },
    JPY: { name: 'Yen', subunit: 'Sen' },
    RUB: { name: 'Rubles', subunit: 'Kopeks' },
    AED: { name: 'Dirhams', subunit: 'Fils' },
    // Add more currencies and their names/subunits as needed
  };

  const { name, subunit } = currencyMap[currency] || { name: currency, subunit: 'Subunit' };

  const [whole, decimal = ''] = String(amount).split('.');

  let result = numberToWords.toWords(parseInt(whole));
  result +=  `${name}`;

  if (decimal) {
    const paddedDecimal = decimal.padEnd(2, '0');
    const decimalInWords = numberToWords.toWords(parseInt(paddedDecimal));
    result += ` and ${decimalInWords} ${subunit}` ;
  }

  return capitalizeWords(result + ' Only');
}
module.exports = inWords