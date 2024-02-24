var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import Vector from './vector.js';
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + x2, y1 + y2);
    ctx.stroke();
}
function drawVector(direction, length) {
    line(0, 0, direction.x * length, direction.y * length);
}
function cmInPixel(cm) {
    return cm * 37.7952756;
}
function convertCanvasToImage() {
    return canvas.toDataURL("image/png");
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
function drawImage() {
    var x = convertCanvasToImage();
    document.querySelector('#display').setAttribute('src', x);
}
var Section = /** @class */ (function () {
    function Section(section) {
        this.step = 1;
        this.section = section;
        this.name = section.querySelector('input[name="name"]').value.toLowerCase();
        this.step = parseFloat(section.querySelector('input[name="step"]').value);
        this.from = parseFloat(section.querySelector('input[name="unit-from"]').value);
        this.to = Math.abs(parseFloat(section.querySelector('input[name="unit-to"]').value));
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
        this.strokeWidth = ctx.lineWidth;
        this.gap = cmInPixel(gap);
        this.gapInCm = gap;
        this.strokeWidth = this.gapInCm;
        this.strokeLength = this.strokeWidth * 1.75;
        this.numberOffset += this.strokeWidth + this.strokeLength * 2;
        this.nameOffset += this.strokeWidth;
        this.nameOffset += this.numberSize + this.strokeLength;
        this.loadOptions();
        this.generate();
        this.sections.forEach(function (section) {
            2;
            section.section.addEventListener('input', _this.generate.bind(_this));
        });
    }
    Generator.prototype.arrow = function (x, y, rad) {
        if (rad === void 0) { rad = 0; }
        var oldTransform = ctx.getTransform();
        ctx.translate(x, y);
        ctx.rotate(rad);
        ctx.beginPath();
        ctx.moveTo(this.strokeLength, 0);
        ctx.lineTo(0, -this.strokeLength);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-this.strokeLength, 0);
        ctx.lineTo(0, -this.strokeLength);
        ctx.stroke();
        ctx.setTransform(oldTransform);
    };
    Generator.prototype.loadOptions = function () {
        this.xSection = new Section(document.getElementById('x-axis'));
        this.ySection = new Section(document.getElementById('y-axis'));
        this.zSection = new Section(document.getElementById('z-axis'));
        this.xfrom = this.xSection.from;
        this.xto = this.xSection.to;
        this.yfrom = this.ySection.from;
        this.yto = this.ySection.to;
        this.zfrom = this.zSection.from;
        this.zto = this.zSection.to;
        this.sections = [this.xSection, this.ySection, this.zSection];
    };
    Generator.prototype.generate = function () {
        this.loadOptions();
        ctx.resetTransform();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.gap = cmInPixel(this.gapInCm);
        this.lineBuffer = this.gap / 2;
        this.calculateCanvasSize(this.gap, this.lineBuffer + this.nameOffset);
        this.calculateOrigin(this.gap, this.xto, this.zto, this.lineBuffer + this.nameOffset);
        ctx.lineWidth = this.strokeWidth;
        this.axis(new Vector(-1, 1), this.xfrom, this.xto, this.gap / 2, this.xSection.name);
        this.axis(new Vector(1, 0), this.yfrom, this.yto, this.gap, this.ySection.name);
        this.axis(new Vector(0, -1), this.zfrom, this.zto, this.gap, this.zSection.name);
        drawImage();
    };
    Generator.prototype.calculateCanvasSize = function (gap, endOffset) {
        // calculate canvas size to fit content
        var width = 0;
        var height = 0;
        // check if x axis is more to the right than the y axis
        if (Math.abs(this.xfrom) * gap / 2 > this.yto * gap) {
            width += Math.abs(this.xfrom) * gap / 2 + endOffset;
        }
        else {
            width += this.yto * gap + endOffset;
        }
        // check if y axis is more to the left than x axis
        if (this.xto * gap / 2 > Math.abs(this.yfrom) * gap) {
            width += this.xto * gap / 2 + endOffset;
        }
        else {
            width += Math.abs(this.yfrom) * gap + endOffset;
        }
        // check if z axis is higher than x axis
        if (this.zto * gap > Math.abs(this.xfrom) * gap / 2) {
            height += this.zto * gap + endOffset;
        }
        else {
            height += Math.abs(this.xfrom) * gap / 2 + endOffset;
        }
        // check if z axis is lower than x axis
        if (Math.abs(this.zfrom) * gap > this.xto * gap / 2) {
            height += Math.abs(this.zfrom) * gap + endOffset;
        }
        else {
            height += this.xto * gap / 2 + endOffset;
        }
        width += this.numberSize * 2;
        height += this.numberSize * 2;
        canvas.width = width + this.margin * 2;
        canvas.height = height + this.margin * 2;
    };
    Generator.prototype.calculateOrigin = function (gap, x, z, endOffset) {
        var startX = 0;
        var startY = 0;
        // calculate origin of coordinate system
        if (-this.xto * gap / 2 < -Math.abs(this.yfrom) * gap) {
            // X axis is more to the left
            startX = this.xto * gap / 2 + endOffset + this.margin;
        }
        else {
            // X axis is more to the right
            startX = Math.abs(this.yfrom) * gap + endOffset + this.margin;
        }
        if (this.zto * gap < Math.abs(this.xfrom) * gap / 2) {
            // Z axis is lower
            startY = Math.abs(this.xfrom) * gap / 2 + endOffset + this.margin;
        }
        else {
            // Z axis is higher
            startY = this.zto * gap + endOffset + this.margin;
        }
        startY += this.numberSize * 2;
        ctx.translate(startX, startY);
        write('0', -this.numberOffset / 2, -this.numberOffset / 2, this.numberSize * this.strokeWidth / 2);
    };
    Generator.prototype.axis = function (direction, from, to, gap, name) {
        var lengthPositive = to * gap + this.lineBuffer / 2;
        var lengthNegative = from * gap + this.lineBuffer / 2;
        var end = direction.mult(lengthPositive);
        if (from > 0) {
            from *= -1;
        }
        drawVector(direction, lengthPositive);
        drawVector(direction.mult(-1), lengthNegative);
        this.arrow(end.x, end.y, direction.getAngle() + Math.PI / 2);
        write(name, end.x + this.nameOffset * direction.x, end.y + this.nameOffset * direction.y, this.numberSize * this.strokeWidth / 2);
        for (var i = from; i <= to; i++) {
            if (i == 0)
                continue;
            var step = direction.mult(i * gap);
            var newVector = direction.rotateBy(Math.PI / 2);
            line(step.x, step.y, newVector.x * this.strokeLength, newVector.y * this.strokeLength);
            line(step.x, step.y, -newVector.x * this.strokeLength, -newVector.y * this.strokeLength);
            if (direction.getAngle() == 0) {
                write(i.toString(), step.x + newVector.x * this.numberOffset, step.y + newVector.y * this.numberOffset, this.numberSize * this.strokeWidth / 2);
            }
            else {
                write(i.toString(), step.x - newVector.x * this.numberOffset, step.y - newVector.y * this.numberOffset, this.numberSize * this.strokeWidth / 2);
            }
        }
    };
    return Generator;
}());
// drawSystem(2, 5, 6, 100);
new Generator(parseFloat(prompt("Centimeter per unit: ")));
canvas.remove();
function copyImage() {
    return __awaiter(this, void 0, void 0, function () {
        var data, blob;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(convertCanvasToImage())];
                case 1:
                    data = _a.sent();
                    return [4 /*yield*/, data.blob()];
                case 2:
                    blob = _a.sent();
                    return [4 /*yield*/, navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ])];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
copyImage();
