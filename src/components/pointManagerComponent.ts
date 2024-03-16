import PointElement from "./pointComponent.js";

class PointManager extends HTMLElement {
    shadowRoot: ShadowRoot;
    points: PointElement[] = [];
    constructor() {
        super();
        this.shadowRoot = this.attachShadow({ mode: 'open' });
        this.points = [];

        this.html();
        this.css();

        this.shadowRoot.getElementById('add-point').addEventListener('click', this.addPoint.bind(this));
    }

    addPoint(){
        const point = new PointElement();
        console.log("dad");
        
        this.shadowRoot.getElementById('points').appendChild(point);
        this.points.push(point);

        // delete the point
        point.shadowRoot.querySelector(".delete").addEventListener('click', ()=>{
            this.shadowRoot.getElementById('points').removeChild(point);
        });

        // update the point with new values if values changed
        point.shadowRoot.querySelectorAll('.x, .y, .z').forEach((input)=>{
            input.addEventListener('change', ()=>{
            })
        })
    }

    html(){
        this.shadowRoot.innerHTML += /*html*/`
        <div id='points'>

        </div>
        <button id="add-point">Add Point</button>
        `
    }

    css(){
        this.shadowRoot.innerHTML += '<style>'+ /*css*/`
            #points{
                display: flex;
                gap: 10px;
            }
        `+'</style>'
    }
}

customElements.define('point-component', PointManager) 