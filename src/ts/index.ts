import {Simulation} from "./simulation.js";

const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const size = Math.min(window.innerWidth, window.innerHeight);
canvas.width = size;
canvas.height = size;

const sim = new Simulation();

draw();

function draw() {
    requestAnimationFrame(draw);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 2; i++) {
        sim.step();           // Update velocities and position
        sim.createReplicas(); // Update replica simulations
        sim.updatePrimary();  // Update primary simulation
    }

    sim.draw(ctx, size); // Draw primary simulation
}
