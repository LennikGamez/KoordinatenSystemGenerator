import Vector from './vector.js';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
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
function write(text, x, y, size = 20) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = size + "px serif";
    ctx.fillText(text, x, y);
}
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
function drawImage() {
    let x = convertCanvasToImage();
    document.querySelector('#display').setAttribute('src', x);
}
function convert3dTo2d(x, y, z) {
    return new Vector(y - x, z + x);
}
class Section {
    section;
    step = 1;
    name;
    from;
    to;
    constructor(section) {
        this.section = section;
        this.name = section.querySelector('input[name="name"]').value.toLowerCase();
        this.step = parseFloat(section.querySelector('input[name="step"]').value);
        this.from = parseFloat(section.querySelector('input[name="unit-from"]').value);
        this.to = Math.abs(parseFloat(section.querySelector('input[name="unit-to"]').value));
    }
}
class Generator {
    margin = 20;
    nameOffset = 20;
    strokeLength = 5;
    numberOffset = 10;
    numberSize = 20;
    gap;
    lineBuffer;
    xSection;
    ySection;
    zSection;
    xfrom;
    xto;
    yfrom;
    yto;
    zfrom;
    zto;
    points = [];
    sections;
    lookSection;
    color;
    strokeWidth = ctx.lineWidth;
    constructor() {
        this.lookSection = document.getElementById('look-section');
        this.gap = cmInPixel(3);
        this.strokeWidth = 2.5;
        this.strokeLength = this.strokeWidth * 1.75;
        this.numberOffset = this.strokeLength + 20;
        this.nameOffset += this.strokeWidth;
        this.nameOffset += this.numberSize + this.strokeLength;
        this.loadOptions();
        this.generate();
        this.sections.forEach(section => {
            section.section.addEventListener('input', this.generate.bind(this));
        });
        let looksection = document.getElementById('look-section').children;
        for (let i = 0; i < looksection.length; i++) {
            looksection[i].addEventListener('input', this.generate.bind(this));
        }
        // document.querySelector('point-manager').addEventListener('changeevent', ()=>console.log('changed'));
        document.querySelector('point-manager').addEventListener('changeevent', this.generate.bind(this));
    }
    arrow(x, y, rad = 0) {
        const oldTransform = ctx.getTransform();
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
    }
    loadOptions() {
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
        this.loadLookSection();
        this.loadPoints();
    }
    loadPoints() {
        this.points = document.querySelector('point-manager').getPoints();
    }
    loadLookSection() {
        this.color = document.getElementById('color').value;
    }
    generate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.loadOptions();
        ctx.resetTransform();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.lineBuffer = this.gap / 2;
        this.calculateCanvasSize(this.gap, this.lineBuffer);
        this.calculateOrigin(this.gap, this.lineBuffer);
        this.setColor(this.color);
        write('0', -this.numberOffset / 2, -this.numberOffset / 2, this.numberSize * this.strokeWidth / 2);
        ctx.lineWidth = this.strokeWidth;
        this.axis(new Vector(-1, 1), this.xfrom, this.xto, this.gap / 2, this.xSection.name);
        this.axis(new Vector(1, 0), this.yfrom, this.yto, this.gap, this.ySection.name);
        this.axis(new Vector(0, -1), this.zfrom, this.zto, this.gap, this.zSection.name);
        this.drawPoints();
        drawImage();
    }
    drawPoints() {
        this.points.forEach(point => {
            const { x, y, z } = point;
            this.drawPoint(x, y, z);
        });
    }
    drawPoint(x, y, z) {
        const dx = x * this.gap / 2;
        const dy = y * this.gap;
        const dz = -z * this.gap;
        console.log(dx, dy, dz);
        const position2D = convert3dTo2d(dx, dy, dz);
        this.setColor('green');
        line(position2D.x - 10, position2D.y - 10, 20, 20);
        line(position2D.x - 10, position2D.y + 10, 20, -20);
    }
    calculateCanvasSize(gap, endOffset) {
        // calculate canvas size to fit content
        let width = 0;
        let height = 0;
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
    }
    calculateOrigin(gap, endOffset) {
        let startX = 0;
        let startY = 0;
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
    }
    setColor(color) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
    }
    axis(direction, from, to, gap, name) {
        const lengthPositive = to * gap + this.lineBuffer / 2;
        const lengthNegative = from * gap + this.lineBuffer / 2;
        const end = direction.mult(lengthPositive);
        if (from > 0) {
            from *= -1;
        }
        drawVector(direction, lengthPositive);
        drawVector(direction.mult(-1), lengthNegative);
        this.arrow(end.x, end.y, direction.getAngle() + Math.PI / 2);
        write(name, end.x + this.nameOffset * direction.x, end.y + this.nameOffset * direction.y, this.numberSize * this.strokeWidth / 2);
        for (let i = from; i <= to; i++) {
            if (i == 0)
                continue;
            const step = direction.mult(i * gap);
            const newVector = direction.rotateBy(Math.PI / 2);
            line(step.x, step.y, newVector.x * this.strokeLength, newVector.y * this.strokeLength);
            line(step.x, step.y, -newVector.x * this.strokeLength, -newVector.y * this.strokeLength);
            if (direction.getAngle() == 0) {
                write(i.toString(), step.x + newVector.x * this.numberOffset, step.y + newVector.y * this.numberOffset, this.numberSize * this.strokeWidth / 2);
            }
            else {
                ;
                write(i.toString(), step.x - newVector.x * this.numberOffset / 2, step.y - newVector.y * this.numberOffset / 2, this.numberSize * this.strokeWidth / 2);
            }
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new Generator();
    canvas.remove();
    async function copyImage() {
        const data = await fetch(convertCanvasToImage());
        const blob = await data.blob();
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]);
    }
    document.getElementById('copy').addEventListener('click', copyImage);
});
