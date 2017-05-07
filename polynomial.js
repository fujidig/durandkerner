class Polynomial {
    constructor(coef) {
        this.coef = coef;
    }
    mul(other) {
        let p = this.coef;
        let q = other.coef;
        let res = [];
        let n = p.length - 1;
        let m = q.length - 1;
        for (let k = 0; k <= n + m; k++) {
            let a = c(0, 0);
            for (let i = Math.max(k - m, 0); i <= Math.min(n, k); i++) {
                let j = k - i;
                a = a.add(p[i].mul(q[j]));
            }
            res[k] = a;
        }
        return new Polynomial(res);
    }
}
function zsToPoly(zs) {
    let poly = new Polynomial([c(1, 0)]);
    for (let z of zs) {
        poly = poly.mul(new Polynomial([c(1, 0), z.scale(-1)]));
    }
    return poly;
}
//# sourceMappingURL=polynomial.js.map