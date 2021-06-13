const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
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
        game = new Game();
        games.push(game);
    }
    game.addPlayer(new Player(socket));
});

app.use(express.static(path.join(__dirname, 'static')));
app.use(cors({
    origin: "http://localhost:8080",
    credentials: true
}));
app.use('/', loginSystem);

app.get('/', cookieParser(),  authorize, (req, res) => {
    if (!req.user) {
        res.redirect('/login');
        return;
    }

    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/stats', cookieParser(), authorize, async (req, res) => {
    if (!req.user) {
        res.send(JSON.stringify({
            user: 'Anonymouse',
            wins: 0,
            defeats: 0
        }));
        return;
    }

    const stats = await DB.getUserStats(req.user);
    res.type('application/json');
    res.send(JSON.stringify(stats));
});

(async () => {
    console.log("Connecting to DB...");
    await DB.init();
    server.listen(PORT, () => console.log(`server listening on ${PORT}`));
})();
