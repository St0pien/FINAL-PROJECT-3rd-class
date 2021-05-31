import { BufferAttribute, BufferGeometry, Points, PointsMaterial } from "three";

export default class Stream {
    constructor(scene, texture, color, dist) {
        this.scene = scene;
        this.dist = dist
        this.rate = 8;
        this.bufferGeometry = new BufferGeometry();
        this.positions = new Float32Array(this.rate * 3);
        this.material = new PointsMaterial({
            color: color,
            depthWrite: false,
            transparent: true,
            size: 3,
            map: texture,
        });

        this.init();

        this.bits = new Points(this.bufferGeometry, this.material);
        this.bits.position.set(0, 0, 0);
        this.scene.add(this.bits);
    }

    init() {
        for (let i = 0; i < this.rate * 3; i += 3) {
            this.positions[i] = 0
            this.positions[i + 1] = 0
            this.positions[i + 2] = Math.random() * this.dist;
        }

        this.bufferGeometry.setAttribute('position', new BufferAttribute(this.positions, 3));

        this.bufferGeometry.attributes.position.needsUpdate = true;
    }

    update() {
        for (let i=2; i<this.rate *3; i+=3) {
            this.positions[i] += 0.1;

            if (this.positions[i] > this.dist) {
                this.positions[i] = 0;
            }
        }

        this.bufferGeometry.attributes.position.needsUpdate = true;
    }
}