import { Mesh, SphereGeometry, Group, PointLight, MeshBasicMaterial } from "three"

export default class StartPoint extends Group {
    constructor(scene, pos, color) {
        super();
        this.geometry = new SphereGeometry(2, 20, 20);
        this.material = new MeshBasicMaterial({ color: color });
        this.mesh = new Mesh(this.geometry, this.material);
        this.add(this.mesh);

        this.light = new PointLight(color, 2, 50);
        this.light.position.set(0, 4, 0);
        this.add(this.light);

        const [x, z] = pos;
        this.position.set(x, 0, z);
        scene.add(this);
    }
}