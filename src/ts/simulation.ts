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

    particles: Particle[];
    replicas: Particle[]; // Replica particles of the sim for periodic boundary

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

        this.particles = [];
        for (let i = 0; i < this.n; i++) {
            this.particles[i] = new Particle(
                Math.random(), Math.random(),
                0 , 0,
                Math.floor(Math.random() * this.m)
            );
        }

        this.width = width;
        this.height = height;
    }

    public createReplicas() {
        this.replicas = [];

        for (let i = 0; i < this.n; i++) {
            for (let a = -1; a < 2; a++) {
                for (let b = -1; b < 2; b++) {
                    this.replicas.push(this.particles[i].copy(a, b));
                }
            }
        }
    }

    public step() {
        // Update velocities
        for (let i = 0; i < this.n; i++) {
            const sum = new Vector(0, 0);

            for (let j = 0; j < this.replicas.length; j++) {
                const rv = this.replicas[j].pos.sub(this.particles[i].pos);
                const r = this.replicas[j].pos.dist(this.particles[i].pos);

                if (r > 0 && r < this.rMax && r < 0.5) { // 0.5 is half sim size
                    const f = force(
                        r / this.rMax,
                        this.matrix[this.particles[i].color][this.replicas[j].color]
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
        for (let i = 0; i < this.replicas.length; i++) {
            const screenX = this.replicas[i].pos.x * this.width;
            const screenY = this.replicas[i].pos.y * this.height;

            if (screenX >= 0 && screenX < this.width && screenY >= 0 && screenY < this.height) {
                ctx.beginPath();
                ctx.arc(screenX, screenY, 2, 0, 2 * Math.PI);

                ctx.fillStyle = `hsl(${360 * (this.replicas[i].color / this.m)}, 100%, 50%)`;
                ctx.fill();
            }
        }
    }
}
