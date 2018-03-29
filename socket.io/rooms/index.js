var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

let room = 0;
io.on('connection', function(socket) {
    let currentRoom = room;
    socket.join(currentRoom);
    room = (room + 1) % 2;
    console.log("A user connected to room", currentRoom);
    socket.on('disconnect', function () {
        console.log('a user disconnected from room', currentRoom);
    });
    socket.on('chat message', function(data) {
        console.log(`Received message (${currentRoom}):`, data);
        io.to(currentRoom).emit('chat message', data);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
