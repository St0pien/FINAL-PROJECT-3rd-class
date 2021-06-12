import Notifier from "../UI/Notifier";
import Connection from "./Connection";
import Node from "./Node";
import StartPoint from "./StartPoint";

export default class Network {
    constructor(scene, io, input, toolbar, size = [9, 10], nodeSize = 10, space = 5) {
        this.scene = scene;
        this.io = io;
        this.toolbar = toolbar;
        this.input = input;
        this.size = size;
        this.nodeSize = nodeSize;
        this.space = space;
        this.nodes = [];
        this.connections = [];
        this.spawnNodes();

        this.availableAction = null;
        this.notifier = new Notifier();

        this.io.on('move', ({ type, cords }) => {
            switch (type) {
                case 'capture':
                    this.onCapture(cords);
                    break;

                case 'fortify':
                    this.nodes[cords[0]][cords[1]].onFortify();
                    this.selectedNode.deselect();
                    this.availableAction = null;
                    this.toolbar.setAction('');
                    break;

                case 'attack':
                    this.notifier.showGoodNotification('Access Granted!');
                    this.onAttack(cords);
                    break;

                case 'denied':
                    this.notifier.showBadNotification('Access Denied!');
                    break;
            }
        });

        this.io.on('enemyMove', ({ type, cords }) => {
            switch (type) {
                case 'capture':
                    this.onEnemyCapture(cords);
                    break;

                case 'fortify':
                    this.nodes[cords[0]][cords[1]].onFortify();
                    break;

                case 'attack':
                    this.notifier.showBadNotification('Your network has been corrupted')
                    this.onAttack(cords);
                    break;

                case 'denied':
                    this.notifier.showGoodNotification('Attack on your network failed!');
                    break;
            }
        });
    }

    spawnNodes() {
        const [height, width] = this.size;
        for (let i = 0; i < height; i++) {
            this.nodes[i] = [];
            for (let j = 0; j < width; j++) {
                const node = new Node(this.scene, [i, j], this.io);
                node.onClick = () => {
                    this.selectNode(i, j);
                }
                const z = i * (this.nodeSize + this.space) - (width - 1.5) * (this.nodeSize + this.space) / 2;
                const x = j * (this.nodeSize + this.space) - (height - 1.5) * (this.nodeSize + this.space) / 2;
                node.position.set(x, 0, z);
                node.label.sprite.position.set(x - 3, -1, z - 2);

                this.nodes[i][j] = node;
            }
        }
    }

    findNodesinRange(cords, range, ownedByPlayer = true) {
        const nodes = this.nodes.reduce((a, n) => [...n, ...a]);
        let ownedNodes = nodes.filter(n => n.isOwnedByPlayer == ownedByPlayer && n.captured);
        ownedNodes = ownedNodes.filter(n => n.cords[0] != cords[0] || n.cords[1] != cords[1]);
        const result = ownedNodes.filter(n => {
            const [r, c] = n.cords;
            return (Math.abs(r - cords[0])) + (Math.abs(c - cords[1])) <= range;
        });

        return result;
    }

    selectNode(i, j) {
        if (this.selectedNode) {
            this.selectedNode.deselect();
        }
        this.selectedNode = this.nodes[i][j];
        this.selectedNode.select();

        let canBeAttacked = this.selectedNode.captured;
        canBeAttacked = canBeAttacked && !this.selectedNode.isOwnedByPlayer;
        canBeAttacked = canBeAttacked && this.findNodesinRange([i, j], 3).length > 0;
        let [x, y] = this.enemyStart.cords;
        canBeAttacked = canBeAttacked && (i != x || j != y);


        if (canBeAttacked) {
            this.availableAction = 'attack';
            this.toolbar.setAction('Attack');
            return;
        }

        [x, y] = this.playerStart.cords;
        const notStart = i != x || j != y;
        if (this.selectedNode.isOwnedByPlayer && notStart) {
            this.availableAction = 'fortify';
            this.toolbar.setAction('Fortify');
            return;
        }

        if (this.findNodesinRange([i, j], 1).length > 0 && notStart) {
            this.availableAction = 'capture';
            this.toolbar.setAction('Capture');
            return;
        }

        this.availableAction = null;
        this.toolbar.setAction('Unreachable');
    }

    placePlayer(cords) {
        const startNode = this.nodes[cords[0]][cords[1]];
        let { x, z } = startNode.position
        if (x < 0) {
            x -= 15;
            z -= 10;
        } else {
            x += 15;
            z -= 10;
        }
        this.playerStart = new StartPoint(this.scene, cords, [x, z], 0x00ff00);
        this.connections.push(new Connection(this.scene, [null, null], cords, this.playerStart.position, startNode.position, 0x00ff00));
        startNode.onCapture();
    }

    placeEnemy(cords) {
        const startNode = this.nodes[cords[0]][cords[1]];
        let { x, z } = startNode.position;
        if (x < 0) {
            x -= 15;
            z -= 10;
        } else {
            x += 15;
            z -= 10;
        }
        this.enemyStart = new StartPoint(this.scene, cords, [x, z], 0xff0000);
        this.connections.push(new Connection(this.scene, [null, null], cords, this.enemyStart.position, startNode.position, 0xff0000));
        startNode.onEnemyCapture();
    }

    placeTarget(cords) {
        const endNode = this.nodes[cords[0]][cords[1]]
        let { x, z } = endNode.position;
        z += 30;
        this.target = new StartPoint(this.scene, cords, [x, z], 0x0000ff);
        this.target.light.position.z -= 30;
        this.connections.push(new Connection(this.scene, [null, null], cords, this.target.position, endNode.position, 0x0000ff));
    }

    onCapture(cords) {
        const [r, c] = cords;
        this.nodes[r][c].onCapture();
        const parents = this.findNodesinRange(cords, 1);
        parents.forEach(parent => {
            this.connections.push(new Connection(this.scene, parent.cords, cords, parent.position, this.nodes[r][c].position, 0x00ff00));
        })

        setTimeout(() => {
            this.availableAction = null;
            this.toolbar.setAction('');
            this.selectedNode.deselect();
        }, 500)
    }

    onEnemyCapture(cords) {
        const [r, c] = cords;
        this.nodes[r][c].onEnemyCapture();
        const parents = this.findNodesinRange(cords, 1, false);
        parents.forEach(parent => {
            this.connections.push(new Connection(this.scene, parent.cords, cords, parent.position, this.nodes[r][c].position, 0xff0000));
        })
    }

    onAttack(listOfCords) {
        listOfCords.forEach(cords => {
            const [r, c] = cords;
            this.nodes[r][c].onAttack();

            // Handle connections
            this.connections.forEach(conn => {
                if (conn.startCords[0] == r && conn.startCords[1] == c) {
                    conn.remove();
                }

                if (conn.endCords[0] == r && conn.endCords[1] == c) {
                    conn.remove();
                }
            })
            this.connections = this.connections.filter(conn => {
                return conn.startCords[0] != r || conn.startCords[1] != c && conn.endCords[0] != r || conn.endCords[1] != c;
            });

        })

        this.availableAction = null;
        this.toolbar.setAction('');
        this.selectedNode.deselect();
    }

    update(timeElapsed) {
        if (this.input.keys.action && this.selectedNode) {
            if (this.findNodesinRange(this.selectedNode.cords, 1).length > 0) {
                this.selectedNode.capture();
            }
            switch (this.availableAction) {
                case 'capture':
                    this.selectedNode.capture();
                    break;

                case 'fortify':
                    this.selectedNode.fortify();
                    break;
                case 'attack':
                    this.selectedNode.attack();
            }

            this.input.keys.action = false;
        }

        this.nodes.reduce((a, n) => [...a, ...n]).forEach(node => {
            node.update(timeElapsed);
        });

        this.connections.forEach(c => {
            c.update();
        })

        this.playerStart.update();
        this.enemyStart.update();
        this.target.update();
    }
}