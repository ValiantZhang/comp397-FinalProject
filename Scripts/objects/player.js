var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var objects;
(function (objects) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(animation, objectName) {
            _super.call(this, animation, objectName);
            this._gravity = 9.81;
            this._maxSpeedX = 30;
            this._jumpSpeed = 10;
            this._friction = -1;
            this._jumpTimer = 2;
            //private _marioState : number = config.MarioState.SMALL;
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
            this._maxAccelerationX = 30;
            this._jumpTimer = this._jumpTimer * 1000;
        };
        Player.prototype.update = function () {
            console.log("speed" + this._velocity);
            // Acceleration \
            // Velocity
            // if(this._velocity.x > this._maxSpeedX) {
            //     this._velocity.x = this._maxSpeedX;
            // } else if (this._velocity.x < -this._maxSpeedX) {
            //     this._velocity.x = -this._maxSpeedX;
            // } else {
            //     this._velocity.x += this._accelerationX;
            // }
            // if (this._velocity.y > this._gravity) {
            //     this._velocity.y = this._gravity;
            // }
            // if(this._isGrounded) {
            //     this._velocity.y = 0;
            // } else {
            //     this._velocity.y += this._gravity;
            // }
            // // Position
            // this.position.x += this._velocity.x;
            // this.position.y += this._velocity.y;
            // if(this._isGrounded) {
            //     this._friction = 0.75;
            //     this._velocity.y = 0;
            // }
            // else {
            //     this._friction = 0;
            // }
            // // // AccelerationX affects Velocity.x
            // // // Gravity affects Velocity.y
            // // // MaxSpeed caps Velocity.x
            // // if(Math.abs(this._velocity.x) < this._maxSpeedX) {
            // //     this._velocity.x += this._accelerationX;
            // // }
            // this._velocity.x *= this._friction;
            // this.position.x += this._velocity.x;
            // this.position.y += this._velocity.y + this._gravity;
            // THIS STUFF
            // Apply acceleration and friction to velocity
            if (this._velocity.x > this._maxSpeedX) {
                this._velocity.x = this._maxSpeedX;
            }
            else if (this._velocity.x < -this._maxSpeedX) {
                this._velocity.x = -this._maxSpeedX;
            }
            else {
                this._velocity.x += this._accelerationX;
            }
            this._velocity.x *= this._friction;
            this.position.x -= this._velocity.x;
            if (this._velocity.y > this._gravity) {
                this._velocity.y = this._gravity;
            }
            if (this._isGrounded) {
                this._velocity.y = 0;
            }
            else {
                this._velocity.y += this._gravity;
                this.position.y += this._velocity.y;
            }
            // console.log("Position" + this.position);
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
            if (this._accelerationX < this._maxAccelerationX) {
                this._accelerationX += 3;
            }
            else {
                this._accelerationX = this._maxAccelerationX;
            }
            this.scaleX = -1;
            this._setMoving();
        };
        Player.prototype.moveLeft = function () {
            if (this._accelerationX > -this._maxAccelerationX) {
                this._accelerationX -= 3;
            }
            else {
                this._accelerationX = -this._maxAccelerationX;
            }
            this.scaleX = 1;
            this._setMoving();
        };
        Player.prototype.resetAcceleration = function () {
            this._accelerationX = 0;
            this._velocity.x = 0;
        };
        Player.prototype.jump = function () {
            this.setIsGrounded(false);
            if (this.position.y < config.Screen.CENTER_Y - 250) {
                this.position.y = config.Screen.CENTER_Y - 250;
            }
            for (var i = 0; i <= this._jumpTimer; i++) {
                if (i < this._jumpTimer / 2) {
                    this._velocity.y = -25;
                    this._isJumping = true;
                }
            }
        };
        Player.prototype.idle = function () {
            this.gotoAndPlay("idle");
            this._isRunning = false;
            this._accelerationX = 0;
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