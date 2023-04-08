const web3 = require('../utils/web3')
const account = web3.eth.accounts.privateKeyToAccount('8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63')
const gas=async(req,res,next)=>{
    const balance=await web3.eth.getBalance(req.user.accountNo);
    if(balance>100000){
        next();
    }
    else{
        const transactionObject = {
            from:account.address,
            to: req.user.accountNo,
            value: 1000000000000000000,
            //gasPrice:'0x0',
            gas:'21000'
        }
        try{
            const signedTx = await web3.eth.accounts.signTransaction(transactionObject,account.privateKey);
            const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            next();
        }
        catch(error){
            res.status(500).json('Internal Server Error');
        }
    }
}

module.exports = gas;