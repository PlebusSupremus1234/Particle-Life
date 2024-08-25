import {Vector} from "./vector.js";

export class Particle {
    pos: Vector;
    vel: Vector;

    color: number;

    constructor(posX: number, posY: number, velX: number, velY: number, color: number) {
        this.pos = new Vector(posX, posY);
        this.vel = new Vector(velX, velY);

        this.color = color;
    }

    // Copy and shift primary particle to replica simulations
    public copy(a: number, b: number): Particle {
        return new Particle(
            this.pos.x + a, this.pos.y + b,
            this.vel.x, this.vel.y,
            this.color
        )
    }
}
