import { Vector2 } from "three";

export default class Input {
    constructor() {
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            action: false
        }

        this.mouse = {
            left: false
        }

        this.scroll = 0;
        this.mousePos = new Vector2();

        window.addEventListener('keydown', e => this.onKeyDown(e));
        window.addEventListener('keyup', e => this.onKeyUp(e));
        window.addEventListener('mousewheel', e => {
            this.scroll += e.deltaY;
        });

        window.addEventListener('DOMMouseScroll', e => {
            this.scroll += e.detail*100;
        });

        window.addEventListener('mousedown', e => this.onMouseDown(e))
    }

    onMouseDown(e) {
        this.mousePos.x = (e.clientX / innerWidth) * 2 - 1;
        this.mousePos.y = -(e.clientY / innerHeight) * 2 + 1;

        this.mouse.left = true;
    }

    onKeyDown(e) {
        switch (e.keyCode) {
            case 87: // w
                this.keys.forward = true;
                break;
            case 65: // a
                this.keys.left = true;
                break;
            case 83: // s
                this.keys.backward = true;
                break;
            case 68: // d
                this.keys.right = true;
                break;
            case 32: // space
                this.keys.action = true;
                break;
        }
    }

    onKeyUp(e) {
        switch (e.keyCode) {
            case 87: // w
                this.keys.forward = false;
                break;
            case 65: // a
                this.keys.left = false;
                break;
            case 83: // s
                this.keys.backward = false;
                break;
            case 68: // d
                this.keys.right = false;
                break;
        }
    }
}