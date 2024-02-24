export default class Vector{
    x: number;
    y: number;
    constructor(x, y){
        this.x = x;
        this.y = y;
    }


    static UP(): Vector{
        return new Vector(0, -1);
    }
    static DOWN(): Vector{
        return new Vector(0, 1);
    }
    static LEFT(): Vector{
        return new Vector(-1, 0);
    }
    static RIGHT(): Vector{
        return new Vector(1, 0);
    }
    static ZERO(): Vector{
        return new Vector(0, 0);
    }

    add(other): Vector{
        if (typeof other == 'number'){
            return new Vector(this.x + other, this.y + other);
        }else if (other instanceof Vector){
            let x = this.x + other.x;
            let y = this.y + other.y;
            return new Vector(x, y);
        }
        return null
    }
    addEq(other){
        if (typeof other == 'number'){
            this.x += other;
            this.y += other;
        }else if (other instanceof Vector){
            this.x += other.x;
            this.y += other.y;
        }
        return null
    }

    sub(other): Vector{
        if (typeof other == 'number'){
            return new Vector(this.x - other, this.y - other);
        }else if (other instanceof Vector){
            let x = this.x - other.x;
            let y = this.y - other.y;
            return new Vector(x, y);
        }
        return null
    }
    subEq(other){
        if (typeof other == 'number'){
            this.x -= other;
            this.y -= other;
        }else if (other instanceof Vector){
            this.x -= other.x;
            this.y -= other.y;
        }
        return null
    }

    mult(other): Vector{
        if (typeof other == 'number'){
            return new Vector(this.x * other, this.y * other);
        }else if (other instanceof Vector){
            let x = this.x * other.x;
            let y = this.y * other.y;
            return new Vector(x, y);
        }
        return null
    }
    multEq(other){
        if (typeof other == 'number'){
            this.x *= other;
            this.y *= other;
        }else if (other instanceof Vector){
            this.x *= other.x;
            this.y *= other.y;
        }
        return null
    }

    div(other): Vector{
        if (typeof other == 'number'){
            return new Vector(this.x / other, this.y / other);
        }else if (other instanceof Vector){
            let x = this.x / other.x;
            let y = this.y / other.y;
            return new Vector(x, y);
        }
        return null
    }
    divEq(other){
        if (typeof other == 'number'){
            this.x /= other;
            this.y /= other;
        }else if (other instanceof Vector){
            this.x /= other.x;
            this.y /= other.y;
        }
        return null
    }

    copy(): Vector{
        return new Vector(this.x, this.y);
    }

    magnitude(): number{
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    dot(other): number{
        return this.x * other.x + this.y * other.y
    }

    normalize(): Vector{
        let vec_len: number = this.magnitude();

        if (vec_len < 0.00001){
            return new Vector(0, 1)
        }
        return new Vector(this.x / vec_len, this.y / vec_len)
    }
}