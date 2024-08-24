import { Simulation } from "./simulation.js";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = 900;
const height = 900;
canvas.width = width;
canvas.height = height;
const sim = new Simulation(width, height);
draw();
function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    sim.step();
    sim.draw(ctx);
}
