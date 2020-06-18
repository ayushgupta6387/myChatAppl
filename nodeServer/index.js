// Node Server which will handle socket io connections
const io = require('socket.io')(process.env.port || 3000)

//socket.io server is running which is an instance of http and attaches itself to it 
// this server listen incoming events

const users = {};

io.on('connection', socket =>{ // it is an socket.io instance which listen many events
    socket.on('new-user-joined', name => { // when something happen with a particular connection, then  what happen to be with that connection handled by socket.on (new-user-joined is an event)

        // console.log("New user", name) // we get name on our server
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name); // this will emit all other person except who have joined (send message to others 'user-joined' with their name)
    });

// when someone sending a message then --
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

// when someone disconnect chat
    socket.on('disconnect', message => { //disconnect
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    })
})