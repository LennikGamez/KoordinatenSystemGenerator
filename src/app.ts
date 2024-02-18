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
        this.to = parseFloat((section.querySelector('input[name="unit-to"]') as HTMLInputElement).value);
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
        this.numberOffset += this.strokeWidth + 5;
        this.nameOffset += this.strokeWidth + 5;
        this.loadOptions();

        this.generate();
        this.sections.forEach(section => {
            section.section.addEventListener('input', this.generate.bind(this))
        });
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

        this.calculateCanvasSize(this.gap, this.xto, this.yto, this.zto, this.lineBuffer + this.nameOffset);
        this.calculateOrigin(this.gap, this.xto, this.zto, this.lineBuffer + this.nameOffset);
        ctx.lineWidth = this.strokeWidth;

        this.xAxis(this.xfrom, this.xto);
        this.yAxis(this.yfrom, this.yto);
        this.zAxis(this.zto);

        drawImage();

    }

    calculateCanvasSize(gap, x, y, z, endOffset){
        // calculate canvas size to fit content
        const width = x*gap/2 + endOffset  + y*gap + endOffset;
        const height = z*gap + endOffset + x*gap/2 + endOffset;

        canvas.width  = width + this.margin*2;
        canvas.height = height + this.margin*2;
        
    }

    calculateOrigin(gap, x, z, endOffset){

        // calculate origin of coordinate system
        const startX = x*gap/2 + endOffset + this.margin;
        const startY = z*gap + endOffset + this.margin;


        ctx.translate(startX, startY);
        write('0', -12, 0, this.numberSize * this.strokeWidth / 2)
    }
    xAxis(from, to){
        const endX = -to * this.gap/2 - this.lineBuffer/2;
        const endY = to * this.gap/2 + this.lineBuffer/2;
        
        if (from > 0){
            from *= -1
        }
        //negative x axis
        if(from < 0){
            line(0, 0, -from*this.gap/2 + this.lineBuffer/2, from*this.gap/2 - this.lineBuffer/2);
            console.log(from*this.gap + this.lineBuffer);
            
        }
        // positive x axis
        line(0, 0, -to*this.gap/2 - this.lineBuffer/2, to*this.gap/2 + this.lineBuffer/2);
        arrow(endX, endY, 270-45);
        write(this.xSection.name, endX - this.nameOffset, endY + this.nameOffset, this.numberSize * this.strokeWidth / 2);
    
        for (let i = from; i <= to; i++) {
            if(i == 0) continue
            const stepSize: number = i*this.gap/2
            line(-stepSize - this.strokeLength, +stepSize - this.strokeLength, this.strokeLength*2, this.strokeLength*2)            
            write((i*this.xSection.step).toString(), -stepSize + this.numberOffset, +stepSize + this.numberOffset, this.numberSize * this.strokeWidth / 2)
        }
    }
    yAxis(from, to){
        const endX = 0 + to*this.gap + this.lineBuffer;
        const endY = 0;

        if(from > 0){
            from *= -1
        }
        if (from < 0){
            line(0, 0, from*this.gap - this.lineBuffer, 0);
        }
        
        line(0, 0, to*this.gap + this.lineBuffer, 0);
        arrow(endX, endY, 90);
        write(this.ySection.name, endX + this.nameOffset, endY, this.numberSize * this.strokeWidth / 2);
        
        for (let i = from; i <= to; i++) {
            if(i == 0) continue
            const stepSize: number = i*this.gap;
            line(stepSize, -this.strokeLength, 0, this.strokeLength*2)
            write((i*this.ySection.step).toString(), stepSize, + this.numberOffset, this.numberSize * this.strokeWidth / 2)
        }
    }
    zAxis(from, to){        
        const endY = -z*this.gap - this.lineBuffer;
        line(0, 0, 0, endY);
        arrow(0, endY);
        write(this.zSection.name, 0, endY - this.nameOffset, this.numberSize * this.strokeWidth / 2)
    
        for(let i = 1; i <= z; i++){
            if(i == 0) continue
            const stepSize: number = i*this.gap;
            line(-this.strokeLength, -stepSize, this.strokeLength*2, 0)
            write((i*this.zSection.step).toString(), -this.numberOffset, -stepSize, this.numberSize * this.strokeWidth / 2)
        }
    }
}

// drawSystem(2, 5, 6, 100);
new Generator(5);
canvas.remove();

async function copyImage(){
    const data = await fetch(convertCanvasToImage());
    const blob = await data.blob();
    await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
    ]) 
}

copyImage();