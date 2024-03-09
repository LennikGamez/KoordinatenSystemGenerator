
class PointElement extends HTMLElement{
    shadowRoot: ShadowRoot;
    constructor() {
        super();
        this.shadowRoot = this.attachShadow({mode: 'open'});

    }

    html() {
        return /*html*/`
            
        `
    }

    css(){
        return /*css*/`
            
        `
    }
}


customElements.define('point-element', PointElement)