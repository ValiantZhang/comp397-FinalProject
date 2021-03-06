var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var objects;
(function (objects) {
    var Spike = (function (_super) {
        __extends(Spike, _super);
        function Spike(x_position, moving, sprit, dim) {
            if (moving === void 0) { moving = false; }
            if (dim === void 0) { dim = config.Dimension.firstDimension; }
            _super.call(this, sprit, dim, sprit, sprit, 128, 87);
            this.direction = 1;
            this.moveable = moving;
            this.x = this.position.x = x_position;
            this.y = this.position.y = config.Screen.CENTER_Y + 140;
        }
        Spike.prototype.update = function () {
            if (this.moveable) {
                //console.log(this.position.y)
                if (this.position.y >= (config.Screen.CENTER_Y + 280))
                    this.direction = -1;
                else if (this.position.y <= (config.Screen.CENTER_Y + 139))
                    this.direction = 1;
                if (dimension == config.Dimension.firstDimension) {
                    this.position.y += 4 * Math.random() * this.direction;
                }
                else {
                    this.position.y += 4 * Math.random() * this.direction * config.Zone.alternateZone;
                }
            }
            _super.prototype.update.call(this);
        };
        Spike.prototype.endGame = function () {
            stage.removeAllChildren();
            scene = config.Scene.MENU;
            changeScene();
        };
        return Spike;
    }(objects.DimensionObject));
    objects.Spike = Spike;
})(objects || (objects = {}));
//# sourceMappingURL=spike.js.map