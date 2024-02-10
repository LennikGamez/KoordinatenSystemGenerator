var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + x2, y1 + y2);
    ctx.stroke();
}
function cmInPixel(cm) {
    return cm * 37.7952756;
}
function convertCanvasToImage() {
    return canvas.toDataURL("image/png");
}
function arrow(x, y, deg) {
    if (deg === void 0) { deg = 0; }
    var rad = degreesToRadians(deg);
    var oldTransform = ctx.getTransform();
    ctx.translate(x, y);
    ctx.rotate(rad);
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(0, -10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(0, -10);
    ctx.stroke();
    ctx.setTransform(oldTransform);
}
function write(text, x, y, size) {
    if (size === void 0) { size = 20; }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = size + "px serif";
    ctx.fillText(text, x, y);
}
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
function xAxis() {
}
function drawSystem(gapInCm, x, y, z) {
    var margin = 20;
    var gap = cmInPixel(gapInCm);
    var nameOffset = 20;
    var strokeLength = 5;
    var numberOffset = 15;
    var numberSize = 15;
    var lineBuffer = gap / 2;
    var endX = 0;
    var endY = 0;
    // calculate canvas size to fit content
    var endOffset = lineBuffer + nameOffset;
    var width = x * gap / 2 + endOffset + y * gap + endOffset;
    var height = z * gap + endOffset + x * gap / 2 + endOffset;
    ctx.canvas.width = width + margin * 2;
    ctx.canvas.height = height + margin * 2;
    // calculate origin of coordinate system
    var startX = x * gap / 2 + endOffset + margin;
    var startY = z * gap + endOffset + margin;
    ctx.translate(startX, startY);
    write('0', -12, 0, numberSize);
    // z-Achse
    endY = -z * gap - lineBuffer;
    line(0, 0, 0, endY);
    arrow(0, endY);
    write('z', 0, endY - nameOffset);
    for (var i = 1; i <= z; i++) {
        line(-strokeLength, -i * gap, strokeLength * 2, 0);
        write(i.toString(), -numberOffset, -i * gap, numberSize);
    }
    // y-Achse
    endX = 0 + y * gap + lineBuffer;
    endY = 0;
    line(0, 0, y * gap + lineBuffer, 0);
    arrow(endX, endY, 90);
    write('y', endX + nameOffset, endY);
    for (var i = 1; i <= y; i++) {
        line(i * gap, -strokeLength, 0, strokeLength * 2);
        write(i.toString(), i * gap, +numberOffset, numberSize);
    }
    // x-Achse
    endX = -x * gap / 2 - lineBuffer;
    endY = x * gap / 2 + lineBuffer;
    line(0, 0, -x * gap / 2 - lineBuffer, x * gap / 2 + lineBuffer);
    arrow(endX, endY, 270 - 45);
    write('x', endX - nameOffset, endY + nameOffset);
    for (var i = 1; i <= x; i++) {
        line(-i * gap / 2 - strokeLength, +i * gap / 2 - strokeLength, strokeLength * 2, strokeLength * 2);
        write(i.toString(), -i * gap / 2 + numberOffset, +i * gap / 2 + numberOffset, numberSize);
    }
}
var Generator = /** @class */ (function () {
    function Generator() {
        this.margin = 20;
        this.nameOffset = 20;
        this.strokeLength = 5;
        this.numberOffset = 15;
        this.numberSize = 15;
    }
    Generator.prototype.generate = function (gap, x, y, z) {
        this.gap = cmInPixel(gap);
        this.lineBuffer = this.gap / 2;
    };
    Generator.prototype.xAxis = function () {
    };
    Generator.prototype.yAxis = function (y) {
        var endX = 0 + y * this.gap + this.lineBuffer;
        var endY = 0;
        line(0, 0, y * this.gap + this.lineBuffer, 0);
        arrow(endX, endY, 90);
        write('y', endX + this.nameOffset, endY);
        for (var i = 1; i <= y; i++) {
            line(i * this.gap, -this.strokeLength, 0, this.strokeLength * 2);
            write(i.toString(), i * this.gap, +this.numberOffset, this.numberSize);
        }
    };
    Generator.prototype.zAxis = function () {
    };
    return Generator;
}());
drawSystem(2, 5, 6, 100);
var x = convertCanvasToImage();
document.querySelector('body').appendChild(document.createElement('img')).setAttribute('src', x);
canvas.remove();
