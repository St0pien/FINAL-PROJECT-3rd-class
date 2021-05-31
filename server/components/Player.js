const { v4: uuid } = require('uuid');

class Player {
    constructor(socket) {
        this.socket = socket;
        this.id = uuid();
        this.startingPosition = null;
    }
}

module.exports = Player;