export default class Vector {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static UP() {
        return new Vector(0, -1);
    }
    static DOWN() {
        return new Vector(0, 1);
    }
    static LEFT() {
        return new Vector(-1, 0);
    }
    static RIGHT() {
        return new Vector(1, 0);
    }
    static ZERO() {
        return new Vector(0, 0);
    }
    add(other) {
        if (typeof other == 'number') {
            return new Vector(this.x + other, this.y + other);
        }
        else if (other instanceof Vector) {
            let x = this.x + other.x;
            let y = this.y + other.y;
            return new Vector(x, y);
        }
        return null;
    }
    addEq(other) {
        if (typeof other == 'number') {
            this.x += other;
            this.y += other;
        }
        else if (other instanceof Vector) {
            this.x += other.x;
            this.y += other.y;
        }
        return null;
    }
    sub(other) {
        if (typeof other == 'number') {
            return new Vector(this.x - other, this.y - other);
        }
        else if (other instanceof Vector) {
            let x = this.x - other.x;
            let y = this.y - other.y;
            return new Vector(x, y);
        }
        return null;
    }
    subEq(other) {
        if (typeof other == 'number') {
            this.x -= other;
            this.y -= other;
        }
        else if (other instanceof Vector) {
            this.x -= other.x;
            this.y -= other.y;
        }
        return null;
    }
    mult(other) {
        if (typeof other == 'number') {
            return new Vector(this.x * other, this.y * other);
        }
        else if (other instanceof Vector) {
            let x = this.x * other.x;
            let y = this.y * other.y;
            return new Vector(x, y);
        }
        return null;
    }
    multEq(other) {
        if (typeof other == 'number') {
            this.x *= other;
            this.y *= other;
        }
        else if (other instanceof Vector) {
            this.x *= other.x;
            this.y *= other.y;
        }
        return null;
    }
    div(other) {
        if (typeof other == 'number') {
            return new Vector(this.x / other, this.y / other);
        }
        else if (other instanceof Vector) {
            let x = this.x / other.x;
            let y = this.y / other.y;
            return new Vector(x, y);
        }
        return null;
    }
    divEq(other) {
        if (typeof other == 'number') {
            this.x /= other;
            this.y /= other;
        }
        else if (other instanceof Vector) {
            this.x /= other.x;
            this.y /= other.y;
        }
        return null;
    }
    rotateBy(angle) {
        let x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        let y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        return new Vector(x, y);
    }
    copy() {
        return new Vector(this.x, this.y);
    }
    magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    normalize() {
        let vec_len = this.magnitude();
        if (vec_len < 0.00001) {
            return new Vector(0, 1);
        }
        return new Vector(this.x / vec_len, this.y / vec_len);
    }
    getAngle() {
        return Math.atan2(this.y, this.x);
    }
}
