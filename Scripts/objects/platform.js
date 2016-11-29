var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var objects;
(function (objects) {
    var Platform = (function (_super) {
        __extends(Platform, _super);
        function Platform(defaultPosition) {
            _super.call(this, null, "platform1", "platform1_3", 192, 47);
            //console.log("block" + defaultPosition.x+ " : "+ defaultPosition.y);
            this.x = defaultPosition.x;
            this.y = defaultPosition.y;
            //this.position =defaultPosition;
        }
        return Platform;
    }(objects.GameObject));
    objects.Platform = Platform;
})(objects || (objects = {}));
//# sourceMappingURL=platform.js.map