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

    grid: Particle[][]; // length 9 grid containing copies of the simulation (used for periodic boundary)

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

        // Initialize grid
        this.grid = [];
        for (let i = 0; i < 9; i++) this.grid.push([]);

        // Initialize main simulation particles
        // [ 0, 1, 2,
        //   3, 4, 5,
        //   6, 7, 8 ]
        for (let i = 0; i < this.n; i++) {
            this.grid[4][i] = new Particle(
                Math.random(), Math.random(),      // Pos
                0 , 0,                             // Velocity
                Math.floor(Math.random() * this.m) // Color
            );
        }
        // Initialize the other 8 replica simulations
        this.createReplicas();

        this.width = width;
        this.height = height;
    }

    public createReplicas() {
        // [ 0, 1, 2,
        //   3, 4, 5,
        //   6, 7, 8 ]
        for (let a = -1; a < 2; a++) {
            for (let b = -1; b < 2; b++) {
                const idx = (a+1) * 3 + (b+1);

                if (idx === 4) continue; // Main simulation

                this.grid[idx] = [];
                for (let i = 0; i < this.n; i++) {
                    this.grid[idx].push(this.grid[4][i].copy(a, b));
                }
            }
        }
    }

    public step() {
        // Update velocities
        for (let i = 0; i < this.n; i++) {
            const sum = new Vector(0, 0);

            for (let j = 0; j < 9; j++) {
                for (let k = 0; k < this.n; k++) {
                    const rv = this.grid[j][k].pos.sub(this.grid[4][i].pos)
                    const r = this.grid[j][k].pos.dist(this.grid[4][i].pos)

                    if (r > 0 && r < this.rMax && r < 0.5) { // 0.5 is half sim size
                        const f = force(
                            r / this.rMax,
                            this.matrix[this.grid[4][i].color][this.grid[j][k].color]
                        );

                        rv.mul(f / r);
                        sum.add(rv);
                    }
                }
            }

            sum.mul(this.rMax * this.forceFactor);

            this.grid[4][i].vel.mul(this.frictionFactor);
            this.grid[4][i].vel.add(sum.mul(this.dt));
        }

        // Update positions
        for (let i = 0; i < this.n; i++) {
            // this.particles[i].pos.add(this.particles[i].vel.mul(this.dt));
            this.grid[4][i].pos.add(this.grid[4][i].vel.mul(this.dt));
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < this.n; j++) {
                const screenX = this.grid[i][j].pos.x * this.width;
                const screenY = this.grid[i][j].pos.y * this.height;

                if (screenX >= 0 && screenX < this.width && screenY >= 0 && screenY < this.height) {
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, 2, 0, 2 * Math.PI);

                    ctx.fillStyle = `hsl(${360 * (this.grid[i][j].color / this.m)}, 100%, 50%)`;
                    ctx.fill();
                }
            }
        }
    }
}
