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

let rooms = {
    1 : io.of('/room1'),
    2 : io.of('/room2'),
};

let chatLogs = {
    1 : [],
    2 : [],
}

for (let room in rooms) {
    console.log('a user connected to room', room);
    rooms[room].on('connection', function (socket) {
        socket.on('disconnect', function () {
            console.log('a user disconnected from room', room);
        });
        socket.on('chat message', function(data) {
            console.log(`Received message (${room}):`, data);
            chatLogs[room].push(data);
            rooms[room].emit('chat message', data);
        });
        // Totally optional. You can ignore this if you want to, I
        // just threw this in here in case you wanted to see how it
        // could kinda get done. The concept wouldn't change from
        // this, just the implementation.
        // In reality, some sort of persistent storage would be used
        // because...
        // - Not everyone cares about history.
        // - No one needs all the history immediately. They can just
        //   start from wherever the chat currently is, and scrolling
        //   upward could cause an event to fire which fetches
        //   previous 50 messages or so.
        // - Storing all the history in memory is a really bad idea.
        //   Memory (RAM) is small, storage (Hard Disk) is big. If the
        //   average message is 100 characters long, and there's 100
        //   rooms, and there's eventually around 10000 messages per
        //   room, you've already got to store roughly 10 ** (2 + 2 +
        //   4) = 10 ** 8 = 100 million bytes (100 MB). That's a
        //   no-no.
        for (let message of chatLogs[room]) {
            socket.emit('chat message', message);
        }
    });
}

http.listen(3000, function(){
    console.log('listening on *:3000');
});
    

/*
 * - If a client connects to the root, then it seems that they connect
 *   to all namespaces. The namespaces are hierarchical.
 * - io.on : Events for all connections to this socket.
 * - namespace.on : Events for all connections to this namespace.
 */
