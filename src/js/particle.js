import { Vector } from "./vector.js";
export class Particle {
    constructor(posX, posY, velX, velY, color) {
        this.pos = new Vector(posX, posY);
        this.vel = new Vector(velX, velY);
        this.color = color;
    }
    copy(x, y) {
        return new Particle(x, y, this.vel.x, this.vel.y, this.color);
    }
}
