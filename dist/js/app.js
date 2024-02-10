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
var Section = /** @class */ (function () {
    function Section(section) {
        this.step = 1;
        this.section = section;
        this.name = section.querySelector('input[name="name"]').value.toLowerCase();
        this.step = parseFloat(section.querySelector('input[name="step"]').value);
        this.units = parseFloat(section.querySelector('input[name="unit"]').value);
    }
    return Section;
}());
var Generator = /** @class */ (function () {
    function Generator(gap) {
        var _this = this;
        this.margin = 20;
        this.nameOffset = 20;
        this.strokeLength = 5;
        this.numberOffset = 15;
        this.numberSize = 15;
        this.gap = cmInPixel(gap);
        this.gapInCm = gap;
        this.loadOptions();
        this.generate();
        this.sections.forEach(function (section) {
            section.section.addEventListener('input', _this.generate.bind(_this));
        });
    }
    Generator.prototype.loadOptions = function () {
        this.xSection = new Section(document.getElementById('x-axis'));
        this.ySection = new Section(document.getElementById('y-axis'));
        this.zSection = new Section(document.getElementById('z-axis'));
        this.x = this.xSection.units;
        this.y = this.ySection.units;
        this.z = this.zSection.units;
        this.sections = [this.xSection, this.ySection, this.zSection];
    };
    Generator.prototype.generate = function () {
        this.loadOptions();
        ctx.resetTransform();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.gap = cmInPixel(this.gapInCm);
        this.lineBuffer = this.gap / 2;
        this.calculateCanvasSize(this.gap, this.x, this.y, this.z, this.lineBuffer + this.nameOffset);
        this.calculateOrigin(this.gap, this.x, this.z, this.lineBuffer + this.nameOffset);
        this.xAxis(this.x);
        this.yAxis(this.y);
        this.zAxis(this.z);
    };
    Generator.prototype.calculateCanvasSize = function (gap, x, y, z, endOffset) {
        // calculate canvas size to fit content
        var width = x * gap / 2 + endOffset + y * gap + endOffset;
        var height = z * gap + endOffset + x * gap / 2 + endOffset;
        canvas.width = width + this.margin * 2;
        canvas.height = height + this.margin * 2;
    };
    Generator.prototype.calculateOrigin = function (gap, x, z, endOffset) {
        // calculate origin of coordinate system
        var startX = x * gap / 2 + endOffset + this.margin;
        var startY = z * gap + endOffset + this.margin;
        ctx.translate(startX, startY);
        write('0', -12, 0, this.numberSize);
    };
    Generator.prototype.xAxis = function (x) {
        var endX = -x * this.gap / 2 - this.lineBuffer;
        var endY = x * this.gap / 2 + this.lineBuffer;
        line(0, 0, -x * this.gap / 2 - this.lineBuffer, x * this.gap / 2 + this.lineBuffer);
        arrow(endX, endY, 270 - 45);
        write(this.xSection.name, endX - this.nameOffset, endY + this.nameOffset);
        for (var i = 1; i <= x; i++) {
            var stepSize = i * this.gap / 2;
            line(-stepSize - this.strokeLength, +stepSize - this.strokeLength, this.strokeLength * 2, this.strokeLength * 2);
            write((i * this.xSection.step).toString(), -stepSize + this.numberOffset, +stepSize + this.numberOffset, this.numberSize);
        }
    };
    Generator.prototype.yAxis = function (y) {
        var endX = 0 + y * this.gap + this.lineBuffer;
        var endY = 0;
        line(0, 0, y * this.gap + this.lineBuffer, 0);
        arrow(endX, endY, 90);
        write(this.ySection.name, endX + this.nameOffset, endY);
        for (var i = 1; i <= y; i++) {
            var stepSize = i * this.gap;
            line(stepSize, -this.strokeLength, 0, this.strokeLength * 2);
            write((i * this.ySection.step).toString(), stepSize, +this.numberOffset, this.numberSize);
        }
    };
    Generator.prototype.zAxis = function (z) {
        var endY = -z * this.gap - this.lineBuffer;
        line(0, 0, 0, endY);
        arrow(0, endY);
        write(this.zSection.name, 0, endY - this.nameOffset);
        for (var i = 1; i <= z; i++) {
            var stepSize = i * this.gap;
            line(-this.strokeLength, -stepSize, this.strokeLength * 2, 0);
            write((i * this.zSection.step).toString(), -this.numberOffset, -stepSize, this.numberSize);
        }
    };
    return Generator;
}());
// drawSystem(2, 5, 6, 100);
new Generator(1);
var x = convertCanvasToImage();
document.querySelector('body').appendChild(document.createElement('img')).setAttribute('src', x);
// canvas.remove();
