var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var objects;
(function (objects) {
    var InvPlatform = (function (_super) {
        __extends(InvPlatform, _super);
        function InvPlatform(animation, defaultPosition, canMove, moveDir, switchDirTimer) {
            _super.call(this, animation, config.Dimension.firstDimension, animation, "platform1_3_alt", 192, 47);
            this.direction = 1;
            this.mobile = canMove;
            this.orientation = moveDir;
            this._switchDelay = switchDirTimer * 1000;
            this._currentTick = createjs.Ticker.getTime();
            this._switchTime = this._currentTick + this._switchDelay;
            this.x = this.position.x = defaultPosition.x;
            this.y = this.position.y = defaultPosition.y;
        }
        InvPlatform.prototype.update = function () {
            _super.prototype.update.call(this);
            this.checkDimension();
        };
        InvPlatform.prototype.checkIfMobile = function () {
            if (this.mobile && this.orientation == "vertical") {
                this.checkTimer();
                this.position.y += this.direction;
            }
            if (this.mobile && this.orientation == "horizontal") {
                this.checkTimer();
                this.position.x += this.direction;
                ;
            }
        };
        InvPlatform.prototype.checkTimer = function () {
            if (createjs.Ticker.getTime() >= this._switchTime) {
                this.direction = this.direction * -1;
                this._currentTick = createjs.Ticker.getTime();
                this._switchTime = this._currentTick + this._switchDelay;
            }
        };
        InvPlatform.prototype.checkDimension = function () {
            if (dimension == config.Dimension.secondDimension) {
                this.alpha = 1.0;
                this.checkIfMobile();
            }
            else {
                this.alpha = 0.3;
            }
        };
        return InvPlatform;
    }(objects.DimensionObject));
    objects.InvPlatform = InvPlatform;
})(objects || (objects = {}));
//# sourceMappingURL=invPlatform.js.map