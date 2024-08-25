export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    // Methods that don't change original vector
    public dist(v: Vector): number {
        const a = this.x - v.x;
        const b = this.y - v.y;

        return Math.sqrt(a * a + b * b);
    }

    public sub(v: Vector): Vector {
        return new Vector(
            this.x - v.x,
            this.y - v.y
        );
    }

    // Methods that change original vector
    public add(v: Vector): Vector {
        this.x += v.x;
        this.y += v.y;

        return this;
    }

    public mul(s: number): Vector {
        this.x *= s;
        this.y *= s;

        return this;
    }
}
