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
    units: number;

    constructor(section: HTMLDivElement){
        this.section = section;
        this.name = (section.querySelector('input[name="name"]') as HTMLInputElement).value.toLowerCase();
        this.step = parseFloat((section.querySelector('input[name="step"]') as HTMLInputElement).value);
        this.units = parseFloat((section.querySelector('input[name="unit"]') as HTMLInputElement).value);
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
    x: number;
    y: number;
    z: number;

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
        
        this.x = this.xSection.units;
        this.y = this.ySection.units;
        this.z = this.zSection.units;
        this.sections = [this.xSection, this.ySection, this.zSection];
    }

    generate(){
        
        this.loadOptions();
        ctx.resetTransform();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.gap = cmInPixel(this.gapInCm);
        this.lineBuffer = this.gap/2;

        this.calculateCanvasSize(this.gap, this.x, this.y, this.z, this.lineBuffer + this.nameOffset);
        this.calculateOrigin(this.gap, this.x, this.z, this.lineBuffer + this.nameOffset);
        ctx.lineWidth = this.strokeWidth;

        this.xAxis(this.x);
        this.yAxis(this.y);
        this.zAxis(this.z);

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
    xAxis(x){
        const endX = -x * this.gap/2 - this.lineBuffer;
        const endY = x * this.gap/2 + this.lineBuffer;
    
        line(0, 0, -x*this.gap/2 - this.lineBuffer, x*this.gap/2 + this.lineBuffer);
        arrow(endX, endY, 270-45);
        write(this.xSection.name, endX - this.nameOffset, endY + this.nameOffset, this.numberSize * this.strokeWidth / 2);
    
        for (let i = 1; i <= x; i++) {
            const stepSize: number = i*this.gap/2
            line(-stepSize - this.strokeLength, +stepSize - this.strokeLength, this.strokeLength*2, this.strokeLength*2)            
            write((i*this.xSection.step).toString(), -stepSize + this.numberOffset, +stepSize + this.numberOffset, this.numberSize * this.strokeWidth / 2)
        }
    }
    yAxis(y){
        const endX = 0 + y*this.gap + this.lineBuffer;
        const endY = 0;
        
        line(0, 0, y*this.gap + this.lineBuffer, 0);
        arrow(endX, endY, 90);
        write(this.ySection.name, endX + this.nameOffset, endY, this.numberSize * this.strokeWidth / 2);
        
        for (let i = 1; i <= y; i++) {
            const stepSize: number = i*this.gap;
            line(stepSize, -this.strokeLength, 0, this.strokeLength*2)
            write((i*this.ySection.step).toString(), stepSize, + this.numberOffset, this.numberSize * this.strokeWidth / 2)
        }
    }
    zAxis(z){        
        const endY = -z*this.gap - this.lineBuffer;
        line(0, 0, 0, endY);
        arrow(0, endY);
        write(this.zSection.name, 0, endY - this.nameOffset, this.numberSize * this.strokeWidth / 2)
    
        for(let i = 1; i <= z; i++){
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