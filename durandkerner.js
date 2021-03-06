class Complex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(other) {
        return new Complex(this.x + other.x, this.y + other.y);
    }
    sub(other) {
        return new Complex(this.x - other.x, this.y - other.y);
    }
    mul(other) {
        return new Complex(this.x * other.x - this.y * other.y, this.x * other.y + this.y * other.x);
    }
    norm() {
        return this.x * this.x + this.y * this.y;
    }
    abs() {
        return Math.sqrt(this.norm());
    }
    conj() {
        return new Complex(this.x, -this.y);
    }
    scale(k) {
        return new Complex(k * this.x, k * this.y);
    }
    inv() {
        return this.conj().scale(1 / this.norm());
    }
    div(other) {
        return this.mul(other.inv());
    }
    toString() {
        return this.x + "+i(" + this.y + ")";
    }
    iszero() {
        return this.x == 0 && this.y == 0;
    }
}
function c(x, y) {
    return new Complex(x, y);
}
function horner(poly, x) {
    let y = poly[0];
    for (let i = 1; i < poly.length; i++) {
        y = y.mul(x).add(poly[i]);
    }
    return y;
}
function differentiate(poly) {
    let d = [];
    let deg = poly.length - 1;
    for (let i = 0; i < deg; i++) {
        d[i] = poly[i].scale(deg - i);
    }
    return d;
}
function factorial(n) {
    let prod = 1;
    for (let i = 1; i <= n; i++) {
        prod *= i;
    }
    return prod;
}
// p(z)からp(z+alpha)を求める
function translate(poly, alpha) {
    let deg = poly.length - 1;
    let p = poly;
    let translatedPoly = [];
    for (let i = 0; i <= deg; i++) {
        translatedPoly[deg - i] = horner(p, alpha).scale(1 / factorial(i));
        p = differentiate(p);
    }
    return translatedPoly;
}
function aberth(poly) {
    const gamma = 0.5;
    let deg = poly.length - 1;
    let p = poly.map((a) => { return a.div(poly[0]); });
    let beta = p[1].scale(-1 / deg);
    let zs = [];
    let q = translate(p, beta);
    let m = 0;
    for (let i = 0; i <= deg; i++) {
        if (!q[i].iszero())
            m++;
    }
    let r = [];
    r[0] = c(1, 0);
    for (let i = 1; i <= deg; i++) {
        r[i] = c(-q[i].abs(), 0);
    }
    let dr = differentiate(r);
    let eta = 0;
    for (let i = 1; i <= deg; i++) {
        eta = Math.max(eta, Math.pow(m * q[i].abs(), 1 / i));
    }
    let radius = c(eta, 0);
    for (let i = 0; i < 5; i++) {
        radius = radius.sub(horner(r, radius).div(horner(dr, radius)));
    }
    for (let i = 0; i < deg; i++) {
        let theta = 2 * Math.PI * i / deg + gamma;
        zs[i] = beta.add(radius.mul(new Complex(Math.cos(theta), Math.sin(theta))));
    }
    return zs;
}
function durandkerner(poly) {
    const maxcount = 500;
    const tol = 1.0e-12;
    let p = poly.map((a) => { return a.div(poly[0]); });
    let deg = poly.length - 1;
    let x = aberth(poly);
    let count = 0;
    let history = [];
    for (count = 0; count < maxcount; count++) {
        history.push(x);
        let y = [];
        for (let i = 0; i < deg; i++) {
            let a = new Complex(1, 0);
            for (let j = 0; j < deg; j++) {
                if (j != i) {
                    a = a.mul(x[i].sub(x[j]));
                }
            }
            y[i] = x[i].sub(horner(p, x[i]).div(a));
        }
        let diff = 0;
        for (let i = 0; i < deg; i++) {
            diff = Math.max(diff, y[i].sub(x[i]).abs());
        }
        if (diff <= tol) {
            break;
        }
        x = y;
    }
    history.push(x);
    return history;
}
//# sourceMappingURL=durandkerner.js.map