import { Simulation } from "./simulation.js";
const canvas = document.getElementById("canvas");
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
    sim.step();
    sim.createReplicas();
    sim.updatePrimary();
    sim.draw(ctx, size);
}
