import { force } from "./util.js";
import { Particle } from "./particle.js";
import { Vector } from "./vector.js";
export class Simulation {
    constructor() {
        this.n = 1000;
        this.dt = 0.01;
        this.frictionHalfLife = 0.040;
        this.rMax = 0.1;
        this.m = 6;
        this.forceFactor = 10;
        this.frictionFactor = Math.pow(0.5, this.dt / this.frictionHalfLife);
        this.matrix = [];
        for (let i = 0; i < this.m; i++) {
            const row = [];
            for (let j = 0; j < this.m; j++) {
                row.push(Math.random() * 2 - 1);
            }
            this.matrix.push(row);
        }
        console.log(this.matrix);
        this.primary = [];
        for (let i = 0; i < this.n; i++) {
            this.primary.push(new Particle(Math.random(), Math.random(), 0, 0, Math.floor(Math.random() * this.m)));
        }
        this.gridSize = 1 / this.rMax + 2;
        this.mooreNeighbors = [
            -this.gridSize - 1, -this.gridSize, -this.gridSize + 1,
            -1, 0, 1,
            this.gridSize - 1, this.gridSize, this.gridSize + 1
        ];
        this.createReplicas();
    }
    updatePrimary() {
        this.primary = [];
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j].pos.x > 0 && this.grid[i][j].pos.x < 1) {
                    if (this.grid[i][j].pos.y > 0 && this.grid[i][j].pos.y < 1) {
                        this.primary.push(this.grid[i][j]);
                    }
                }
            }
        }
    }
    createReplicas() {
        this.grid = [];
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            this.grid[i] = [];
        }
        for (let a = -1; a < 2; a++) {
            for (let b = -1; b < 2; b++) {
                for (let i = 0; i < this.n; i++) {
                    const newX = this.primary[i].pos.x + a;
                    const newY = this.primary[i].pos.y + b;
                    if (newX > -this.rMax && newX < 1 + this.rMax &&
                        newY > -this.rMax && newY < 1 + this.rMax) {
                        const idx = this.getGridIdx(newX, newY);
                        this.grid[idx].push(this.primary[i].copy(newX, newY));
                    }
                }
            }
        }
    }
    getGridIdx(x, y) {
        const xIdx = Math.floor((x + this.rMax) * 10);
        const yIdx = Math.floor((y + this.rMax) * 10);
        return yIdx * this.gridSize + xIdx;
    }
    getGridIdxs(idx) {
        const output = [];
        for (let i = 0; i < 9; i++) {
            const mooreIdx = idx + this.mooreNeighbors[i];
            if (this.grid[mooreIdx].length !== 0)
                output.push(mooreIdx);
        }
        return output;
    }
    step() {
        for (let i = 0; i < this.n; i++) {
            const sum = new Vector(0, 0);
            const neighborIdxs = this.getGridIdxs(this.getGridIdx(this.primary[i].pos.x, this.primary[i].pos.y));
            for (let j of neighborIdxs) {
                for (let k = 0; k < this.grid[j].length; k++) {
                    const rv = this.grid[j][k].pos.sub(this.primary[i].pos);
                    const r = this.grid[j][k].pos.dist(this.primary[i].pos);
                    if (r > 0 && r < this.rMax) {
                        const f = force(r / this.rMax, this.matrix[this.primary[i].color][this.grid[j][k].color]);
                        rv.mul(f / r);
                        sum.add(rv);
                    }
                }
            }
            sum.mul(this.rMax * this.forceFactor);
            this.primary[i].vel.mul(this.frictionFactor);
            this.primary[i].vel.add(sum.mul(this.dt));
        }
        for (let i = 0; i < this.n; i++) {
            this.primary[i].pos.add(this.primary[i].vel.mul(this.dt));
        }
    }
    draw(ctx, size) {
        const radius = 2;
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                const screenX = this.grid[i][j].pos.x * size;
                const screenY = this.grid[i][j].pos.y * size;
                if (screenX >= -radius && screenX < size + radius &&
                    screenY >= -radius && screenY < size + radius) {
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);
                    ctx.fillStyle = `hsl(${360 * (this.grid[i][j].color / this.m)}, 100%, 50%)`;
                    ctx.fill();
                }
            }
        }
    }
}
