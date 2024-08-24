export class Cell {
    constructor() {
        this.discreteVelocities = [
            0, 0, 0,
            0, 1, 0,
            0, 0, 0
        ];
        this.velocity = [0, 0];
        this.density = 1;
    }
}
