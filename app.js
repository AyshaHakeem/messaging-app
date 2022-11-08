if(process.eventNames.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const socketio = require('socket.io')
const io = socketio(server)
const users = {} // object to hold socket of users


server.listen(process.env.PORT || 3000)

app.use(express.static('public'))

app.get('/', (req,res)=>{
    res.send('index')
})

io.sockets.on('connection', socket => { 

    socket.on('new user', (id , callback) => {
        if(id in users){
            callback(false)
        } else{
            callback(true)
            socket.userID=id
            // save user as a socket with id as the socket's property
            users[id] = socket
            updateUserList()        } 
    })

    // upon receiving the message
    socket.on('send message', data=>{

        // send event to user
        io.sockets.emit("new message" , data);
        
    })

    socket.on('disconnect',()=>{
        let id = socket.userID
        delete users[socket.userID]
        if(id){
            updateUserList()        
        }
    })

    function updateUserList(){
        io.sockets.emit('users', Object.keys(users))
    }
})


