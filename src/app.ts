const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

function line(x1: number, y1: number, x2: number, y2: number) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function cmInPixel(cm: number){
    return cm * 37.7952756
}

function convertCanvasToImage(){
    return canvas.toDataURL("image/png");
}

line(0,10, cmInPixel(2),10);