const express = require('express');
const app = express();
const Game = require('./components/Game');
const Player = require('./components/Player');

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST'],
    }
});

const { games } = require('./data');

const PORT = process.env.PORT || 3000;

io.on('connection', socket => {
    let game = games.find(g => g.isFree());
    if (!game) {
        game = new Game(io);
        games.push(game);
    }
    game.addPlayer(new Player(socket));
});

server.listen(PORT, () => console.log(`server listening on ${PORT}`));
