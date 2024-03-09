
export default class PointElement extends HTMLElement{
    shadowRoot: ShadowRoot;
    constructor() {
        super();
        this.shadowRoot = this.attachShadow({mode: 'open'});
        this.html();
        this.css();
    }

    html() {
        this.shadowRoot.innerHTML += /*html*/`
         <h1>Point</h1>   
        `
    }

    css(){
        this.shadowRoot.innerHTML +=  /*css*/`
            
        `
    }
}


customElements.define('point-element', PointElement)