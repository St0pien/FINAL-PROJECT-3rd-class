import { AnimationMixer, LoopOnce, Group, PointLight, Vector3, MathUtils, Quaternion } from "three";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";
import getModel from "../loaders/Models";
import LevelSprite from "./LevelSprite";

export default class Node extends Group {
    constructor(scene, cords, io) {
        super();
        this.scene = scene;
        this.scene.add(this);
        this.cords= cords;
        this.level = 1;
        this.selected = false;
        this.captured = false;
        this.isOwnedByPlayer = false;
        this.io = io;
        this.loadModel();

        this.speed = 0.01;

        this.onClick = () => null;
    }

    colorize(color) {
        this.mesh.children.forEach(c => {
            if (c.material) {
                c.material = c.material.clone();
                c.material.opacity = 0.2;
                c.material.color.setHex(color);
            }
        });
    }

    loadModel() {
        const base = getModel('node');
        this.mesh = SkeletonUtils.clone(base);
        this.mesh.animations = base.animations.map(a => a.clone());
        this.colorize(0x444444);
        this.scale.setScalar(0.05);
        this.add(this.mesh);

        this.mixer = new AnimationMixer(this.mesh);
        this.action = this.mixer.clipAction(this.mesh.animations[0]);

        this.light = new PointLight(0xffffff, 0, 50, 2);
        this.light.position.set(0, 5, 0);

        this.label = new LevelSprite(this.scene, this.level, 'blue');
    }

    capture() {
        this.io.emit('move', {
            type: 'capture',
            cords: this.cords
        })
    }

    fortify() {
        this.io.emit('move', {
            type: 'fortify',
            cords: this.cords
        })
    }

    attack() {
        this.io.emit('move', {
            type: 'attack',
            cords: this.cords
        })
    }

    deselect() {
        this.selected = false;
    }
    
    select() {
        this.selected = true;
    }

    onCapture() {
        this.action.reset();
        this.action.setLoop(LoopOnce);
        this.action.play();
        this.captured = true;
        this.isOwnedByPlayer = true;

        this.colorize(0x00ff00);
    }

    onEnemyCapture() {
        this.action.reset();
        this.action.setLoop(LoopOnce);
        this.action.play();
        this.captured = true;

        this.colorize(0xff0000);
    }

    onFortify() {
        this.level++;
        this.label.updateLevel(this.level);
        this.speed = 0.2;
    }

    onAttack() {
        this.captured = false;
        this.isOwnedByPlayer = false;
        this.level = 1;
        this.label.updateLevel(this.level);
        this.colorize(0x444444);
        this.attacked = true;
        setTimeout(() => this.attacked = false, 1000);
    }

    update(timeElapsed) {
        this.mixer.update(timeElapsed);

        if (this.captured) {
            this.speed = MathUtils.lerp(this.speed, 0.01, timeElapsed);
            this.rotation.y += this.speed;
        } else {
            this.quaternion.slerp(new Quaternion(), timeElapsed*3);
        }

        if (this.attacked) {
            this.mesh.position.lerp(new Vector3(0, -150, 0), timeElapsed*5);
        } else if (this.selected) {
            this.mesh.position.lerp(new Vector3(0, 150, 0), timeElapsed*3);
        } else {
            this.mesh.position.lerp(new Vector3(0, 0, 0), timeElapsed*3);
        }
    }
}