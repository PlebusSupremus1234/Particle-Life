import {Simulation} from "./simulation.js";

const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = 900;
const height = 900;
canvas.width = width;
canvas.height = height;

const sim = new Simulation();

draw();

function draw() {
    requestAnimationFrame(draw);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    sim.step(); // Update velocities and position
    sim.createReplicas(); // Update replica simulations
    sim.updatePrimary(); // Update primary simulation
    sim.draw(ctx, width, height); // Draw primary simulation
}
