
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
            <input type=number class="x" placeholder='X'></input>   
            <input type=number class="y" placeholder='Y'></input>   
            <input type=number class="z" placeholder='Z'></input>   
            <input type=button class="delete" value="X"></input>
        `
    }

    css(){
        this.shadowRoot.innerHTML +=  '<style>' +/*css*/`
            input{
                width: 40px;
            }
            .reset{
                text-align: center;
                vertical-align: middle;

                background: red;
                border: none;

                padding: 3px;
                border-radius: 4px

            }
            
        `+'</style>'
    }
}


customElements.define('point-element', PointElement)