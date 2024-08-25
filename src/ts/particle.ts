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

    // Copy particle to new position
    public copy(x: number, y: number): Particle {
        return new Particle(
            x, y,
            this.vel.x, this.vel.y,
            this.color
        )
    }
}
