var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var objects;
(function (objects) {
    var Platform = (function (_super) {
        __extends(Platform, _super);
        function Platform(animation, defaultPosition) {
            _super.call(this, animation, config.Dimension.firstDimension, animation, "platform1_3_alt", 192, 47);
            this.x = this.position.x = defaultPosition.x;
            this.y = this.position.y = defaultPosition.y;
        }
        Platform.prototype.update = function () {
            _super.prototype.update.call(this);
        };
        return Platform;
    }(objects.DimensionObject));
    objects.Platform = Platform;
})(objects || (objects = {}));
//# sourceMappingURL=platform.js.map