const express = require('express')
const app = express();
require('dotenv').config()
const morgan = require('morgan')
const signupHandler = require('./routes/signup')
const loginHandler = require('./routes/login')
const changePwdHandler = require('./routes/changePass')
const delteHandler = require('./routes/delete')
const transact=require('./routes/transact');
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.set('strictQuery',true)

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

mongoose.connect(process.env.MONGOOSE)
    .then(console.log('Connection Successful'))
    .catch(err=>console.log(err))

app.options('*',cors())

app.use('/signup',signupHandler)
app.use('/login',loginHandler)
app.use('/changePwd',changePwdHandler)
app.use('/delete',delteHandler);


app.use('/transact',transact);



app.use('/',(req,res)=>{
    res.status(200).json({msg:'Welcome to home route!'})
})

app.use((req,res)=>{
    res.status(404).json({msg:'No resource found!'})
})

module.exports = app