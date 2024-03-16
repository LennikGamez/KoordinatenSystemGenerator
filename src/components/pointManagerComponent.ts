import PointElement from "./pointComponent.js";
import { Point } from "../types.js";

const changeEvent = new CustomEvent('changeevent');

export default class PointManager extends HTMLElement {
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
        
        this.shadowRoot.getElementById('points').appendChild(point);
        this.points.push(point);

        // delete the point
        point.shadowRoot.querySelector(".delete").addEventListener('click', ()=>{
            this.shadowRoot.getElementById('points').removeChild(point)
            this.points = this.points.filter((p) => p !== point);
            
            this.dispatchEvent(changeEvent);
        });

        // update the point with new values if values changed
        point.shadowRoot.querySelectorAll('.x, .y, .z').forEach((input)=>{
            input.addEventListener('change', ()=>{                
                this.dispatchEvent(changeEvent);
            })
        })
    }

    getPoints(): Point[] {
        const pointList: Point[] = [];
        this.points.forEach((point)=>{
            pointList.push(point.getPoint());
        })
        return pointList;
    }

    html(){
        this.shadowRoot.innerHTML += /*html*/`
        <div id='points'></div>
        <button id="add-point">Add Point</button>
        `
    }

    css(){
        this.shadowRoot.innerHTML += '<style>'+ /*css*/`
            #points{
                display: flex;
                gap: 10px;
                flex-direction: column;
            }

        `+'</style>'
    }
}

customElements.define('point-manager', PointManager) 