import { io } from 'socket.io-client';
import { AmbientLight, Clock, DefaultLoadingManager, Scene } from 'three';
import Camera from "./Camera";
import Renderer from "./Renderer";
import Network from './network/Network';
import Input from './Input';
import { loadModels } from './loaders/Models';
import Menu from './UI/Menu';
import Toolbar from './UI/Toolbar';

export default class Main {
    constructor(container) {
        this.container = container;
        this.scene = new Scene();
        this.renderer = new Renderer(this.scene, container);
        this.input = new Input();
        this.camera = new Camera(this.renderer, this.scene, this.input);
        this.light = new AmbientLight(0xffffff, 0.2);
        this.scene.add(this.light);
        this.clock = new Clock();

        this.render();

        this.menu = new Menu(() => this.connect());
    }

    connect() {
        this.io = io(process.env.API_URL);

        this.io.on('config', ({ startingPosition, board, target }) => {
            this.boardSize = board;
            this.startingPosition = startingPosition;
            this.target = target;
        });

        this.io.on('start', ({ enemyPosition }) => {
            this.enemyPosition = enemyPosition;
            this.menu.load();
            DefaultLoadingManager.onLoad = () => {
                this.menu.hide();
            }
            this.init();
        })

        this.menu.wait();
        this.toolbar = new Toolbar(this.io);
    }

    async init() {
        await loadModels();
        this.network = new Network(this.scene, this.io, this.input, this.toolbar, this.boardSize);
        this.network.placePlayer(this.startingPosition);
        this.network.placeEnemy(this.enemyPosition);
        this.network.placeTarget(this.target);
    }

    render() {
        this.renderer.render(this.scene, this.camera);

        const delta = this.clock.getDelta();
        this.camera.update();
        if (this.network) {
            this.network.update(delta);
        }

        requestAnimationFrame(() => this.render());
    }
}