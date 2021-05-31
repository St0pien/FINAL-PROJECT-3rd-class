import { TextureLoader } from "three";
import Stream from "./Stream";
import zero from "../../assets/textures/0.png";
import one from "../../assets/textures/1.png";

export default class Connection {
    constructor(scene, start, dst, color) {
        this.scene = scene;
        this.distance = start.distanceTo(dst);
        this.zeros = new Stream(this.scene, new TextureLoader().load(zero), color, this.distance);
        this.ones = new Stream(this.scene, new TextureLoader().load(one), color, this.distance);

        this.zeros.bits.position.copy(start);
        this.ones.bits.position.copy(start);

        this.zeros.bits.lookAt(dst);
        this.ones.bits.lookAt(dst);
    }

    update() {
        this.zeros.update();
        this.ones.update();
    }
}