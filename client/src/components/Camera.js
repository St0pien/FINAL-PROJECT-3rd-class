import { PerspectiveCamera, Raycaster, Vector3 } from 'three';
import Node from './network/Node';

export default class Camera extends PerspectiveCamera {
    constructor(renderer, scene, input) {
        const width = renderer.domElement.width;
        const height = renderer.domElement.height;

        super(75, width / height, 0.1, 10000);
        this.scene = scene
        this.cameraStart = new Vector3(0, 110, -120);
        this.position.copy(this.cameraStart);
        this.lookAt(new Vector3(0, 0, 0));

        this.input = input;

        this.updateSize(renderer);

        window.addEventListener('resize', () => {
            this.updateSize(renderer);
        });

        this.raycaster = new Raycaster();
    }

    updateSize(renderer) {
        this.aspect = renderer.domElement.width / renderer.domElement.height
        this.updateProjectionMatrix();
    }

    update(timeElapsed) {
        if (this.input.keys.forward) {
            this.position.z += 0.5 * timeElapsed*200;
        }

        if (this.input.keys.backward) {
            this.position.z -= 0.5 * timeElapsed*200;
        }

        if (this.input.keys.left) {
            this.position.x += 0.5 * timeElapsed*200;
        }

        if (this.input.keys.right) {
            this.position.x -= 0.5 * timeElapsed*200;
        }

        this.position.y += this.input.scroll / 50;
        this.position.clamp(new Vector3(-200, 15, -200), new Vector3(200, 300, 50));
        this.input.scroll = 0;

        if (this.input.mouse.left) {
            this.raycaster.setFromCamera(this.input.mousePos, this);
            const intersects = this.raycaster.intersectObjects(this.scene.children, true);
            if (intersects.length > 0) {
                const clicked = intersects[0].object;
                clicked.traverseAncestors(a => {
                    if (a instanceof Node) {
                        a.onClick();
                    }
                })
            }

            this.input.mouse.left = false;
        }
    }
}