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

function drawSystem(gapInCm: number, x, y, z){
    const margin = 20;
    const gap = cmInPixel(gapInCm);
    const nameOffset = 20;
    const strokeLength = 5;
    const numberOffset = 15;
    const numberSize = 15;
    
    let lineBuffer = gap/2;
    let endX = 0;
    let endY = 0;

    // calculate canvas size to fit content
    const endOffset = lineBuffer + nameOffset;
    const width = x*gap/2 + endOffset  + y*gap + endOffset;
    const height = z*gap + endOffset + x*gap/2 + endOffset;

    ctx.canvas.width  = width + margin*2;
    ctx.canvas.height = height + margin*2;

    // calculate origin of coordinate system
    const startX = x*gap/2 + endOffset + margin;
    const startY = z*gap + endOffset + margin;


    ctx.translate(startX, startY);
    write('0', -12, 0, numberSize)

    // z-Achse
    endY = -z*gap - lineBuffer;
    line(0, 0, 0, endY);
    arrow(0, endY);
    write('z', 0, endY - nameOffset);

    for(let i = 1; i <= z; i++){
        line(-strokeLength, -i*gap, strokeLength*2, 0)
        write(i.toString(), -numberOffset, -i*gap, numberSize)
    }

    // y-Achse
    endX = 0 + y*gap + lineBuffer;
    endY = 0;
    
    line(0, 0, y*gap + lineBuffer, 0);
    arrow(endX, endY, 90);
    write('y', endX + nameOffset, endY);
    
    for (let i = 1; i <= y; i++) {
        line(i*gap, -strokeLength, 0, strokeLength*2)
        write(i.toString(), i*gap, + numberOffset, numberSize)
    }
    // x-Achse

    endX = -x * gap/2 - lineBuffer;
    endY = x * gap/2 + lineBuffer;

    line(0, 0, -x*gap/2 - lineBuffer, x*gap/2 + lineBuffer);
    arrow(endX, endY, 270-45);
    write('x', endX - nameOffset, endY + nameOffset);

    for (let i = 1; i <= x; i++) {
        line(-i*gap/2 - strokeLength, +i*gap/2 - strokeLength, strokeLength*2, strokeLength*2)
        write(i.toString(), -i*gap/2 + numberOffset, +i*gap/2 + numberOffset, numberSize)
    }
}

drawSystem(2, 5, 6, 100);

let x = convertCanvasToImage();
document.querySelector('body').appendChild(document.createElement('img')).setAttribute('src', x);