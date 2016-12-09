module objects {
    export class EnemyObstacle extends objects.DimensionObject {

      
        private _hasAttacked : boolean;
        private _startingY : number;
      
        constructor(defaultPosition : objects.Vector2) {
            
           super("enemyOb",config.Dimension.dualDimension, "enemyObstacle", "enemyObstacle", 243, 304);
           this.x = this.position.x = defaultPosition.x;
           this.y = this.position.y = defaultPosition.y;
           this._hasAttacked = false;
           this._startingY = this.position.y;
        }
        
        public start() : void {
            this.scaleX = 1;
            this.scaleY = 1;
        }
        
        public update(){
            super.update();
            
            this.checkDimension();
            if (this._hasAttacked){
                if (this.position.y > this._startingY - 150){
                    this.position.y -= 3;
                }
            }
        }
        
        checkDimension() : void {
            if (dimension == config.Dimension.secondDimension){
                this.alpha = 1.0;
            }
            else{
                this.alpha = 0.3;
            }
        }
        
        public attack() : void {
            this._hasAttacked = true;
        }
        
        get hasAttacked() : boolean {
            return this._hasAttacked;
        }

        public endGame() : void {
            stage.removeAllChildren();
            scene = config.Scene.MENU;
            changeScene();   
        }
      
    }
}