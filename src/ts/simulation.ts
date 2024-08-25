import {force} from "./util.js";
import {Particle} from "./particle.js";
import {Vector} from "./vector.js";

export class Simulation {
    n = 1000; // Number of particles
    dt = 0.02; // Time step

    frictionHalfLife = 0.040; // Friction half life
    frictionFactor: number;

    rMax = 0.1; // Max radius
    m = 6; // Number of colors

    forceFactor = 10; // Scale forces

    matrix: number[][]; // Attraction matrix

    primary: Particle[]; // Primary simulation
    allParticles: Particle[]; // Copies of particles and replicas for periodic boundary

    constructor() {
        this.frictionFactor = Math.pow(0.5, this.dt / this.frictionHalfLife);

        // Initialize random attraction matrix
        this.matrix = [];
        for (let i = 0; i < this.m; i++) {
            const row: number[] = [];

            for (let j = 0; j < this.m; j++) {
                row.push(Math.random() * 2 - 1);
            }

            this.matrix.push(row);
        }
        console.log(this.matrix);

        // Initialize main simulation particles
        this.primary = [];
        for (let i = 0; i < this.n; i++) {
            this.primary.push(new Particle(
                Math.random(), Math.random(),      // Pos
                0, 0,                             // Velocity
                Math.floor(Math.random() * this.m) // Color
            ));
        }

        // Initialize the other replica simulations
        this.allParticles = [];
        this.createReplicas();
    }

    // Update primary simulation particles to what particles are inside the primary simulation
    public updatePrimary() {
        this.primary = [];

        for (let i = 0; i < 9 * this.n; i++) {
            if (this.allParticles[i].pos.x > 0 && this.allParticles[i].pos.x < 1) {
                if (this.allParticles[i].pos.y > 0 && this.allParticles[i].pos.y < 1) {
                    this.primary.push(this.allParticles[i]);
                }
            }
        }
    }

    // Creates replicas of the primary simulation
    public createReplicas() {
        this.allParticles = [];

        for (let a = -1; a < 2; a++) {
            for (let b = -1; b < 2; b++) {
                for (let i = 0; i < this.n; i++) {
                    this.allParticles.push(this.primary[i].copy(a, b));
                }
            }
        }
    }

    // Simulation step - only need to update primary simulation
    public step() {
        // Update velocities
        for (let i = 0; i < this.n; i++) {
            const sum = new Vector(0, 0);

            for (let j = 0; j < 9 * this.n; j++) { // All particles
                const rv = this.allParticles[j].pos.sub(this.primary[i].pos)
                const r = this.allParticles[j].pos.dist(this.primary[i].pos)

                if (r > 0 && r < this.rMax && r < 0.5) { // 0.5 is half sim size
                    const f = force(
                        r / this.rMax,
                        this.matrix[this.primary[i].color][this.allParticles[j].color]
                    );

                    rv.mul(f / r);
                    sum.add(rv);
                }
            }

            sum.mul(this.rMax * this.forceFactor);

            this.primary[i].vel.mul(this.frictionFactor);
            this.primary[i].vel.add(sum.mul(this.dt));
        }

        // Update positions
        for (let i = 0; i < this.n; i++) {
            this.primary[i].pos.add(this.primary[i].vel.mul(this.dt));
        }
    }

    // Draw primary simulation particles
    public draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
        for (let i = 0; i < this.n; i++) {
            const screenX = this.primary[i].pos.x * width;
            const screenY = this.primary[i].pos.y * height;

            if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
                ctx.beginPath();
                ctx.arc(screenX, screenY, 2, 0, 2 * Math.PI);

                ctx.fillStyle = `hsl(${360 * (this.primary[i].color / this.m)}, 100%, 50%)`;
                ctx.fill();
            }
        }
    }
}
