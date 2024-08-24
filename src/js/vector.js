export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    dist(v) {
        const a = this.x - v.x;
        const b = this.y - v.y;
        return Math.sqrt(a * a + b * b);
    }
    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    mul(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
}
