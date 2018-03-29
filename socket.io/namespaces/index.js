var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

let rooms = {
    1 : io.of('/room1'),
    2 : io.of('/room2'),
};

for (let room in rooms) {
    console.log('a user connected to room', room);
    rooms[room].on('connection', function (socket) {
        socket.on('disconnect', function () {
            console.log('a user disconnected from room', room);
        });
        socket.on('chat message', function(data) {
            console.log(`Received message (${room}):`, data);
            rooms[room].emit('chat message', data);
        });
    });
}


http.listen(3000, function(){
    console.log('listening on *:3000');
});
