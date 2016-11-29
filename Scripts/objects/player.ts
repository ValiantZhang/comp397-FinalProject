module objects {
    export class Player extends objects.GameObject {
        private _gravity : number = 9.81;

        private _maxSpeedX : number = 30;
        private _velocity : objects.Vector2;
        private _accelerationX : number;
        private _maxAccelerationX : number;
        private _jumpSpeed : number = 10;
        private _friction : number = -1;
        private _jumpTimer : number = 2;

        //private _marioState : number = config.MarioState.SMALL;
        private _isStar : boolean = false;
        private _isDead : boolean = false;
        private _isGrounded : boolean = false;
        private _isJumping : boolean = false;
        private _isRunning : boolean = false;
        
        public isColliding : boolean = false;

        constructor(animation : createjs.SpriteSheet, objectName:string) {
            super(animation,objectName);
            this.start();
        }

        public start() : void {
            this._velocity = new objects.Vector2(0,0);
            this._accelerationX = 0;
            this._maxAccelerationX = 30;
            this._jumpTimer = this._jumpTimer * 1000;
        }

        public update() : void {
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
            } else if (this._velocity.x < -this._maxSpeedX) {
                this._velocity.x = -this._maxSpeedX;
            } else {
                this._velocity.x += this._accelerationX;
            }
            
            this._velocity.x *= this._friction;
            this.position.x -= this._velocity.x;

            if(this._velocity.y > this._gravity) {
                this._velocity.y = this._gravity;
            }
            
            if(this._isGrounded) {
                this._velocity.y = 0;
            } else {
                this._velocity.y += this._gravity;
                this.position.y += this._velocity.y;
            }

            
            
            // console.log("Position" + this.position);
            //+ " Vel: " + this._velocity + " Acc: " + this._accelerationX);
            super.update();
        }

        public getVelocity() : objects.Vector2 {
            return this._velocity;
        }

        public setVelocity(newVelocity : objects.Vector2) {
            this._velocity = newVelocity;
        }

        public getIsGrounded() : boolean {
            return this._isGrounded;
        }

        public setIsGrounded(b : boolean) : void {
            this._isGrounded = b;
        }

        public moveRight() : void {
            if (this._accelerationX < this._maxAccelerationX){
                this._accelerationX += 3;
            } else {
                this._accelerationX = this._maxAccelerationX;
            }
            this.scaleX = -1;
            this._setMoving();
        }
        public moveLeft() : void {
            if (this._accelerationX > -this._maxAccelerationX){
                this._accelerationX -= 3;
            } else {
                this._accelerationX = -this._maxAccelerationX;
            }
            this.scaleX = 1;
            this._setMoving();
        }
        public resetAcceleration() : void {
            this._accelerationX = 0;
            this._velocity.x = 0;
        }
        public jump() : void {
            this.setIsGrounded(false);
            
            if (this.position.y < config.Screen.CENTER_Y - 250){
                this.position.y = config.Screen.CENTER_Y - 250;
            }
            
            for (var i = 0; i <= this._jumpTimer; i++){
                
                if (i < this._jumpTimer /2){
                    this._velocity.y = -25;
                    this._isJumping = true;
                 } 
            }
            
            
        }
        public idle() : void {
            this.gotoAndPlay("idle");
            this._isRunning = false;
            this._accelerationX = 0;
        }
        private _setMoving() : void{
           if (!this._isRunning){
                this.gotoAndPlay("run");
                this._isRunning = true;
            } 
        }
    }
}