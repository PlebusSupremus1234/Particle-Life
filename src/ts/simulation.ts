import { force } from "./util.js";
import { Particle } from "./particle.js";
import { Vector } from "./vector.js";

export class Simulation {
    n = 1000;
    dt = 0.02;
    frictionHalfLife = 0.040;

    rMax = 0.1;
    m = 6;

    forceFactor = 10;

    frictionFactor: number;

    matrix: number[][];

    colors: number[] = [];

    particles: Particle[] = [];

    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.frictionFactor = Math.pow(0.5, this.dt / this.frictionHalfLife)

        this.matrix = [];
        for (let i = 0; i < this.m; i++) {
            const row: number[] = [];

            for (let j = 0; j < this.m; j++) {
                row.push(Math.random() * 2 - 1);
            }

            this.matrix.push(row);
        }

        console.log(this.matrix);

        for (let i = 0; i < this.n; i++) {
            this.colors[i] = Math.floor(Math.random() * this.m);

            this.particles[i] = new Particle(Math.random(), Math.random());
        }

        this.width = width;
        this.height = height;
    }

    public step() {
        // Update velocities
        for (let i = 0; i < this.n; i++) {
            const sum = new Vector(0, 0);

            for (let j = 0; j < this.n; j++) {
                if (j === i) continue;

                const rv = this.particles[j].pos.sub(this.particles[i].pos);
                const r = this.particles[j].pos.dist(this.particles[i].pos);

                if (r > 0 && r < this.rMax) {
                    const f = force(
                        r / this.rMax,
                        this.matrix[this.colors[i]][this.colors[j]]
                    );

                    rv.mul(f / r);
                    sum.add(rv);
                }
            }

            sum.mul(this.rMax * this.forceFactor);

            this.particles[i].vel.mul(this.frictionFactor);
            this.particles[i].vel.add(sum.mul(this.dt));
        }

        // Update positions
        for (let i = 0; i < this.n; i++) {
            this.particles[i].pos.add(this.particles[i].vel.mul(this.dt));
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        for (let i = 0; i < this.n; i++) {
            ctx.beginPath();
            const screenX = this.particles[i].pos.x * this.width;
            const screenY = this.particles[i].pos.y * this.height;
            ctx.arc(screenX, screenY, 2, 0, 2 * Math.PI);

            ctx.fillStyle = `hsl(${360 * (this.colors[i] / this.m)}, 100%, 50%)`;
            ctx.fill();
        }
    }
}
