module objects {
    export class Spike extends objects.DimensionObject {

        
        private moveable : boolean;
        private direction:number=1;
        
        constructor(x_position : number,moving : boolean = false, sprit : string = "spike") {
            super("spike1",config.Dimension.firstDimension, sprit, sprit, 128, 87);
           
            //console.log("block" + defaultPosition.x+ " : "+ defaultPosition.y);
            this.moveable =moving;     
            this.x = this.position.x = x_position;
            this.y = this.position.y = config.Screen.CENTER_Y+140;
            //this.position =defaultPosition;
        }
          
        public update(){
            
            if(this.moveable)
            {
                //console.log(this.position.y)
                if(this.position.y>=(config.Screen.CENTER_Y+280))
                     this.direction=-1;
                else if(this.position.y<=(config.Screen.CENTER_Y+139))
                     this.direction=1;
                    
                if (dimension == config.Dimension.firstDimension){
                    this.position.y+=4*Math.random()*this.direction; 
                } else {
                    this.position.y+=4*Math.random()*this.direction * config.Zone.alternateZone;
                }
               
                    
            }
            
            super.update();
        }
        
        public endGame() : void {
            stage.removeAllChildren();
            scene = config.Scene.MENU;
            changeScene();   
        }

    }
}