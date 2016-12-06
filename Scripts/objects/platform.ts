module objects {
    export class Platform extends objects.DimensionObject {

      
        constructor(defaultPosition : objects.Vector2) {
            
           super("platform1",config.Dimension.firstDimension,"platform1_3","platform1_3_alt", 192, 47);
           this.x = this.position.x = defaultPosition.x;
           this.y = this.position.y = defaultPosition.y;
          
        }
        
        public update(){
            super.update();
        }

      
    }
}