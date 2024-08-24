import { Vector } from "./vector.js";
export class Particle {
    constructor(posX, posY) {
        this.pos = new Vector(posX, posY);
        this.vel = new Vector(0, 0);
    }
}
