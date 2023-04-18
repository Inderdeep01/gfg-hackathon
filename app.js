const express = require('express')
const app = express();
require('dotenv').config()
const morgan = require('morgan')
const signupHandler = require('./routes/signup')
const loginHandler = require('./routes/login')
const changePwdHandler = require('./routes/changePass')
const delteHandler = require('./routes/delete')
const transact=require('./routes/transact')
const cardHandler = require('./routes/card')
const userDetails = require('./routes/userDetail')
const balance = require('./routes/getBalance')
const Tx = require('./routes/getTransactions')
const deposit = require('./routes/deposit')

const cors = require('cors')
const bodyParser = require('body-parser');
const authToken=require('./routes/authToken');



const mongoose = require('mongoose')
mongoose.set('strictQuery',true)

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

mongoose.connect(process.env.MONGOOSE)
    .then(console.log('Connection Successful'))
    .catch(err=>console.log(err))

app.options('*',cors());

app.use('/authToken',authToken);
app.use('/signup',signupHandler)
app.use('/login',loginHandler)
app.use('/changePwd',changePwdHandler)
app.use('/delete',delteHandler)
app.use('/transact',transact);
app.use('/card',cardHandler)
app.use('/transact',transact)
app.use('/balance',balance)
app.use('/getTx',Tx)
app.use('/deposit',deposit)
app.use('/details',userDetails)



app.use('/',(req,res)=>{
    res.status(200).json({msg:'Welcome to home route!',version:'1.0.0'})
})

app.use((req,res)=>{
    res.status(404).json({msg:'No resource found!'})
})

module.exports = app