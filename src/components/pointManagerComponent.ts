

class PointManager extends HTMLElement {
    shadowRoot: ShadowRoot;
    points: PointElement[] = [];
    constructor() {
        super();
        this.shadowRoot = this.attachShadow({ mode: 'open' });
        this.points = [];
    }

    html(){
        return /*html*/`
        
        `
    }

    css(){
        return /*css*/`
            
        `
    }
}