const socket = io.connect()

// login

const IDform = document.getElementById('setID')
const IDerror = document.getElementById('IDerror')
const IDbox = document.getElementById('userID')
const messageForm = document.getElementById('send-message')
const messageBox = document.getElementById('message')
const chat = document.getElementById('chat')
const userList = document.getElementById('userList')

let sender= ''

// user register
IDform.addEventListener('submit',(e)=>{
    e.preventDefault()  
    let ID = IDbox.value
     if(Number(ID) && ID.length==6){
        socket.emit('new user',ID, data=>{
            // if callback returns true
            if(data){
                document.getElementById('userWrap').style.display = 'none'
                document.querySelector('.chatHead').style.display = 'block'
                document.getElementById('contentWrap').style.display = 'flex'
                sender = ID
            }else{
                IDerror.innerText = 'That user ID is already taken, try again!'
            }
        })
     }else{
        IDerror.innerText = 'User ID can only contain six numbers from 0-9'
     }
    IDbox.value = ''
})


// chat

messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    let message = messageBox.value

    // send event to server when message is sent
    socket.emit('send message', {
        sender: sender,
        message: message
    })
    
    messageBox.value = ''
    
})

//received from server for displaying
socket.on("new message", data=>{
    chat.insertAdjacentHTML('beforeend',`<p class="user-msg"><b>${data.sender}:</b><br>${data.message}</p>`)
}) 

// upon user registration

socket.on('users', data=>{
    userList.innerHTML = ''
    for(let i = 0; i<data.length; i++){
        userList.innerHTML += `<li>${data[i]}</li>` 
    }
} )







