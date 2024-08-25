import { force } from "./util.js";
import { Particle } from "./particle.js";
import { Vector } from "./vector.js";
export class Simulation {
    constructor() {
        this.n = 1000;
        this.dt = 0.02;
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
        this.allParticles = [];
        this.createReplicas();
    }
    updatePrimary() {
        this.primary = [];
        for (let i = 0; i < 9 * this.n; i++) {
            if (this.allParticles[i].pos.x > 0 && this.allParticles[i].pos.x < 1) {
                if (this.allParticles[i].pos.y > 0 && this.allParticles[i].pos.y < 1) {
                    this.primary.push(this.allParticles[i]);
                }
            }
        }
    }
    createReplicas() {
        this.allParticles = [];
        for (let a = -1; a < 2; a++) {
            for (let b = -1; b < 2; b++) {
                for (let i = 0; i < this.n; i++) {
                    this.allParticles.push(this.primary[i].copy(a, b));
                }
            }
        }
    }
    step() {
        for (let i = 0; i < this.n; i++) {
            const sum = new Vector(0, 0);
            for (let j = 0; j < 9 * this.n; j++) {
                const rv = this.allParticles[j].pos.sub(this.primary[i].pos);
                const r = this.allParticles[j].pos.dist(this.primary[i].pos);
                if (r > 0 && r < this.rMax && r < 0.5) {
                    const f = force(r / this.rMax, this.matrix[this.primary[i].color][this.allParticles[j].color]);
                    rv.mul(f / r);
                    sum.add(rv);
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
    draw(ctx, width, height) {
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
