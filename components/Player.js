const { v4: uuid } = require('uuid');

class Player {
    constructor(socket) {
        this.socket = socket;
        this.id = uuid();
        this.startingPosition = null;
        this.nick = 'Anonymouse';
    }

    setNick(nick) {
        if (nick) {
            this.nick = nick;
        }
    }
}

module.exports = Player;