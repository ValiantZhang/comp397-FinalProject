module objects {
    export class InvPlatform extends objects.DimensionObject {

        private mobile : boolean;
        private direction : number=1;
        private orientation : string;
        private maxBound : number;
        private minBound : number;
        
        private _switchTime : number;
        private _switchDelay : number;
        private _currentTick : number;
      
        constructor(animation : string, defaultPosition : objects.Vector2, canMove : boolean, moveDir : string, switchDirTimer : number) {
            
           super(animation,config.Dimension.firstDimension,animation,"platform1_3_alt", 192, 47);
           
           this.mobile = canMove;
           this.orientation = moveDir;

           this._switchDelay = switchDirTimer * 1000;
            this._currentTick = createjs.Ticker.getTime();
            this._switchTime = this._currentTick + this._switchDelay;
           
           this.x = this.position.x = defaultPosition.x;
           this.y = this.position.y = defaultPosition.y;
          
        }
        
        
        public update(){
            super.update();
            this.checkDimension();
        }
        
        
        public checkIfMobile() : void {
            if(this.mobile && this.orientation == "vertical")
            {
                this.checkTimer();
                this.position.y += this.direction; 
                    
            }
            
            if(this.mobile && this.orientation == "horizontal")
            {
                this.checkTimer();
                this.position.x+=this.direction; 
                    
            }
        }
        
        checkTimer() : void {
            if (createjs.Ticker.getTime() >= this._switchTime){
                this.direction=this.direction * -1;
                this._currentTick = createjs.Ticker.getTime();
                this._switchTime = this._currentTick + this._switchDelay;
            }
        }
        
        
        checkDimension() : void {
            if (dimension == config.Dimension.secondDimension){
                this.alpha = 1.0;
                this.checkIfMobile();
            }
            else{
                this.alpha = 0.1;
            }
        }

      
    }
}