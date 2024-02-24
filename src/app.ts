import Vector from './vector.js';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

function line(x1: number, y1: number, x2: number, y2: number): void {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + x2, y1 + y2);
    ctx.stroke();
}

function drawVector(direction, length): void{
    line(0, 0, direction.x * length, direction.y * length);
}

function cmInPixel(cm: number){
    return cm * 37.7952756
}

function convertCanvasToImage(){
    return canvas.toDataURL("image/png");
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

function drawImage(){
    let x = convertCanvasToImage();
    document.querySelector('#display').setAttribute('src', x);

}

class Section{
    section: HTMLDivElement;
    step: number = 1;
    name: string;
    from: number;
    to: number;

    constructor(section: HTMLDivElement){
        this.section = section;
        this.name = (section.querySelector('input[name="name"]') as HTMLInputElement).value.toLowerCase();
        this.step = parseFloat((section.querySelector('input[name="step"]') as HTMLInputElement).value);
        this.from = parseFloat((section.querySelector('input[name="unit-from"]') as HTMLInputElement).value);
        this.to = Math.abs(parseFloat((section.querySelector('input[name="unit-to"]') as HTMLInputElement).value));
    }
}


class Generator{
    margin: number = 20;
    nameOffset: number = 20;
    strokeLength: number = 5;
    numberOffset: number = 15;
    numberSize: number = 15;
    gap: number;
    lineBuffer: number;

    xSection: Section;

    ySection: Section;

    zSection: Section

    gapInCm: number;
    xfrom: number;
    xto: number;
    yfrom: number;
    yto: number;
    zfrom: number;
    zto: number;

    sections: Array<Section>;

    strokeWidth = ctx.lineWidth;
    constructor(gap: number){
        this.gap = cmInPixel(gap);
        this.gapInCm = gap;
        this.strokeWidth = this.gapInCm;
        this.strokeLength = this.strokeWidth * 1.75;
        this.numberOffset += this.strokeWidth + this.strokeLength * 2
        this.nameOffset += this.strokeWidth;
        this.nameOffset += this.numberSize + this.strokeLength;
        this.loadOptions();

        this.generate();
        this.sections.forEach(section => {2
            section.section.addEventListener('input', this.generate.bind(this))
        });
    }

    arrow(x: number, y: number, rad: number = 0) {
        const oldTransform = ctx.getTransform();
    
        ctx.translate(x, y);
        ctx.rotate(rad);
        ctx.beginPath();
        ctx.moveTo(this.strokeLength, 0);
        ctx.lineTo(0, - this.strokeLength);
        ctx.stroke();
    
        ctx.beginPath();
        ctx.moveTo(-this.strokeLength, 0);
        ctx.lineTo(0, - this.strokeLength);
        ctx.stroke();
        ctx.setTransform(oldTransform);
    
    }

    loadOptions(){
        this.xSection = new Section(document.getElementById('x-axis') as HTMLDivElement);
        this.ySection = new Section(document.getElementById('y-axis') as HTMLDivElement);
        this.zSection = new Section(document.getElementById('z-axis') as HTMLDivElement);
        
        this.xfrom = this.xSection.from;
        this.xto = this.xSection.to;

        this.yfrom = this.ySection.from;
        this.yto = this.ySection.to;

        this.zfrom = this.zSection.from;
        this.zto = this.zSection.to;
        this.sections = [this.xSection, this.ySection, this.zSection];
    }

    generate(){
        
        this.loadOptions();
        ctx.resetTransform();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.gap = cmInPixel(this.gapInCm);
        this.lineBuffer = this.gap/2;

        this.calculateCanvasSize(this.gap, this.lineBuffer + this.nameOffset);
        this.calculateOrigin(this.gap, this.xto, this.zto, this.lineBuffer + this.nameOffset);
        ctx.lineWidth = this.strokeWidth;

        this.axis(new Vector(-1, 1), this.xfrom, this.xto, this.gap/2, this.xSection.name);
        this.axis(new Vector(1, 0), this.yfrom, this.yto, this.gap, this.ySection.name);
        this.axis(new Vector(0, -1), this.zfrom, this.zto, this.gap, this.zSection.name);

        drawImage();

    }

    calculateCanvasSize(gap, endOffset){
        // calculate canvas size to fit content
        let width=0;
        let height=0;

        // check if x axis is more to the right than the y axis
        if(Math.abs(this.xfrom) * gap/2 > this.yto * gap){
                                       
            width += Math.abs(this.xfrom)*gap/2 + endOffset;
            
        }else{
            width += this.yto*gap + endOffset;
        }

        // check if y axis is more to the left than x axis
        if(this.xto * gap/2 > Math.abs(this.yfrom) * gap){
            width += this.xto * gap/2 + endOffset;
        }else{
            width += Math.abs(this.yfrom) * gap + endOffset;
        }

        // check if z axis is higher than x axis
        if (this.zto * gap > Math.abs(this.xfrom)* gap/2){
            height += this.zto * gap + endOffset;
        }else{
            height += Math.abs(this.xfrom) * gap/2 + endOffset;
        }

        // check if z axis is lower than x axis
        if (Math.abs(this.zfrom) * gap > this.xto * gap/2){
            height += Math.abs(this.zfrom) * gap + endOffset;
        }else{
            height += this.xto * gap/2 + endOffset;
        }

        width += this.numberSize * 2;
        height += this.numberSize * 2;
        

        canvas.width  = width + this.margin*2;
        canvas.height = height + this.margin*2;
        
    }

    calculateOrigin(gap, x, z, endOffset){
        let startX = 0;
        let startY = 0;
        // calculate origin of coordinate system
        if(-this.xto * gap/2 < -Math.abs(this.yfrom) * gap){
            // X axis is more to the left
            startX = this.xto * gap/2 + endOffset + this.margin;
        }
        else{
            // X axis is more to the right
            startX = Math.abs(this.yfrom) * gap + endOffset + this.margin;
        }


        if(this.zto * gap < Math.abs(this.xfrom) * gap/2){
            // Z axis is lower
            startY = Math.abs(this.xfrom) * gap/2 + endOffset + this.margin;
        }
        else{
            // Z axis is higher
            startY = this.zto * gap + endOffset + this.margin;
        }

        startY += this.numberSize * 2;
        ctx.translate(startX, startY);
        write('0', -this.numberOffset/2, -this.numberOffset/2, this.numberSize * this.strokeWidth / 2)
    }

    axis(direction, from, to, gap, name): void{
        const lengthPositive = to * gap + this.lineBuffer/2;
        const lengthNegative = from * gap + this.lineBuffer/2;
        const end: Vector = direction.mult(lengthPositive);

        if (from > 0){
            from *= -1;
        }

        drawVector(direction, lengthPositive);
        drawVector(direction.mult(-1), lengthNegative);

        this.arrow(end.x, end.y, direction.getAngle() + Math.PI/2);
        write(name, end.x + this.nameOffset * direction.x, end.y + this.nameOffset * direction.y, this.numberSize * this.strokeWidth / 2);

        for (let i = from; i <= to; i++) {
            if(i == 0) continue
            const step = direction.mult(i * gap);
            const newVector = direction.rotateBy(Math.PI/2);
            line(step.x, step.y, newVector.x * this.strokeLength, newVector.y * this.strokeLength);
            line(step.x, step.y, -newVector.x * this.strokeLength, -newVector.y * this.strokeLength);

            if (direction.getAngle() == 0){
                write(i.toString(), step.x + newVector.x * this.numberOffset, step.y + newVector.y * this.numberOffset, this.numberSize * this.strokeWidth / 2);
            }else{
                write(i.toString(), step.x - newVector.x * this.numberOffset, step.y - newVector.y * this.numberOffset, this.numberSize * this.strokeWidth / 2);
            }
        }
    }

}

// drawSystem(2, 5, 6, 100);
new Generator(parseFloat(prompt("Centimeter per unit: ")));
canvas.remove();

async function copyImage(){
    const data = await fetch(convertCanvasToImage());
    const blob = await data.blob();
    await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
    ]) 
}

copyImage();