var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
function cmInPixel(cm) {
    return cm * 37.7952756;
}
line(0, 10, cmInPixel(2), 10);
