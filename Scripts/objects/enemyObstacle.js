var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var objects;
(function (objects) {
    var EnemyObstacle = (function (_super) {
        __extends(EnemyObstacle, _super);
        function EnemyObstacle(defaultPosition) {
            _super.call(this, "enemyOb", config.Dimension.dualDimension, "enemyObstacle", "enemyObstacle", 243, 304);
            this.x = this.position.x = defaultPosition.x;
            this.y = this.position.y = defaultPosition.y;
            this._hasAttacked = false;
            this._startingY = this.position.y;
        }
        EnemyObstacle.prototype.start = function () {
            this.scaleX = 1;
            this.scaleY = 1;
        };
        EnemyObstacle.prototype.update = function () {
            _super.prototype.update.call(this);
            this.checkDimension();
            if (this._hasAttacked) {
                if (this.position.y > this._startingY - 150) {
                    this.position.y -= 3;
                }
            }
        };
        EnemyObstacle.prototype.checkDimension = function () {
            if (dimension == config.Dimension.secondDimension) {
                this.alpha = 1.0;
            }
            else {
                this.alpha = 0.3;
            }
        };
        EnemyObstacle.prototype.attack = function () {
            this._hasAttacked = true;
        };
        Object.defineProperty(EnemyObstacle.prototype, "hasAttacked", {
            get: function () {
                return this._hasAttacked;
            },
            enumerable: true,
            configurable: true
        });
        EnemyObstacle.prototype.endGame = function () {
            stage.removeAllChildren();
            scene = config.Scene.MENU;
            changeScene();
        };
        return EnemyObstacle;
    }(objects.DimensionObject));
    objects.EnemyObstacle = EnemyObstacle;
})(objects || (objects = {}));
//# sourceMappingURL=enemyObstacle.js.map