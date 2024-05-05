var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const width = canvas.width; //= window.innerWidth);
const height = canvas.height; //= window.innerHeight);

const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
const canvasTop = canvas.offsetTop + canvas.clientTop;

const G = 5;
const MAX_VEL = 9;
const INITIAL_VEL = 6;
const MASS = 1500;
const MASS_WIDTH = 10;

const suns = [];
const masses = [];

let Sun1 = {
    x: 155,
    y: 380,
    m: 358,
};

let Sun2 = {
    x: 540,
    y: 200,
    m: 115,
};

let Sun3 = {
    x: 840,
    y: 400,
    m: 215,
};

let Sun4 = {
    x: 90,
    y: 120,
    m: 80,
};

suns.push(Sun1);
suns.push(Sun2);
suns.push(Sun3);
suns.push(Sun4);

canvas.addEventListener("click", event => {
    let x = event.pageX - canvasLeft;
    let y = event.pageY - canvasTop;

    masses.push({
        x,
        y,
        anti_gravity: event.shiftKey ? true : false,
        m: MASS,
        vx: Math.random() * INITIAL_VEL - INITIAL_VEL / 2,
        vy: Math.random() * INITIAL_VEL - INITIAL_VEL / 2,
    });
});

const animate = () => {
    // recalculate positions
    masses.forEach(m => updateVelocities(m));

    // clear the canvas
    ctx.clearRect(0, 0, width, height);

    // redraw everything
    ctx.strokeRect(0, 0, width, height);
    suns.forEach(sun => drawSun(sun));
    masses.forEach(mass => drawMass(mass));

    requestAnimationFrame(animate);
};

const updateVelocities = m => {
    // Work out the attraction of every sun on this mass
    suns.forEach(s => {
        let distance = getDistance(s.x, s.y, m.x, m.y);
        console.log("distance", distance);
        if (distance < 15) distance = 15;
        if (distance > 2000) distance = 2000;

        const attraction = newtonsLawOfUniversalGravitation(s.m, m.m, distance);

        var direction = Math.atan2(s.x - m.x, s.y - m.y);
        var attractionX = Math.sin(direction) * attraction;
        var attractionY = Math.cos(direction) * attraction;

        if (m.anti_gravity) {
            m.vx -= attractionX;
            m.vy -= attractionY;
        } else {
            m.vx += attractionX;
            m.vy += attractionY;
        }
    });

    // don't let them go too fast
    if (m.vx > MAX_VEL) m.vx = MAX_VEL;
    if (m.vx < -MAX_VEL) m.vx = -MAX_VEL;
    if (m.vy > MAX_VEL) m.vy = MAX_VEL;
    if (m.vy < -MAX_VEL) m.vy = -MAX_VEL;

    // Do the move based on velocity
    if (m.anti_gravity) {
        // don't let the anti gravity particles go outside the box
        if (m.x + m.vx < width && m.x + m.vx > 0) {
            m.x += m.vx;
        }
        if (m.y + m.vy < height && m.y + m.vy > 0) {
            m.y += m.vy;
        }
    } else {
        m.x += m.vx;
        m.y += m.vy;
    }
};

const drawSun = sun => {
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.m / 5, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();
};

const drawMass = mass => {
    ctx.beginPath();

    ctx.arc(mass.x, mass.y, MASS_WIDTH, 0, 2 * Math.PI);

    if (mass.anti_gravity) {
        ctx.fillStyle = "limegreen";
    } else {
        ctx.fillStyle = "grey";
    }

    ctx.fill();
};

var getDistance = function (x1, y1, x2, y2) {
    var a = Math.abs(x1 - x2);
    var b = Math.abs(y1 - y2);
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
};

var newtonsLawOfUniversalGravitation = function (mass1, mass2, distance) {
    var force = G * ((mass1 * mass2) / Math.pow(distance, 2));
    var attraction2 = force / mass2;
    return attraction2;
};

requestAnimationFrame(animate);
