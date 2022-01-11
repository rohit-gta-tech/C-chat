const http = require('http')
const express = require('express')
const cors = require('cors')
const socketIo = require("socket.io")

const app = express()
const port = 4500 || process.env.PORT

const users = []


app.use(cors)
app.get("/", (req, res) => {
    res.send("its working")
})

const server = http.createServer(app)

const io = socketIo(server)

io.on("connection", (socket) => {

    socket.on('joined', ({ user }) => {
        users[socket.id] = user
        socket.emit('welcome', {user: "Admin", message: `Welcome to the chat, ${users[socket.id]}`})
        socket.broadcast.emit('userJoined', { user: 'Admin', message: `${users[socket.id]} has joined`})
    })

    socket.on('message', ({ message, id }) => {
        io.emit('sendMessage', {user: users[id], message, id })
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', {user:'Admin', message: `${users[socket.id]} has left`})
    })
    
})

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})