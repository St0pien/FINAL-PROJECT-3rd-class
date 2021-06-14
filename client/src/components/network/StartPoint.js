import { Mesh, SphereGeometry, Group, PointLight, MeshBasicMaterial, Points, PointsMaterial, TextureLoader } from "three"

import one from "../../assets/textures/1.png";
import zero from "../../assets/textures/0.png";

export default class StartPoint extends Group {
    constructor(scene, cords, pos, color) {
        super();
        this.cords = cords;
        this.geometry = new SphereGeometry(2, 20, 20);
        this.material = new MeshBasicMaterial({ color: color });
        this.mesh = new Mesh(this.geometry, this.material);
        this.add(this.mesh);

        this.light = new PointLight(color, 4, 150);
        this.light.position.set(0, 4, 0);
        this.add(this.light);

        this.ones = new Points(new SphereGeometry(4, 10, 5), new PointsMaterial({
            color,
            depthWrite: false,
            transparent: true,
            size: 1,
            map: new TextureLoader().load(one),
        }));

        this.add(this.ones);

        this.zeros = new Points(new SphereGeometry(8, 10, 5), new PointsMaterial({
            color,
            depthWrite: false,
            transparent: true,
            size: 2,
            map: new TextureLoader().load(zero),
        }));

        this.add(this.zeros);

        const [x, z] = pos;
        this.position.set(x, 0, z);
        scene.add(this);
    }

    update() {
        this.ones.rotateY(-0.01);
        this.zeros.rotateY(0.01);
    }
}