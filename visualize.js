const WIDTH = 500;
const HEIGHT = 500;
function drawArrow(ctx, x1, y1, x2, y2) {
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
    ctx.lineTo(d * (1 - k), -d * k);
    ctx.stroke();
    ctx.restore();
}
function draw(canvas, history) {
    console.log(history.length);
    let k = WIDTH / 2 / 5;
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
            ctx.arc(history[j][i].x * k, -history[j][i].y * k, r, 0, 2 * Math.PI);
            if (j == 0)
                ctx.fillStyle = "blue";
            else if (j == n - 1)
                ctx.fillStyle = "red";
            else
                ctx.fillStyle = "black";
            ctx.fill();
            if (j > 0) {
                drawArrow(ctx, history[j - 1][i].x * k, -history[j - 1][i].y * k, history[j][i].x * k, -history[j][i].y * k);
            }
        }
    }
    ctx.restore();
}
function randomPoly(degree) {
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
    //let poly = [c(1, 0), c(0, -2), c(2, 7), c(3, -11)];
    // x(x+1)(x+2)(x+3)(x+4)
    let poly = [c(1, 0), c(10, 0), c(35, 0), c(50, 0), c(24, 0), c(0, 0)];
    let history = durandkerner(poly);
    draw(canvas, history);
    document.getElementById("random").addEventListener("click", random);
    function random() {
        let degree = Number(document.getElementById("degree").value);
        let poly = randomPoly(degree);
        let history = durandkerner(poly);
        draw(canvas, history);
        document.getElementById("random").addEventListener("click", random);
    }
};
//# sourceMappingURL=visualize.js.map