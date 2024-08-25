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
        for (let i = 0; i < this.allParticles.length; i++) {
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
                    const newX = this.primary[i].pos.x + a;
                    const newY = this.primary[i].pos.y + b;
                    if (newX > -this.rMax && newX < 1 + this.rMax &&
                        newY > -this.rMax && newY < 1 + this.rMax) {
                        this.allParticles.push(this.primary[i].copy(newX, newY));
                    }
                }
            }
        }
    }
    step() {
        for (let i = 0; i < this.n; i++) {
            const sum = new Vector(0, 0);
            for (let j = 0; j < this.allParticles.length; j++) {
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
    draw(ctx, size) {
        const radius = 2;
        for (let i = 0; i < this.allParticles.length; i++) {
            const screenX = this.allParticles[i].pos.x * size;
            const screenY = this.allParticles[i].pos.y * size;
            if (screenX >= -radius && screenX < size + radius &&
                screenY >= -radius && screenY < size + radius) {
                ctx.beginPath();
                ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);
                ctx.fillStyle = `hsl(${360 * (this.allParticles[i].color / this.m)}, 100%, 50%)`;
                ctx.fill();
            }
        }
    }
}
