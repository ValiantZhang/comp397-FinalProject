var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var objects;
(function (objects) {
    var HugeWall = (function (_super) {
        __extends(HugeWall, _super);
        function HugeWall(defaultPosition) {
            _super.call(this, "invisibleWall", config.Dimension.firstDimension, "invisibleWall", "invisibleWall", 500, 640);
            this.x = this.position.x = defaultPosition.x;
            this.y = this.position.y = defaultPosition.y;
        }
        return HugeWall;
    }(objects.DimensionObject));
    objects.HugeWall = HugeWall;
})(objects || (objects = {}));
//# sourceMappingURL=hugeWall.js.map