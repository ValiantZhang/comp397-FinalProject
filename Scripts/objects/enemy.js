var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var objects;
(function (objects) {
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy(animation, target) {
            _super.call(this, animation, "enemy");
            this._speed = 2;
            this.target = target;
            this.on("mouseover", this.overButton, this);
            this.on("mouseout", this.outButton, this);
            this.on("mousedown", this.destroy, this);
        }
        Enemy.prototype.update = function () {
            _super.prototype.update.call(this);
            var newRotation = Math.atan2(this.target.y - this.position.y, this.target.x - this.position.x) * 180 / Math.PI;
            this.rotation = newRotation;
            //console.log("Rotatation" +this.rotation);
            this._scaleY = ((this.target.y - this.position.y) /
                (Math.abs((this.target.y - this.position.y)) + Math.abs((this.target.x - this.position.x))));
            this._scaleX = ((this.target.x - this.position.x) /
                (Math.abs((this.target.y - this.position.y)) + Math.abs((this.target.x - this.position.x))));
            //console.log("Rotatation" +this._scaleX);    
            this.position.x += this._scaleX * this._speed;
            this.position.y += this._scaleY * this._speed;
            this.checkDimension();
        };
        Enemy.prototype.setPosition = function (pos) {
            this.x = pos.x;
            this.y = pos.y;
        };
        Enemy.prototype.getPosition = function () {
            return new objects.Vector2(this.x, this.y);
        };
        Enemy.prototype.moveTowards = function (targetPos) {
            this.x = targetPos.x;
            this.y = targetPos.y;
        };
        Enemy.prototype.endGame = function () {
            stage.removeAllChildren();
            scene = config.Scene.MENU;
            changeScene();
        };
        Enemy.prototype.checkDimension = function () {
            if (dimension == config.Dimension.secondDimension) {
                this.alpha = 1.0;
            }
            else {
                this.alpha = 0.1;
            }
        };
        // private _dead() : void {
        //     currentScene.removeChild(this);
        // }
        Enemy.prototype.overButton = function (event) {
            if (dimension == config.Dimension.secondDimension) {
                event.currentTarget.alpha = 0.5;
            }
        };
        Enemy.prototype.outButton = function (event) {
            if (dimension == config.Dimension.secondDimension) {
                event.currentTarget.alpha = 1.0;
            }
        };
        Enemy.prototype.destroy = function (event) {
            if (dimension == config.Dimension.secondDimension) {
                this.parent.removeChild(this);
                currentScene.update();
            }
        };
        return Enemy;
    }(objects.GameObject));
    objects.Enemy = Enemy;
})(objects || (objects = {}));
//# sourceMappingURL=enemy.js.map