var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var objects;
(function (objects) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(imgString) {
            _super.call(this, imgString);
            this._gravity = 9.81;
            this._maxSpeedX = 10;
            this._jumpSpeed = 10;
            this._friction = -1;
            this._marioState = config.MarioState.SMALL;
            this._isStar = false;
            this._isDead = false;
            this._isGrounded = false;
            this._isJumping = false;
            this._isRunning = false;
            this.isColliding = false;
            this.start();
        }
        Player.prototype.start = function () {
            this._velocity = new objects.Vector2(0, 0);
            this._accelerationX = 0;
        };
        Player.prototype.update = function () {
            // Acceleration \
            // Velocity
            if (this._velocity.x > this._maxSpeedX) {
                this._velocity.x = this._maxSpeedX;
            }
            else if (this._velocity.x < -this._maxSpeedX) {
                this._velocity.x = -this._maxSpeedX;
            }
            else {
                this._velocity.x += this._accelerationX;
            }
            if (this._velocity.y > 9.81) {
                this._velocity.y = 5;
            }
            if (this._isGrounded) {
                this._velocity.y = 0;
            }
            else {
                this._velocity.y += this._gravity;
            }
            // Position
            this.position.x += this._velocity.x;
            this.position.y += this._velocity.y;
            if (this._velocity.y > 9.81) {
                this._velocity.y = 9.81;
            }
            if (this._isGrounded) {
                this._friction = 0.75;
                this._velocity.y = 0;
            }
            else {
                this._friction = 0;
            }
            // // AccelerationX affects Velocity.x
            // // Gravity affects Velocity.y
            // // MaxSpeed caps Velocity.x
            // if(Math.abs(this._velocity.x) < this._maxSpeedX) {
            //     this._velocity.x += this._accelerationX;
            // }
            // this._velocity.x *= this._friction;
            // this.position.x += this._velocity.x;
            // this.position.y += this._velocity.y + this._gravity;
            console.log("Position" + this.position);
            //+ " Vel: " + this._velocity + " Acc: " + this._accelerationX);
            _super.prototype.update.call(this);
        };
        Player.prototype.getVelocity = function () {
            return this._velocity;
        };
        Player.prototype.setVelocity = function (newVelocity) {
            this._velocity = newVelocity;
        };
        Player.prototype.getIsGrounded = function () {
            return this._isGrounded;
        };
        Player.prototype.setIsGrounded = function (b) {
            this._isGrounded = b;
        };
        Player.prototype.moveRight = function () {
            this._accelerationX += 0.05;
            this.scaleX = -1;
            this._setMoving();
        };
        Player.prototype.moveLeft = function () {
            this._accelerationX += -0.05;
            this.scaleX = 1;
            this._setMoving();
        };
        Player.prototype.resetAcceleration = function () {
            this._accelerationX = 0;
            this._velocity.x = 0;
        };
        Player.prototype.jump = function () {
            this.setIsGrounded(false);
            this._velocity.y = -25;
            this._isJumping = true;
        };
        Player.prototype.idle = function () {
            this.gotoAndPlay("idle");
            this._isRunning = false;
        };
        Player.prototype._setMoving = function () {
            if (!this._isRunning) {
                this.gotoAndPlay("run");
                this._isRunning = true;
            }
        };
        return Player;
    }(objects.GameObject));
    objects.Player = Player;
})(objects || (objects = {}));
//# sourceMappingURL=player.js.map