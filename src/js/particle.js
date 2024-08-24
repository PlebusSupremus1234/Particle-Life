import { Vector } from "./vector.js";
export class Particle {
    constructor(posX, posY, velX, velY, color) {
        this.pos = new Vector(posX, posY);
        this.vel = new Vector(velX, velY);
        this.color = color;
    }
    copy(a, b) {
        return new Particle(this.pos.x + a, this.pos.y + b, this.vel.x, this.vel.y, this.color);
    }
}
