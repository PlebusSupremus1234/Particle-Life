import { Sum } from "./util.js";
import { Cell } from "./cell.js";
export class Field {
    constructor(res, latticeWidth) {
        this.res = res;
        this.latticeWidth = latticeWidth;
        this.field = [];
        for (let b = 0; b < res; b++) {
            const fm = [];
            for (let a = 0; a < res; a++) {
                fm.push(new Cell());
            }
            this.field.push(fm);
        }
    }
    momentum(x, y) {
        return [
            this.field[y][x].velocity[0] * Sum(this.field[y][x].discreteVelocities),
            this.field[y][x].velocity[1] * Sum(this.field[y][x].discreteVelocities)
        ];
    }
    draw(ctx, res) {
        for (let b = 0; b < this.res; b++) {
            for (let a = 0; a < this.res; a++) {
                const n = b * res / res;
                const x = a * res / res;
                const shade = 1000 * Math.pow((Math.pow(this.field[b][a].velocity[0], 2) + Math.pow(this.field[b][a].velocity[0], 2)), 0.5);
                ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
                ctx.fillRect(a * this.latticeWidth, b * this.latticeWidth, this.latticeWidth, this.latticeWidth);
            }
        }
    }
}
