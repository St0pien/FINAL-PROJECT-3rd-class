import { TextureLoader } from "three";
import Stream from "./Stream";
import zero from "../../assets/textures/0.png";
import one from "../../assets/textures/1.png";

export default class Connection {
    constructor(scene, startCords, endCords, start, dst, color) {
        this.scene = scene;
        this.startCords = startCords;
        this.endCords = endCords;
        this.distance = start.distanceTo(dst);
        this.zeros = new Stream(this.scene, new TextureLoader().load(zero), color, this.distance);
        this.ones = new Stream(this.scene, new TextureLoader().load(one), color, this.distance);

        this.zeros.bits.position.copy(start);
        this.ones.bits.position.copy(start);

        this.zeros.bits.lookAt(dst);
        this.ones.bits.lookAt(dst);
    }

    remove() {
        this.scene.remove(this.zeros.bits);
        this.scene.remove(this.ones.bits);
        console.log('removed connection', this.startCords);
        
    }

    update() {
        this.zeros.update();
        this.ones.update();
    }
}