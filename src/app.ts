const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

function line(x1: number, y1: number, x2: number, y2: number) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + x2, y1 + y2);
    ctx.stroke();
}

function cmInPixel(cm: number){
    return cm * 37.7952756
}

function convertCanvasToImage(){
    return canvas.toDataURL("image/png");
}

function arrow(x: number, y: number, deg: number = 0) {
    const rad = degreesToRadians(deg);
    const oldTransform = ctx.getTransform();

    ctx.translate(x, y);
    ctx.rotate(rad);
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(0, - 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(0, - 10);
    ctx.stroke();
    ctx.setTransform(oldTransform);

}

function write(text: string, x: number, y: number, size: number = 20){
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = size + "px serif";
    ctx.fillText(text, x, y);
}

function degreesToRadians(degrees: number){
    return degrees * Math.PI / 180
}



class Generator{
    margin: number = 20;
    nameOffset: number = 20;
    strokeLength: number = 5;
    numberOffset: number = 15;
    numberSize: number = 15;
    gap: number;
    lineBuffer: number;

    generate(gap, x, y, z){
        this.gap = cmInPixel(gap);
        this.lineBuffer = this.gap/2;

        this.calculateCanvasSize(this.gap, x, y, z, this.lineBuffer + this.nameOffset);
        this.calculateOrigin(this.gap, x, y, z, this.lineBuffer + this.nameOffset);

        this.xAxis(x);
        this.yAxis(y);
        this.zAxis(z);
    }

    calculateCanvasSize(gap, x, y, z, endOffset){
        // calculate canvas size to fit content
        const width = x*gap/2 + endOffset  + y*gap + endOffset;
        const height = z*gap + endOffset + x*gap/2 + endOffset;

        ctx.canvas.width  = width + this.margin*2;
        ctx.canvas.height = height + this.margin*2;
    }

    calculateOrigin(gap, x, y, z, endOffset){

        // calculate origin of coordinate system
        const startX = x*gap/2 + endOffset + this.margin;
        const startY = z*gap + endOffset + this.margin;


        ctx.translate(startX, startY);
        write('0', -12, 0, this.numberSize)
    }
    xAxis(x){
        const endX = -x * this.gap/2 - this.lineBuffer;
        const endY = x * this.gap/2 + this.lineBuffer;
    
        line(0, 0, -x*this.gap/2 - this.lineBuffer, x*this.gap/2 + this.lineBuffer);
        arrow(endX, endY, 270-45);
        write('x', endX - this.nameOffset, endY + this.nameOffset);
    
        for (let i = 1; i <= x; i++) {
            const stepSize: number = i*this.gap/2
            line(-stepSize - this.strokeLength, +stepSize - this.strokeLength, this.strokeLength*2, this.strokeLength*2)
            write(i.toString(), -stepSize + this.numberOffset, +stepSize + this.numberOffset, this.numberSize)
        }
    }
    yAxis(y){
        const endX = 0 + y*this.gap + this.lineBuffer;
        const endY = 0;
        
        line(0, 0, y*this.gap + this.lineBuffer, 0);
        arrow(endX, endY, 90);
        write('y', endX + this.nameOffset, endY);
        
        for (let i = 1; i <= y; i++) {
            const stepSize: number = i*this.gap;
            line(stepSize, -this.strokeLength, 0, this.strokeLength*2)
            write(i.toString(), stepSize, + this.numberOffset, this.numberSize)
        }
    }
    zAxis(z){
        const endY = -z*this.gap - this.lineBuffer;
        line(0, 0, 0, endY);
        arrow(0, endY);
        write('z', 0, endY - this.nameOffset);
    
        for(let i = 1; i <= z; i++){
            const stepSize: number = i*this.gap;
            line(-this.strokeLength, -stepSize, this.strokeLength*2, 0)
            write(i.toString(), -this.numberOffset, -stepSize, this.numberSize)
        }
    }
}

// drawSystem(2, 5, 6, 100);
new Generator().generate(1, 5, 6, 10);

let x = convertCanvasToImage();
document.querySelector('body').appendChild(document.createElement('img')).setAttribute('src', x);

// canvas.remove();
