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

        this.io.on('move', ({ type, cords }) => {
            switch (type) {
                case 'capture':
                    this.onCapture(cords);
                    break;
            }
        });

        this.io.on('enemyMove', ({ type, cords }) => {
            switch (type) {
                case 'capture':
                    this.onEnemyCapture(cords);
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
                const z = i * (this.nodeSize + this.space) - width * (this.nodeSize + this.space) / 2;
                const x = j * (this.nodeSize + this.space) - height * (this.nodeSize + this.space) / 2;
                node.position.set(x, 0, z);
                node.label.sprite.position.set(x-3, -1, z-2);

                this.nodes[i][j] = node;
            }
        }
    }

    findNodesinRange(cords, range, ownedByPlayer=true) {
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

        if (this.selectedNode.captured && !this.selectedNode.isOwnedByPlayer) {
            this.toolbar.setAction('Attack');
            return;
        }

        if (this.selectedNode.isOwnedByPlayer) {
            this.toolbar.setAction('Fortify');
            return;
        }

        if (this.findNodesinRange([i, j], 1).length > 0) {
            this.toolbar.setAction('Capture');
            return;
        }

        this.toolbar.setAction('Unreachable');
    }

    update() {
        if (this.selectedNode.captured && !this.selectedNode.ownedByPlayer) {
            return 'Attack';
        }
    }

    placePlayer(cords) {
        const startNode = this.nodes[cords[0]][cords[1]];
        let { x, z } = startNode.position
        if (x < 0) {
            x -= 10;
            z -= 5;
        } else {
            x += 10;
            z -= 5;
        }
        this.playerStart = new StartPoint(this.scene, [x, z], 0x00ff00);
        this.connections.push(new Connection(this.scene, this.playerStart.position, startNode.position, 0x00ff00));
        startNode.onCapture();
    }

    placeEnemy(cords) {
        const startNode = this.nodes[cords[0]][cords[1]];
        let { x, z } = startNode.position;
        if (x < 0) {
            x -= 10;
            z -= 5;
        } else {
            x += 10;
            z -= 5;
        }
        this.enemyStart = new StartPoint(this.scene, [x, z], 0xff0000);
        this.connections.push(new Connection(this.scene, this.enemyStart.position, startNode.position, 0xff0000));
        startNode.onEnemyCapture();
    }

    placeTarget(cords) {
        const endNode = this.nodes[cords[0]][cords[1]]
        let { x, z } = endNode.position;
        z += 20;
        this.target = new StartPoint(this.scene, [x, z], 0x0000ff);
        this.target.light.position.z -= 30;
        this.connections.push(new Connection(this.scene, this.target.position, endNode.position, 0x0000ff));
    }

    onCapture(cords) {
        const [r, c] = cords;
        this.nodes[r][c].onCapture();
        const parents = this.findNodesinRange(cords, 1);
        parents.forEach(parent => {
            this.connections.push(new Connection(this.scene, parent.position, this.nodes[r][c].position, 0x00ff00));
        })

        setTimeout(() => {
            this.toolbar.setAction('');
            this.selectedNode.deselect();
        }, 500)
    }

    onEnemyCapture(cords) {
        const [r, c] = cords;
        this.nodes[r][c].onEnemyCapture();
        const parents = this.findNodesinRange(cords, 1, false);
        parents.forEach(parent => {
            this.connections.push(new Connection(this.scene, parent.position, this.nodes[r][c].position, 0xff0000));
        })        
    }

    update(timeElapsed) {
        if (this.input.keys.action && this.selectedNode) {
            if (this.findNodesinRange(this.selectedNode.cords, 1).length > 0) {
                this.selectedNode.capture();
            }

            this.input.keys.action = false;
        }

        this.nodes.reduce((a, n) => [...a, ...n]).forEach(node => {
            node.update(timeElapsed);
        });

        this.connections.forEach(c => {
            c.update();
        })
    }
}