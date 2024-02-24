var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.UP = function () {
        return new Vector(0, -1);
    };
    Vector.DOWN = function () {
        return new Vector(0, 1);
    };
    Vector.LEFT = function () {
        return new Vector(-1, 0);
    };
    Vector.RIGHT = function () {
        return new Vector(1, 0);
    };
    Vector.ZERO = function () {
        return new Vector(0, 0);
    };
    Vector.prototype.add = function (other) {
        if (typeof other == 'number') {
            return new Vector(this.x + other, this.y + other);
        }
        else if (other instanceof Vector) {
            var x = this.x + other.x;
            var y = this.y + other.y;
            return new Vector(x, y);
        }
        return null;
    };
    Vector.prototype.addEq = function (other) {
        if (typeof other == 'number') {
            this.x += other;
            this.y += other;
        }
        else if (other instanceof Vector) {
            this.x += other.x;
            this.y += other.y;
        }
        return null;
    };
    Vector.prototype.sub = function (other) {
        if (typeof other == 'number') {
            return new Vector(this.x - other, this.y - other);
        }
        else if (other instanceof Vector) {
            var x = this.x - other.x;
            var y = this.y - other.y;
            return new Vector(x, y);
        }
        return null;
    };
    Vector.prototype.subEq = function (other) {
        if (typeof other == 'number') {
            this.x -= other;
            this.y -= other;
        }
        else if (other instanceof Vector) {
            this.x -= other.x;
            this.y -= other.y;
        }
        return null;
    };
    Vector.prototype.mult = function (other) {
        if (typeof other == 'number') {
            return new Vector(this.x * other, this.y * other);
        }
        else if (other instanceof Vector) {
            var x = this.x * other.x;
            var y = this.y * other.y;
            return new Vector(x, y);
        }
        return null;
    };
    Vector.prototype.multEq = function (other) {
        if (typeof other == 'number') {
            this.x *= other;
            this.y *= other;
        }
        else if (other instanceof Vector) {
            this.x *= other.x;
            this.y *= other.y;
        }
        return null;
    };
    Vector.prototype.div = function (other) {
        if (typeof other == 'number') {
            return new Vector(this.x / other, this.y / other);
        }
        else if (other instanceof Vector) {
            var x = this.x / other.x;
            var y = this.y / other.y;
            return new Vector(x, y);
        }
        return null;
    };
    Vector.prototype.divEq = function (other) {
        if (typeof other == 'number') {
            this.x /= other;
            this.y /= other;
        }
        else if (other instanceof Vector) {
            this.x /= other.x;
            this.y /= other.y;
        }
        return null;
    };
    Vector.prototype.rotateBy = function (angle) {
        var x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        var y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        return new Vector(x, y);
    };
    Vector.prototype.copy = function () {
        return new Vector(this.x, this.y);
    };
    Vector.prototype.magnitude = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
    Vector.prototype.dot = function (other) {
        return this.x * other.x + this.y * other.y;
    };
    Vector.prototype.normalize = function () {
        var vec_len = this.magnitude();
        if (vec_len < 0.00001) {
            return new Vector(0, 1);
        }
        return new Vector(this.x / vec_len, this.y / vec_len);
    };
    Vector.prototype.getAngle = function () {
        return Math.atan2(this.y, this.x);
    };
    return Vector;
}());
export default Vector;
