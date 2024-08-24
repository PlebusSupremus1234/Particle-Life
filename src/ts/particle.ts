import { Vector } from "./vector.js";

export class Particle {
    pos: Vector;
    vel: Vector;

    constructor(posX: number, posY: number) {
        this.pos = new Vector(posX, posY);
        this.vel = new Vector(0, 0);
    }
}
