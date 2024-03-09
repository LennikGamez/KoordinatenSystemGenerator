import PointElement from "./pointComponent.js";
class PointManager extends HTMLElement {
    shadowRoot;
    points = [];
    constructor() {
        super();
        this.shadowRoot = this.attachShadow({ mode: 'open' });
        this.points = [];
        this.html();
        this.css();
        this.shadowRoot.getElementById('add-point').addEventListener('click', this.addPoint.bind(this));
    }
    addPoint() {
        const point = new PointElement();
        console.log("dad");
        this.shadowRoot.getElementById('points').appendChild(point);
        this.points.push(point);
    }
    html() {
        this.shadowRoot.innerHTML += /*html*/ `
        <div id='points'>

        </div>
        <button id="add-point">Add Point</button>
        `;
    }
    css() {
        this.shadowRoot.innerHTML += '<style>' + /*css*/ `
            
        ` + '</style>';
    }
}
customElements.define('point-component', PointManager);
