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

    destroy() {
        this.ownedBy = null;
        this.level = 1;
    }

    attack() {
        const chance = Math.random();
        if (true) {
            this.destroy();
            return true;
        } else {
            return; false;
        }
    }
}

module.exports = NetworkNode;
