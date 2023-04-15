const mint = require('./mint')
const burn = require('./burn')
const getConversionRate = require('./getConversionRate')

/* FOREX utility function
-> This function is used for settlement in currency other than the originating currency
-> Accepts 4 parameters:
1. src: source currency
2. dst: destination currency
3. wallet: An object containing user credentials
    {
        address: '0xabcsderw23423',
        privateKey: 'private-key'
    }
4. recipient: address of the recipient

-> Execution Logic:
1. Get the conversion rate of the currency to settle trade in
2. Burn the originating tokens (refer 'burn')
3. Mint the destination tokens (refer 'mint')
4. Return the transaction reciept
*/

const forex = async (src,dst,amount,wallet,recipient)=>{
    const rate = getConversionRate(src,dst)
    let burntx
    try{
        burntx = await burn(src,amount,wallet)
    }
    catch{
        return {status:false,msg:"Insufficient Funds!"}
    }
    if(burntx.status){
        let minttx
        try{
            minttx = await mint(dst,amount*rate | 0,recipient)
        }
        catch{
            return {status: false,msg:"Unable to complete the transaction! Please check your input"}
        }
        if(minttx.status){
            return {status:true,txReceipt: minttx}
        }
        else
            return {status:false}
    }
    else
        return {status: false}
}

module.exports = forex