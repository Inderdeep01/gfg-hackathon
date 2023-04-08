const http = require('http')
require('dotenv').config()
const app = require('./app')

const server = http.createServer(app)

const PORT = process.env.PORT

server.listen(PORT)