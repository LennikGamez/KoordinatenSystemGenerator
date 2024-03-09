var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PointElement = /** @class */ (function (_super) {
    __extends(PointElement, _super);
    function PointElement() {
        var _this = _super.call(this) || this;
        _this.shadowRoot = _this.attachShadow({ mode: 'open' });
        return _this;
    }
    PointElement.prototype.html = function () {
        return /*html*/ "\n            \n        ";
    };
    PointElement.prototype.css = function () {
        return /*css*/ "\n            \n        ";
    };
    return PointElement;
}(HTMLElement));
customElements.define('point-element', PointElement);
