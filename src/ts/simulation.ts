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

    grid: Particle[][]; // R width grid for efficiency when searching for neighbors
    gridSize: number;
    mooreNeighbors: number[];

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
                0, 0,                              // Velocity
                Math.floor(Math.random() * this.m) // Color
            ));
        }

        // Initialize the other replica simulations
        this.allParticles = [];
        this.createReplicas();

        // Initialize grid
        this.gridSize = 1 / this.rMax + 2; // 12
        this.mooreNeighbors = [
            -this.gridSize - 1, -this.gridSize, -this.gridSize + 1,
            -1, 0, 1,
            this.gridSize - 1, this.gridSize, this.gridSize + 1
        ];
        this.updateGrid();
    }

    // Update primary simulation particles to what particles are inside the primary simulation
    public updatePrimary() {
        this.primary = [];

        for (let i = 0; i < this.allParticles.length; i++) {
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
                    // Instead of replicating the whole simulation, only copy particles around the edges
                    // Cuts down total amount of particles by ~84%
                    const newX = this.primary[i].pos.x + a;
                    const newY = this.primary[i].pos.y + b;

                    // Check if within primary sim + margins
                    if (
                        newX > -this.rMax && newX < 1 + this.rMax &&
                        newY > -this.rMax && newY < 1 + this.rMax
                    ) {
                        this.allParticles.push(this.primary[i].copy(newX, newY));
                    }
                }
            }
        }
    }

    private getGridIdx(x: number, y: number): number {
        const xIdx = Math.floor((x + this.rMax) * 10);
        const yIdx = Math.floor((y + this.rMax) * 10);

        return yIdx * this.gridSize + xIdx;
    }

    private getGridIdxs(idx: number): number[] {
        const output: number[] = [];

        for (let i = 0; i < 9; i++) {
            const mooreIdx = idx + this.mooreNeighbors[i];
            if (this.grid[mooreIdx].length !== 0) output.push(mooreIdx);
        }

        return output;
    }

    public updateGrid() {
        this.grid = [];
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            this.grid[i] = [];
        }

        for (let i = 0; i < this.allParticles.length; i++) {
            const idx = this.getGridIdx(this.allParticles[i].pos.x, this.allParticles[i].pos.y);
            this.grid[idx].push(this.allParticles[i]);
        }
    }

    // Simulation step - only need to update primary simulation
    public step() {
        // Update velocities
        for (let i = 0; i < this.n; i++) {
            const sum = new Vector(0, 0);

            const neighborIdxs = this.getGridIdxs(this.getGridIdx(this.primary[i].pos.x, this.primary[i].pos.y));
            for (let j of neighborIdxs) {
                for (let k = 0; k < this.grid[j].length; k++) {
                    const rv = this.grid[j][k].pos.sub(this.primary[i].pos);
                    const r = this.grid[j][k].pos.dist(this.primary[i].pos);

                    if (r > 0 && r < this.rMax) {
                        const f = force(
                            r / this.rMax,
                            this.matrix[this.primary[i].color][this.grid[j][k].color]
                        );

                        rv.mul(f / r);
                        sum.add(rv);
                    }
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
    public draw(ctx: CanvasRenderingContext2D, size: number) {
        const radius = 2;

        for (let i = 0; i < this.allParticles.length; i++) {
            const screenX = this.allParticles[i].pos.x * size;
            const screenY = this.allParticles[i].pos.y * size;

            if (
                screenX >= -radius && screenX < size + radius &&
                screenY >= -radius && screenY < size + radius
            ) {
                ctx.beginPath();
                ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);

                ctx.fillStyle = `hsl(${360 * (this.allParticles[i].color / this.m)}, 100%, 50%)`;
                ctx.fill();
            }
        }
    }
}
