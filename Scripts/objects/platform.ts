module objects {
    export class Platform extends objects.DimensionObject {

      
        constructor(animation : string, defaultPosition : objects.Vector2) {
            
           super(animation,config.Dimension.firstDimension,animation,"platform1_3_alt", 192, 47);
           this.x = this.position.x = defaultPosition.x;
           this.y = this.position.y = defaultPosition.y;
          
        }
        
        public update(){
            super.update();
        }

      
    }
}