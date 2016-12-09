module objects {
    export class Player extends objects.GameObject {
        private _gravity : number = 6.81;

        private _maxSpeedX : number = 30;
        private _velocity : objects.Vector2;
        private _accelerationX : number;
        private _maxAccelerationX : number;
        private _jumpSpeed : number = 10;
        private _friction : number = -1;
        private _zoneMultiplier : number;

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
            this._zoneMultiplier = config.Zone.realZone;;
        }

        public update() : void {
            
            // Apply acceleration and friction to velocity
            if (this._velocity.x > this._maxSpeedX) {
                this._velocity.x = this._maxSpeedX;
            } else if (this._velocity.x < -this._maxSpeedX) {
                this._velocity.x = -this._maxSpeedX;
            } else {
                this._velocity.x += this._accelerationX;
            }
            
            this._velocity.x *= this._friction;
            this.position.x -= this._velocity.x  * this._zoneMultiplier;

            if(this._velocity.y > this._gravity) {
                this._velocity.y = this._gravity;
            }
            
            if(this._isGrounded) {
                this._velocity.y = 0;
            } else {
                this._velocity.y += this._gravity;
                this.position.y += this._velocity.y * this._zoneMultiplier;
            }

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
            if (this._isGrounded){
                this._isJumping = false;
            }
        }
        
        // Change the multiplier for speed depending on zone
        public changeZone(newZone : number) : void{
            this._zoneMultiplier = newZone;
            if (newZone == config.Zone.alternateZone){
                this.gotoAndPlay("run_alt");
                this._gravity *= config.Zone.alternateZone;
            } else {
                this.gotoAndPlay("run");
                this._gravity /= config.Zone.alternateZone;
            }
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
            if (!this._isJumping){
                this.position.y = this.position.y - 1;
                
                // Clamp jump at screen height
                if (this.position.y < config.Screen.CENTER_Y - 250){
                    this.position.y = config.Screen.CENTER_Y - 250;
                }

                // Set jump velocity based on dimension
                if (this._zoneMultiplier == config.Zone.alternateZone){
                    this._velocity.y = -70 / this._zoneMultiplier / 2;
                } else {
                    this._velocity.y = -70 / this._zoneMultiplier;
                }
                this._isJumping = true;
                this.setIsGrounded(false);
            }
        }
        
        public idle() : void {
            if (dimension == config.Dimension.firstDimension){
                this.gotoAndPlay("idle");
            } else {
                this.gotoAndPlay("idle_alt");
            }
            this._isRunning = false;
            this._accelerationX = 0;
        }
        
        private _setMoving() : void{
           if (!this._isRunning){
                if (dimension == config.Dimension.firstDimension){
                    this.gotoAndPlay("run");
                } else {
                    this.gotoAndPlay("run_alt");
                }
                this._isRunning = true;
            } 
        }
    }
}