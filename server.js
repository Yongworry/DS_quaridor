const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const {Board, ainb} = require("./quaridor.js");
var board = new Board();
var player = 0;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/main.html');
});
app.use(express.static("./game"));


io.on('connection', (socket) => {
    socket.emit('player assign', "You are player " + player);
    socket.emit('player', player);
    socket.emit('new board', [board.show(), [board.players[0].position, board.players[1].position]]);
    player = 1- player;
    console.log('a user connected');
    
    socket.on('onmouse', (msg) => {
        var player = msg[1];
        if (msg[0] === false){
            socket.emit('viewboard', [board.show(),[board.players[0].position, board.players[1].position]]);
            return false;
        }
        if (player === board.current_player){
            if (msg[0].length === 3){
                var para = [parseInt(msg[0][0]), parseInt(msg[0][1]), parseInt(msg[0][2])];
                if (board.can_put_block_at([para[0], para[1]], para[2])){
                    socket.emit('viewfirst', [board.show(),[board.players[0].position, board.players[1].position], para]);
                    return;
                }
            }   else if (msg[0].length === 2){
                    var pcoor = board.players[player].position;
                    var para = [msg[0][0] - pcoor[0], parseInt(msg[0][1]) - pcoor[1]];
                    if (ainb([para[0], para[1]], board.possible_moves(board.current_player))){
                        socket.emit('playerview', [board.show(),[board.players[0].position, board.players[1].position], [msg[0][0], msg[0][1]]]);
                        return;
                    }
                }
        }
        socket.emit('viewboard', [board.show(),[board.players[0].position, board.players[1].position]]);
    })
    
    socket.on('input', (msg) => {
        var player = msg[1];

        if (player !== board.current_player || msg[0] === false){
            //socket.emit('error', 'wrong input!');
            return false;
        }
        var para = new Array();
        if (msg[0].length === 2){
            var pcoor = board.players[player].position;
            para = [parseInt(msg[0][0]) - pcoor[0], parseInt(msg[0][1]) - pcoor[1]];
        }   else if (msg[0].length === 3){
            para = [parseInt(msg[0][0]), parseInt(msg[0][1]), parseInt(msg[0][2])];
        }   else{
            var flag = false;
        }
        var flag = board.turn(player, para);
        if (flag === false){
            socket.emit('error', 'wrong input');
            return false;
        }   if (flag === true){
            io.emit('game end', board.current_player);
            board = new Board();
            player = 0;
        }
        socket.emit('remainblock', board.players[player].block);
        io.emit('after turn', [board.show(), [board.players[0].position, board.players[1].position]]);
        io.emit()
    });
    socket.on('disconnect', () =>{
        console.log('user disconnected');
    });

    socket.on('chat', (msg) => {
        io.emit('chat', msg);
      });
});

server.listen(process.env.PORT || 3000);