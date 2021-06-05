class NetworkNode {
    constructor(x, y) {
        this.ownedBy = null;
        this.position = [x, y];
        this.level = 1;
    }

    isFree() {
        return this.ownedBy == null;
    }

    capture(playerid) {
        this.ownedBy = playerid;
    }

    fortify() {
        this.level++;
    }
}

module.exports = NetworkNode;
