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
        users: {},
    };
}

function createUser() {
    return { strikes : 0 };
}

let badWords = [
    'babyTrucker',
    'toasty',
    'noglot',
    'stardbae',
    'sick',
    'duck',
];

function detectBadWord(message) {
    /* `|` is the alternation operator in regular expressions. So the
     * expression will look for the first of these words that matches
     * something in the string.
     */
    let detector = RegExp(badWords.join('|'), 'i');
    return detector.test(message);
}

function replaceBadWords(message) {
    let detector = RegExp(badWords.join('|'), 'gi');
    return message.replace(detector, function(match) {
        return "*".repeat(match.length);
    });
}

function sendMessageTo(socket, sender, message, roomName) {
    let badWords = detectBadWord(message);
    let room = rooms[roomName];
    let finalMessage = message;
    if (badWords) {
        finalMessage = replaceBadWords(message);
        let strikes = room.users[sender].strikes;
        strikes += 1;
        if (strikes > 2) {
            // Kick this guy. What a jerk.
            socket.disconnect(true);
            io.to(roomName).emit(
                'chat message', `${sender} was kicked. `);
            return;
        } else {
            let user = room.users[sender];
            user.strikes = strikes;
        }
    }
    room.messages.push(finalMessage);
    io.to(roomName).emit('chat message', finalMessage);
}

function joinRoom(socket, roomName, nickname) {
    let room = rooms[roomName];
    if (!room) {
        room = createRoom({name:roomName});
        rooms[roomName] = room;
    }
    if (room.users[nickname]) {
        socket.emit('join fail', 'nickname taken');
        return;
    }

    room.users[nickname] = createUser();

    socket.join(roomName);
    socket.on('chat message', function(message) {
        console.log(`Received message (${roomName}):`, message);
        sendMessageTo(socket, nickname, message, roomName);
    });
    socket.emit('join succeed');

    /* I moved this here because the event listeners should only be
     * placed on a successful join. Otherwise, if someone failed to
     * join over and over again, we'd keep putting event listeners for
     * disconnect, despite not needing all of them.
     */
    socket.on('disconnect', function () {
        console.log(nickname, 'disconnected from', roomName);
        io.to(roomName).emit('chat message', `${nickname} has left.`);
        delete room.users[nickname];
    });

    /* Give chat history to new users. */
    for (let message of room.messages) {
        socket.emit('chat message', message);
    }
    /* I decided that user join/leave messages were not worth keeping
     * in the message log. That may not be right for you.
     * I put this after the history so that the "joined" message would
     * show up after the replay of history messages for the person
     * that just joined.
     */
    io.to(roomName).emit('chat message', `${nickname} has joined.`);
}

io.on('connection', function(socket) {
    console.log("A user connected to server.");
    socket.on('join room', function (roomName, nickname) {
        console.log(nickname, "connected to", roomName);
        joinRoom(socket, roomName, nickname);

    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

/* Glossary:
 * `CLIENT`     :   The JS running on index.html.
 * `SERVER`     :   This program.
 * `->`         :   "Sends" or "Transmits". CLIENT transmits to SERVER, and
 *                  SERVER transmits to CLIENT.
 * `<-`         :   "Receives". CLIENT receives from SERVER, and
 *                  SERVER receives from CLIENT.
 * `->(ROOM)`   :   Transmits to the room of a CLIENT.
 *
 * Communication:
 *
 * CLIENT listens for:
 *      CHAT_MESSAGE
 *      JOIN_FAIL
 *      JOIN_SUCCEED
 *
 * CLIENT -> JOIN_ROOM, room name, nickname
 * SERVER:
 *   Creates room if not exists, or finds existing room
 *   Checks to see if nickname exists already in room's list of users.
 *   If name exists:
 *      SERVER -> JOIN_FAIL, reason
 *   ELSE:
 *      SERVER -> JOIN_SUCCEED
 *
 * IF CLIENT <- JOIN_FAIL
 *      client can try to address the sent reason.
 * ELSE IF CLIENT <- JOIN_SUCCEED
 *      Then the client has joined a room and is now able to send
 *      CHAT_MESSAGE events.
 *      The CLIENT may receive a set 'chat message' events right after
 *      or before JOIN_SUCCEED.
 *
 * MOST OF REST OF COMMUNICATION IS:
 *      CLIENT -> CHAT_MESSAGE, message
 *      SERVER ->(ROOM) CHAT_MESSAGE, message
 *
 *
 * CONNECTION ends on one of the following:
 *
 * CLIENT -> DISCONNECT
 * SERVER closes connection.
 */
