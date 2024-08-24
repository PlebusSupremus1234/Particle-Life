export function force(r: number, a: number): number {
    const beta = 0.3;

    if (r < beta) return r / beta - 1;
    else if (beta < r && r < 1) return a * (1 - Math.abs(2 * r - 1 - beta) / (1 - beta));
    else return 0;
}
