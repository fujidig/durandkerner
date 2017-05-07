
const WIDTH = 500;
const HEIGHT = 500;
const K = WIDTH / 2 / 5;

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
    ctx.save();
    ctx.translate(x1, y1);
    let d1 = x2 - x1;
    let d2 = y2 - y1;
    let d = Math.sqrt(d1 * d1 + d2 * d2);
    d1 /= d;
    d2 /= d;
    ctx.transform(d1, d2, -d2, d1, 0, 0);
    ctx.beginPath();
    const k = 0.05;
    ctx.moveTo(0, 0);
    ctx.lineTo(d, 0);
    ctx.lineTo(d * (1 - k), d * k);
    ctx.moveTo(d, 0);
    ctx.lineTo(d * (1 - k), - d * k);
    ctx.stroke();
    ctx.restore();
}

function draw(canvas: HTMLCanvasElement, history: Complex[][]) {
    console.log(history.length);
    let n = history.length;
    let d = history[0].length;
    let ctx = canvas.getContext("2d");
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.strokeStyle = "gray";
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.moveTo(0, HEIGHT / 2);
    ctx.lineTo(WIDTH, HEIGHT / 2);
    ctx.stroke();
    ctx.fillStyle = ctx.strokeStyle = "black";
    ctx.translate(WIDTH / 2, HEIGHT / 2);
    for (let i = 0; i < d; i++) {
        for (let j = 0; j < n; j++) {
            ctx.beginPath();
            let r = (j == 0 || j == n - 1) ? 3 : 1;
            ctx.arc(history[j][i].x * K, - history[j][i].y * K, r, 0, 2 * Math.PI);
            if (j == 0) ctx.fillStyle = "blue";
            else if (j == n - 1) ctx.fillStyle = "red";
            else ctx.fillStyle = "black";
            ctx.fill();
            if (j > 0) {
                drawArrow(ctx, history[j - 1][i].x * K, - history[j - 1][i].y * K, history[j][i].x * K, - history[j][i].y * K);
            }
        }
    }
    ctx.restore();
}

function randomPoly(degree: number) {
    var poly = [c(1, 0)];
    for (let i = 1; i <= degree; i++) {
        poly.push(c(Math.random(), Math.random()));
    }
    return poly;
}

window.onload = () => {
    let canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    let container = document.getElementById("content");
    container.appendChild(canvas);
    
    let poly = zsToPoly([c(0, 0), c(1, 0), c(-1, 0), c(2, 0), c(-2, 0)]).coef;
    let history = durandkerner(poly);
    draw(canvas, history);

    document.getElementById("random").addEventListener("click", random);

    function random() {
        let degree = Number((<HTMLInputElement>document.getElementById("degree")).value);
        poly = randomPoly(degree);
        history = durandkerner(poly);
        draw(canvas, history);
        document.getElementById("random").addEventListener("click", random);
    }

    let startX: number
    let startY: number;
    let dragging: number = null;
    let initialZ: Complex = null;
    let zs: Complex[] = null;

    canvas.addEventListener("mousedown", function (e) {
        e.preventDefault();
        startX = e.clientX - canvas.offsetLeft;
        startY = e.clientY - canvas.offsetTop;
        zs = history[history.length - 1].slice();
        for (let i = 0; i < zs.length; i++) {
            let x = WIDTH / 2 + zs[i].x * K;
            let y = HEIGHT / 2 - zs[i].y * K;
            let dx = x - startX;
            let dy = y - startY;
            if (dx * dx + dy * dy < 4 * 4) {
                dragging = i;
                initialZ = zs[i];
            } 
        }
    });
    document.body.addEventListener("mousemove", function (e) {
        if (dragging != null) {
            move(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        }
    });
    document.body.addEventListener("mouseup", function (e) {
        e.preventDefault();
        dragging = null;
    });

    function move(x: number, y: number) {
        x -= startX, y -= startY;
        zs[dragging] = initialZ.add(c(x / K, - y / K));
        let poly = zsToPoly(zs);
        history = durandkerner(poly.coef);
        draw(canvas, history);
    }
};