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
            _super.call(this, "enemyOb", config.Dimension.firstDimension, "enemyObstacle", "enemyObstacle", 500, 500);
            this.x = this.position.x = defaultPosition.x;
            this.y = this.position.y = defaultPosition.y;
        }
        EnemyObstacle.prototype.start = function () {
            this.scaleX = 1;
            this.scaleY = 1;
        };
        EnemyObstacle.prototype.update = function () {
            _super.prototype.update.call(this);
            this.checkDimension();
        };
        EnemyObstacle.prototype.checkDimension = function () {
            if (dimension == config.Dimension.secondDimension) {
                this.alpha = 1.0;
            }
            else {
                this.alpha = 0.1;
            }
        };
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