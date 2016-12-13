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
            this._dying1 = false;
            this._dying2 = false;
            this._alive = true;
            this._speed = 6;
            this.target = target;
            this.on("mouseover", this.overButton, this);
            this.on("mouseout", this.outButton, this);
            this.on("mousedown", this.destroy, this);
            // Hover cursor setup
            this._hoverReticle = new createjs.Bitmap(assets.getResult("enemyReticle"));
            this._hoverReticle.regX = this._hoverReticle.getBounds().width / 2;
            this._hoverReticle.regY = this._hoverReticle.getBounds().height / 2;
        }
        Enemy.prototype.update = function () {
            _super.prototype.update.call(this);
            var newRotation = Math.atan2(this.target.y - this.position.y, this.target.x - this.position.x) * 180 / Math.PI;
            this.rotation = newRotation;
            this._scaleY = ((this.target.y - this.position.y) /
                (Math.abs((this.target.y - this.position.y)) + Math.abs((this.target.x - this.position.x))));
            this._scaleX = ((this.target.x - this.position.x) /
                (Math.abs((this.target.y - this.position.y)) + Math.abs((this.target.x - this.position.x))));
            // Update hover reticle position
            this._hoverReticle.x = stage.mouseX;
            this._hoverReticle.y = stage.mouseY;
            this.position.x += this._scaleX * this._speed;
            this.position.y += this._scaleY * this._speed;
            this._deathAnimation();
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
                this.alpha = 0.3;
            }
        };
        Enemy.prototype.overButton = function (event) {
            if (dimension == config.Dimension.secondDimension) {
                stage.addChild(this._hoverReticle);
            }
        };
        Enemy.prototype.outButton = function (event) {
            stage.removeChild(this._hoverReticle);
        };
        Enemy.prototype.destroy = function (event) {
            if (dimension == config.Dimension.secondDimension) {
                var deathSound = createjs.Sound.play("enemyDeathSound", { loop: 0 });
                deathSound.play();
                this._dying1 = true;
            }
        };
        Enemy.prototype._deathAnimation = function () {
            if (this.scaleX < 1.2 && this._dying1) {
                this.scaleX += 0.01;
                this.scaleY += 0.01;
                currentScene.update();
            }
            else if (this.scaleX > 0 && this._dying2) {
                this._dying2 = true;
                this._dying1 = false;
                this.scaleX -= 0.01;
                this.scaleY -= 0.01;
                currentScene.update();
            }
            else {
                this._alive = false;
            }
        };
        Object.defineProperty(Enemy.prototype, "isAlive", {
            get: function () {
                return this._alive;
            },
            enumerable: true,
            configurable: true
        });
        return Enemy;
    }(objects.GameObject));
    objects.Enemy = Enemy;
})(objects || (objects = {}));
//# sourceMappingURL=enemy.js.map