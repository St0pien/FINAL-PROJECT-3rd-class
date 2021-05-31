import { WebGLRenderer } from 'three';

export default class Renderer extends WebGLRenderer {
    constructor(scene, container) {
        super({
            antialias: true
        });
        this.scene = scene;
        this.container = container;
        this.container.appendChild(this.domElement);
        this.updateSize();

        window.addEventListener('resize', () => this.updateSize());
    }

    updateSize() {
        this.setSize(window.innerWidth, window.innerHeight);
    }

    render(scene, camera) {
        this.render(scene, camera);
    }
}