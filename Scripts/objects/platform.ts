module objects {
    export class Platform extends objects.DimensionObject {

      
        constructor(animation : string, defaultPosition : objects.Vector2, 
                    dim : number = config.Dimension.firstDimension) {
            
           super(animation, dim, animation,"platform1_3_alt", 192, 47);
           this.x = this.position.x = defaultPosition.x;
           this.y = this.position.y = defaultPosition.y;
          
        }
        
        public update(){
            super.update();
        }

      
    }
}