module objects {
    export class EnemyObstacle extends objects.DimensionObject {

      
        constructor(defaultPosition : objects.Vector2) {
            
           super("enemyOb",config.Dimension.firstDimension, "enemyObstacle", "enemyObstacle", 500, 500);
           this.x = this.position.x = defaultPosition.x;
           this.y = this.position.y = defaultPosition.y;
          
        }
        
        public start() : void {
            this.scaleX = 1;
            this.scaleY = 1;
        }
        
        public update(){
            super.update();
            
            this.checkDimension();
        }
        
        checkDimension() : void {
            if (dimension == config.Dimension.secondDimension){
                this.alpha = 1.0;
            }
            else{
                this.alpha = 0.1;
            }
        }

        public endGame() : void {
            stage.removeAllChildren();
            scene = config.Scene.MENU;
            changeScene();   
        }
      
    }
}