const socket = io('http://localhost:3000');

const form = document.getElementById('send-form');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// audio that will use in receiving messages
var audio = new Audio('ting.mp3');

// function that will append event info to the container 
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
    audio.play();
    }
}

// whenever user joined ask name and let the server know 
const name = prompt("Enter your name to join chat");
socket.emit('new-user-joined', name);

// now send message, when someone joined and receive their name  from the server
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'right')
})

// if server send a message then how someone receive messages
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left')
})

// when someone left the chat append info to the container 
socket.on('left', name => {
    append(`${name} left the chat`, 'right')
})


// whenever someone submit the form or going to send message send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault(); // by this page not reloaded
    const message = messageInput.value;
    append(`You: ${message}`, 'right')
    socket.emit('send', message)
    messageInput.value = '' // after submitting input space remain empty
})