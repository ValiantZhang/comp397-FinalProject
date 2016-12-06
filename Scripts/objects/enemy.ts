module objects {
    export class Enemy extends objects.GameObject {

        private _move : objects.Vector2;

        // public variables
        public name:string;
        public width:number;
        public height:number;
        public center:objects.Vector2;
        
        private _scaleX:number;
        private _scaleY:number;
        private _speed:number=2;
        public target:objects.Vector2;

        constructor(animation:createjs.SpriteSheet, target) {
            super(animation, "enemy");
            
            this.target =target;
            this.on("mouseover", this.overButton, this);
            this.on("mouseout", this.outButton, this);
            this.on("mousedown", this.destroy, this);
           
        }

        public update() : void {
            
            super.update();
            
            var newRotation = Math.atan2(this.target.y - this.position.y, this.target.x - this.position.x) * 180 / Math.PI;
            this.rotation=newRotation;
            //console.log("Rotatation" +this.rotation);
            
             this._scaleY= ( 
                (this.target.y - this.position.y)/
                (Math.abs((this.target.y - this.position.y))+Math.abs((this.target.x- this.position.x)))
                );
                
            this._scaleX= ( 
                (this.target.x - this.position.x)/
                  (Math.abs((this.target.y- this.position.y))+Math.abs((this.target.x - this.position.x)))
                );
                
            //console.log("Rotatation" +this._scaleX);    
            this.position.x += this._scaleX*this._speed;
            this.position.y += this._scaleY*this._speed;    
            
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
                this.visible = true;
            }
            else{
                this.visible = false;
            }
        }

        // private _dead() : void {
        //     currentScene.removeChild(this);
        // }
        
        overButton(event: createjs.MouseEvent) : void {
            if (dimension == config.Dimension.secondDimension){
                event.currentTarget.alpha = 0.5;
            }
        }
        
        outButton(event:createjs.MouseEvent) : void {
            if (dimension == config.Dimension.secondDimension){
                event.currentTarget.alpha = 1.0;
            }
        }
        
        destroy(event:createjs.MouseEvent) : void{
            // console.log(currentScene);
            // this.filters = [
            //     new createjs.ColorFilter(122,122,0,1, 0,0,122,0)
            // ];
            this.parent.removeChild(this);
            currentScene.update();
        }
        
    }
}