import { Sprite, CanvasTexture, SpriteMaterial } from "three"

export default class LevelSprite {
    constructor(parent, level, color) {
        this.ctx = document.createElement('canvas').getContext('2d');
        this.ctx.canvas.style.border = '2px solid black';
        this.ctx.canvas.width = 512;
        this.ctx.canvas.height = 512;
        this.ctx.fillStyle = '#444';
        this.ctx.textAlign = 'center';
        this.ctx.font = "900 500px Montserrat";
        this.ctx.fillText(level, 256, 390);
        this.texture = new CanvasTexture(this.ctx.canvas);

        this.material = new SpriteMaterial({
            map: this.texture,
            transparent: true,
        });

        this.sprite = new Sprite(this.material);
        this.sprite.scale.setScalar(3);

        parent.add(this.sprite);
    }

    updateLevel(level) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillText(level, 256, 390);
        this.texture.needsUpdate = true;
    }
}