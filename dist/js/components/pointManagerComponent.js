import PointElement from "./pointComponent.js";
const changeEvent = new CustomEvent('changeevent');
export default class PointManager extends HTMLElement {
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
        this.shadowRoot.getElementById('points').appendChild(point);
        this.points.push(point);
        // delete the point
        point.shadowRoot.querySelector(".delete").addEventListener('click', () => {
            this.shadowRoot.getElementById('points').removeChild(point);
            this.points = this.points.filter((p) => p !== point);
            this.dispatchEvent(changeEvent);
        });
        // update the point with new values if values changed
        point.shadowRoot.querySelectorAll('.x, .y, .z').forEach((input) => {
            input.addEventListener('change', () => {
                this.dispatchEvent(changeEvent);
            });
        });
    }
    getPoints() {
        const pointList = [];
        this.points.forEach((point) => {
            pointList.push(point.getPoint());
        });
        return pointList;
    }
    html() {
        this.shadowRoot.innerHTML += /*html*/ `
        <div id='points'></div>
        <button id="add-point">Add Point</button>
        `;
    }
    css() {
        this.shadowRoot.innerHTML += '<style>' + /*css*/ `
            #points{
                display: flex;
                gap: 10px;
                flex-direction: column;
            }

            :host{
                display: grid;
                grid-template-rows: 2fr 1fr;
                place-items: center;
                gap: 20px
            }

        ` + '</style>';
    }
}
customElements.define('point-manager', PointManager);
