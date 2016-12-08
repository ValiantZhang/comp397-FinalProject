var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var objects;
(function (objects) {
    var DimensionObject = (function (_super) {
        __extends(DimensionObject, _super);
        function DimensionObject(objectName, physicalDimension, normalImage, shadowImage, width, height) {
            if (width === void 0) { width = 100; }
            if (height === void 0) { height = 100; }
            _super.call(this, null, objectName, normalImage, width, height, shadowImage);
            this._physicalDimension = physicalDimension;
            this._normalImage = normalImage;
            this._shadowImage = shadowImage;
            this.start();
        }
        DimensionObject.prototype.start = function () {
            this._dimension = config.Dimension.firstDimension;
            if (this._physicalDimension == config.Dimension.firstDimension) {
                this.gotoAndPlay("idle");
            }
            else {
                this.gotoAndPlay("alt");
            }
        };
        DimensionObject.prototype.update = function () {
            _super.prototype.update.call(this);
        };
        // Switch main image with shadow and vice versa
        DimensionObject.prototype.dimensionShift = function () {
            // Swap dimensions
            this._dimension = this._dimension == config.Dimension.firstDimension ?
                config.Dimension.secondDimension :
                config.Dimension.firstDimension;
            if (this._dimension == this._physicalDimension) {
                this.gotoAndPlay("idle");
                this.alpha = 1;
            }
            else {
                this.gotoAndPlay("alt");
                this.alpha = 0.5;
            }
        };
        return DimensionObject;
    }(objects.GameObject));
    objects.DimensionObject = DimensionObject;
})(objects || (objects = {}));
//# sourceMappingURL=dimensionObject.js.map