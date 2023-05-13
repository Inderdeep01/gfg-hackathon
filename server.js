const http = require('http')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const app = require('./app')

const server = http.createServer(app)

const PORT = process.env.PORT

let instance = server.listen(PORT)
const io = require('socket.io')(instance,{
    pingTimeout: 60000,
    cors:{
        origin:'*'
    }
})

io.on('connection',(socket)=>{
    module.exports = socket
    socket.on("setup",(token)=>{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        let id = decoded.id
        socket.join(id)
        socket.emit("connected")
    })
    socket.on("transaction",(tx)=>{
        socket.in(tx.to._id).emit("newTransactionRecieved",tx)
    })
    socket.on("merchant",(id)=>{
        socket.join(id);
        socket.emit("connected")
    })
    socket.on("merchantTransfer",(tx)=>{
        socket.in(tx.from._id).emit("newTransactionRecieved",tx)
    })
})
