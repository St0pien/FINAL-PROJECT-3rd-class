const { v4: uuid } = require('uuid');
const NetworkNode = require('./NetworkNode');

class Game {
    constructor(io) {
        this.id = uuid();
        this.io = io;
        this.players = [];
        this.nodes = [];
        this.size = [10, 9];
        this.finished = false;

        for (let i = 0; i < this.size[0]; i++) {
            this.nodes[i] = [];
            for (let j = 0; j < this.size[1]; j++) {
                this.nodes[i][j] = new NetworkNode(i, j);
            }
        }

        this.target = [9, Math.floor(this.size[1] / 2)];

        this.currentPlayer = null;
    }

    isFree() {
        return this.players.length < 2;
    }

    getEnemy(player) {
        return this.players.find(p => p.id != player.id);
    }

    addPlayer(player) {
        player.startingPosition = [0, (this.size[1] - 1) * this.players.length];

        player.socket.join(this.id);
        player.socket.emit('config', {
            startingPosition: player.startingPosition,
            board: this.size,
            target: this.target
        });
        this.players.push(player);

        if (!this.isFree()) {
            this.start();
        }
    }

    start() {
        this.players.forEach(p => {
            p.socket.emit('start', {
                enemyPosition: this.getEnemy(p).startingPosition
            });

            this.nodes[p.startingPosition[0]][p.startingPosition[1]].capture(p.id);

            p.socket.on('move', ({ cords, type }) => {
                switch (type) {
                    case 'capture':
                        this.onCapture(p, cords);
                        break;
                    case 'fortify':
                        this.onFortify(p, cords);
                        break;
                    case 'attack':
                        this.onAttack(p, cords)
                        break;
                }
            });

            p.socket.on('disconnect', () => {
                this.getEnemy(p).socket.emit('abort');
                this.finished = true;
            });
        });
        this.nextPlayer();
    }

    findNodesinRange(playerid, cords, range) {
        const nodes = this.nodes.reduce((a, n) => [...n, ...a]);
        const ownedNodes = nodes.filter(n => n.ownedBy == playerid);
        const result = ownedNodes.filter(n => {
            const [r, c] = n.position;
            return (Math.abs(r - cords[0])) + (Math.abs(c - cords[1])) <= range;
        });

        return result;
    }

    onCapture(player, cords) {
        if (this.currentPlayer.id != player.id) return;

        const [r, c] = cords;
        const node = this.nodes[r][c];

        if (!node.isFree()) return;

        if (this.findNodesinRange(player.id, cords,  1).length == 0) return;

        node.capture(this.currentPlayer.id);

        const [row, col] = this.target;

        if (row == r && col == c) {
           this.onWin();
        }

        this.currentPlayer.socket.emit('move', {
            type: 'capture',
            cords
        });
        this.getEnemy(this.currentPlayer).socket.emit('enemyMove', {
            type: 'capture',
            cords
        })

        this.nextPlayer();
    }

    onFortify(player, cords) {
        if (this.currentPlayer.id != player.id) return;
        const [r, c] = cords;
        const node = this.nodes[r][c];

        if (node.ownedBy != player.id) return;

        node.fortify();

        this.currentPlayer.socket.emit('move', {
            type: 'fortify',
            cords
        });
        this.getEnemy(this.currentPlayer).socket.emit('enemyMove', {
            type: 'fortify',
            cords
        })

        this.nextPlayer();
    }

    traverseStep(graph, cords) {
        const [r, c] = cords;
        graph[r][c]++;
        for (let i=-1; i<=1; i++) {
            for (let j=-1; j<=1; j++) {
                if (Math.abs(i) == Math.abs(j)) continue;
                if (r+i < 0) continue;
                if (r+i >= this.size[0]) continue;
                if (c+j < 0) continue;
                if (c+j >= this.size[1]) continue;

                if (graph[r+i][c+j] == 1) {
                    this.traverseStep(graph, [r+i, c+j]);
                }
            }
        }
        return graph;
    }

    traverseNodes(player) {
        const nodesAttacked = [];

        const graph = this.nodes.map(row => {
            return row.map(node => node.ownedBy == player.id ? 1 : 0);
        });
        this.traverseStep(graph, player.startingPosition);
        graph.forEach((arr, row) => {
            arr.forEach((node, col) => {
                if (node == 1) {
                    nodesAttacked.push(this.nodes[row][col]);
                }
            });
        });

        return nodesAttacked;
    }

    onAttack(player, cords) {
        if (this.currentPlayer.id != player.id) return;
        const [r, c] = cords;
        const node = this.nodes[r][c];

        if (node.ownedBy != this.getEnemy(player).id) return;

        if (this.findNodesinRange(player.id, cords, 3).length <= 0) return;

        const success = node.attack();
        if (success) {
            const destroyed = this.traverseNodes(this.getEnemy(player));
            destroyed.forEach(n => n.destroy());

            const affectedCords = [node.position, ...destroyed.map(({ position }) => position)];

            this.currentPlayer.socket.emit('move', {
                type: 'attack',
                cords: affectedCords
            });
            this.getEnemy(this.currentPlayer).socket.emit('enemyMove', {
                type: 'attack',
                cords: affectedCords    
            })
        } else {
            this.currentPlayer.socket.emit('move', {
                type: 'denied',
                cords
            });
            this.getEnemy(this.currentPlayer).socket.emit('enemyMove', {
                type: 'denied',
                cords
            })
        }

        this.nextPlayer();
    }

    onWin() {
        this.currentPlayer.socket.emit('win');
        this.getEnemy(this.currentPlayer).socket.emit('lost');

        this.finished  = true;
    }

    nextPlayer() {
        if (this.currentPlayer == null) {
            this.currentPlayer = this.players[0];
        } else {
            this.currentPlayer = this.getEnemy(this.currentPlayer);
        }

        this.currentPlayer.socket.emit('turn', true);
        this.getEnemy(this.currentPlayer).socket.emit('turn', false);
    }
}

module.exports = Game;