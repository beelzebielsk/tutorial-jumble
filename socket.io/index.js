// Sources:
// - <https://socket.io/get-started/chat/> For the basic structure.
// - <https://socket.io/docs/rooms-and-namespaces/> For the use of
//   namespaces.

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

let rooms = {};

function createRoom({name}) {
    return {
        name,
        messages: [],
        users: [],
    };
}

function joinRoom(socket, roomName, nickname) {
    let room = rooms[roomName];
    if (!room) {
        room = createRoom({name:roomName});
        rooms[roomName] = room;
    }
    socket.join(roomName);
    socket.on('chat message', function(message) {
        console.log(`Received message (${roomName}):`, message);
        io.to(roomName).emit('chat message', message);
        room.messages.push(message);
    });
    /* Give chat history to new users. */
    for (let message of room.messages) {
        socket.emit('chat message', message);
    }
}

io.on('connection', function(socket) {
    console.log("A user connected to server.");
    socket.on('join room', function (roomName) {
        console.log("A user connected to room", roomName);
        joinRoom(socket, roomName);

        socket.on('disconnect', function () {
            console.log('a user disconnected from room', roomName);
        });
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

/*
 * - If a client connects to the root, then it seems that they connect
 *   to all namespaces. The namespaces are hierarchical.
 * - io.on : Events for all connections to this socket.
 * - namespace.on : Events for all connections to this namespace.
 */
