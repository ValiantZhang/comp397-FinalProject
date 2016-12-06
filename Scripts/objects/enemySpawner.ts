module objects {
    export class EnemySpawner extends objects.DimensionObject {

      
        public activated:boolean=false;  
        
        constructor(defaultPosition : number) {
            
           super("enemySpawner",config.Dimension.firstDimension,"invisibleWall","invisibleWall", 2, 500);
           this.x = this.position.x = defaultPosition;
           this.y = this.position.y = 550;
          
        }
        
        public update(){
            super.update();
        }

      
    }
}