const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const loginSystem = require('./routers/loginSystem');
const DB = require('./utils/DB');
const authorize = require('./utils/authorize');
const Game = require('./components/Game');
const Player = require('./components/Player');

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST'],
    }
});

const { games } = require('./utils/data');

const PORT = process.env.PORT || 3000;

io.on('connection', socket => {
    const filteredGames = games.filter(g => !g.finished);
    games.splice(0);
    games.push(...filteredGames);

    let game = games.find(g => g.isFree());
    if (!game) {
        game = new Game(io);
        games.push(game);
    }
    game.addPlayer(new Player(socket));
});

app.use(express.static(path.join(__dirname, 'static')));
app.use('/', loginSystem);

app.get('/', cookieParser(),  authorize, (req, res) => {
    if (!req.user) {
        res.redirect('/login');
        return;
    }

    res.send("WELCOME INSIDE " + req.user);
});

(async () => {
    console.log("Connecting to DB...");
    await DB.init();
    server.listen(PORT, () => console.log(`server listening on ${PORT}`));
})();
