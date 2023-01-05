const http = require("http")
const express = require("express")
const cors = require("cors")
const socketIO = require("socket.io")

const app = express()
const port = 5000 || process.env.port

const users = [{}] // storing all the users in this array

app.use(cors())
app.get("/", (req, res) =>{
    res.send("Hello")
})

const server = http.createServer(app)

const io = socketIO(server)

io.on("connection", (socket) =>{
    console.log("new connection")

    socket.on("joined", ({user}) =>{
        users[socket.id] = user
        console.log(`${users[socket.id]} has joined`) // consoling user's name in the cmd or terminal
        // when user joins, that message will be sent to everyone except the user
        socket.broadcast.emit(`userJoined`,  {user:"Admin", message:`${users[socket.id]} has joined`})
        // sending the data 
        socket.emit(`welcome`, {user:"Admin", message: `Welcome,${users[socket.id]}`}) 
    })

    socket.on('message',({message,id})=>{
        // io.emit --->sending user's message to the whole circuit because it shoule be recieved by other people as well as user it self
        io.emit('sendMessage',{user:users[id],message,id}); 
    })
    
    socket.on("disconnected", () =>{ // getting the event from the frontend (client side or chat_application file)
        socket.broadcast.emit("leave", {user:"Admin", message:`${users[socket.id]} has left`})
        console.log("User left") //consoling user left in the cmd or terminal
    })
})

server.listen(port, () =>{
    console.log(`server is working on http://localhost:${port}`)
})