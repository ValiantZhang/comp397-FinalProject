module objects {
    export class Enemy extends objects.GameObject {

        private _move : objects.Vector2;

        // public variables
        public name:string;
        public width:number;
        public height:number;
        public center:objects.Vector2;
        
        private _dying1:boolean = false;
        private _dying2:boolean = false;
        private _alive:boolean = true;
        private _scaleX:number;
        private _scaleY:number;
        private _speed:number=6;
        private _hoverReticle:createjs.Bitmap;
        public target:objects.Vector2;

        constructor(animation:createjs.SpriteSheet, target) {
            super(animation, "enemy");
            
            this.target =target;
            this.on("mouseover", this.overButton, this);
            this.on("mouseout", this.outButton, this);
            this.on("mousedown", this.destroy, this);
            
            // Hover cursor setup
            this._hoverReticle = new createjs.Bitmap(assets.getResult("enemyReticle"));
            this._hoverReticle.regX = this._hoverReticle.getBounds().width / 2;
            this._hoverReticle.regY = this._hoverReticle.getBounds().height / 2;
        }

        public update() : void {
            
            super.update();
            
            var newRotation = Math.atan2(this.target.y - this.position.y, this.target.x - this.position.x) * 180 / Math.PI;
            this.rotation=newRotation;
            
            this._scaleY= ( 
                (this.target.y - this.position.y)/
                (Math.abs((this.target.y - this.position.y))+Math.abs((this.target.x- this.position.x)))
                );
                
            this._scaleX= ( 
                (this.target.x - this.position.x)/
                  (Math.abs((this.target.y- this.position.y))+Math.abs((this.target.x - this.position.x)))
                );
                
                
            // Update hover reticle position
            this._hoverReticle.x = stage.mouseX;
            this._hoverReticle.y = stage.mouseY;
            
            this.position.x += this._scaleX * this._speed;
            this.position.y += this._scaleY * this._speed;    
            
            this._deathAnimation();
            
            this.checkDimension();
            
        }

        public setPosition(pos : objects.Vector2) : void {
            this.x = pos.x;
            this.y = pos.y;
        }

        public getPosition() : objects.Vector2 {
            return new objects.Vector2(this.x, this.y);
        }
        
        public moveTowards(targetPos : objects.Vector2) : void {
            this.x = targetPos.x;
            this.y = targetPos.y;
        }
        
        public endGame() : void {
            stage.removeAllChildren();
            scene = config.Scene.MENU;
            changeScene();   
        }
        
        checkDimension() : void {
            if (dimension == config.Dimension.secondDimension){
                this.alpha = 1.0;
            }
            else{
                this.alpha = 0.3;
            }
        }
        
        overButton(event: createjs.MouseEvent) : void {
            if (dimension == config.Dimension.secondDimension){
                stage.addChild(this._hoverReticle);
            }
        }
        
        outButton(event:createjs.MouseEvent) : void {
            stage.removeChild(this._hoverReticle);
        }
        
        destroy(event:createjs.MouseEvent) : void{
            if (dimension == config.Dimension.secondDimension){
                var deathSound = createjs.Sound.play("enemyDeathSound",{loop: 0});
                deathSound.play();
                this._dying1 = true;
            }
        }
        
        private _deathAnimation() : void {
            if (this.scaleX < 1.2 && this._dying1){
                this.scaleX += 0.01;
                this.scaleY += 0.01;
                currentScene.update();
            } else if (this.scaleX > 0 && this._dying2){
                this._dying2 = true;
                this._dying1 = false;
                this.scaleX -= 0.01;
                this.scaleY -= 0.01;
                currentScene.update();
            } else {
                this._alive = false;
                //currentScene.removeChild(this);
            }
        }
        
        get isAlive() : boolean {
            return this._alive;
        }
        
    }
}