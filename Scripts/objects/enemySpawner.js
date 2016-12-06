var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var objects;
(function (objects) {
    var EnemySpawner = (function (_super) {
        __extends(EnemySpawner, _super);
        function EnemySpawner(defaultPosition) {
            _super.call(this, "enemySpawner", config.Dimension.firstDimension, "invisibleWall", "invisibleWall", 2, 500);
            this.activated = false;
            this.x = this.position.x = defaultPosition;
            this.y = this.position.y = 550;
        }
        EnemySpawner.prototype.update = function () {
            _super.prototype.update.call(this);
        };
        return EnemySpawner;
    }(objects.DimensionObject));
    objects.EnemySpawner = EnemySpawner;
})(objects || (objects = {}));
//# sourceMappingURL=enemySpawner.js.map